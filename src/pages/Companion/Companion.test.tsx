// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Companion from './Companion';

const mocks = vi.hoisted(() => ({
  companions: [
    {
      companionId: 11,
      displayName: '철수',
      linkedUserNickname: '철수',
      companionType: 'FRIEND' as const,
      isAppUser: true,
    },
  ],
  pendingRequests: [
    {
      requestId: 21,
      fromUserNickname: '영희',
      fromUserImageUrl: '',
    },
  ],
  isDeleting: false,
  isResponding: false,
  deleteCompanion: vi.fn(),
  deleteHookId: vi.fn(),
  respondRequest: vi.fn(),
  updateName: vi.fn(),
  refetchCompanions: vi.fn(),
  showToast: vi.fn(),
}));

vi.mock('~/features/companions/companion.queries', () => ({
  useCompanions: () => ({
    data: mocks.companions,
    isLoading: false,
    isError: false,
    refetch: mocks.refetchCompanions,
  }),
  usePendingCompanionRequests: () => ({ data: mocks.pendingRequests }),
  useMyCompanionCode: () => ({ data: { myCode: 'ABC123' } }),
  useDeleteCompanion: (companionId: number) => {
    mocks.deleteHookId(companionId);
    return { mutate: mocks.deleteCompanion, isPending: mocks.isDeleting };
  },
  useRespondCompanionRequest: () => ({
    mutate: mocks.respondRequest,
    isPending: mocks.isResponding,
  }),
  useUpdateCompanionName: () => ({ mutate: mocks.updateName, isPending: false }),
}));

vi.mock('~/components/Toast/useToast', () => ({
  useToast: () => ({ showToast: mocks.showToast }),
}));

const renderCompanion = () =>
  render(
    <MemoryRouter>
      <Companion />
    </MemoryRouter>,
  );

afterEach(cleanup);

beforeEach(() => {
  mocks.companions = [
    {
      companionId: 11,
      displayName: '철수',
      linkedUserNickname: '철수',
      companionType: 'FRIEND',
      isAppUser: true,
    },
  ];
  mocks.pendingRequests = [
    {
      requestId: 21,
      fromUserNickname: '영희',
      fromUserImageUrl: '',
    },
  ];
  mocks.isDeleting = false;
  mocks.isResponding = false;
  mocks.deleteCompanion.mockReset();
  mocks.deleteHookId.mockReset();
  mocks.respondRequest.mockReset();
  mocks.updateName.mockReset();
  mocks.refetchCompanions.mockReset();
  mocks.showToast.mockReset();
});

describe('Companion 확인 다이얼로그', () => {
  it('삭제 대상을 고정하고 실패 시 유지한 뒤 성공 시에만 닫는다', () => {
    const view = renderCompanion();

    fireEvent.click(view.getByRole('button', { name: '철수 관리' }));
    fireEvent.click(view.getByRole('button', { name: '연결 해제' }));

    expect(mocks.deleteCompanion).not.toHaveBeenCalled();
    expect(view.getByRole('alertdialog', { name: '철수님을 삭제할까요?' })).toBeTruthy();

    mocks.companions = [{ ...mocks.companions[0], displayName: '변경된 이름' }];
    view.rerender(
      <MemoryRouter>
        <Companion />
      </MemoryRouter>,
    );

    const dialog = view.getByRole('alertdialog', { name: '철수님을 삭제할까요?' });
    expect(mocks.deleteHookId).toHaveBeenLastCalledWith(11);
    fireEvent.click(within(dialog).getByRole('button', { name: '삭제' }));

    expect(mocks.deleteCompanion).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );

    mocks.isDeleting = true;
    view.rerender(
      <MemoryRouter>
        <Companion />
      </MemoryRouter>,
    );
    expect(view.getByRole('button', { name: '삭제 중' })).toHaveProperty('disabled', true);
    expect(view.getByRole('button', { name: '취소' })).toHaveProperty('disabled', true);

    mocks.isDeleting = false;
    view.rerender(
      <MemoryRouter>
        <Companion />
      </MemoryRouter>,
    );
    expect(view.getByRole('alertdialog', { name: '철수님을 삭제할까요?' })).toBeTruthy();

    fireEvent.click(view.getByRole('button', { name: '삭제' }));
    const successfulOptions = mocks.deleteCompanion.mock.calls[1][1] as {
      onSuccess: () => void;
    };
    act(() => successfulOptions.onSuccess());

    expect(view.queryByRole('alertdialog')).toBeNull();
  });

  it('거절은 확인 후 처리하고 수락은 기존처럼 즉시 처리한다', () => {
    const view = renderCompanion();

    fireEvent.click(view.getByRole('button', { name: '거절' }));

    expect(mocks.respondRequest).not.toHaveBeenCalled();
    expect(view.getByText('영희님의 신청을 거절하면 목록에서 사라져요.')).toBeTruthy();

    mocks.pendingRequests = [{ ...mocks.pendingRequests[0], fromUserNickname: '변경된 이름' }];
    view.rerender(
      <MemoryRouter>
        <Companion />
      </MemoryRouter>,
    );

    const dialog = view.getByRole('alertdialog', { name: '동반자 신청을 거절할까요?' });
    expect(within(dialog).getByText('영희님의 신청을 거절하면 목록에서 사라져요.')).toBeTruthy();
    fireEvent.click(within(dialog).getByRole('button', { name: '거절' }));

    expect(mocks.respondRequest).toHaveBeenCalledWith(
      { requestId: 21, accept: false },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );

    mocks.isResponding = true;
    view.rerender(
      <MemoryRouter>
        <Companion />
      </MemoryRouter>,
    );
    expect(view.getByRole('button', { name: '거절 중' })).toHaveProperty('disabled', true);
    expect(view.getByRole('button', { name: '취소' })).toHaveProperty('disabled', true);

    mocks.isResponding = false;
    view.rerender(
      <MemoryRouter>
        <Companion />
      </MemoryRouter>,
    );
    expect(view.getByRole('alertdialog')).toBeTruthy();

    fireEvent.click(within(view.getByRole('alertdialog')).getByRole('button', { name: '거절' }));
    const rejectOptions = mocks.respondRequest.mock.calls[1][1] as { onSuccess: () => void };
    act(() => rejectOptions.onSuccess());
    expect(view.queryByRole('alertdialog')).toBeNull();

    fireEvent.click(view.getByRole('button', { name: '수락' }));
    expect(mocks.respondRequest).toHaveBeenLastCalledWith({ requestId: 21, accept: true });
  });
});
