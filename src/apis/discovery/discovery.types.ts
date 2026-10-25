export type DiscoveryFeedType = 'YOUTUBE' | 'SAVED';
export type DiscoveryActionType =
  | 'SAVE'
  | 'UNSAVE'
  | 'SKIP'
  | 'DETAIL_VIEW'
  | 'VIDEO_VIEW'
  | 'ADD_TODAY_CANDIDATE'
  | 'REMOVE_TODAY_CANDIDATE';

export interface DiscoveryCreatorSummary {
  id: number;
  name: string;
}

export interface DiscoveryContentSummary {
  id: number;
  youtubeVideoId: string;
  thumbnailUrl?: string;
  title?: string;
}

export interface DiscoveryFeedItem {
  restaurantId: number;
  placeId?: string;
  name: string;
  category?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  distanceMeters?: number;
  creator?: DiscoveryCreatorSummary;
  content?: DiscoveryContentSummary;
  heroImageUrl?: string;
  story: string;
  tags: string[];
  saved: boolean;
  todayCandidate: boolean;
}

export interface DiscoveryFeedResponse {
  items: DiscoveryFeedItem[];
  nextCursor?: number;
  hasNext: boolean;
}

export interface DiscoveryFeedRequest {
  latitude?: number;
  longitude?: number;
  region?: string;
  creatorId?: number;
  creatorIds?: number[];
  type?: DiscoveryFeedType;
  cursor?: number;
  size?: number;
}

export interface DiscoveryActionRequest {
  restaurantId: number;
  creatorContentId?: number;
  actionType: DiscoveryActionType;
}

export interface DiscoveryActionResponse {
  restaurantId: number;
  saved: boolean;
  todayCandidate: boolean;
}

export interface DiscoveryCreatorResponse {
  id: number;
  name: string;
  creatorType: string;
  youtubeConfigured: boolean;
  syncedVideoCount: number;
  verifiedRestaurantCount: number;
}

export interface DiscoveryMenuItem {
  id: number;
  name: string;
  priceWon?: number;
}

export type DiscoveryCommentReactionStatus =
  | 'READY'
  | 'GENERATING'
  | 'NO_COMMENTS'
  | 'COMMENTS_DISABLED'
  | 'INSUFFICIENT'
  | 'FAILED'
  | 'NO_SOURCE_VIDEO';

export interface DiscoveryCommentReactionResponse {
  status: DiscoveryCommentReactionStatus | string;
  summary?: string;
  relatedCommentCount: number;
  sampledCommentCount: number;
  sampleIsPartial: boolean;
  creatorContentId?: number;
  youtubeVideoId?: string;
  sourceVideoTitle?: string;
  generatedAt?: string;
  notice?: string;
}

export interface DiscoveryDetailResponse {
  restaurant: DiscoveryFeedItem;
  mapUrl?: string;
  youtubeEmbedUrl?: string;
  menus: DiscoveryMenuItem[];
}
