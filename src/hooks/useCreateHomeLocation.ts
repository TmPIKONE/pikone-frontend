import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { createHomeLocationBuilder } from '~/apis/homeLocation/homeLocation.api';
import type {
  HomeLocationCreateRequest,
  HomeLocationResponse,
} from '~/apis/homeLocation/homeLocation.types';

type OnSuccess = NonNullable<
  UseMutationOptions<HomeLocationResponse, unknown, HomeLocationCreateRequest>['onSuccess']
>;

export const useCreateHomeLocation = (
  options?: UseMutationOptions<HomeLocationResponse, unknown, HomeLocationCreateRequest>,
) => {
  const queryClient = useQueryClient();

  return useApiMutation<HomeLocationCreateRequest, HomeLocationResponse>(
    createHomeLocationBuilder(),
    {
      ...options,
      onSuccess: (...args: Parameters<OnSuccess>) => {
        queryClient.invalidateQueries({ queryKey: ['homeLocations'] });
        options?.onSuccess?.(...args);
      },
    },
  );
};
