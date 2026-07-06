import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { saveRecordBuilder } from '~/apis/record/record.api';
import type { SaveResponse } from '~/apis/record/record.types';

type OnSuccess = NonNullable<UseMutationOptions<SaveResponse, unknown, FormData>['onSuccess']>;

export const useSaveRecord = (options?: UseMutationOptions<SaveResponse, unknown, FormData>) => {
  const queryClient = useQueryClient();

  return useApiMutation<FormData, SaveResponse>(saveRecordBuilder(), {
    ...options,
    onSuccess: (...args: Parameters<OnSuccess>) => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      options?.onSuccess?.(...args);
    },
  });
};