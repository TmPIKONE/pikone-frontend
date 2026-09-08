import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RecommendationRequest } from './recommendation.types';
import {
  getRecommendationsBuilder,
  recordRecommendationActionBuilder,
  recordRecommendationImpressionsBuilder,
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
