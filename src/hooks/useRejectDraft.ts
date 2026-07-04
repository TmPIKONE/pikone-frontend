import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { rejectDraftBuilder } from '~/apis/draft/draft.api';

type OnSuccess = NonNullable<UseMutationOptions<void, unknown, void>['onSuccess']>;

export const useRejectDraft = (
  draftId: number,
  options?: UseMutationOptions<void, unknown, void>,
) => {
  const queryClient = useQueryClient();

  return useApiMutation<void, void>(rejectDraftBuilder(draftId), {
    ...options,
    onSuccess: (...args: Parameters<OnSuccess>) => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
      options?.onSuccess?.(...args);
    },
  });
};
