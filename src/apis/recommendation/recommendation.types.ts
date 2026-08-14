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

export interface RecommendationRequest {
  latitude: number;
  longitude: number;
  locationLabel?: string;
  purposes?: string[];
  foodPreferences?: string[];
  companionId?: number;
  priority?: RecommendationPriority;
  radiusMeters?: number;
  excludedPlaceIds?: string[];
}

export interface RecommendationResponse {
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
  oneLineSummary?: string;
  menuKeywords?: string[];
  reasonTags?: string[];
  recommendationReason?: string;
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
