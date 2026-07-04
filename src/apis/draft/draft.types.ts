import type { LocationType, RestaurantCandidate } from '~/apis/record/record.types';

export interface PendingCountResponse {
  pendingCount: number;
}

export interface DraftResponse {
  draftId: number;
  imageUrl: string;
  foodName: string;
  foodTags: string[];
  sceneTags: string[];
  locationType: LocationType;
  placeName?: string;
  category?: string;
  address?: string;
  restaurantCandidates: RestaurantCandidate[];
  capturedAt: string;
  hasExifGps: boolean;
}

export interface ApproveRequest {
  kakaoPlaceId?: string;
  placeName?: string;
  category?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  foodName?: string;
  willRevisit?: boolean;
  isPublic?: boolean;
  companionId?: number;
  locationType?: LocationType;
}

export interface UpdateLocationTypeRequest {
  locationType: LocationType;
}
