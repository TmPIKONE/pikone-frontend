import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useApiMutation, useApiQuery } from '~/apis/config/queryHooks';
import {
  approveDraftBuilder,
  getPendingCountBuilder,
  getPendingDraftsBuilder,
  rejectDraftBuilder,
  updateDraftLocationTypeBuilder,
} from '~/apis/draft/draft.api';
import type {
  ApproveRequest,
  DraftResponse,
  PendingCountResponse,
  UpdateLocationTypeRequest,
} from '~/apis/draft/draft.types';
import { queryKeys } from '~/apis/queryKeys';
import { useToast } from '~/components/Toast/useToast';

type ApproveOptions = UseMutationOptions<void, unknown, ApproveRequest>;
type ApproveSuccess = NonNullable<ApproveOptions['onSuccess']>;
type VoidSuccess = NonNullable<UseMutationOptions<void, unknown, void>['onSuccess']>;
type UpdateLocationOptions = UseMutationOptions<void, unknown, UpdateLocationTypeRequest>;
type UpdateLocationSuccess = NonNullable<UpdateLocationOptions['onSuccess']>;

export const usePendingDrafts = () =>
  useApiQuery<void, DraftResponse[]>(getPendingDraftsBuilder(), queryKeys.drafts.pending);

export const usePendingDraftCount = () =>
  useApiQuery<void, PendingCountResponse, number>(
    getPendingCountBuilder(),
    queryKeys.drafts.pendingCount,
    { select: (data) => data.pendingCount },
  );

export const useApproveDraft = (draftId: number, options?: ApproveOptions) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<ApproveRequest, void>(approveDraftBuilder(draftId), {
    ...options,
    onSuccess: (...args: Parameters<ApproveSuccess>) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.drafts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.records.all });
      showToast('대기 기록을 저장했어요.');
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      showToast('대기 기록 저장에 실패했어요.', 'error');
      options?.onError?.(...args);
    },
  });
};

export const useRejectDraft = (
  draftId: number,
  options?: UseMutationOptions<void, unknown, void>,
) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<void, void>(rejectDraftBuilder(draftId), {
    ...options,
    onSuccess: (...args: Parameters<VoidSuccess>) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.drafts.all });
      showToast('대기 기록을 삭제했어요.');
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      showToast('대기 기록 삭제에 실패했어요.', 'error');
      options?.onError?.(...args);
    },
  });
};

export const useUpdateDraftLocationType = (draftId: number, options?: UpdateLocationOptions) => {
  const queryClient = useQueryClient();

  return useApiMutation<UpdateLocationTypeRequest, void>(updateDraftLocationTypeBuilder(draftId), {
    ...options,
    onSuccess: (...args: Parameters<UpdateLocationSuccess>) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.drafts.all });
      options?.onSuccess?.(...args);
    },
  });
};
