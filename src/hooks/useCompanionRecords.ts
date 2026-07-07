import { useApiQuery } from '~/apis/config/ApiBuilder';
import { getCompanionRecordsBuilder } from '~/apis/companion/companion.api';
import type { FriendRecordResponse } from '~/apis/companion/companion.types';

export const useCompanionRecords = (companionId?: number) => {
  return useApiQuery<void, FriendRecordResponse[]>(
    getCompanionRecordsBuilder(companionId ?? 0),
    ['companions', companionId, 'records'],
    {
      enabled: companionId != null && Number.isFinite(companionId),
    },
  );
};
