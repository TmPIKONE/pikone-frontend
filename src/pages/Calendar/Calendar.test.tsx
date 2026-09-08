// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Calendar from './Calendar';

vi.mock('~/features/records/record.queries', () => ({
  useCalendar: () => ({
    data: [
      {
        recordId: 1,
        visitDate: '2026-08-02',
        thumbnailUrl: 'https://images.example.com/meal.jpg',
        companionName: '',
        isPublic: true,
        restaurantName: '정우식당',
        foodName: '김치찌개',
        willRevisit: true,
      },
    ],
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
}));

afterEach(cleanup);

describe('Calendar view toggle', () => {
  it('사진 피드에서 사진을 누르면 별도 기록 페이지로 이동한다', () => {
    const { getByRole, queryByRole, getByText } = render(
      <MemoryRouter initialEntries={['/calendar']}>
        <Routes>
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/record/view" element={<div>독립 기록 페이지</div>} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(getByRole('button', { name: '사진 피드로 보기' }));

    expect(queryByRole('button', { name: '선택한 날짜로 이동' })).toBeNull();
    expect(getByRole('button', { name: '달력으로 보기' })).toBeTruthy();
    expect(getByText('02')).toBeTruthy();

    fireEvent.click(getByRole('button', { name: '2026-08-02 김치찌개 기록 보기' }));
    expect(getByText('독립 기록 페이지')).toBeTruthy();
  });

  it('달력 날짜 클릭은 선택만 하고 기록 쓰기 버튼을 눌러야 이동한다', () => {
    const { getByRole, getByText } = render(
      <MemoryRouter initialEntries={['/calendar']}>
        <Routes>
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/record/add" element={<div>빈 날짜 기록 작성</div>} />
        </Routes>
      </MemoryRouter>,
    );

    const emptyDate = getByRole('button', { name: '2026-08-03 기록 없음' });
    fireEvent.click(emptyDate);

    expect(emptyDate.getAttribute('aria-pressed')).toBe('true');
    expect(getByRole('button', { name: '이 날짜 기록하기' })).toBeTruthy();

    fireEvent.click(getByRole('button', { name: '이 날짜 기록하기' }));
    expect(getByText('빈 날짜 기록 작성')).toBeTruthy();
  });
});
