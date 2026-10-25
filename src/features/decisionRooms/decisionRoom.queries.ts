import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDecisionRoom,
  deleteDecisionRoom,
  finalizeDecisionRoom,
  generateDecisionRoomCandidates,
  getMyDecisionRooms,
  getPublicDecisionRoom,
  joinDecisionRoom,
  searchDecisionRoomLocations,
  updateDecisionRoomParticipant,
  voteDecisionRoomCandidate,
} from '~/apis/decisionRoom/decisionRoom.api';
import type {
  DecisionRoomCreateRequest,
  DecisionRoomJoinRequest,
  DecisionRoomResponse,
  DecisionRoomUpdateParticipantRequest,
  DecisionRoomVoteRequest,
} from '~/apis/decisionRoom/decisionRoom.types';
import { queryKeys } from '~/apis/queryKeys';

export const useMyDecisionRooms = () =>
  useQuery({
    queryKey: queryKeys.decisionRooms.mine,
    queryFn: getMyDecisionRooms,
    staleTime: 15 * 1000,
    refetchOnMount: 'always',
    retry: 1,
  });

export const useDecisionRoom = (inviteCode: string, participantToken?: string | null) =>
  useQuery({
    queryKey: queryKeys.decisionRooms.detail(inviteCode, Boolean(participantToken)),
    queryFn: () => getPublicDecisionRoom(inviteCode, participantToken),
    enabled: Boolean(inviteCode),
    refetchInterval: 3000,
    staleTime: 1000,
    retry: 1,
  });

export const useCreateDecisionRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: DecisionRoomCreateRequest) => createDecisionRoom(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.decisionRooms.mine }),
  });
};

export const useDeleteDecisionRoom = (inviteCode: string, roomId: number | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      if (!roomId) throw new Error('약속 ID가 없습니다.');
      return deleteDecisionRoom(roomId);
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.decisionRooms.detail(inviteCode, true) });
      queryClient.removeQueries({ queryKey: queryKeys.decisionRooms.detail(inviteCode, false) });
      queryClient.invalidateQueries({ queryKey: queryKeys.decisionRooms.mine });
    },
  });
};

export const useJoinDecisionRoom = (inviteCode: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: DecisionRoomJoinRequest) => joinDecisionRoom(inviteCode, request),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKeys.decisionRooms.detail(inviteCode, true), response.room);
      queryClient.invalidateQueries({ queryKey: queryKeys.decisionRooms.mine });
    },
  });
};

export const useUpdateDecisionRoomParticipant = (
  inviteCode: string,
  participantToken: string | null,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: DecisionRoomUpdateParticipantRequest) =>
      updateDecisionRoomParticipant(inviteCode, participantToken, request),
    onSuccess: (room: DecisionRoomResponse) => {
      queryClient.setQueryData(
        queryKeys.decisionRooms.detail(inviteCode, Boolean(participantToken)),
        room,
      );
    },
  });
};

export const useGenerateDecisionRoomCandidates = (
  inviteCode: string,
  roomId: number | undefined,
  participantToken?: string | null,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      if (!roomId) throw new Error('약속 ID가 없습니다.');
      return generateDecisionRoomCandidates(roomId, participantToken);
    },
    onSuccess: (room) => {
      queryClient.setQueryData(
        queryKeys.decisionRooms.detail(inviteCode, Boolean(participantToken)),
        room,
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.decisionRooms.mine });
    },
  });
};

export const useVoteDecisionRoomCandidate = (
  inviteCode: string,
  participantToken: string | null,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: DecisionRoomVoteRequest) =>
      voteDecisionRoomCandidate(inviteCode, participantToken, request),
    onSuccess: (room) => {
      queryClient.setQueryData(
        queryKeys.decisionRooms.detail(inviteCode, Boolean(participantToken)),
        room,
      );
    },
  });
};

export const useFinalizeDecisionRoom = (
  inviteCode: string,
  roomId: number | undefined,
  participantToken?: string | null,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (candidateId: number) => {
      if (!roomId) throw new Error('약속 ID가 없습니다.');
      return finalizeDecisionRoom(roomId, participantToken, { candidateId });
    },
    onSuccess: (room) => {
      queryClient.setQueryData(
        queryKeys.decisionRooms.detail(inviteCode, Boolean(participantToken)),
        room,
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.decisionRooms.mine });
    },
  });
};

export const useDecisionRoomLocationSearch = (
  inviteCode: string,
  query: string,
  latitude?: number,
  longitude?: number,
  enabled = true,
) =>
  useQuery({
    queryKey: queryKeys.decisionRooms.locations(inviteCode, query, latitude, longitude),
    queryFn: () => searchDecisionRoomLocations(inviteCode, query, latitude, longitude),
    enabled: enabled && Boolean(inviteCode) && query.trim().length >= 2,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
