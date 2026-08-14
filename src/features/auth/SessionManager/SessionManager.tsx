import { useState } from 'react';
import type { AuthSessionResponse } from '~/apis/auth/session.types';
import { ConfirmDialog } from '~/components/ConfirmDialog/ConfirmDialog';
import { useAuthSessions, useRevokeAuthSession } from '~/features/auth/session.queries';
import * as S from './SessionManager.styles';
import type { SessionManagerViewProps } from './SessionManager.types';

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

const formatLastActive = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '최근 활동 시간 확인 불가'
    : `${dateFormatter.format(date)} 활동`;
};

export const SessionManagerView = ({
  sessions,
  isLoading,
  isError,
  revokingSessionId,
  onRetry,
  onRevoke,
}: SessionManagerViewProps) => (
  <S.Section aria-labelledby="session-manager-title">
    <S.Header>
      <S.Title id="session-manager-title">로그인된 기기</S.Title>
      <S.Hint>
        모르는 기기의 자동 로그인을 끊을 수 있어요. 이미 열린 화면은 최대 15분 뒤 로그아웃돼요.
      </S.Hint>
    </S.Header>

    {isLoading && <S.Status role="status">로그인 기기를 확인하고 있어요...</S.Status>}

    {isError && (
      <>
        <S.Status role="alert">기기 목록을 불러오지 못했어요.</S.Status>
        <S.RetryButton type="button" onClick={onRetry}>
          다시 불러오기
        </S.RetryButton>
      </>
    )}

    {!isLoading && !isError && sessions.length === 0 && (
      <S.Status>표시할 로그인 기기가 없어요.</S.Status>
    )}

    {!isLoading && !isError && sessions.length > 0 && (
      <S.List aria-label="로그인된 기기 목록">
        {sessions.map((session) => (
          <S.Item key={session.id}>
            <S.DeviceInfo>
              <S.DeviceNameRow>
                <S.DeviceName>{session.deviceName}</S.DeviceName>
                {session.current && <S.CurrentBadge>현재 기기</S.CurrentBadge>}
              </S.DeviceNameRow>
              <S.LastActive>{formatLastActive(session.lastActiveAt)}</S.LastActive>
            </S.DeviceInfo>
            {!session.current && (
              <S.RevokeButton
                type="button"
                disabled={revokingSessionId === session.id}
                aria-label={`${session.deviceName}에서 로그아웃`}
                onClick={() => onRevoke(session)}
              >
                {revokingSessionId === session.id ? '처리 중...' : '로그아웃'}
              </S.RevokeButton>
            )}
          </S.Item>
        ))}
      </S.List>
    )}
  </S.Section>
);

const SessionManager = () => {
  const sessionsQuery = useAuthSessions();
  const revokeSession = useRevokeAuthSession();
  const [revokeTarget, setRevokeTarget] = useState<Pick<
    AuthSessionResponse,
    'id' | 'deviceName'
  > | null>(null);

  const handleRevoke = (session: AuthSessionResponse) => {
    if (revokeTarget || revokeSession.isPending) return;
    setRevokeTarget({ id: session.id, deviceName: session.deviceName });
  };

  const handleConfirmRevoke = () => {
    if (!revokeTarget || revokeSession.isPending) return;

    revokeSession.mutate(revokeTarget.id, {
      onSuccess: () => setRevokeTarget(null),
    });
  };

  return (
    <>
      <SessionManagerView
        sessions={sessionsQuery.data ?? []}
        isLoading={sessionsQuery.isLoading}
        isError={sessionsQuery.isError}
        revokingSessionId={revokeSession.isPending ? (revokeSession.variables ?? null) : null}
        onRetry={() => void sessionsQuery.refetch()}
        onRevoke={handleRevoke}
      />
      <ConfirmDialog
        isOpen={revokeTarget !== null}
        title="기기 로그아웃"
        description={revokeTarget ? `${revokeTarget.deviceName}에서 로그아웃할까요?` : ''}
        confirmLabel="로그아웃"
        pendingLabel="로그아웃 중..."
        isPending={revokeSession.isPending}
        onCancel={() => {
          if (!revokeSession.isPending) setRevokeTarget(null);
        }}
        onConfirm={handleConfirmRevoke}
      />
    </>
  );
};

export default SessionManager;
