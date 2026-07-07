import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { deleteCompanionBuilder } from '~/apis/companion/companion.api';
import { useToast } from '~/components/Toast/Toast';

type OnSuccess = NonNullable<UseMutationOptions<void, unknown, void>['onSuccess']>;

export const useDeleteCompanion = (
  companionId: number,
  options?: UseMutationOptions<void, unknown, void>,
) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<void, void>(deleteCompanionBuilder(companionId), {
    ...options,
    onSuccess: (...args: Parameters<OnSuccess>) => {
      queryClient.invalidateQueries({ queryKey: ['companions'] });
      showToast('동반자를 삭제했어요.');
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      showToast('동반자 삭제에 실패했어요.', 'error');
      options?.onError?.(...args);
    },
  });
};
