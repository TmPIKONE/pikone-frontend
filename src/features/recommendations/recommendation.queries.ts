import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useApiMutation, useApiQuery } from '~/apis/config/queryHooks';
import {
  getRecommendationUsageBuilder,
  getRecommendationsBuilder,
  recordRecommendationActionBuilder,
  recordRecommendationImpressionsBuilder,
  searchRecommendationLocationsBuilder,
} from '~/apis/recommendation/recommendation.api';
import type {
  RecommendationActionRequest,
  RecommendationImpressionRequest,
  RecommendationLocationResponse,
  RecommendationRequest,
  RecommendationResponse,
  RecommendationUsageResponse,
} from '~/apis/recommendation/recommendation.types';
import { queryKeys } from '~/apis/queryKeys';
import {
  completeRecommendationImpression,
  failRecommendationImpression,
} from './recommendationTracking';

export interface RecommendationImpressionMutationVariables {
  requestId: string;
  body: RecommendationImpressionRequest;
  dedupeKey: string;
}

export interface RecommendationActionMutationVariables {
  requestId: string;
  body: RecommendationActionRequest;
}

export const useRecommendations = () => {
  const queryClient = useQueryClient();

  return useApiMutation<RecommendationRequest, RecommendationResponse[]>(
    getRecommendationsBuilder(),
    {
      onSuccess: (recommendations) => {
        if (recommendations.length === 0) return;

        queryClient.setQueryData<RecommendationUsageResponse>(
          queryKeys.recommendations.usage,
          (current) => {
            if (!current) return current;
            const usedCount = Math.min(current.dailyLimit, current.usedCount + 1);
            const remainingCount = Math.max(0, current.dailyLimit - usedCount);
            return {
              ...current,
              usedCount,
              remainingCount,
              exhausted: remainingCount === 0,
            };
          },
        );
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.recommendations.usage }),
    },
  );
};

const retryTrackingRequest = (failureCount: number, error: unknown) => {
  if (failureCount >= 1) return false;
  if (!isAxiosError(error)) return true;

  const status = error.response?.status;
  return status == null || status >= 500;
};

export const useRecommendationImpressions = () =>
  useMutation<void, unknown, RecommendationImpressionMutationVariables>({
    mutationFn: ({ requestId, body }) =>
      recordRecommendationImpressionsBuilder(requestId).execute(body),
    retry: retryTrackingRequest,
    onSuccess: (_data, variables) => completeRecommendationImpression(variables.dedupeKey),
    onError: (_error, variables) => failRecommendationImpression(variables.dedupeKey),
  });

export const useRecommendationAction = () =>
  useMutation<void, unknown, RecommendationActionMutationVariables>({
    mutationFn: ({ requestId, body }) => recordRecommendationActionBuilder(requestId).execute(body),
    retry: retryTrackingRequest,
  });

export const useRecommendationUsage = () =>
  useApiQuery<void, RecommendationUsageResponse>(
    getRecommendationUsageBuilder(),
    queryKeys.recommendations.usage,
    {
      staleTime: 15 * 1000,
      refetchOnWindowFocus: true,
      retry: 1,
    },
  );

export const useRecommendationLocationSearch = (
  query: string,
  latitude?: number,
  longitude?: number,
  enabled = true,
) =>
  useApiQuery<void, RecommendationLocationResponse[]>(
    searchRecommendationLocationsBuilder(query, latitude, longitude),
    queryKeys.recommendations.locations(query, latitude, longitude),
    {
      enabled: enabled && query.trim().length >= 2,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  );
