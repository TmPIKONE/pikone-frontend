import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { createLocalCompanionBuilder } from '~/apis/companion/companion.api';
import type {
  CreateLocalCompanionDto,
  CreateLocalCompanionResponse,
} from '~/apis/companion/companion.types';

type OnSuccess = NonNullable<
  UseMutationOptions<CreateLocalCompanionResponse, unknown, CreateLocalCompanionDto>['onSuccess']
>;

export const useCreateLocalCompanion = (
  options?: UseMutationOptions<CreateLocalCompanionResponse, unknown, CreateLocalCompanionDto>,
) => {
  const queryClient = useQueryClient();

  return useApiMutation<CreateLocalCompanionDto, CreateLocalCompanionResponse>(
    createLocalCompanionBuilder(),
    {
      ...options,
      onSuccess: (...args: Parameters<OnSuccess>) => {
        queryClient.invalidateQueries({ queryKey: ['companions'] });
        options?.onSuccess?.(...args);
      },
    },
  );
};
