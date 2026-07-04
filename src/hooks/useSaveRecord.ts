import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { saveRecordBuilder } from '~/apis/record/record.api';
import type { SaveRequest, SaveResponse } from '~/apis/record/record.types';

type OnSuccess = NonNullable<UseMutationOptions<SaveResponse, unknown, SaveRequest>['onSuccess']>;

export const useSaveRecord = (options?: UseMutationOptions<SaveResponse, unknown, SaveRequest>) => {
  const queryClient = useQueryClient();

  return useApiMutation<SaveRequest, SaveResponse>(saveRecordBuilder(), {
    ...options,
    onSuccess: (...args: Parameters<OnSuccess>) => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      options?.onSuccess?.(...args);
    },
  });
};
