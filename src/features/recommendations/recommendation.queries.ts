import { useApiMutation } from '~/apis/config/ApiBuilder';
import { getRecommendationsBuilder } from '~/apis/recommendation/recommendation.api';
import type {
  RecommendationRequest,
  RecommendationResponse,
} from '~/apis/recommendation/recommendation.types';

export const useRecommendations = () =>
  useApiMutation<RecommendationRequest, RecommendationResponse[]>(getRecommendationsBuilder());
