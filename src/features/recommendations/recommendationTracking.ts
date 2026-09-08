import type {
  RecommendationImpressionCandidate,
  RecommendationResponse,
} from '~/apis/recommendation/recommendation.types';

const IMPRESSION_DEDUPE_STORAGE_KEY = 'pikone:recommendation-impressions';
const MAX_IMPRESSION_DEDUPE_KEYS = 50;
const inFlightImpressions = new Set<string>();
const successfulImpressions = new Set<string>();

const isPositiveInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value > 0;

export const resolveRecommendationRequestId = (recommendations: RecommendationResponse[]) => {
  const requestIds = new Set(
    recommendations
      .map((recommendation) => recommendation.recommendationRequestId?.trim())
      .filter((requestId): requestId is string => Boolean(requestId)),
  );

  return requestIds.size === 1 ? requestIds.values().next().value : undefined;
};

export const getTrackableCandidateId = (
  recommendation: RecommendationResponse,
  requestId: string | undefined,
) => {
  if (
    !requestId ||
    recommendation.recommendationRequestId?.trim() !== requestId ||
    !isPositiveInteger(recommendation.candidateSnapshotId)
  ) {
    return undefined;
  }

  return recommendation.candidateSnapshotId;
};

export const getRenderedImpressionCandidates = (
  recommendations: RecommendationResponse[],
  requestId: string | undefined,
): RecommendationImpressionCandidate[] =>
  recommendations
    .slice(0, 3)
    .map((recommendation, index) => ({
      candidateSnapshotId: getTrackableCandidateId(recommendation, requestId),
      position: index + 1,
    }))
    .filter(
      (candidate): candidate is RecommendationImpressionCandidate =>
        candidate.candidateSnapshotId !== undefined,
    );

export const createClientEventId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random()
    .toString(36)
    .slice(2)}`;
};

const readStoredImpressionKeys = () => {
  try {
    const stored = sessionStorage.getItem(IMPRESSION_DEDUPE_STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((key) => typeof key === 'string') : [];
  } catch {
    return [];
  }
};

const createImpressionKey = (requestId: string, candidates: RecommendationImpressionCandidate[]) =>
  `${requestId}:${candidates
    .map(({ candidateSnapshotId, position }) => `${candidateSnapshotId}@${position}`)
    .join(',')}`;

export const beginRecommendationImpression = (
  requestId: string,
  candidates: RecommendationImpressionCandidate[],
) => {
  const key = createImpressionKey(requestId, candidates);
  if (successfulImpressions.has(key) || inFlightImpressions.has(key)) return undefined;

  const storedKeys = readStoredImpressionKeys();
  if (storedKeys.includes(key)) {
    successfulImpressions.add(key);
    return undefined;
  }

  inFlightImpressions.add(key);
  return key;
};

export const completeRecommendationImpression = (key: string) => {
  inFlightImpressions.delete(key);
  successfulImpressions.add(key);

  const storedKeys = readStoredImpressionKeys();
  if (storedKeys.includes(key)) return;

  try {
    sessionStorage.setItem(
      IMPRESSION_DEDUPE_STORAGE_KEY,
      JSON.stringify([...storedKeys, key].slice(-MAX_IMPRESSION_DEDUPE_KEYS)),
    );
  } catch {
    // In-memory success dedupe still protects the current page when storage is unavailable.
  }
};

export const failRecommendationImpression = (key: string) => {
  inFlightImpressions.delete(key);
};
