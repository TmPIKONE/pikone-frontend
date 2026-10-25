export const PURPOSE_OPTIONS = [
  '빠른 한 끼',
  '데이트',
  '친구 모임',
  '가족 식사',
  '회식',
  '술자리',
  '카페',
] as const;

// 사용자가 카테고리를 해석하지 않아도 바로 음식이 떠오르도록
// 한식/양식 같은 대분류 대신 실제로 주문하는 메뉴명을 사용한다.
export const FOOD_PREFERENCE_OPTIONS = [
  '삼겹살',
  '갈비',
  '햄버거',
  '피자',
  '치킨',
  '국밥',
  '찌개',
  '라멘',
  '칼국수',
  '파스타',
  '초밥',
  '회',
  '떡볶이',
  '마라탕',
  '돈까스',
  '카페',
  '디저트',
] as const;

export const RECOMMENDATION_PRIORITY_OPTIONS = [
  { value: 'BALANCED', label: '알아서 골라줘' },
  { value: 'NEARBY', label: '가까운 곳' },
  { value: 'FAMILIAR', label: '실패 적은 곳' },
  { value: 'DISCOVERY', label: '새로운 곳' },
] as const;

export const DISTANCE_OPTIONS = [
  { value: 700, label: '도보 10분' },
  { value: 1400, label: '도보 20분' },
  { value: 3000, label: '3km까지' },
] as const;

export type RecommendationPriority = (typeof RECOMMENDATION_PRIORITY_OPTIONS)[number]['value'];

export type RecommendationOccasion =
  'QUICK_MEAL' | 'DATE' | 'FRIEND' | 'FAMILY' | 'NORMAL' | 'SPECIAL';
export type RecommendationMobility = 'WALK' | 'PUBLIC_TRANSPORT' | 'CAR';
export type RecommendationDiscoveryIntent =
  'FAMILIAR' | 'NEW_PLACE' | 'HOT_PLACE' | 'LOCAL_GEM' | 'BALANCED';
export type RecommendationTimeBudget = 'SHORT' | 'NORMAL' | 'RELAXED';
export type RecommendationBudgetPreference = 'VALUE' | 'NORMAL' | 'SPECIAL';

export const OCCASION_OPTIONS = [
  { value: 'QUICK_MEAL', label: '빠르게 한 끼' },
  { value: 'DATE', label: '데이트' },
  { value: 'FRIEND', label: '친구와 식사' },
  { value: 'FAMILY', label: '가족 식사' },
  { value: 'NORMAL', label: '평범한 식사' },
  { value: 'SPECIAL', label: '특별한 날' },
] as const satisfies readonly { value: RecommendationOccasion; label: string }[];

// API field name is kept for compatibility, but recommendation only uses
// familiar/new/balanced. HOT_PLACE/LOCAL_GEM belong to the separate Discovery tab.
export const DISCOVERY_INTENT_OPTIONS = [
  { value: 'FAMILIAR', label: '다시 가고 싶은 곳' },
  { value: 'NEW_PLACE', label: '최근 기록에 없는 곳' },
  { value: 'BALANCED', label: '상관없음' },
] as const satisfies readonly { value: RecommendationDiscoveryIntent; label: string }[];

export const MOBILITY_OPTIONS = [
  { value: 'WALK', label: '도보' },
  { value: 'PUBLIC_TRANSPORT', label: '대중교통' },
  { value: 'CAR', label: '차량' },
] as const satisfies readonly { value: RecommendationMobility; label: string }[];

export const TIME_BUDGET_OPTIONS = [
  { value: 'SHORT', label: '시간이 빠듯해요' },
  { value: 'NORMAL', label: '보통' },
  { value: 'RELAXED', label: '여유 있어요' },
] as const satisfies readonly { value: RecommendationTimeBudget; label: string }[];

export const BUDGET_OPTIONS = [
  { value: 'VALUE', label: '가성비' },
  { value: 'NORMAL', label: '상관없음' },
  { value: 'SPECIAL', label: '특별한 날' },
] as const satisfies readonly { value: RecommendationBudgetPreference; label: string }[];

export interface RecommendationRequest {
  latitude: number;
  longitude: number;
  locationLabel?: string;
  purposes?: string[];
  naturalContext?: string;
  contextSearchTerms?: string[];
  foodPreferences?: string[];
  companionFoodPreferences?: string[];
  companionId?: number;
  strictFoodPreferences?: boolean;
  strictCompanionFoodPreferences?: boolean;
  seenPlaceIds?: string[];
  /** Server-authoritative exclusions for this recommendation exploration. */
  excludedCategoryFamilies?: string[];
  contextSources?: Record<string, 'MANUAL' | 'TEXT' | 'DEFAULT'>;
  occasion?: RecommendationOccasion;
  mobility?: RecommendationMobility;
  discoveryIntent?: RecommendationDiscoveryIntent;
  timeBudget?: RecommendationTimeBudget;
  budgetPreference?: RecommendationBudgetPreference;
  priority?: RecommendationPriority;
  radiusMeters?: number;
  excludedPlaceIds?: string[];
  /** Newest accepted recommendation response in this exploration. */
  parentRecommendationRequestId?: string;
}

export interface RecommendationMenuPreview {
  name: string;
  priceWon?: number | null;
}

export interface RecommendationResponse {
  recommendationRequestId?: string | null;
  candidateSnapshotId?: number | null;
  kakaoPlaceId: string;
  placeName: string;
  category?: string;
  categoryLabel?: string;
  address?: string;
  mapUrl?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  walkingMinutes?: number;
  recommendType?: string;
  pickLabel?: string;
  categoryFamily?: string;
  responsePosition?: number;
  policyVersion?: string;
  effectiveContext?: string[];
  rankingWeights?: Record<string, number>;
  oneLineSummary?: string;
  menuKeywords?: string[];
  reasonTags?: string[];
  contextNotes?: string[];
  recommendationReason?: string;
  imageUrl?: string;
  imageSource?: 'USER_DINING_RECORD' | 'NONE' | string;
  menuInfoSource?: 'RESTAURANT_MENU' | 'NONE' | string;
  menus?: RecommendationMenuPreview[];
}

export interface RecommendationImpressionCandidate {
  candidateSnapshotId: number;
  position: number;
}

export interface RecommendationImpressionRequest {
  candidates: RecommendationImpressionCandidate[];
}

export type RecommendationActionType =
  'PLACE_OPEN' | 'EXCLUDE' | 'MENU_EXCLUDE' | 'SELECT' | 'RERECOMMEND';

export interface RecommendationActionRequest {
  candidateSnapshotId?: number;
  actionType: RecommendationActionType;
  clientEventId: string;
}

export interface RecommendationUsageResponse {
  dailyLimit: number;
  usedCount: number;
  remainingCount: number;
  exhausted: boolean;
  resetAt: string;
}

export interface RecommendationLocationResponse {
  locationId: string;
  placeName: string;
  address?: string;
  category?: string;
  latitude: number;
  longitude: number;
}

export interface NaturalLanguageContextRequest {
  text: string;
}

export interface NaturalLanguageContextResponse {
  area?: string;
  specifiedFields?: string[];
  occasion?: RecommendationOccasion | null;
  mobility?: RecommendationMobility | null;
  discoveryIntent?: RecommendationDiscoveryIntent | null;
  timeBudget?: RecommendationTimeBudget | null;
  budgetPreference: RecommendationBudgetPreference;
  foodPreferences?: string[];
  source: 'LLM' | 'RULE_FALLBACK' | string;
  contextSearchTerms?: string[];
  contextNotes?: string[];
}

export interface PromptSuggestionRequest {
  locationLabel?: string;
  occasion?: RecommendationOccasion;
  mobility?: RecommendationMobility;
  discoveryIntent?: RecommendationDiscoveryIntent;
  timeBudget?: RecommendationTimeBudget;
  foodPreferences?: string[];
  companionId?: number;
  naturalContext?: string;
  refresh?: boolean;
}

export interface PromptSuggestionItem {
  suggestionId: string;
  text: string;
  position: number;
}

export interface PromptSuggestionResponse {
  groupId: string;
  suggestions: PromptSuggestionItem[];
  generationMethod: 'AI' | 'FALLBACK' | string;
  personalHistoryApplied: boolean;
  sharedPatternApplied: boolean;
  personalSampleCount: number;
  sharedSampleUserCount: number;
  notice?: string;
}

export interface PromptSuggestionEventRequest {
  clientEventId: string;
  eventType: 'EXPOSED' | 'SELECTED';
  groupId: string;
  suggestionId: string;
}

export interface PromptSubmissionRequest {
  clientEventId: string;
  groupId?: string;
  suggestionId?: string;
  finalText?: string;
  locationLabel?: string;
  occasion?: RecommendationOccasion;
  mobility?: RecommendationMobility;
  discoveryIntent?: RecommendationDiscoveryIntent;
  timeBudget?: RecommendationTimeBudget;
  foodPreferences?: string[];
  companionId?: number;
  contextSearchTerms?: string[];
  contextSources?: Record<string, 'MANUAL' | 'TEXT' | 'DEFAULT'>;
  contextParserSource?: string;
}

export interface RecommendationHistoryResponse {
  recommendationRequestId: string;
  locationLabel?: string;
  priority?: RecommendationPriority;
  createdAt: string;
  selectedKakaoPlaceId?: string | null;
  recommendations: RecommendationResponse[];
  request: RecommendationRequest;
}

export type RecommendationWorkspaceStatus = 'COMPARING' | 'SELECTED';
export interface RecommendationWorkspaceUpsertRequest {
  rootRequestId: string;
  request: RecommendationRequest;
  recommendations: RecommendationResponse[];
  selectedCandidateSnapshotId?: number;
  selectedKakaoPlaceId?: string;
  status: RecommendationWorkspaceStatus;
}
export interface RecommendationWorkspaceResponse extends RecommendationWorkspaceUpsertRequest {
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}
