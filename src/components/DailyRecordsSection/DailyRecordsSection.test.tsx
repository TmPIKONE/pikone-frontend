// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useState } from 'react';
import type { CalendarResponse } from '~/apis/record/record.types';
import { DailyRecordsSection } from './DailyRecordsSection';

const queryMock = vi.hoisted(() => ({
  data: [] as CalendarResponse[],
  isLoading: false,
  isError: false,
  refetch: vi.fn(),
  useCalendar: vi.fn(),
}));

vi.mock('~/features/records/record.queries', () => ({
  useCalendar: (year: number, month: number) => {
    queryMock.useCalendar(year, month);
    return queryMock;
  },
}));

const createRecord = (
  recordId: number,
  visitDate: string,
  overrides: Partial<CalendarResponse> = {},
): CalendarResponse => ({
  recordId,
  visitDate,
  thumbnailUrl: `https://images.example.com/meal-${recordId}.jpg`,
  restaurantName: `피코네 식당 ${recordId}`,
  foodName: `한 끼 ${recordId}`,
  willRevisit: recordId === 1,
  companionName: '',
  isPublic: false,
  ...overrides,
});

const LocationProbe = () => {
  const location = useLocation();
  return (
    <div data-testid="location">
      {location.pathname}
      {location.search}
      {location.state ? JSON.stringify(location.state) : ''}
    </div>
  );
};

const StatefulSection = ({ initialDate = '2020-08-18' }: { initialDate?: string }) => {
  const [date, setDate] = useState(initialDate);
  return <DailyRecordsSection selectedDate={date} onDateChange={setDate} />;
};

const renderSection = (initialDate = '2020-08-18') =>
  render(
    <MemoryRouter initialEntries={['/home']}>
      <Routes>
        <Route path="/home" element={<StatefulSection initialDate={initialDate} />} />
        <Route path="*" element={<LocationProbe />} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  queryMock.data = [];
  queryMock.isLoading = false;
  queryMock.isError = false;
  queryMock.refetch.mockReset();
  queryMock.useCalendar.mockReset();
});

afterEach(cleanup);

describe('DailyRecordsSection monthly photo pile UX', () => {
  it('처음에는 월 사진을 모아 보이고 누르면 날짜별 묶음으로 펼친다', () => {
    queryMock.data = [
      createRecord(1, '2020-08-18'),
      createRecord(2, '2020-08-18'),
      createRecord(3, '2020-08-17'),
      createRecord(4, '2020-08-16'),
    ];
    const view = renderSection();

    expect(view.getByText('8월의 한 끼가 쌓였어요')).toBeTruthy();
    expect(view.getByText('사진 4장 · 눌러서 날짜별로 펼쳐보기')).toBeTruthy();
    expect(view.queryByText('8월 18일')).toBeNull();
    expect(view.container.querySelectorAll('img')[0].getAttribute('loading')).toBe('eager');

    fireEvent.click(view.getByRole('button', { name: '2020년 8월 사진 4장 날짜별로 펼치기' }));

    expect(view.getByRole('heading', { name: '2020년 8월' })).toBeTruthy();
    expect(view.getByText('8월 18일')).toBeTruthy();
    expect(view.getByText('8월 17일')).toBeTruthy();
    expect(view.getAllByRole('button', { name: /기록 보기$/ })).toHaveLength(4);
  });

  it('하루 기록은 정책대로 최대 3장만 날짜 묶음에 배치한다', () => {
    queryMock.data = Array.from({ length: 4 }, (_, index) => createRecord(index + 1, '2020-08-18'));
    const view = renderSection();

    fireEvent.click(view.getByRole('button', { name: '2020년 8월 사진 4장 날짜별로 펼치기' }));
    expect(view.getAllByRole('button', { name: /기록 보기$/ })).toHaveLength(3);
  });

  it('날짜 사진을 누르면 기존 RecordView 날짜 상태로 이동한다', () => {
    queryMock.data = [createRecord(1, '2020-08-18')];
    const view = renderSection();

    fireEvent.click(view.getByRole('button', { name: '2020년 8월 사진 1장 날짜별로 펼치기' }));
    fireEvent.click(view.getByRole('button', { name: '2020-08-18 한 끼 1 기록 보기' }));

    expect(view.getByTestId('location').textContent).toBe('/record/view{"date":"2020-08-18"}');
  });

  it('빈 달의 사진 더미는 선택한 날짜의 RecordAdd로 연결한다', () => {
    const view = renderSection();

    expect(view.getByText('8월의 첫 한 끼를 남겨볼까요?')).toBeTruthy();
    fireEvent.click(view.getByRole('button', { name: '2020년 8월 첫 식사 기록하기' }));
    expect(view.getByTestId('location').textContent).toBe('/record/add?date=2020-08-18');
  });

  it('펼친 화면에서 달을 이동해도 펼침 상태와 안전한 날짜를 유지한다', () => {
    queryMock.data = [createRecord(1, '2020-08-18')];
    const view = renderSection();

    fireEvent.click(view.getByRole('button', { name: '2020년 8월 사진 1장 날짜별로 펼치기' }));
    fireEvent.click(view.getByRole('button', { name: '다음 달' }));

    expect(queryMock.useCalendar).toHaveBeenLastCalledWith(2020, 9);
    expect(view.getByRole('heading', { name: '2020년 9월' })).toBeTruthy();
  });

  it('사진 URL 없음과 로드 실패를 폴라로이드 안에서 대체한다', () => {
    queryMock.data = [
      createRecord(1, '2020-08-18', { thumbnailUrl: '' }),
      createRecord(2, '2020-08-17'),
    ];
    const view = renderSection();

    expect(view.container.querySelectorAll('img')).toHaveLength(1);
    fireEvent.error(view.container.querySelector('img')!);
    expect(view.container.querySelector('img')).toBeNull();
  });

  it('loading과 error 재시도를 월 사진 상태로 제공한다', () => {
    queryMock.isLoading = true;
    const view = renderSection();
    expect(view.getByLabelText('2020년 8월 기록 불러오는 중')).toBeTruthy();

    queryMock.isLoading = false;
    queryMock.isError = true;
    view.rerender(
      <MemoryRouter>
        <DailyRecordsSection selectedDate="2020-08-18" onDateChange={vi.fn()} />
      </MemoryRouter>,
    );

    fireEvent.click(view.getByRole('button', { name: /8월의 사진을 불러오지 못했어요/ }));
    expect(queryMock.refetch).toHaveBeenCalledOnce();
  });
});
