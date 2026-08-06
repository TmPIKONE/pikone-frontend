import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import {
  cancelCompanionRequestBuilder,
  createLocalCompanionBuilder,
  deleteCompanionBuilder,
  getCompanionRecordsBuilder,
  getCompanionsBuilder,
  getMyCompanionCodeBuilder,
  getPendingCompanionRequestsBuilder,
  respondCompanionRequestBuilder,
  sendCompanionRequestBuilder,
  updateCompanionNameBuilder,
} from '~/apis/companion/companion.api';
import type {
  CompanionResponse,
  CreateLocalCompanionDto,
  CreateLocalCompanionResponse,
  FriendRecordResponse,
  MyCodeResponse,
  PendingRequestResponse,
  RespondRequestDto,
  RespondRequestResponse,
  SendRequestDto,
  SendRequestResponse,
  UpdateDisplayNameDto,
} from '~/apis/companion/companion.types';
import { useApiMutation, useApiQuery } from '~/apis/config/ApiBuilder';
import { queryKeys } from '~/apis/queryKeys';
import { useToast } from '~/components/Toast/useToast';

type VoidSuccess = NonNullable<UseMutationOptions<void, unknown, void>['onSuccess']>;
type CreateOptions = UseMutationOptions<
  CreateLocalCompanionResponse,
  unknown,
  CreateLocalCompanionDto
>;
type CreateSuccess = NonNullable<CreateOptions['onSuccess']>;
type RespondOptions = UseMutationOptions<RespondRequestResponse, unknown, RespondRequestDto>;
type RespondSuccess = NonNullable<RespondOptions['onSuccess']>;
type UpdateNameOptions = UseMutationOptions<void, unknown, UpdateDisplayNameDto>;
type UpdateNameSuccess = NonNullable<UpdateNameOptions['onSuccess']>;

export const useCompanions = () =>
  useApiQuery<void, CompanionResponse[]>(getCompanionsBuilder(), queryKeys.companions.all);

export const useCompanionRecords = (companionId?: number) =>
  useApiQuery<void, FriendRecordResponse[]>(
    getCompanionRecordsBuilder(companionId ?? 0),
    queryKeys.companions.records(companionId ?? 0),
    { enabled: companionId != null && Number.isFinite(companionId) },
  );

export const useMyCompanionCode = () =>
  useApiQuery<void, MyCodeResponse>(getMyCompanionCodeBuilder(), queryKeys.companions.myCode);

export const usePendingCompanionRequests = () =>
  useApiQuery<void, PendingRequestResponse[]>(
    getPendingCompanionRequestsBuilder(),
    queryKeys.companions.pendingRequests,
  );

export const useCancelCompanionRequest = (
  requestId: number,
  options?: UseMutationOptions<void, unknown, void>,
) => useApiMutation<void, void>(cancelCompanionRequestBuilder(requestId), options);

export const useCreateLocalCompanion = (options?: CreateOptions) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<CreateLocalCompanionDto, CreateLocalCompanionResponse>(
    createLocalCompanionBuilder(),
    {
      ...options,
      onSuccess: (...args: Parameters<CreateSuccess>) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.companions.all });
        showToast('동반자를 추가했어요.');
        options?.onSuccess?.(...args);
      },
      onError: (...args) => {
        showToast('동반자 추가에 실패했어요.', 'error');
        options?.onError?.(...args);
      },
    },
  );
};

export const useDeleteCompanion = (
  companionId: number,
  options?: UseMutationOptions<void, unknown, void>,
) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<void, void>(deleteCompanionBuilder(companionId), {
    ...options,
    onSuccess: (...args: Parameters<VoidSuccess>) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companions.all });
      showToast('동반자를 삭제했어요.');
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      showToast('동반자 삭제에 실패했어요.', 'error');
      options?.onError?.(...args);
    },
  });
};

export const useRespondCompanionRequest = (options?: RespondOptions) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<RespondRequestDto, RespondRequestResponse>(
    respondCompanionRequestBuilder(),
    {
      ...options,
      onSuccess: (...args: Parameters<RespondSuccess>) => {
        const [, variables] = args;
        queryClient.invalidateQueries({ queryKey: queryKeys.companions.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.companions.pendingRequests });
        showToast(variables.accept ? '동반자 신청을 수락했어요.' : '동반자 신청을 거절했어요.');
        options?.onSuccess?.(...args);
      },
      onError: (...args) => {
        showToast('신청 처리에 실패했어요.', 'error');
        options?.onError?.(...args);
      },
    },
  );
};

export const useSendCompanionRequest = (
  options?: UseMutationOptions<SendRequestResponse, unknown, SendRequestDto>,
) => {
  const { showToast } = useToast();

  return useApiMutation<SendRequestDto, SendRequestResponse>(sendCompanionRequestBuilder(), {
    ...options,
    onSuccess: (...args) => {
      showToast('동반자 신청을 보냈어요.');
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      showToast('동반자 신청에 실패했어요.', 'error');
      options?.onError?.(...args);
    },
  });
};

export const useUpdateCompanionName = (companionId: number, options?: UpdateNameOptions) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<UpdateDisplayNameDto, void>(updateCompanionNameBuilder(companionId), {
    ...options,
    onSuccess: (...args: Parameters<UpdateNameSuccess>) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companions.all });
      showToast('동반자 이름을 수정했어요.');
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      showToast('이름 수정에 실패했어요.', 'error');
      options?.onError?.(...args);
    },
  });
};
