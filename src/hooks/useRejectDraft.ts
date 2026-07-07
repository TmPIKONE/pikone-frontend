import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { rejectDraftBuilder } from '~/apis/draft/draft.api';
import { useToast } from '~/components/Toast/Toast';

type OnSuccess = NonNullable<UseMutationOptions<void, unknown, void>['onSuccess']>;

export const useRejectDraft = (
  draftId: number,
  options?: UseMutationOptions<void, unknown, void>,
) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<void, void>(rejectDraftBuilder(draftId), {
    ...options,
    onSuccess: (...args: Parameters<OnSuccess>) => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
      showToast('대기 기록을 삭제했어요.');
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      showToast('대기 기록 삭제에 실패했어요.', 'error');
      options?.onError?.(...args);
    },
  });
};
