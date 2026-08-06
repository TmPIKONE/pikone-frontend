import { useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useApiMutation, useApiQuery } from '~/apis/config/ApiBuilder';
import { queryKeys } from '~/apis/queryKeys';
import {
  analyzeImageBuilder,
  deleteRecordBuilder,
  getCalendarBuilder,
  getRecordsByDateBuilder,
  saveRecordBuilder,
  searchRestaurantsBuilder,
  updateRecordBuilder,
  updateVisibilityBuilder,
} from '~/apis/record/record.api';
import type {
  AiFoodResponse,
  CalendarResponse,
  RecordDetailResponse,
  RestaurantCandidate,
  SaveRequest,
  SaveResponse,
  UpdateRecordRequest,
  VisibilityRequest,
  VisibilityResponse,
} from '~/apis/record/record.types';
import { useToast } from '~/components/Toast/useToast';

type SaveOptions = UseMutationOptions<SaveResponse, unknown, SaveRequest>;
type SaveSuccess = NonNullable<SaveOptions['onSuccess']>;
type UpdateOptions = UseMutationOptions<void, unknown, UpdateRecordRequest>;
type UpdateSuccess = NonNullable<UpdateOptions['onSuccess']>;
type VisibilityOptions = UseMutationOptions<VisibilityResponse, unknown, VisibilityRequest>;
type VisibilitySuccess = NonNullable<VisibilityOptions['onSuccess']>;
type VoidSuccess = NonNullable<UseMutationOptions<void, unknown, void>['onSuccess']>;

const isDailyRecordLimitError = (error: unknown) => {
  if (!isAxiosError(error)) return false;
  const responseData = error.response?.data as { message?: unknown } | undefined;
  return (
    typeof responseData?.message === 'string' && responseData.message.includes('하루 최대 3개')
  );
};

export const useCalendar = (year: number, month: number) =>
  useApiQuery<void, CalendarResponse[]>(
    getCalendarBuilder(year, month),
    queryKeys.records.calendar(year, month),
  );

export const useRecordsByDate = (date: string) =>
  useApiQuery<void, RecordDetailResponse[]>(
    getRecordsByDateBuilder(date),
    queryKeys.records.byDate(date),
    { enabled: Boolean(date) },
  );

export const useAnalyzeImage = (latitude?: number, longitude?: number) =>
  useApiMutation<FormData, AiFoodResponse>(analyzeImageBuilder(latitude, longitude));

export const useRestaurantSearch = (query: string, latitude?: number, longitude?: number) => {
  const normalizedQuery = query.trim();

  return useApiQuery<void, RestaurantCandidate[]>(
    searchRestaurantsBuilder(normalizedQuery, latitude, longitude),
    queryKeys.records.restaurantSearch(normalizedQuery, latitude, longitude),
    {
      enabled: normalizedQuery.length >= 2,
      staleTime: 60_000,
    },
  );
};

export const useDeleteRecord = (
  recordId: number,
  options?: UseMutationOptions<void, unknown, void>,
) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<void, void>(deleteRecordBuilder(recordId), {
    ...options,
    onSuccess: (...args: Parameters<VoidSuccess>) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.records.all });
      showToast('식사 기록을 삭제했어요.');
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      showToast('식사 기록 삭제에 실패했어요.', 'error');
      options?.onError?.(...args);
    },
  });
};

export const useSaveRecord = (options?: SaveOptions) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<SaveRequest, SaveResponse>(saveRecordBuilder(), {
    ...options,
    onSuccess: (...args: Parameters<SaveSuccess>) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.records.all });
      showToast('식사 기록을 저장했어요.');
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      showToast(
        isDailyRecordLimitError(args[0])
          ? '이 날짜에는 이미 3개를 기록했어요.'
          : '식사 기록 저장에 실패했어요.',
        'error',
      );
      options?.onError?.(...args);
    },
  });
};

export const useUpdateRecord = (recordId: number, options?: UpdateOptions) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<UpdateRecordRequest, void>(updateRecordBuilder(recordId), {
    ...options,
    onSuccess: (...args: Parameters<UpdateSuccess>) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.records.all });
      showToast('식사 기록을 수정했어요.');
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      showToast('식사 기록 수정에 실패했어요.', 'error');
      options?.onError?.(...args);
    },
  });
};

export const useUpdateVisibility = (recordId: number, options?: VisibilityOptions) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useApiMutation<VisibilityRequest, VisibilityResponse>(updateVisibilityBuilder(recordId), {
    ...options,
    onSuccess: (...args: Parameters<VisibilitySuccess>) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.records.all });
      showToast('공개 여부를 수정했어요.');
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      showToast('공개 여부 수정에 실패했어요.', 'error');
      options?.onError?.(...args);
    },
  });
};
