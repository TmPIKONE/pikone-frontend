import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { createHomeLocationBuilder } from '~/apis/homeLocation/homeLocation.api';
import type {
  HomeLocationCreateRequest,
  HomeLocationResponse,
} from '~/apis/homeLocation/homeLocation.types';
import { useToast } from '~/components/Toast/Toast';

type OnSuccess = NonNullable<
  UseMutationOptions<HomeLocationResponse, unknown, HomeLocationCreateRequest>['onSuccess']
>;

export const useCreateHomeLocation = (
  options?: UseMutationOptions<HomeLocationResponse, unknown, HomeLocationCreateRequest>,
) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<HomeLocationCreateRequest, HomeLocationResponse>(
    createHomeLocationBuilder(),
    {
      ...options,
      onSuccess: (...args: Parameters<OnSuccess>) => {
        queryClient.invalidateQueries({ queryKey: ['homeLocations'] });
        showToast('고정 장소를 추가했어요.');
        options?.onSuccess?.(...args);
      },
      onError: (...args) => {
        showToast('고정 장소 추가에 실패했어요.', 'error');
        options?.onError?.(...args);
      },
    },
  );
};
