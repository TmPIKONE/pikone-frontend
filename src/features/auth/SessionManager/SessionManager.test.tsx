// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { SessionManagerView } from './SessionManager';

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
