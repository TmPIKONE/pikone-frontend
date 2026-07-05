import ApiBuilder from '../config/ApiBuilder';
import type { RecommendationRequest, RecommendationResponse } from './recommendation.types';

const RECOMMENDATIONS = '/recommendations';

export const getRecommendationsBuilder = () =>
  ApiBuilder.create<RecommendationRequest, RecommendationResponse[]>(RECOMMENDATIONS).setMethod(
    'POST',
  );
