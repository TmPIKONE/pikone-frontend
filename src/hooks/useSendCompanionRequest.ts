import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { sendCompanionRequestBuilder } from '~/apis/companion/companion.api';
import type { SendRequestDto, SendRequestResponse } from '~/apis/companion/companion.types';

export const useSendCompanionRequest = (
  options?: UseMutationOptions<SendRequestResponse, unknown, SendRequestDto>,
) => {
  return useApiMutation<SendRequestDto, SendRequestResponse>(
    sendCompanionRequestBuilder(),
    options,
  );
};
