// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, within } from '@testing-library/react';
import SessionManager, { SessionManagerView } from './SessionManager';

const apiMocks = vi.hoisted(() => ({
  sessions: [] as Array<{
    id: number;
    deviceName: string;
    lastActiveAt: string;
    expiresAt: string;
    current: boolean;
  }>,
  revoke: vi.fn(),
  refetch: vi.fn(),
  isPending: false,
  variables: undefined as number | undefined,
}));

vi.mock('~/features/auth/session.queries', () => ({
  useAuthSessions: () => ({
    data: apiMocks.sessions,
    isLoading: false,
    isError: false,
    refetch: apiMocks.refetch,
  }),
  useRevokeAuthSession: () => ({
    mutate: apiMocks.revoke,
    isPending: apiMocks.isPending,
    variables: apiMocks.variables,
  }),
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

afterEach(cleanup);

const sessions = [
  {
    id: 1,
    deviceName: 'Chrome · Windows',
    lastActiveAt: '2026-07-31T18:20:00',
    expiresAt: '2026-08-14T18:20:00',
    current: true,
  },
  {
    id: 2,
    deviceName: '삼성 인터넷 · Android',
    lastActiveAt: '2026-07-30T09:10:00',
    expiresAt: '2026-08-13T09:10:00',
    current: false,
  },
];

beforeEach(() => {
  apiMocks.sessions = sessions;
  apiMocks.isPending = false;
  apiMocks.variables = undefined;
  vi.clearAllMocks();
});

describe('SessionManagerView', () => {
  it('현재 기기는 보호하고 다른 기기만 로그아웃할 수 있게 표시한다', () => {
    const onRevoke = vi.fn();
    const { getByText, getByRole, queryByLabelText } = render(
      <SessionManagerView
        sessions={sessions}
        isLoading={false}
        isError={false}
        revokingSessionId={null}
        onRetry={() => undefined}
        onRevoke={onRevoke}
      />,
    );

    expect(getByText('현재 기기')).toBeTruthy();
    expect(queryByLabelText('Chrome · Windows에서 로그아웃')).toBeNull();
    fireEvent.click(getByRole('button', { name: '삼성 인터넷 · Android에서 로그아웃' }));
    expect(onRevoke).toHaveBeenCalledWith(sessions[1]);
  });

  it('목록 오류 시 한국어 복구 동작을 제공한다', () => {
    const onRetry = vi.fn();
    const { getByRole } = render(
      <SessionManagerView
        sessions={[]}
        isLoading={false}
        isError
        revokingSessionId={null}
        onRetry={onRetry}
        onRevoke={() => undefined}
      />,
    );

    fireEvent.click(getByRole('button', { name: '다시 불러오기' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});

describe('SessionManager revoke confirmation', () => {
  it('선택한 원격 기기를 고정하고 성공하기 전까지 확인창을 유지한다', () => {
    const view = render(<SessionManager />);

    fireEvent.click(view.getByRole('button', { name: '삼성 인터넷 · Android에서 로그아웃' }));

    let dialog = view.getByRole('alertdialog', { name: '기기 로그아웃' });
    expect(within(dialog).getByText('삼성 인터넷 · Android에서 로그아웃할까요?')).toBeTruthy();
    expect(apiMocks.revoke).not.toHaveBeenCalled();

    apiMocks.sessions = [sessions[0], { ...sessions[1], deviceName: '변경된 원격 기기' }];
    view.rerender(<SessionManager />);
    dialog = view.getByRole('alertdialog');
    expect(within(dialog).getByText('삼성 인터넷 · Android에서 로그아웃할까요?')).toBeTruthy();

    fireEvent.click(within(dialog).getByRole('button', { name: '취소' }));
    expect(view.queryByRole('alertdialog')).toBeNull();
    expect(apiMocks.revoke).not.toHaveBeenCalled();

    apiMocks.sessions = sessions;
    view.rerender(<SessionManager />);
    fireEvent.click(view.getByRole('button', { name: '삼성 인터넷 · Android에서 로그아웃' }));
    dialog = view.getByRole('alertdialog');
    fireEvent.click(within(dialog).getByRole('button', { name: '로그아웃' }));

    expect(apiMocks.revoke).toHaveBeenCalledOnce();
    expect(apiMocks.revoke.mock.calls[0]?.[0]).toBe(2);

    apiMocks.isPending = true;
    apiMocks.variables = 2;
    view.rerender(<SessionManager />);
    dialog = view.getByRole('alertdialog');
    expect(
      (within(dialog).getByRole('button', { name: '취소' }) as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(
      (within(dialog).getByRole('button', { name: '로그아웃 중...' }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect(
      (
        view.getByRole('button', {
          name: '삼성 인터넷 · Android에서 로그아웃',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);

    apiMocks.isPending = false;
    apiMocks.variables = undefined;
    view.rerender(<SessionManager />);
    expect(view.getByRole('alertdialog')).toBeTruthy();

    const mutationOptions = apiMocks.revoke.mock.calls[0]?.[1] as { onSuccess: () => void };
    act(() => mutationOptions.onSuccess());
    expect(view.queryByRole('alertdialog')).toBeNull();
  });
});
