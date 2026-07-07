import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { deleteHomeLocationBuilder } from '~/apis/homeLocation/homeLocation.api';
import { useToast } from '~/components/Toast/Toast';

type OnSuccess = NonNullable<UseMutationOptions<void, unknown, void>['onSuccess']>;

export const useDeleteHomeLocation = (
  id: number,
  options?: UseMutationOptions<void, unknown, void>,
) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<void, void>(deleteHomeLocationBuilder(id), {
    ...options,
    onSuccess: (...args: Parameters<OnSuccess>) => {
      queryClient.invalidateQueries({ queryKey: ['homeLocations'] });
      showToast('고정 장소를 삭제했어요.');
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      showToast('고정 장소 삭제에 실패했어요.', 'error');
      options?.onError?.(...args);
    },
  });
};
