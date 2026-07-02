import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { respondCompanionRequestBuilder } from '~/apis/companion/companion.api';
import type { RespondRequestDto, RespondRequestResponse } from '~/apis/companion/companion.types';

export const useRespondCompanionRequest = (
  options?: UseMutationOptions<RespondRequestResponse, unknown, RespondRequestDto>,
) => {
  const queryClient = useQueryClient();

  return useApiMutation<RespondRequestDto, RespondRequestResponse>(
    respondCompanionRequestBuilder(),
    {
      ...options,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey: ['companions', 'pendingRequests'] });
        queryClient.invalidateQueries({ queryKey: ['companions'] });
        options?.onSuccess?.(data, variables, context);
      },
    },
  );
};
