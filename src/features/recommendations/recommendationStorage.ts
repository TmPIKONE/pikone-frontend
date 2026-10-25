import type {
  RecommendationLocationResponse,
  RecommendationRequest,
  RecommendationResponse,
} from '~/apis/recommendation/recommendation.types';

const RESULT_STORAGE_KEY = 'pikone:recommendation-result';
const DRAFT_STORAGE_KEY = 'pikone:recommendation-draft';
const RECENT_DESTINATIONS_KEY = 'pikone:recent-recommendation-destinations';
const SELECTED_RECOMMENDATION_KEY = 'pikone:selected-recommendation';
const TRIP_STORAGE_KEY = 'pikone:recommendation-trip';
const WORKFLOW_STORAGE_KEY = 'pikone:recommendation-workflow';
const MAX_RECENT_DESTINATIONS = 4;
export const RECOMMENDATION_ATTRIBUTION_TTL_MS = 24 * 60 * 60 * 1000;

export type RecommendationWorkflowPhase = 'EDITING' | 'COMPARING' | 'SELECTED';

export interface RecommendationResultState {
  recommendations?: RecommendationResponse[];
  request?: RecommendationRequest;
  updatedAt?: string;
  workspaceId?: string;
  rootRequestId?: string;
  selectedCandidateSnapshotId?: number;
  selectedKakaoPlaceId?: string;
  historyPreview?: boolean;
  activeResultSnapshot?: RecommendationResultState;
  persistWorkspace?: boolean;
}

export interface RecommendationWorkflowState {
  phase: RecommendationWorkflowPhase;
  updatedAt: string;
}

export interface RecommendationTripState {
  recommendation: RecommendationResponse;
  request: RecommendationRequest;
  selectedAt: string;
}

export interface SelectedRecommendationContext {
  recommendationRequestId: string;
  candidateSnapshotId: number;
  kakaoPlaceId: string;
  selectedAt: string;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isOptionalBoolean = (value: unknown) => value === undefined || typeof value === 'boolean';

const isOptionalString = (value: unknown) => value === undefined || typeof value === 'string';

const isOptionalFiniteNumber = (value: unknown) =>
  value === undefined || (typeof value === 'number' && Number.isFinite(value));

const isOptionalNullableString = (value: unknown) => value == null || typeof value === 'string';

const isOptionalNullableFiniteNumber = (value: unknown) =>
  value == null || (typeof value === 'number' && Number.isFinite(value));

const isOptionalStringArray = (value: unknown) =>
  value === undefined || (Array.isArray(value) && value.every((item) => typeof item === 'string'));

const isOptionalMenuArray = (value: unknown) =>
  value === undefined ||
  (Array.isArray(value) &&
    value.every(
      (item) =>
        isObject(item) &&
        typeof item.name === 'string' &&
        (item.priceWon == null ||
          (typeof item.priceWon === 'number' && Number.isFinite(item.priceWon))),
    ));

const isRecommendation = (value: unknown): value is RecommendationResponse =>
  isObject(value) &&
  typeof value.kakaoPlaceId === 'string' &&
  typeof value.placeName === 'string' &&
  isOptionalString(value.category) &&
  isOptionalString(value.categoryLabel) &&
  isOptionalString(value.categoryFamily) &&
  isOptionalStringArray(value.contextNotes) &&
  isOptionalStringArray(value.effectiveContext) &&
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
  isOptionalString(value.imageUrl) &&
  isOptionalMenuArray(value.menus) &&
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
  isOptionalStringArray(value.companionFoodPreferences) &&
  isOptionalFiniteNumber(value.companionId) &&
  isOptionalString(value.occasion) &&
  isOptionalString(value.mobility) &&
  isOptionalString(value.discoveryIntent) &&
  isOptionalString(value.timeBudget) &&
  isOptionalString(value.budgetPreference) &&
  isOptionalString(value.priority) &&
  isOptionalFiniteNumber(value.radiusMeters) &&
  isOptionalStringArray(value.excludedPlaceIds) &&
  isOptionalStringArray(value.seenPlaceIds) &&
  isOptionalStringArray(value.excludedCategoryFamilies) &&
  isOptionalBoolean(value.strictFoodPreferences) &&
  isOptionalBoolean(value.strictCompanionFoodPreferences) &&
  isOptionalStringArray(value.contextSearchTerms) &&
  isOptionalString(value.naturalContext) &&
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
    const workspaceId = typeof parsed.workspaceId === 'string' ? parsed.workspaceId : undefined;
    const rootRequestId =
      typeof parsed.rootRequestId === 'string' ? parsed.rootRequestId : undefined;
    const updatedAt =
      typeof parsed.updatedAt === 'string' && Number.isFinite(Date.parse(parsed.updatedAt))
        ? parsed.updatedAt
        : undefined;
    const selectedCandidateSnapshotId =
      typeof parsed.selectedCandidateSnapshotId === 'number'
        ? parsed.selectedCandidateSnapshotId
        : undefined;
    const selectedKakaoPlaceId =
      typeof parsed.selectedKakaoPlaceId === 'string' ? parsed.selectedKakaoPlaceId : undefined;

    return recommendations && request
      ? {
          recommendations,
          request,
          updatedAt,
          workspaceId,
          rootRequestId,
          selectedCandidateSnapshotId,
          selectedKakaoPlaceId,
        }
      : {};
  } catch {
    return {};
  }
};

export const writeRecommendationResult = (
  result: RecommendationResultState & {
    recommendations: RecommendationResponse[];
    request: RecommendationRequest;
  },
) => {
  try {
    const updatedAt = result.updatedAt ?? new Date().toISOString();
    sessionStorage.setItem(
      RESULT_STORAGE_KEY,
      JSON.stringify({
        recommendations: result.recommendations,
        request: result.request,
        updatedAt,
        workspaceId: result.workspaceId,
        rootRequestId: result.rootRequestId,
        selectedCandidateSnapshotId: result.selectedCandidateSnapshotId,
        selectedKakaoPlaceId: result.selectedKakaoPlaceId,
      }),
    );
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

const isRecommendationTripState = (value: unknown): value is RecommendationTripState =>
  isObject(value) &&
  isRecommendation(value.recommendation) &&
  isRecommendationRequest(value.request) &&
  typeof value.selectedAt === 'string' &&
  Number.isFinite(Date.parse(value.selectedAt));

export const readRecommendationTrip = (): RecommendationTripState | undefined => {
  try {
    const stored = sessionStorage.getItem(TRIP_STORAGE_KEY);
    if (!stored) return undefined;
    const parsed: unknown = JSON.parse(stored);
    return isRecommendationTripState(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

export const writeRecommendationTrip = (trip: RecommendationTripState) => {
  try {
    sessionStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(trip));
  } catch {
    // Navigation still works through react-router state if session storage is unavailable.
  }
};

export const clearRecommendationTrip = () => {
  try {
    sessionStorage.removeItem(TRIP_STORAGE_KEY);
  } catch {
    // No-op.
  }
};

export const readRecommendationWorkflow = (): RecommendationWorkflowState => {
  try {
    const raw = sessionStorage.getItem(WORKFLOW_STORAGE_KEY);
    if (!raw) {
      const result = readRecommendationResult();
      return {
        phase: result.selectedKakaoPlaceId
          ? 'SELECTED'
          : result.recommendations?.length
            ? 'COMPARING'
            : 'EDITING',
        updatedAt: new Date(0).toISOString(),
      };
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isObject(parsed)) throw new Error('invalid workflow');
    const phase = parsed.phase;
    if (phase !== 'EDITING' && phase !== 'COMPARING' && phase !== 'SELECTED')
      throw new Error('invalid phase');
    return {
      phase,
      updatedAt:
        typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date(0).toISOString(),
    };
  } catch {
    return { phase: 'EDITING', updatedAt: new Date(0).toISOString() };
  }
};

export const writeRecommendationWorkflow = (phase: RecommendationWorkflowPhase) => {
  try {
    sessionStorage.setItem(
      WORKFLOW_STORAGE_KEY,
      JSON.stringify({ phase, updatedAt: new Date().toISOString() }),
    );
  } catch {
    // Workflow restoration is best-effort.
  }
};

export const clearRecommendationClientState = () => {
  try {
    sessionStorage.removeItem(RESULT_STORAGE_KEY);
    sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    sessionStorage.removeItem(TRIP_STORAGE_KEY);
    sessionStorage.removeItem(WORKFLOW_STORAGE_KEY);
    localStorage.removeItem(SELECTED_RECOMMENDATION_KEY);
    localStorage.removeItem(RECENT_DESTINATIONS_KEY);
  } catch {
    // No-op in restricted storage environments.
  }
};

export interface RecommendationDraftState {
  naturalContext: string;
  selectedLocationKey: string;
  selectedDestination: RecommendationLocationResponse | null;
  companionId: number | null;
  foodPreferences: string[];
  companionFoodPreferences?: string[];
  occasion: string;
  mobility: string;
  discoveryIntent: string;
  timeBudget: string;
  budgetPreference?: string;
  radiusMeters: number;
  nearbyFirst?: boolean;
  touchedFields?: string[];
  strictFoodPreferences?: boolean;
  strictCompanionFoodPreferences?: boolean;
  explorationRequest?: RecommendationRequest;
  contextSearchTerms?: string[];
  parsedFields?: string[];
  contextParserSource?: string;
  promptSuggestionGroupId?: string;
  promptSuggestionId?: string;
  updatedAt: string;
}

const isRecommendationDraft = (value: unknown): value is Partial<RecommendationDraftState> =>
  isObject(value) &&
  [
    'naturalContext',
    'selectedLocationKey',
    'occasion',
    'mobility',
    'discoveryIntent',
    'timeBudget',
    'budgetPreference',
    'contextParserSource',
    'promptSuggestionGroupId',
    'promptSuggestionId',
  ].every((key) => isOptionalString(value[key])) &&
  [
    'foodPreferences',
    'companionFoodPreferences',
    'touchedFields',
    'contextSearchTerms',
    'parsedFields',
  ].every((key) => isOptionalStringArray(value[key])) &&
  ['strictFoodPreferences', 'strictCompanionFoodPreferences', 'nearbyFirst'].every((key) =>
    isOptionalBoolean(value[key]),
  ) &&
  isOptionalFiniteNumber(value.radiusMeters) &&
  isOptionalNullableFiniteNumber(value.companionId) &&
  (value.selectedDestination == null || isDestination(value.selectedDestination)) &&
  (value.explorationRequest === undefined || isRecommendationRequest(value.explorationRequest));

export const readRecommendationDraft = (): Partial<RecommendationDraftState> => {
  try {
    const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!isRecommendationDraft(parsed) || typeof parsed.updatedAt !== 'string') return {};
    const savedAt = new Date(parsed.updatedAt);
    const now = new Date();
    if (!Number.isFinite(savedAt.getTime()) || savedAt.toDateString() !== now.toDateString())
      return {};
    return parsed;
  } catch {
    return {};
  }
};

export const writeRecommendationDraft = (draft: Omit<RecommendationDraftState, 'updatedAt'>) => {
  try {
    sessionStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({ ...draft, updatedAt: new Date().toISOString() }),
    );
  } catch {
    // Draft persistence is best-effort; the form remains usable without storage.
  }
};

export const clearRecommendationDraft = () => {
  try {
    sessionStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    /* no-op */
  }
};
