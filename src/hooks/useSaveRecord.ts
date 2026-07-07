import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { saveRecordBuilder } from '~/apis/record/record.api';
import type { SaveResponse } from '~/apis/record/record.types';
import { useToast } from '~/components/Toast/Toast';

type OnSuccess = NonNullable<UseMutationOptions<SaveResponse, unknown, FormData>['onSuccess']>;

export const useSaveRecord = (options?: UseMutationOptions<SaveResponse, unknown, FormData>) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<FormData, SaveResponse>(saveRecordBuilder(), {
    ...options,
    onSuccess: (...args: Parameters<OnSuccess>) => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      showToast('식사 기록을 저장했어요.');
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      showToast('식사 기록 저장에 실패했어요.', 'error');
      options?.onError?.(...args);
    },
  });
};
