import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthSessionsBuilder, revokeAuthSessionBuilder } from '~/apis/auth/session.api';
import type { SessionRevocationResponse } from '~/apis/auth/session.types';
import { useApiQuery } from '~/apis/config/queryHooks';
import { queryKeys } from '~/apis/queryKeys';
import { useToast } from '~/components/Toast/useToast';

export const useAuthSessions = () => useApiQuery(getAuthSessionsBuilder(), queryKeys.auth.sessions);

export const useRevokeAuthSession = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<SessionRevocationResponse, unknown, number>({
    mutationFn: (sessionId) => revokeAuthSessionBuilder(sessionId).execute(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.sessions });
      showToast('선택한 기기의 자동 로그인을 해제했어요.');
    },
    onError: () => {
      showToast('기기 로그아웃에 실패했어요. 잠시 후 다시 시도해주세요.', 'error');
    },
  });
};
