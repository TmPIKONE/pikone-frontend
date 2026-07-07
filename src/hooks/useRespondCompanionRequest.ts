import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { respondCompanionRequestBuilder } from '~/apis/companion/companion.api';
import type { RespondRequestDto, RespondRequestResponse } from '~/apis/companion/companion.types';
import { useToast } from '~/components/Toast/Toast';

export const useRespondCompanionRequest = (
  options?: UseMutationOptions<RespondRequestResponse, unknown, RespondRequestDto>,
) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<RespondRequestDto, RespondRequestResponse>(
    respondCompanionRequestBuilder(),
    {
      ...options,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey: ['companions', 'pendingRequests'] });
        queryClient.invalidateQueries({ queryKey: ['companions'] });
        showToast(variables.accept ? '동반자 신청을 수락했어요.' : '동반자 신청을 거절했어요.');
        options?.onSuccess?.(data, variables, context);
      },
      onError: (...args) => {
        showToast('신청 처리에 실패했어요.', 'error');
        options?.onError?.(...args);
      },
    },
  );
};
