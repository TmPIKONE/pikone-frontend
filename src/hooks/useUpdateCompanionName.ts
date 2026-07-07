import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { updateCompanionNameBuilder } from '~/apis/companion/companion.api';
import type { UpdateDisplayNameDto } from '~/apis/companion/companion.types';
import { useToast } from '~/components/Toast/Toast';

type OnSuccess = NonNullable<UseMutationOptions<void, unknown, UpdateDisplayNameDto>['onSuccess']>;

export const useUpdateCompanionName = (
  companionId: number,
  options?: UseMutationOptions<void, unknown, UpdateDisplayNameDto>,
) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<UpdateDisplayNameDto, void>(updateCompanionNameBuilder(companionId), {
    ...options,
    onSuccess: (...args: Parameters<OnSuccess>) => {
      queryClient.invalidateQueries({ queryKey: ['companions'] });
      showToast('동반자 이름을 수정했어요.');
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      showToast('이름 수정에 실패했어요.', 'error');
      options?.onError?.(...args);
    },
  });
};
