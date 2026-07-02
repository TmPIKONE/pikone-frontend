import { useApiQuery } from '~/apis/config/ApiBuilder';
import { getPendingCountBuilder } from '~/apis/draft/draft.api';
import type { PendingCountResponse } from '~/apis/draft/draft.types';

export const usePendingDraftCount = () => {
  return useApiQuery<void, PendingCountResponse, number>(
    getPendingCountBuilder(),
    ['drafts', 'pendingCount'],
    {
      select: (data) => data.pendingCount,
    },
  );
};
