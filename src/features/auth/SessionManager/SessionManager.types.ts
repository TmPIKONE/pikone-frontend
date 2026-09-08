import type { AuthSessionResponse } from '~/apis/auth/session.types';

export interface SessionManagerViewProps {
  sessions: AuthSessionResponse[];
  isLoading: boolean;
  isError: boolean;
  revokingSessionId: number | null;
  onRetry: () => void;
  onRevoke: (session: AuthSessionResponse) => void;
}
