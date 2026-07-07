import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { createLocalCompanionBuilder } from '~/apis/companion/companion.api';
import type {
  CreateLocalCompanionDto,
  CreateLocalCompanionResponse,
} from '~/apis/companion/companion.types';
import { useToast } from '~/components/Toast/Toast';

type OnSuccess = NonNullable<
  UseMutationOptions<CreateLocalCompanionResponse, unknown, CreateLocalCompanionDto>['onSuccess']
>;

export const useCreateLocalCompanion = (
  options?: UseMutationOptions<CreateLocalCompanionResponse, unknown, CreateLocalCompanionDto>,
) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<CreateLocalCompanionDto, CreateLocalCompanionResponse>(
    createLocalCompanionBuilder(),
    {
      ...options,
      onSuccess: (...args: Parameters<OnSuccess>) => {
        queryClient.invalidateQueries({ queryKey: ['companions'] });
        showToast('동반자를 추가했어요.');
        options?.onSuccess?.(...args);
      },
      onError: (...args) => {
        showToast('동반자 추가에 실패했어요.', 'error');
        options?.onError?.(...args);
      },
    },
  );
};
