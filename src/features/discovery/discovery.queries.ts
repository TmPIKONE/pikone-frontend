import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getDiscoveryCreatorsBuilder,
  getDiscoveryDetailBuilder,
  getDiscoveryCommentReactionBuilder,
  getDiscoveryFeedBuilder,
  getTodayCandidatesBuilder,
  recordDiscoveryActionBuilder,
} from '~/apis/discovery/discovery.api';
import type {
  DiscoveryActionRequest,
  DiscoveryActionResponse,
  DiscoveryFeedRequest,
} from '~/apis/discovery/discovery.types';
import { queryKeys } from '~/apis/queryKeys';

export const useDiscoveryFeed = (params: Omit<DiscoveryFeedRequest, 'cursor'>) =>
  useInfiniteQuery({
    queryKey: queryKeys.discovery.feed(params),
    initialPageParam: undefined as number | undefined,
    queryFn: ({ pageParam }) => getDiscoveryFeedBuilder({ ...params, cursor: pageParam }).execute(),
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    staleTime: 30_000,
  });

export const useDiscoveryCreators = () =>
  useQuery({
    queryKey: queryKeys.discovery.creators,
    queryFn: () => getDiscoveryCreatorsBuilder().execute(),
    staleTime: 10 * 60_000,
  });

export const useDiscoveryDetail = (
  restaurantId: number | undefined,
  latitude?: number,
  longitude?: number,
) =>
  useQuery({
    queryKey: queryKeys.discovery.detail(restaurantId ?? 0, latitude, longitude),
    queryFn: () => getDiscoveryDetailBuilder(restaurantId!, latitude, longitude).execute(),
    enabled: restaurantId != null && Number.isFinite(restaurantId),
  });

export const useDiscoveryCommentReaction = (restaurantId: number | undefined) =>
  useQuery({
    queryKey: queryKeys.discovery.commentReaction(restaurantId ?? 0),
    queryFn: () => getDiscoveryCommentReactionBuilder(restaurantId!).execute(),
    enabled: restaurantId != null && Number.isFinite(restaurantId),
    staleTime: 5 * 60_000,
    retry: 1,
    refetchInterval: (query) => (query.state.data?.status === 'GENERATING' ? 2500 : false),
  });

export const useTodayCandidates = (latitude?: number, longitude?: number) =>
  useQuery({
    queryKey: queryKeys.discovery.todayCandidates,
    queryFn: () => getTodayCandidatesBuilder(latitude, longitude).execute(),
  });

export const useDiscoveryAction = () => {
  const queryClient = useQueryClient();
  return useMutation<DiscoveryActionResponse, unknown, DiscoveryActionRequest>({
    mutationFn: (body) => recordDiscoveryActionBuilder().execute(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.discovery.all });
    },
  });
};
