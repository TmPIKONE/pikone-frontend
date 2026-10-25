import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RecommendationRequest } from './recommendation.types';
import {
  getRecommendationsBuilder,
  recordRecommendationActionBuilder,
  recordRecommendationImpressionsBuilder,
  recordPromptSubmissionBuilder,
} from './recommendation.api';

const mocks = vi.hoisted(() => ({ apiClient: vi.fn() }));

vi.mock('~/apis/config/apiClient', () => ({ default: mocks.apiClient }));

describe('recommendation API contract', () => {
  beforeEach(() => {
    mocks.apiClient.mockReset();
    mocks.apiClient.mockResolvedValue({ data: { data: undefined } });
  });

  it('requestId를 path-safe하게 encoding해 impression POST를 전송한다', async () => {
    const body = { candidates: [{ candidateSnapshotId: 101, position: 1 }] };

    await recordRecommendationImpressionsBuilder('request/a b').execute(body);

    expect(mocks.apiClient).toHaveBeenCalledWith({
      method: 'POST',
      url: '/recommendations/request%2Fa%20b/impressions',
      data: body,
    });
  });

  it('action payload와 clientEventId를 그대로 POST한다', async () => {
    const body = {
      candidateSnapshotId: 202,
      actionType: 'PLACE_OPEN' as const,
      clientEventId: 'event-123',
    };

    await recordRecommendationActionBuilder('request/a b').execute(body);

    expect(mocks.apiClient).toHaveBeenCalledWith({
      method: 'POST',
      url: '/recommendations/request%2Fa%20b/actions',
      data: body,
    });
  });

  it('prompt submission은 추천 requestId를 path-safe하게 연결한다', async () => {
    const body = {
      clientEventId: 'prompt-submit:request/a b',
      finalText: '친구와 조용하게 먹을 곳을 추천해 줘.',
    };

    await recordPromptSubmissionBuilder('request/a b').execute(body);

    expect(mocks.apiClient).toHaveBeenCalledWith({
      method: 'POST',
      url: '/recommendations/request%2Fa%20b/prompt-submission',
      data: body,
    });
  });

  it('parentRecommendationRequestId는 재추천에만 선택적으로 직렬화된다', async () => {
    const baseRequest: RecommendationRequest = { latitude: 37.5, longitude: 127 };
    const rerecommendRequest = {
      ...baseRequest,
      parentRecommendationRequestId: 'parent-request',
    };

    await getRecommendationsBuilder().execute(baseRequest);
    await getRecommendationsBuilder().execute(rerecommendRequest);

    expect(mocks.apiClient.mock.calls[0]?.[0].data).toEqual(baseRequest);
    expect(mocks.apiClient.mock.calls[0]?.[0].data).not.toHaveProperty(
      'parentRecommendationRequestId',
    );
    expect(mocks.apiClient.mock.calls[1]?.[0].data).toEqual(rerecommendRequest);
  });
});

it('posts authoritative family exclusions and explicit strict flags without transforming them', async () => {
  const body: RecommendationRequest = {
    latitude: 37.5,
    longitude: 127,
    excludedCategoryFamilies: ['MEAT', 'SUSHI_RAW'],
    foodPreferences: ['파스타'],
    strictFoodPreferences: false,
    companionId: 7,
    companionFoodPreferences: ['치킨'],
    strictCompanionFoodPreferences: true,
    parentRecommendationRequestId: 'latest',
  };
  await getRecommendationsBuilder().execute(body);
  expect(mocks.apiClient).toHaveBeenLastCalledWith({
    method: 'POST',
    url: '/recommendations',
    data: body,
  });
});
