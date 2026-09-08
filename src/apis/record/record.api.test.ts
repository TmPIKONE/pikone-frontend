import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SaveRequest } from './record.types';
import { saveRecordBuilder } from './record.api';

const mocks = vi.hoisted(() => ({ apiClient: vi.fn() }));

vi.mock('~/apis/config/apiClient', () => ({ default: mocks.apiClient }));

const baseRequest: SaveRequest = {
  kakaoPlaceId: 'place-1',
  restaurant: { kakaoPlaceId: 'place-1', placeName: '정우식당' },
  foodName: '김치찌개',
  visitDate: '2026-09-07',
};

describe('record save API contract', () => {
  beforeEach(() => {
    mocks.apiClient.mockReset();
    mocks.apiClient.mockResolvedValue({ data: { data: { recordId: 1 } } });
  });

  it('기존 저장 요청에는 attribution field를 추가하지 않는다', async () => {
    await saveRecordBuilder().execute(baseRequest);

    expect(mocks.apiClient).toHaveBeenCalledWith({
      method: 'POST',
      url: '/records',
      data: baseRequest,
    });
    expect(mocks.apiClient.mock.calls[0]?.[0].data).not.toHaveProperty(
      'sourceRecommendationCandidateId',
    );
  });

  it('선택된 추천 candidate attribution을 선택적으로 직렬화한다', async () => {
    const attributedRequest = { ...baseRequest, sourceRecommendationCandidateId: 301 };

    await saveRecordBuilder().execute(attributedRequest);

    expect(mocks.apiClient.mock.calls[0]?.[0].data).toEqual(attributedRequest);
  });
});
