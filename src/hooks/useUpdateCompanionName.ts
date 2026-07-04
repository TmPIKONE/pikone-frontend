import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { updateCompanionNameBuilder } from '~/apis/companion/companion.api';
import type { UpdateDisplayNameDto } from '~/apis/companion/companion.types';

type OnSuccess = NonNullable<UseMutationOptions<void, unknown, UpdateDisplayNameDto>['onSuccess']>;

export const useUpdateCompanionName = (
  companionId: number,
  options?: UseMutationOptions<void, unknown, UpdateDisplayNameDto>,
) => {
  const queryClient = useQueryClient();

  return useApiMutation<UpdateDisplayNameDto, void>(updateCompanionNameBuilder(companionId), {
    ...options,
    onSuccess: (...args: Parameters<OnSuccess>) => {
      queryClient.invalidateQueries({ queryKey: ['companions'] });
      options?.onSuccess?.(...args);
    },
  });
};
