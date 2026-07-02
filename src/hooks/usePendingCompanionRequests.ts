import { useApiQuery } from '~/apis/config/ApiBuilder';
import { getPendingCompanionRequestsBuilder } from '~/apis/companion/companion.api';
import type { PendingRequestResponse } from '~/apis/companion/companion.types';

export const usePendingCompanionRequests = () => {
  return useApiQuery<void, PendingRequestResponse[]>(getPendingCompanionRequestsBuilder(), [
    'companions',
    'pendingRequests',
  ]);
};
