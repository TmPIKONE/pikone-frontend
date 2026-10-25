import type {
  RecommendationLocationResponse,
  RecommendationOccasion,
} from '~/apis/recommendation/recommendation.types';

export type DecisionRoomStatus = 'OPEN' | 'CANDIDATES_READY' | 'FINALIZED';
export type DecisionRoomVoteValue = 'LIKE' | 'OKAY' | 'HARD';
export type DecisionRoomConsensusState =
  'CONSTRAINT_CONFLICT' | 'HARD_NO' | 'WAITING' | 'CONSENSUS';

export interface DecisionRoomCreateRequest {
  title: string;
  mealAt?: string;
  occasion?: RecommendationOccasion;
  foodPreferences?: string[];
  meetingLatitude: number;
  meetingLongitude: number;
  meetingLocationLabel: string;
  meetingRadiusMeters?: number;
}

export interface DecisionRoomJoinRequest {
  displayName: string;
  avoidKeywords?: string[];
  preferredFoods?: string[];
}

export type DecisionRoomUpdateParticipantRequest = DecisionRoomJoinRequest;

export interface DecisionRoomVoteRequest {
  candidateId: number;
  value: DecisionRoomVoteValue;
}

export interface DecisionRoomFinalizeRequest {
  candidateId: number;
}

export interface DecisionRoomParticipant {
  participantId: number;
  displayName: string;
  host: boolean;
  avoidKeywords: string[];
  preferredFoods?: string[];
  constraintsSubmitted: boolean;
}

export interface DecisionRoomCandidate {
  candidateId: number;
  kakaoPlaceId: string;
  placeName: string;
  category?: string;
  address?: string;
  mapUrl?: string;
  latitude?: number;
  longitude?: number;
  recommendationReason?: string;
  displayOrder: number;
  distanceFromMeetingMeters?: number;
  allConstraintsSatisfied: boolean;
  blockedParticipantNames: string[];
  likeCount: number;
  okayCount: number;
  hardCount: number;
  pendingVoteCount: number;
  myVote?: DecisionRoomVoteValue | null;
  consensusState: DecisionRoomConsensusState;
  recommendedForConsensus: boolean;
}

export interface DecisionRoomSummary {
  roomId: number;
  inviteCode: string;
  title: string;
  mealAt?: string;
  status: DecisionRoomStatus;
  hostDisplayName: string;
  participantCount: number;
  viewerHost: boolean;
  meetingLocationLabel?: string;
}

export interface DecisionRoomResponse {
  roomId: number;
  inviteCode: string;
  title: string;
  mealAt?: string;
  occasion: RecommendationOccasion;
  foodPreferences: string[];
  status: DecisionRoomStatus;
  hostDisplayName: string;
  meetingLatitude: number;
  meetingLongitude: number;
  meetingLocationLabel: string;
  meetingRadiusMeters: number;
  participants: DecisionRoomParticipant[];
  candidates: DecisionRoomCandidate[];
  finalizedCandidateId?: number | null;
  viewerParticipantId?: number | null;
  viewerHost: boolean;
  allParticipantsReady: boolean;
  canGenerateCandidates: boolean;
  unresolvedMessage?: string;
}

export interface DecisionRoomCreateResponse {
  roomId: number;
  inviteCode: string;
  hostParticipantToken: string;
  room: DecisionRoomResponse;
}

export interface DecisionRoomJoinResponse {
  participantId: number;
  participantToken: string;
  room: DecisionRoomResponse;
}

export type DecisionRoomLocationResponse = RecommendationLocationResponse;
