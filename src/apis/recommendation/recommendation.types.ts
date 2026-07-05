// 스웨거 스펙에 enum이 없어서(순수 string[]) 아래 목록 임시값으로 채움.
export const PURPOSE_OPTIONS = ['혼밥', '데이트', '회식', '스터디', '나들이'] as const;
export const FOOD_PREFERENCE_OPTIONS = [
  '한식',
  '중식',
  '일식',
  '양식',
  '분식',
  '카페/디저트',
] as const;

export interface RecommendationRequest {
  latitude?: number;
  longitude?: number;
  purposes?: string[];
  foodPreferences?: string[];
  companionId?: number;
}

export interface RecommendationResponse {
  kakaoPlaceId: string;
  placeName: string;
  category?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  recommendType?: string;
  recommendationReason?: string;
}
