import ApiBuilder from '~/apis/config/builder/ApiBuilder';
import type {
  DiscoveryActionRequest,
  DiscoveryActionResponse,
  DiscoveryCreatorResponse,
  DiscoveryDetailResponse,
  DiscoveryCommentReactionResponse,
  DiscoveryFeedRequest,
  DiscoveryFeedResponse,
  DiscoveryFeedItem,
} from './discovery.types';

const DISCOVERY = '/discovery';

export const getDiscoveryFeedBuilder = (params: DiscoveryFeedRequest) =>
  ApiBuilder.create<void, DiscoveryFeedResponse>(`${DISCOVERY}/feed`)
    .setMethod('GET')
    .setParams({
      latitude: params.latitude,
      longitude: params.longitude,
      region: params.region,
      creatorId: params.creatorId,
      creatorIds: params.creatorIds?.length ? params.creatorIds.join(',') : undefined,
      type: params.type,
      cursor: params.cursor,
      size: params.size,
    });

export const getDiscoveryDetailBuilder = (
  restaurantId: number,
  latitude?: number,
  longitude?: number,
) =>
  ApiBuilder.create<void, DiscoveryDetailResponse>(`${DISCOVERY}/restaurants/${restaurantId}`)
    .setMethod('GET')
    .setParams({ latitude, longitude });

export const getDiscoveryCommentReactionBuilder = (restaurantId: number) =>
  ApiBuilder.create<void, DiscoveryCommentReactionResponse>(
    `${DISCOVERY}/restaurants/${restaurantId}/comment-reaction`,
  ).setMethod('GET');

export const recordDiscoveryActionBuilder = () =>
  ApiBuilder.create<DiscoveryActionRequest, DiscoveryActionResponse>(
    `${DISCOVERY}/actions`,
  ).setMethod('POST');

export const getDiscoveryCreatorsBuilder = () =>
  ApiBuilder.create<void, DiscoveryCreatorResponse[]>(`${DISCOVERY}/creators`).setMethod('GET');

export const getTodayCandidatesBuilder = (latitude?: number, longitude?: number) =>
  ApiBuilder.create<void, DiscoveryFeedItem[]>(`${DISCOVERY}/today-candidates`)
    .setMethod('GET')
    .setParams({ latitude, longitude });
