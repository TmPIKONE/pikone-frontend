import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { updateHomeLocationBuilder } from '~/apis/homeLocation/homeLocation.api';
import type {
  HomeLocationUpdateRequest,
  HomeLocationResponse,
} from '~/apis/homeLocation/homeLocation.types';

type OnSuccess = NonNullable<
  UseMutationOptions<HomeLocationResponse, unknown, HomeLocationUpdateRequest>['onSuccess']
>;

export const useUpdateHomeLocation = (
  id: number,
  options?: UseMutationOptions<HomeLocationResponse, unknown, HomeLocationUpdateRequest>,
) => {
  const queryClient = useQueryClient();

  return useApiMutation<HomeLocationUpdateRequest, HomeLocationResponse>(
    updateHomeLocationBuilder(id),
    {
      ...options,
      onSuccess: (...args: Parameters<OnSuccess>) => {
        queryClient.invalidateQueries({ queryKey: ['homeLocations'] });
        options?.onSuccess?.(...args);
      },
    },
  );
};
