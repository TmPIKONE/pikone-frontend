import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { updateHomeLocationBuilder } from '~/apis/homeLocation/homeLocation.api';
import type {
  HomeLocationUpdateRequest,
  HomeLocationResponse,
} from '~/apis/homeLocation/homeLocation.types';
import { useToast } from '~/components/Toast/Toast';

type OnSuccess = NonNullable<
  UseMutationOptions<HomeLocationResponse, unknown, HomeLocationUpdateRequest>['onSuccess']
>;

export const useUpdateHomeLocation = (
  id: number,
  options?: UseMutationOptions<HomeLocationResponse, unknown, HomeLocationUpdateRequest>,
) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<HomeLocationUpdateRequest, HomeLocationResponse>(
    updateHomeLocationBuilder(id),
    {
      ...options,
      onSuccess: (...args: Parameters<OnSuccess>) => {
        queryClient.invalidateQueries({ queryKey: ['homeLocations'] });
        showToast('고정 장소를 수정했어요.');
        options?.onSuccess?.(...args);
      },
      onError: (...args) => {
        showToast('고정 장소 수정에 실패했어요.', 'error');
        options?.onError?.(...args);
      },
    },
  );
};
