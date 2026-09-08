import type {
  RecommendationLocationResponse,
  RecommendationRequest,
  RecommendationResponse,
} from '~/apis/recommendation/recommendation.types';

const RESULT_STORAGE_KEY = 'pikone:recommendation-result';
const RECENT_DESTINATIONS_KEY = 'pikone:recent-recommendation-destinations';
const SELECTED_RECOMMENDATION_KEY = 'pikone:selected-recommendation';
const MAX_RECENT_DESTINATIONS = 4;
export const RECOMMENDATION_ATTRIBUTION_TTL_MS = 24 * 60 * 60 * 1000;

export interface RecommendationResultState {
  recommendations?: RecommendationResponse[];
  request?: RecommendationRequest;
}

export interface SelectedRecommendationContext {
  recommendationRequestId: string;
  candidateSnapshotId: number;
  kakaoPlaceId: string;
  selectedAt: string;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isOptionalString = (value: unknown) => value === undefined || typeof value === 'string';

const isOptionalFiniteNumber = (value: unknown) =>
  value === undefined || (typeof value === 'number' && Number.isFinite(value));

const isOptionalNullableString = (value: unknown) => value == null || typeof value === 'string';

const isOptionalNullableFiniteNumber = (value: unknown) =>
  value == null || (typeof value === 'number' && Number.isFinite(value));

const isOptionalStringArray = (value: unknown) =>
  value === undefined || (Array.isArray(value) && value.every((item) => typeof item === 'string'));

const isRecommendation = (value: unknown): value is RecommendationResponse =>
  isObject(value) &&
  typeof value.kakaoPlaceId === 'string' &&
  typeof value.placeName === 'string' &&
  isOptionalString(value.category) &&
  isOptionalString(value.categoryLabel) &&
  isOptionalString(value.address) &&
  isOptionalString(value.mapUrl) &&
  isOptionalFiniteNumber(value.latitude) &&
  isOptionalFiniteNumber(value.longitude) &&
  isOptionalFiniteNumber(value.distance) &&
  isOptionalFiniteNumber(value.walkingMinutes) &&
  isOptionalString(value.recommendType) &&
  isOptionalString(value.pickLabel) &&
  isOptionalString(value.oneLineSummary) &&
  isOptionalStringArray(value.menuKeywords) &&
  isOptionalStringArray(value.reasonTags) &&
  isOptionalString(value.recommendationReason) &&
  isOptionalNullableString(value.recommendationRequestId) &&
  isOptionalNullableFiniteNumber(value.candidateSnapshotId);

const isRecommendationRequest = (value: unknown): value is RecommendationRequest =>
  isObject(value) &&
  typeof value.latitude === 'number' &&
  Number.isFinite(value.latitude) &&
  typeof value.longitude === 'number' &&
  Number.isFinite(value.longitude) &&
  isOptionalString(value.locationLabel) &&
  isOptionalStringArray(value.purposes) &&
  isOptionalStringArray(value.foodPreferences) &&
  isOptionalFiniteNumber(value.companionId) &&
  isOptionalString(value.priority) &&
  isOptionalFiniteNumber(value.radiusMeters) &&
  isOptionalStringArray(value.excludedPlaceIds) &&
  isOptionalString(value.parentRecommendationRequestId);

const isDestination = (value: unknown): value is RecommendationLocationResponse =>
  isObject(value) &&
  typeof value.locationId === 'string' &&
  typeof value.placeName === 'string' &&
  typeof value.latitude === 'number' &&
  Number.isFinite(value.latitude) &&
  typeof value.longitude === 'number' &&
  Number.isFinite(value.longitude) &&
  isOptionalString(value.address) &&
  isOptionalString(value.category);

export const readRecommendationResult = (): RecommendationResultState => {
  try {
    const stored = sessionStorage.getItem(RESULT_STORAGE_KEY);
    if (!stored) return {};

    const parsed: unknown = JSON.parse(stored);
    if (!isObject(parsed)) return {};

    const recommendations = Array.isArray(parsed.recommendations)
      ? parsed.recommendations.filter(isRecommendation)
      : undefined;
    const request = isRecommendationRequest(parsed.request) ? parsed.request : undefined;

    return recommendations && request ? { recommendations, request } : {};
  } catch {
    return {};
  }
};

export const writeRecommendationResult = (result: Required<RecommendationResultState>) => {
  try {
    sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result));
  } catch {
    // Storage can be unavailable in restricted browser environments.
  }
};

export const readRecentRecommendationDestinations = (): RecommendationLocationResponse[] => {
  try {
    const stored = localStorage.getItem(RECENT_DESTINATIONS_KEY);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed)
      ? parsed.filter(isDestination).slice(0, MAX_RECENT_DESTINATIONS)
      : [];
  } catch {
    return [];
  }
};

export const writeRecentRecommendationDestinations = (
  destinations: RecommendationLocationResponse[],
) => {
  const recentDestinations = destinations.slice(0, MAX_RECENT_DESTINATIONS);

  try {
    localStorage.setItem(RECENT_DESTINATIONS_KEY, JSON.stringify(recentDestinations));
  } catch {
    // Storage can be unavailable in restricted browser environments.
  }

  return recentDestinations;
};

export const clearSelectedRecommendation = () => {
  try {
    localStorage.removeItem(SELECTED_RECOMMENDATION_KEY);
  } catch {
    // Storage can be unavailable in restricted browser environments.
  }
};

const isSelectedRecommendationContext = (value: unknown): value is SelectedRecommendationContext =>
  isObject(value) &&
  typeof value.recommendationRequestId === 'string' &&
  Boolean(value.recommendationRequestId.trim()) &&
  typeof value.candidateSnapshotId === 'number' &&
  Number.isInteger(value.candidateSnapshotId) &&
  value.candidateSnapshotId > 0 &&
  typeof value.kakaoPlaceId === 'string' &&
  Boolean(value.kakaoPlaceId.trim()) &&
  typeof value.selectedAt === 'string' &&
  Number.isFinite(Date.parse(value.selectedAt));

export const readSelectedRecommendation = (
  now = Date.now(),
): SelectedRecommendationContext | undefined => {
  try {
    const stored = localStorage.getItem(SELECTED_RECOMMENDATION_KEY);
    if (!stored) return undefined;

    const parsed: unknown = JSON.parse(stored);
    if (!isSelectedRecommendationContext(parsed)) {
      clearSelectedRecommendation();
      return undefined;
    }

    if (now - Date.parse(parsed.selectedAt) > RECOMMENDATION_ATTRIBUTION_TTL_MS) {
      clearSelectedRecommendation();
      return undefined;
    }

    return {
      ...parsed,
      recommendationRequestId: parsed.recommendationRequestId.trim(),
      kakaoPlaceId: parsed.kakaoPlaceId.trim(),
    };
  } catch {
    clearSelectedRecommendation();
    return undefined;
  }
};

export const writeSelectedRecommendation = (context: SelectedRecommendationContext) => {
  try {
    localStorage.setItem(SELECTED_RECOMMENDATION_KEY, JSON.stringify(context));
  } catch {
    // Selection UI and action tracking remain usable without browser storage.
  }
};
