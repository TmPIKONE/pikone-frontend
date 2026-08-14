import { useQueryClient } from '@tanstack/react-query';
import { useApiMutation, useApiQuery } from '~/apis/config/queryHooks';
import {
  getRecommendationUsageBuilder,
  getRecommendationsBuilder,
  searchRecommendationLocationsBuilder,
} from '~/apis/recommendation/recommendation.api';
import type {
  RecommendationLocationResponse,
  RecommendationRequest,
  RecommendationResponse,
  RecommendationUsageResponse,
} from '~/apis/recommendation/recommendation.types';
import { queryKeys } from '~/apis/queryKeys';

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
