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
        <Route
          path="/home"
          element={<DailyRecordsSection selectedDate={selectedDate} />}
        />
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

describe('DailyRecordsSection home priority UX', () => {
  it('선택한 날짜 기록이 있으면 해당 기록을 대표 이미지 한 장으로 보여준다', () => {
    queryMock.data = createRecord(1, '2020-08-18');
    const view = renderSection();

    expect(view.getByText('8월 18일에 남긴 한 끼예요.')).toBeTruthy();
    expect(view.getByText('한 끼 1')).toBeTruthy();
    expect(view.container.querySelectorAll('img')).toHaveLength(1);
    expect(view.queryByRole('button', { name: /8월 18일 한 끼 기록하기/ })).toBeNull();
  });

  it('선택한 날짜 기록이 없으면 기록 CTA를 과거 사진보다 먼저 제공한다', () => {
    queryMock.data = createRecord(7, '2020-08-12');
    const view = renderSection();

    expect(view.getByText('8월 18일은 아직 비어 있어요.')).toBeTruthy();
    expect(view.getByText('오늘의 한 끼를 남겨볼까요?')).toBeTruthy();
    expect(view.getByText('오늘 대신, 이런 기억은 어때요?')).toBeTruthy();
    expect(view.getByText('8월 12일')).toBeTruthy();
    expect(view.container.querySelectorAll('img')).toHaveLength(1);

    fireEvent.click(view.getByRole('button', { name: '8월 18일 한 끼 기록하기' }));
    expect(view.getByTestId('location').textContent).toBe('/record/add?date=2020-08-18');
  });

  it('과거 대표 사진을 누르면 그 사진이 속한 날짜의 RecordView로 이동한다', () => {
    queryMock.data = createRecord(3, '2020-08-12');
    const view = renderSection();

    fireEvent.click(view.getByRole('button', { name: '2020-08-12 한 끼 3 기록 보기' }));
    expect(view.getByTestId('location').textContent).toBe('/record/view{"date":"2020-08-12"}');
  });

  it('과거 기록도 없으면 큰 빈 사진 카드 없이 기록 CTA만 명확하게 보여준다', () => {
    const view = renderSection();

    expect(view.getByText('8월 18일은 아직 비어 있어요.')).toBeTruthy();
    expect(view.getByText('사진 한 장으로 오늘의 한 끼를 남겨보세요.')).toBeTruthy();
    expect(view.container.querySelectorAll('img')).toHaveLength(0);

    fireEvent.click(view.getByRole('button', { name: '8월 18일 한 끼 기록하기' }));
    expect(view.getByTestId('location').textContent).toBe('/record/add?date=2020-08-18');
  });

  it('사진 URL 없음과 로드 실패를 대표 사진 영역 안에서 대체한다', () => {
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
