// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RecordView from './RecordView';

vi.mock('~/features/records/record.queries', () => ({
  useRecordsByDate: () => ({
    data: [
      {
        recordId: 1,
        imageUrl: 'https://images.example.com/meal.jpg',
        restaurantName: '정우식당',
        restaurantAddress: '서울특별시 중구',
        foodName: '김치찌개',
        visitDate: '2026-08-02',
        locationType: 'RESTAURANT',
        willRevisit: true,
        companionName: '',
        companionNames: [],
        isPublic: true,
      },
    ],
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
  useDeleteRecord: () => ({ mutate: vi.fn(), isPending: false }),
}));

afterEach(cleanup);

describe('RecordView', () => {
  it('날짜 기록을 모달이 아닌 독립 페이지에 표시한다', () => {
    const { getByRole, getByText, queryByText } = render(
      <MemoryRouter
        initialEntries={[{ pathname: '/record/view', state: { date: '2026-08-02' } }]}
      >
        <Routes>
          <Route path="/record/view" element={<RecordView />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(getByText('김치찌개')).toBeTruthy();
    expect(getByText('정우식당')).toBeTruthy();
    expect(getByText('재방문')).toBeTruthy();
    expect(queryByText('서울특별시 중구')).toBeNull();
    expect(queryByText('매장 식사')).toBeNull();
    expect(getByRole('link', { name: '지도 보기' }).getAttribute('href')).toBe(
      `https://map.naver.com/p/search/${encodeURIComponent('정우식당')}`,
    );
    expect(getByRole('button', { name: '이 날짜에 기록 추가' })).toBeTruthy();

    fireEvent.click(getByRole('button', { name: '기록 메뉴 열기' }));
    expect(getByRole('menuitem', { name: '전체 수정' })).toBeTruthy();
    expect(getByRole('menuitem', { name: '삭제' })).toBeTruthy();
  });
});
