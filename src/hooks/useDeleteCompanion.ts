import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { deleteCompanionBuilder } from '~/apis/companion/companion.api';

export const useDeleteCompanion = (
  companionId: number,
  options?: UseMutationOptions<void, unknown, void>,
) => {
  const queryClient = useQueryClient();

  return useApiMutation<void, void>(deleteCompanionBuilder(companionId), {
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['companions'] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};
