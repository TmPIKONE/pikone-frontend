import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { updateCompanionNameBuilder } from '~/apis/companion/companion.api';
import type { UpdateDisplayNameDto } from '~/apis/companion/companion.types';

export const useUpdateCompanionName = (
  companionId: number,
  options?: UseMutationOptions<void, unknown, UpdateDisplayNameDto>,
) => {
  const queryClient = useQueryClient();

  return useApiMutation<UpdateDisplayNameDto, void>(updateCompanionNameBuilder(companionId), {
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['companions'] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};
