// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DraftDetail from './DraftDetail';

const apiMocks = vi.hoisted(() => ({
  drafts: [] as unknown[],
  reject: vi.fn(),
  rejectHookId: vi.fn(),
  approve: vi.fn(),
  saveLocation: vi.fn(),
  isRejecting: false,
}));

vi.mock('~/features/drafts/draft.queries', () => ({
  usePendingDrafts: () => ({ data: apiMocks.drafts, isLoading: false }),
  useApproveDraft: () => ({ mutate: apiMocks.approve, isPending: false }),
  useRejectDraft: (draftId: number) => {
    apiMocks.rejectHookId(draftId);
    return { mutate: apiMocks.reject, isPending: apiMocks.isRejecting };
  },
  useUpdateDraftLocationType: () => ({ mutate: apiMocks.saveLocation, isPending: false }),
}));

vi.mock('~/components/CompanionSelector/CompanionSelector', () => ({
  default: () => null,
}));

vi.mock('~/components/PlaceTypeWheelPicker/PlaceTypeWheelPicker', () => ({
  default: () => <div />,
}));

vi.mock('~/components/Switch/Switch', () => ({
  default: () => null,
}));

vi.mock('~/components/ConfirmDialog/ConfirmDialog', () => ({
  ConfirmDialog: ({
    isOpen,
    title,
    description,
    confirmLabel,
    cancelLabel = '취소',
    pendingLabel,
    isPending = false,
    onCancel,
    onConfirm,
  }: {
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    cancelLabel?: string;
    pendingLabel?: string;
    isPending?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
  }) =>
    isOpen ? (
      <div role="alertdialog" aria-label={title}>
        <p>{description}</p>
        <button type="button" disabled={isPending} onClick={onCancel}>
          {cancelLabel}
        </button>
        <button type="button" disabled={isPending} onClick={onConfirm}>
          {isPending ? pendingLabel : confirmLabel}
        </button>
      </div>
    ) : null,
}));

const draft = {
  draftId: 1,
  imageUrl: 'https://images.example.com/draft.jpg',
  shared: false,
  foodName: '자동 인식 파스타',
  foodTags: ['파스타'],
  sceneTags: [],
  locationType: 'RESTAURANT',
  restaurantCandidates: [
    {
      kakaoPlaceId: 'place-1',
      placeName: '피코 키친',
      category: '양식',
      address: '서울시 중구',
      latitude: 37.5,
      longitude: 127,
    },
  ],
  capturedAt: '2026-08-12T12:30:00+09:00',
  hasExifGps: true,
};

beforeEach(() => {
  apiMocks.drafts = [draft];
  apiMocks.isRejecting = false;
  vi.clearAllMocks();
});

afterEach(cleanup);

const renderDraftDetail = () =>
  render(
    <MemoryRouter initialEntries={['/draft/1']}>
      <Routes>
        <Route path="/draft/:draftId" element={<DraftDetail />} />
        <Route path="/draft" element={<div>대기 기록 목록</div>} />
      </Routes>
    </MemoryRouter>,
  );

describe('DraftDetail reject confirmation', () => {
  it('선택한 기록을 확인 후 한 번만 제외하고 성공 시에만 목록으로 이동한다', () => {
    const view = renderDraftDetail();

    fireEvent.click(view.getByRole('button', { name: '제외' }));

    let dialog = view.getByRole('alertdialog', { name: '기록 제외' });
    expect(
      within(dialog).getByText('이 기록을 거절할까요? 거절하면 되돌릴 수 없어요.'),
    ).toBeTruthy();
    expect(apiMocks.reject).not.toHaveBeenCalled();
    expect(apiMocks.rejectHookId).toHaveBeenLastCalledWith(draft.draftId);

    fireEvent.click(within(dialog).getByRole('button', { name: '취소' }));
    expect(view.queryByRole('alertdialog')).toBeNull();
    expect(apiMocks.reject).not.toHaveBeenCalled();

    fireEvent.click(view.getByRole('button', { name: '제외' }));
    dialog = view.getByRole('alertdialog');
    fireEvent.click(within(dialog).getByRole('button', { name: '제외' }));

    expect(apiMocks.reject).toHaveBeenCalledOnce();
    expect(apiMocks.reject.mock.calls[0]?.[0]).toBeUndefined();

    apiMocks.isRejecting = true;
    view.rerender(
      <MemoryRouter initialEntries={['/draft/1']}>
        <Routes>
          <Route path="/draft/:draftId" element={<DraftDetail />} />
          <Route path="/draft" element={<div>대기 기록 목록</div>} />
        </Routes>
      </MemoryRouter>,
    );
    dialog = view.getByRole('alertdialog');
    expect(
      (within(dialog).getByRole('button', { name: '취소' }) as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(
      (within(dialog).getByRole('button', { name: '처리 중...' }) as HTMLButtonElement).disabled,
    ).toBe(true);

    apiMocks.isRejecting = false;
    view.rerender(
      <MemoryRouter initialEntries={['/draft/1']}>
        <Routes>
          <Route path="/draft/:draftId" element={<DraftDetail />} />
          <Route path="/draft" element={<div>대기 기록 목록</div>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(view.getByRole('alertdialog')).toBeTruthy();
    expect(view.queryByText('대기 기록 목록')).toBeNull();

    const mutationOptions = apiMocks.reject.mock.calls[0]?.[1] as { onSuccess: () => void };
    act(() => mutationOptions.onSuccess());
    expect(view.getByText('대기 기록 목록')).toBeTruthy();
    expect(view.queryByRole('alertdialog')).toBeNull();
  });
});
