import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { deleteHomeLocationBuilder } from '~/apis/homeLocation/homeLocation.api';

type OnSuccess = NonNullable<UseMutationOptions<void, unknown, void>['onSuccess']>;

export const useDeleteHomeLocation = (
  id: number,
  options?: UseMutationOptions<void, unknown, void>,
) => {
  const queryClient = useQueryClient();

  return useApiMutation<void, void>(deleteHomeLocationBuilder(id), {
    ...options,
    onSuccess: (...args: Parameters<OnSuccess>) => {
      queryClient.invalidateQueries({ queryKey: ['homeLocations'] });
      options?.onSuccess?.(...args);
    },
  });
};
