import axios from 'axios';
import apiClient from '~/apis/config/apiClient';
import { API_BASE_URL } from '~/apis/config/apiConfig';
import type { ApiEnvelope } from '~/apis/config/api.types';
import type {
  DecisionRoomCreateRequest,
  DecisionRoomCreateResponse,
  DecisionRoomFinalizeRequest,
  DecisionRoomJoinRequest,
  DecisionRoomJoinResponse,
  DecisionRoomLocationResponse,
  DecisionRoomResponse,
  DecisionRoomSummary,
  DecisionRoomUpdateParticipantRequest,
  DecisionRoomVoteRequest,
} from './decisionRoom.types';

const ROOT = '/decision-rooms';
const PARTICIPANT_TOKEN_HEADER = 'X-Decision-Participant-Token';

const publicClient = axios.create({
  baseURL: API_BASE_URL,
});

const participantHeaders = (participantToken?: string | null) =>
  participantToken ? { [PARTICIPANT_TOKEN_HEADER]: participantToken } : undefined;

export const createDecisionRoom = async (request: DecisionRoomCreateRequest) => {
  const { data } = await apiClient.post<ApiEnvelope<DecisionRoomCreateResponse>>(ROOT, request);
  return data.data;
};

export const getMyDecisionRooms = async () => {
  const { data } = await apiClient.get<ApiEnvelope<DecisionRoomSummary[]>>(`${ROOT}/mine`);
  return data.data;
};

export const deleteDecisionRoom = async (roomId: number) => {
  await apiClient.delete(`${ROOT}/${roomId}`);
};

export const getPublicDecisionRoom = async (
  inviteCode: string,
  participantToken?: string | null,
) => {
  const { data } = await apiClient.get<ApiEnvelope<DecisionRoomResponse>>(
    `${ROOT}/public/${encodeURIComponent(inviteCode)}`,
    { headers: participantHeaders(participantToken) },
  );
  return data.data;
};

export const joinDecisionRoom = async (inviteCode: string, request: DecisionRoomJoinRequest) => {
  const { data } = await apiClient.post<ApiEnvelope<DecisionRoomJoinResponse>>(
    `${ROOT}/public/${encodeURIComponent(inviteCode)}/join`,
    request,
  );
  return data.data;
};

export const updateDecisionRoomParticipant = async (
  inviteCode: string,
  participantToken: string | null | undefined,
  request: DecisionRoomUpdateParticipantRequest,
) => {
  const { data } = await apiClient.put<ApiEnvelope<DecisionRoomResponse>>(
    `${ROOT}/public/${encodeURIComponent(inviteCode)}/participants/me`,
    request,
    { headers: participantHeaders(participantToken) },
  );
  return data.data;
};

export const generateDecisionRoomCandidates = async (
  roomId: number,
  participantToken?: string | null,
) => {
  const { data } = await apiClient.post<ApiEnvelope<DecisionRoomResponse>>(
    `${ROOT}/${roomId}/candidates/generate`,
    undefined,
    { headers: participantHeaders(participantToken) },
  );
  return data.data;
};

export const voteDecisionRoomCandidate = async (
  inviteCode: string,
  participantToken: string | null | undefined,
  request: DecisionRoomVoteRequest,
) => {
  const { data } = await apiClient.post<ApiEnvelope<DecisionRoomResponse>>(
    `${ROOT}/public/${encodeURIComponent(inviteCode)}/votes`,
    request,
    { headers: participantHeaders(participantToken) },
  );
  return data.data;
};

export const finalizeDecisionRoom = async (
  roomId: number,
  participantToken: string | null | undefined,
  request: DecisionRoomFinalizeRequest,
) => {
  const { data } = await apiClient.post<ApiEnvelope<DecisionRoomResponse>>(
    `${ROOT}/${roomId}/finalize`,
    request,
    { headers: participantHeaders(participantToken) },
  );
  return data.data;
};

export const searchDecisionRoomLocations = async (
  inviteCode: string,
  query: string,
  latitude?: number,
  longitude?: number,
) => {
  const { data } = await publicClient.get<ApiEnvelope<DecisionRoomLocationResponse[]>>(
    `${ROOT}/public/${encodeURIComponent(inviteCode)}/locations`,
    { params: { query, latitude, longitude } },
  );
  return data.data;
};
