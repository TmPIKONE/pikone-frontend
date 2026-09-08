import ApiBuilder from '../config/builder/ApiBuilder';
import type {
  RecommendationActionRequest,
  RecommendationImpressionRequest,
  RecommendationLocationResponse,
  RecommendationRequest,
  RecommendationResponse,
  RecommendationUsageResponse,
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
