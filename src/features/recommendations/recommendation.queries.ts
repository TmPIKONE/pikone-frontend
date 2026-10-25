import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useApiMutation, useApiQuery } from '~/apis/config/queryHooks';
import {
  getRecommendationUsageBuilder,
  getRecommendationHistoryBuilder,
  getRecommendationWorkspacesBuilder,
  saveRecommendationWorkspaceBuilder,
  getRecommendationHistoryDetailBuilder,
  parseRecommendationContextBuilder,
  getRecommendationsBuilder,
  recordRecommendationActionBuilder,
  recordRecommendationImpressionsBuilder,
  reverseRecommendationLocationBuilder,
  searchRecommendationLocationsBuilder,
  getPromptSuggestionsBuilder,
  recordPromptSuggestionEventBuilder,
  recordPromptSubmissionBuilder,
} from '~/apis/recommendation/recommendation.api';
import type {
  NaturalLanguageContextRequest,
  NaturalLanguageContextResponse,
  RecommendationActionRequest,
  RecommendationImpressionRequest,
  RecommendationLocationResponse,
  RecommendationRequest,
  RecommendationResponse,
  RecommendationUsageResponse,
  RecommendationHistoryResponse,
  RecommendationWorkspaceResponse,
  RecommendationWorkspaceUpsertRequest,
  PromptSuggestionRequest,
  PromptSuggestionResponse,
  PromptSuggestionEventRequest,
  PromptSubmissionRequest,
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

export const useRecommendationLocationReverse = () =>
  useMutation<RecommendationLocationResponse, unknown, { latitude: number; longitude: number }>({
    mutationFn: async ({ latitude, longitude }) => {
      const locations = await reverseRecommendationLocationBuilder(latitude, longitude).execute();
      const location = locations[0];
      if (!location) {
        throw new Error('핀 위치의 주소를 찾지 못했어요.');
      }
      return location;
    },
    retry: 1,
  });

export const useRecommendationContextParser = () =>
  useApiMutation<NaturalLanguageContextRequest, NaturalLanguageContextResponse>(
    parseRecommendationContextBuilder(),
  );

export const usePromptSuggestions = () =>
  useApiMutation<PromptSuggestionRequest, PromptSuggestionResponse>(getPromptSuggestionsBuilder());

export const usePromptSuggestionEvent = () =>
  useMutation<void, unknown, PromptSuggestionEventRequest>({
    mutationFn: (body) => recordPromptSuggestionEventBuilder().execute(body),
    retry: retryTrackingRequest,
  });

export interface PromptSubmissionMutationVariables {
  requestId: string;
  body: PromptSubmissionRequest;
}

export const usePromptSubmission = () =>
  useMutation<void, unknown, PromptSubmissionMutationVariables>({
    mutationFn: ({ requestId, body }) => recordPromptSubmissionBuilder(requestId).execute(body),
    retry: retryTrackingRequest,
  });

export const useRecommendationHistory = () =>
  useApiQuery<void, RecommendationHistoryResponse[]>(
    getRecommendationHistoryBuilder(),
    queryKeys.recommendations.history,
    { staleTime: 60 * 1000, retry: 1 },
  );

export const useRecommendationHistoryDetail = (requestId: string | undefined) =>
  useApiQuery<void, RecommendationHistoryResponse>(
    getRecommendationHistoryDetailBuilder(requestId ?? ''),
    queryKeys.recommendations.historyDetail(requestId ?? ''),
    { enabled: Boolean(requestId), staleTime: 5 * 60 * 1000, retry: 1 },
  );

export const useRecommendationWorkspaces = () =>
  useApiQuery<void, RecommendationWorkspaceResponse[]>(
    getRecommendationWorkspacesBuilder(),
    queryKeys.recommendations.workspaces,
    { staleTime: 30 * 1000, retry: 1 },
  );

export const useSaveRecommendationWorkspace = (workspaceId: string | undefined) => {
  const queryClient = useQueryClient();
  return useApiMutation<RecommendationWorkspaceUpsertRequest, RecommendationWorkspaceResponse>(
    saveRecommendationWorkspaceBuilder(workspaceId ?? ''),
    {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: queryKeys.recommendations.workspaces }),
    },
  );
};
