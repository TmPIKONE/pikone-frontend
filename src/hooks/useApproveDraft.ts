import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { approveDraftBuilder } from '~/apis/draft/draft.api';
import type { ApproveRequest } from '~/apis/draft/draft.types';
import { useToast } from '~/components/Toast/Toast';

type OnSuccess = NonNullable<UseMutationOptions<void, unknown, ApproveRequest>['onSuccess']>;

export const useApproveDraft = (
  draftId: number,
  options?: UseMutationOptions<void, unknown, ApproveRequest>,
) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<ApproveRequest, void>(approveDraftBuilder(draftId), {
    ...options,
    onSuccess: (...args: Parameters<OnSuccess>) => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
      queryClient.invalidateQueries({ queryKey: ['records'] });
      showToast('대기 기록을 저장했어요.');
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      showToast('대기 기록 저장에 실패했어요.', 'error');
      options?.onError?.(...args);
    },
  });
};
