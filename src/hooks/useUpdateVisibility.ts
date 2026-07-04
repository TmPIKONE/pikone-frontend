import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { updateVisibilityBuilder } from '~/apis/record/record.api';
import type { VisibilityRequest, VisibilityResponse } from '~/apis/record/record.types';

type OnSuccess = NonNullable<
  UseMutationOptions<VisibilityResponse, unknown, VisibilityRequest>['onSuccess']
>;

export const useUpdateVisibility = (
  recordId: number,
  options?: UseMutationOptions<VisibilityResponse, unknown, VisibilityRequest>,
) => {
  const queryClient = useQueryClient();

  return useApiMutation<VisibilityRequest, VisibilityResponse>(updateVisibilityBuilder(recordId), {
    ...options,
    onSuccess: (...args: Parameters<OnSuccess>) => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      options?.onSuccess?.(...args);
    },
  });
};
