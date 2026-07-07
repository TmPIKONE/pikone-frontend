export type CompanionType = 'ALONE' | 'LOVER' | 'FRIEND' | 'FAMILY' | 'CUSTOM';

export interface CompanionResponse {
  companionId: number;
  displayName: string;
  linkedUserNickname: string;
  companionType: CompanionType;
  isAppUser: boolean;
}

export interface SendRequestDto {
  targetCode: string;
}

export interface SendRequestResponse {
  requestId: number;
}

export interface PendingRequestResponse {
  requestId: number;
  fromUserNickname: string;
  fromUserImageUrl: string;
}

export interface RespondRequestDto {
  requestId: number;
  accept: boolean;
}

export interface RespondRequestResponse {
  requestId: number;
  accepted: boolean;
}

export interface CreateLocalCompanionDto {
  displayName: string;
  companionType: CompanionType;
}

export interface CreateLocalCompanionResponse {
  companionId: number;
}

export interface UpdateDisplayNameDto {
  displayName: string;
}

export interface MyCodeResponse {
  myCode: string;
}

export interface FriendRecordResponse {
  recordId: number;
  imageUrl: string;
  foodName: string;
  restaurantName: string;
  restaurantAddress?: string;
  latitude?: number;
  longitude?: number;
  visitDate: string;
}
