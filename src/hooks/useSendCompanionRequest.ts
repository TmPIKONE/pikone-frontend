import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { sendCompanionRequestBuilder } from '~/apis/companion/companion.api';
import type { SendRequestDto, SendRequestResponse } from '~/apis/companion/companion.types';
import { useToast } from '~/components/Toast/Toast';

export const useSendCompanionRequest = (
  options?: UseMutationOptions<SendRequestResponse, unknown, SendRequestDto>,
) => {
  const { showToast } = useToast();

  return useApiMutation<SendRequestDto, SendRequestResponse>(
    sendCompanionRequestBuilder(),
    {
      ...options,
      onSuccess: (...args) => {
        showToast('동반자 신청을 보냈어요.');
        options?.onSuccess?.(...args);
      },
      onError: (...args) => {
        showToast('동반자 신청에 실패했어요.', 'error');
        options?.onError?.(...args);
      },
    },
  );
};
