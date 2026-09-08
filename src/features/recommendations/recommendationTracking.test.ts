// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import type { RecommendationResponse } from '~/apis/recommendation/recommendation.types';
import {
  beginRecommendationImpression,
  completeRecommendationImpression,
  failRecommendationImpression,
  getRenderedImpressionCandidates,
  resolveRecommendationRequestId,
} from './recommendationTracking';

const candidate = (
  placeId: string,
  requestId?: string,
  candidateSnapshotId?: number,
): RecommendationResponse => ({
  kakaoPlaceId: placeId,
  placeName: placeId,
  recommendationRequestId: requestId,
  candidateSnapshotId,
});

describe('recommendation tracking helpers', () => {
  beforeEach(() => sessionStorage.clear());

  it('동일한 requestId만 안전하게 resolve하고 혼합 session은 거부한다', () => {
    expect(resolveRecommendationRequestId([candidate('1', 'session-a', 1), candidate('2')])).toBe(
      'session-a',
    );
    expect(
      resolveRecommendationRequestId([
        candidate('1', 'session-a', 1),
        candidate('2', 'session-b', 2),
      ]),
    ).toBeUndefined();
    expect(resolveRecommendationRequestId([candidate('legacy')])).toBeUndefined();
  });

  it('실제 UI 순서로 최대 3개를 만들고 tracking 불가능한 item을 제외한다', () => {
    const recommendations = [
      candidate('1', 'session-a', 11),
      candidate('2', 'session-a'),
      candidate('3', 'session-a', 33),
      candidate('4', 'session-a', 44),
    ];

    expect(getRenderedImpressionCandidates(recommendations, 'session-a')).toEqual([
      { candidateSnapshotId: 11, position: 1 },
      { candidateSnapshotId: 33, position: 3 },
    ]);
  });

  it('requestId와 candidate set이 같은 impression을 session 내에서 중복 표시하지 않는다', () => {
    const candidates = [{ candidateSnapshotId: 1, position: 1 }];

    const key = beginRecommendationImpression('failure-session', candidates);

    expect(key).toEqual(expect.any(String));
    expect(beginRecommendationImpression('failure-session', candidates)).toBeUndefined();

    failRecommendationImpression(key!);

    expect(sessionStorage.getItem('pikone:recommendation-impressions')).toBeNull();
    expect(beginRecommendationImpression('failure-session', candidates)).toBe(key);
  });

  it('successful impressions are persisted while a new session remains trackable', () => {
    const candidates = [{ candidateSnapshotId: 2, position: 1 }];
    const key = beginRecommendationImpression('success-session', candidates);

    completeRecommendationImpression(key!);

    expect(beginRecommendationImpression('success-session', candidates)).toBeUndefined();
    expect(sessionStorage.getItem('pikone:recommendation-impressions')).toContain(key);
    expect(beginRecommendationImpression('next-session', candidates)).toEqual(expect.any(String));
  });
});
