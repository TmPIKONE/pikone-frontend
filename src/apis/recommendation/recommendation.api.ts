import ApiBuilder from '../config/builder/ApiBuilder';
import type {
  RecommendationActionRequest,
  RecommendationImpressionRequest,
  NaturalLanguageContextRequest,
  NaturalLanguageContextResponse,
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
} from './recommendation.types';

const RECOMMENDATIONS = '/recommendations';

export const getRecommendationsBuilder = () =>
  ApiBuilder.create<RecommendationRequest, RecommendationResponse[]>(RECOMMENDATIONS).setMethod(
    'POST',
  );

export const recordRecommendationImpressionsBuilder = (requestId: string) =>
  ApiBuilder.create<RecommendationImpressionRequest, void>(
    `${RECOMMENDATIONS}/${encodeURIComponent(requestId)}/impressions`,
  ).setMethod('POST');

export const recordRecommendationActionBuilder = (requestId: string) =>
  ApiBuilder.create<RecommendationActionRequest, void>(
    `${RECOMMENDATIONS}/${encodeURIComponent(requestId)}/actions`,
  ).setMethod('POST');

export const getRecommendationUsageBuilder = () =>
  ApiBuilder.create<void, RecommendationUsageResponse>(`${RECOMMENDATIONS}/usage`).setMethod('GET');

export const searchRecommendationLocationsBuilder = (
  query: string,
  latitude?: number,
  longitude?: number,
) =>
  ApiBuilder.create<void, RecommendationLocationResponse[]>(`${RECOMMENDATIONS}/locations`)
    .setMethod('GET')
    .setParams({ query, latitude, longitude });

export const reverseRecommendationLocationBuilder = (latitude: number, longitude: number) =>
  ApiBuilder.create<void, RecommendationLocationResponse[]>(`${RECOMMENDATIONS}/locations`)
    .setMethod('GET')
    .setParams({ latitude, longitude });

export const getPromptSuggestionsBuilder = () =>
  ApiBuilder.create<PromptSuggestionRequest, PromptSuggestionResponse>(
    `${RECOMMENDATIONS}/prompt-suggestions`,
  ).setMethod('POST');

export const recordPromptSuggestionEventBuilder = () =>
  ApiBuilder.create<PromptSuggestionEventRequest, void>(
    `${RECOMMENDATIONS}/prompt-suggestions/events`,
  ).setMethod('POST');

export const recordPromptSubmissionBuilder = (requestId: string) =>
  ApiBuilder.create<PromptSubmissionRequest, void>(
    `${RECOMMENDATIONS}/${encodeURIComponent(requestId)}/prompt-submission`,
  ).setMethod('POST');

export const parseRecommendationContextBuilder = () =>
  ApiBuilder.create<NaturalLanguageContextRequest, NaturalLanguageContextResponse>(
    `${RECOMMENDATIONS}/context/parse`,
  ).setMethod('POST');

export const getRecommendationHistoryBuilder = () =>
  ApiBuilder.create<void, RecommendationHistoryResponse[]>(`${RECOMMENDATIONS}/history`).setMethod(
    'GET',
  );

export const getRecommendationHistoryDetailBuilder = (requestId: string) =>
  ApiBuilder.create<void, RecommendationHistoryResponse>(
    `${RECOMMENDATIONS}/history/${encodeURIComponent(requestId)}`,
  ).setMethod('GET');

export const getRecommendationWorkspacesBuilder = () =>
  ApiBuilder.create<void, RecommendationWorkspaceResponse[]>(
    `${RECOMMENDATIONS}/workspaces`,
  ).setMethod('GET');

export const saveRecommendationWorkspaceBuilder = (workspaceId: string) =>
  ApiBuilder.create<RecommendationWorkspaceUpsertRequest, RecommendationWorkspaceResponse>(
    `${RECOMMENDATIONS}/workspaces/${encodeURIComponent(workspaceId)}`,
  ).setMethod('PUT');
