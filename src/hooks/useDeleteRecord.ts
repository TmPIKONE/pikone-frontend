import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { deleteRecordBuilder } from '~/apis/record/record.api';

type OnSuccess = NonNullable<UseMutationOptions<void, unknown, void>['onSuccess']>;

export const useDeleteRecord = (
  recordId: number,
  options?: UseMutationOptions<void, unknown, void>,
) => {
  const queryClient = useQueryClient();

  return useApiMutation<void, void>(deleteRecordBuilder(recordId), {
    ...options,
    onSuccess: (...args: Parameters<OnSuccess>) => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      options?.onSuccess?.(...args);
    },
  });
};
