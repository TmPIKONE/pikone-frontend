import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { updateDraftLocationTypeBuilder } from '~/apis/draft/draft.api';
import type { UpdateLocationTypeRequest } from '~/apis/draft/draft.types';

type OnSuccess = NonNullable<
  UseMutationOptions<void, unknown, UpdateLocationTypeRequest>['onSuccess']
>;

export const useUpdateDraftLocationType = (
  draftId: number,
  options?: UseMutationOptions<void, unknown, UpdateLocationTypeRequest>,
) => {
  const queryClient = useQueryClient();

  return useApiMutation<UpdateLocationTypeRequest, void>(updateDraftLocationTypeBuilder(draftId), {
    ...options,
    onSuccess: (...args: Parameters<OnSuccess>) => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
      options?.onSuccess?.(...args);
    },
  });
};
