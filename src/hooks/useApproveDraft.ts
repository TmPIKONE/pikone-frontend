import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { approveDraftBuilder } from '~/apis/draft/draft.api';
import type { ApproveRequest } from '~/apis/draft/draft.types';

type OnSuccess = NonNullable<UseMutationOptions<void, unknown, ApproveRequest>['onSuccess']>;

export const useApproveDraft = (
  draftId: number,
  options?: UseMutationOptions<void, unknown, ApproveRequest>,
) => {
  const queryClient = useQueryClient();

  return useApiMutation<ApproveRequest, void>(approveDraftBuilder(draftId), {
    ...options,
    onSuccess: (...args: Parameters<OnSuccess>) => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
      queryClient.invalidateQueries({ queryKey: ['records'] });
      options?.onSuccess?.(...args);
    },
  });
};
