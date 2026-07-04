import ApiBuilder from '../config/ApiBuilder';
import type {
  PendingCountResponse,
  DraftResponse,
  ApproveRequest,
  UpdateLocationTypeRequest,
} from './draft.types';

const DRAFTS = '/drafts';
const DRAFTS_PENDING = '/drafts/pending';
const DRAFTS_PENDING_COUNT = '/drafts/pending/count';

export const getPendingCountBuilder = () =>
  ApiBuilder.create<void, PendingCountResponse>(DRAFTS_PENDING_COUNT).setMethod('GET');

export const getPendingDraftsBuilder = () =>
  ApiBuilder.create<void, DraftResponse[]>(DRAFTS_PENDING).setMethod('GET');

export const approveDraftBuilder = (draftId: number) =>
  ApiBuilder.create<ApproveRequest, void>(`${DRAFTS}/${draftId}/approve`).setMethod('POST');

export const rejectDraftBuilder = (draftId: number) =>
  ApiBuilder.create<void, void>(`${DRAFTS}/${draftId}/reject`).setMethod('PATCH');

export const updateDraftLocationTypeBuilder = (draftId: number) =>
  ApiBuilder.create<UpdateLocationTypeRequest, void>(`${DRAFTS}/${draftId}/location`).setMethod(
    'PATCH',
  );
