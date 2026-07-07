import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { updateRecordBuilder } from '~/apis/record/record.api';
import type { UpdateRecordRequest } from '~/apis/record/record.types';
import { useToast } from '~/components/Toast/Toast';

type OnSuccess = NonNullable<UseMutationOptions<void, unknown, UpdateRecordRequest>['onSuccess']>;

export const useUpdateRecord = (
  recordId: number,
  options?: UseMutationOptions<void, unknown, UpdateRecordRequest>,
) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<UpdateRecordRequest, void>(updateRecordBuilder(recordId), {
    ...options,
    onSuccess: (...args: Parameters<OnSuccess>) => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      showToast('식사 기록을 수정했어요.');
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      showToast('식사 기록 수정에 실패했어요.', 'error');
      options?.onError?.(...args);
    },
  });
};
