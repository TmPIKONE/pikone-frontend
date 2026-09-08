// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RecordView from './RecordView';

const apiMocks = vi.hoisted(() => ({
  records: [] as unknown[],
  deleteRecord: vi.fn(),
  deleteHook: vi.fn(),
  isDeleting: false,
  refetch: vi.fn(),
}));

vi.mock('~/features/records/record.queries', () => ({
  useRecordsByDate: () => ({
    data: apiMocks.records,
    isLoading: false,
    isError: false,
    refetch: apiMocks.refetch,
  }),
  useDeleteRecord: (recordId: number, options: { onSuccess: () => void }) => {
    apiMocks.deleteHook(recordId, options);
    return { mutate: apiMocks.deleteRecord, isPending: apiMocks.isDeleting };
  },
}));

afterEach(cleanup);

const record = {
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
};

beforeEach(() => {
  apiMocks.records = [record];
  apiMocks.isDeleting = false;
  vi.clearAllMocks();
});

const recordViewTree = () => (
  <MemoryRouter initialEntries={[{ pathname: '/record/view', state: { date: '2026-08-02' } }]}>
    <Routes>
      <Route path="/record/view" element={<RecordView />} />
    </Routes>
  </MemoryRouter>
);

describe('RecordView', () => {
  it('날짜 기록을 모달이 아닌 독립 페이지에 표시한다', () => {
    const { getByRole, getByText, queryByText } = render(
      <MemoryRouter initialEntries={[{ pathname: '/record/view', state: { date: '2026-08-02' } }]}>
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

  it('삭제 대상을 고정하고 pending·실패·재시도 뒤 성공할 때만 확인창을 닫는다', async () => {
    const view = render(recordViewTree());

    const menuButton = view.getByRole('button', { name: '기록 메뉴 열기' });
    menuButton.focus();
    fireEvent.click(menuButton);
    const deleteMenuItem = view.getByRole('menuitem', { name: '삭제' });
    deleteMenuItem.focus();
    fireEvent.click(deleteMenuItem);

    let dialog = view.getByRole('alertdialog');
    expect(apiMocks.deleteRecord).not.toHaveBeenCalled();
    expect(apiMocks.deleteHook).toHaveBeenLastCalledWith(
      record.recordId,
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );

    fireEvent.click(within(dialog).getByRole('button', { name: '취소' }));
    expect(view.queryByRole('alertdialog')).toBeNull();
    expect(apiMocks.deleteRecord).not.toHaveBeenCalled();
    await waitFor(() => expect(document.activeElement).toBe(menuButton));

    fireEvent.click(menuButton);
    fireEvent.click(view.getByRole('menuitem', { name: '삭제' }));

    apiMocks.records = [{ ...record, recordId: 2, foodName: '된장찌개' }];
    view.rerender(recordViewTree());
    dialog = view.getByRole('alertdialog');
    expect(apiMocks.deleteHook).toHaveBeenLastCalledWith(
      record.recordId,
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );

    const confirmButton = within(dialog).getByRole('button', { name: '삭제' });
    fireEvent.click(confirmButton);
    fireEvent.click(confirmButton);

    expect(apiMocks.deleteRecord).toHaveBeenCalledTimes(1);
    expect(apiMocks.deleteRecord.mock.calls[0]).toEqual([]);

    apiMocks.isDeleting = true;
    view.rerender(recordViewTree());
    dialog = view.getByRole('alertdialog');
    expect(within(dialog).getByRole('button', { name: '취소' })).toHaveProperty('disabled', true);
    expect(within(dialog).getByRole('button', { name: '삭제 중...' })).toHaveProperty(
      'disabled',
      true,
    );
    fireEvent.click(within(dialog).getByRole('button', { name: '삭제 중...' }));
    expect(apiMocks.deleteRecord).toHaveBeenCalledTimes(1);

    apiMocks.isDeleting = false;
    view.rerender(recordViewTree());
    dialog = view.getByRole('alertdialog');
    fireEvent.click(within(dialog).getByRole('button', { name: '삭제' }));
    fireEvent.click(within(dialog).getByRole('button', { name: '삭제' }));
    expect(apiMocks.deleteRecord).toHaveBeenCalledTimes(2);

    const hookOptions = apiMocks.deleteHook.mock.lastCall?.[1] as { onSuccess: () => void };
    act(() => hookOptions.onSuccess());
    expect(apiMocks.refetch).toHaveBeenCalledOnce();
    expect(view.queryByRole('alertdialog')).toBeNull();
  });
});
