// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import type { CalendarResponse } from '~/apis/record/record.types';
import { DailyRecordsSection } from './DailyRecordsSection';

const queryMock = vi.hoisted(() => ({
  data: null as CalendarResponse | null,
  isLoading: false,
  isError: false,
  refetch: vi.fn(),
  useHomeRepresentativeRecord: vi.fn(),
}));

vi.mock('~/features/records/record.queries', () => ({
  useHomeRepresentativeRecord: (date: string) => {
    queryMock.useHomeRepresentativeRecord(date);
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

const renderSection = (selectedDate = '2020-08-18') =>
  render(
    <MemoryRouter initialEntries={['/home']}>
      <Routes>
        <Route path="/home" element={<DailyRecordsSection selectedDate={selectedDate} />} />
        <Route path="*" element={<LocationProbe />} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  queryMock.data = null;
  queryMock.isLoading = false;
  queryMock.isError = false;
  queryMock.refetch.mockReset();
  queryMock.useHomeRepresentativeRecord.mockReset();
});

afterEach(() => {
  cleanup();
});

describe('DailyRecordsSection home card UX', () => {
  it('선택한 날짜 기록이 있으면 오늘 카드 안에 대표 사진을 보여준다', () => {
    queryMock.data = createRecord(1, '2020-08-18');
    const view = renderSection();

    expect(view.getByText('8월 18일')).toBeTruthy();
    expect(view.getByText('한 끼 1')).toBeTruthy();
    expect(view.container.querySelectorAll('img')).toHaveLength(1);
    expect(view.queryByRole('button', { name: /8월 18일 한 끼 기록하기/ })).toBeNull();
  });

  it('선택한 날짜 기록이 없으면 오늘 카드에서 바로 추가할 수 있다', () => {
    queryMock.data = createRecord(7, '2020-08-12');
    const view = renderSection();

    expect(view.getByText('8월 18일 기록을 추가하세요')).toBeTruthy();
    expect(view.getByText('지난 기록')).toBeTruthy();
    expect(view.getByText('한 끼 7')).toBeTruthy();

    fireEvent.click(view.getByRole('button', { name: '8월 18일 한 끼 기록하기' }));
    expect(view.getByTestId('location').textContent).toBe('/record/add?date=2020-08-18');
  });

  it('과거 대표 사진을 누르면 그 날짜 RecordView로 이동한다', () => {
    queryMock.data = createRecord(3, '2020-08-12');
    const view = renderSection();

    fireEvent.click(view.getByRole('button', { name: '2020-08-12 한 끼 3 기록 보기' }));
    expect(view.getByTestId('location').textContent).toBe('/record/view{"date":"2020-08-12"}');
  });

  it('기록이 전혀 없으면 사진 없이 추가 CTA와 AI CTA를 제공한다', () => {
    const view = renderSection();

    expect(view.getByText('8월 18일 기록을 추가하세요')).toBeTruthy();
    expect(view.getByText('AI로 다음 한 끼 추천받기')).toBeTruthy();
    expect(view.container.querySelectorAll('img')).toHaveLength(0);
  });

  it('사진 URL 없음과 로드 실패를 카드 안에서 대체한다', () => {
    queryMock.data = createRecord(1, '2020-08-18', { thumbnailUrl: '' });
    const view = renderSection();
    expect(view.container.querySelectorAll('img')).toHaveLength(0);

    queryMock.data = createRecord(2, '2020-08-18');
    view.rerender(
      <MemoryRouter>
        <DailyRecordsSection selectedDate="2020-08-18" />
      </MemoryRouter>,
    );

    const image = view.container.querySelector('img');
    expect(image).not.toBeNull();
    fireEvent.error(image!);
    expect(view.container.querySelector('img')).toBeNull();
  });

  it('loading과 error 재시도 상태를 제공한다', () => {
    queryMock.isLoading = true;
    const view = renderSection();
    expect(view.getByLabelText('8월 18일 대표 기록 불러오는 중')).toBeTruthy();

    queryMock.isLoading = false;
    queryMock.isError = true;
    view.rerender(
      <MemoryRouter>
        <DailyRecordsSection selectedDate="2020-08-18" />
      </MemoryRouter>,
    );

    fireEvent.click(view.getByRole('button', { name: /홈 기록을 불러오지 못했어요/ }));
    expect(queryMock.refetch).toHaveBeenCalledOnce();
  });
});
