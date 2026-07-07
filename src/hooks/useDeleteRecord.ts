import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { deleteRecordBuilder } from '~/apis/record/record.api';
import { useToast } from '~/components/Toast/Toast';

type OnSuccess = NonNullable<UseMutationOptions<void, unknown, void>['onSuccess']>;

export const useDeleteRecord = (
  recordId: number,
  options?: UseMutationOptions<void, unknown, void>,
) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<void, void>(deleteRecordBuilder(recordId), {
    ...options,
    onSuccess: (...args: Parameters<OnSuccess>) => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      showToast('식사 기록을 삭제했어요.');
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      showToast('식사 기록 삭제에 실패했어요.', 'error');
      options?.onError?.(...args);
    },
  });
};
