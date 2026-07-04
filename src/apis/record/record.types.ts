export type LocationType = 'RESTAURANT' | 'HOME' | 'OFFICE' | 'DELIVERY' | 'UNKNOWN';

export interface CalendarResponse {
  recordId: number;
  visitDate: string;
  thumbnailUrl: string;
  companionName: string;
  isPublic: boolean;
}

export interface RecordDetailResponse {
  recordId: number;
  imageUrl: string;
  restaurantName: string;
  foodName: string;
  willRevisit: boolean;
  companionName: string;
  isPublic: boolean;
}

export interface RestaurantCandidate {
  kakaoPlaceId: string;
  placeName: string;
  category?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  similarityScore?: number;
}

export interface AiFoodResponse {
  foodName: string;
  foodTags: string[];
  sceneTags: string[];
  confidence: number;
  restaurants: RestaurantCandidate[];
  recommendedRestaurant?: RestaurantCandidate;
}

export interface RestaurantInfo {
  kakaoPlaceId: string;
  placeName: string;
  category?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface SaveRequest {
  kakaoPlaceId: string;
  restaurant: RestaurantInfo;
  foodName: string;
  imageUrl?: string;
  visitDate: string;
  willRevisit?: boolean;
  isPublic?: boolean;
  companionId?: number;
  locationType?: LocationType;
  placeName?: string;
  category?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface SaveResponse {
  recordId: number;
}

export interface VisibilityRequest {
  isPublic: boolean;
}

export interface VisibilityResponse {
  recordId: number;
  isPublic: boolean;
}

export interface UpdateRecordRequest {
  foodName?: string;
  willRevisit?: boolean;
  isPublic?: boolean;
  companionId?: number;
  locationType?: LocationType;
}
