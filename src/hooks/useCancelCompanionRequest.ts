import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation } from '~/apis/config/ApiBuilder';
import { cancelCompanionRequestBuilder } from '~/apis/companion/companion.api';

export const useCancelCompanionRequest = (
  requestId: number,
  options?: UseMutationOptions<void, unknown, void>,
) => {
  return useApiMutation<void, void>(cancelCompanionRequestBuilder(requestId), options);
};
