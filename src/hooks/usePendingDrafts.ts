import { useApiQuery } from '~/apis/config/ApiBuilder';
import { getPendingDraftsBuilder } from '~/apis/draft/draft.api';
import type { DraftResponse } from '~/apis/draft/draft.types';

export const usePendingDrafts = () => {
  return useApiQuery<void, DraftResponse[]>(getPendingDraftsBuilder(), ['drafts', 'pending']);
};
