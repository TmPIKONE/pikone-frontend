import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { updateRecordBuilder } from '~/apis/record/record.api';
import type { UpdateRecordRequest } from '~/apis/record/record.types';

type OnSuccess = NonNullable<UseMutationOptions<void, unknown, UpdateRecordRequest>['onSuccess']>;

export const useUpdateRecord = (
  recordId: number,
  options?: UseMutationOptions<void, unknown, UpdateRecordRequest>,
) => {
  const queryClient = useQueryClient();

  return useApiMutation<UpdateRecordRequest, void>(updateRecordBuilder(recordId), {
    ...options,
    onSuccess: (...args: Parameters<OnSuccess>) => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      options?.onSuccess?.(...args);
    },
  });
};
