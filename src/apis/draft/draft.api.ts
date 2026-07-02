import ApiBuilder from '../config/ApiBuilder';
import type { PendingCountResponse } from './draft.types';

const DRAFTS_PENDING_COUNT = '/drafts/pending/count';

export const getPendingCountBuilder = () =>
  ApiBuilder.create<void, PendingCountResponse>(DRAFTS_PENDING_COUNT).setMethod('GET');
