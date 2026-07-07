import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { updateVisibilityBuilder } from '~/apis/record/record.api';
import type { VisibilityRequest, VisibilityResponse } from '~/apis/record/record.types';
import { useToast } from '~/components/Toast/Toast';

type OnSuccess = NonNullable<
  UseMutationOptions<VisibilityResponse, unknown, VisibilityRequest>['onSuccess']
>;

export const useUpdateVisibility = (
  recordId: number,
  options?: UseMutationOptions<VisibilityResponse, unknown, VisibilityRequest>,
) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<VisibilityRequest, VisibilityResponse>(updateVisibilityBuilder(recordId), {
    ...options,
    onSuccess: (...args: Parameters<OnSuccess>) => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      showToast('공개 여부를 수정했어요.');
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      showToast('공개 여부 수정에 실패했어요.', 'error');
      options?.onError?.(...args);
    },
  });
};
