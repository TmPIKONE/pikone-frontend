// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearSelectedRecommendation,
  readSelectedRecommendation,
  readRecentRecommendationDestinations,
  readRecommendationResult,
  writeRecentRecommendationDestinations,
  writeRecommendationResult,
  writeSelectedRecommendation,
} from './recommendationStorage';

const request = { latitude: 37.5, longitude: 127, priority: 'BALANCED' as const };
const recommendation = { kakaoPlaceId: '123', placeName: '정우 식당' };
const trackedRecommendation = {
  ...recommendation,
  recommendationRequestId: 'request-1',
  candidateSnapshotId: 101,
};
const destination = {
  locationId: 'place-1',
  placeName: '서울역',
  latitude: 37.55,
  longitude: 126.97,
};

describe('recommendation browser storage contract', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('기존 storage key와 payload를 유지한다', () => {
    writeRecommendationResult({ recommendations: [recommendation], request });
    writeRecentRecommendationDestinations([destination]);

    expect(JSON.parse(sessionStorage.getItem('pikone:recommendation-result') ?? '')).toEqual({
      recommendations: [recommendation],
      request,
    });
    expect(
      JSON.parse(localStorage.getItem('pikone:recent-recommendation-destinations') ?? ''),
    ).toEqual([destination]);
    expect(readRecommendationResult()).toEqual({ recommendations: [recommendation], request });
    expect(readRecentRecommendationDestinations()).toEqual([destination]);
  });

  it('tracking field와 parent request를 sessionStorage에서 그대로 복원한다', () => {
    const rerecommendRequest = { ...request, parentRecommendationRequestId: 'parent-request' };

    writeRecommendationResult({
      recommendations: [trackedRecommendation],
      request: rerecommendRequest,
    });

    expect(readRecommendationResult()).toEqual({
      recommendations: [trackedRecommendation],
      request: rerecommendRequest,
    });
  });

  it('best-effort tracking field의 null contract도 추천 결과로 보존한다', () => {
    const legacyRecommendation = {
      ...recommendation,
      recommendationRequestId: null,
      candidateSnapshotId: null,
    };

    writeRecommendationResult({ recommendations: [legacyRecommendation], request });

    expect(readRecommendationResult()).toEqual({
      recommendations: [legacyRecommendation],
      request,
    });
  });

  it('손상된 저장 값은 화면 데이터로 사용하지 않는다', () => {
    sessionStorage.setItem('pikone:recommendation-result', '{broken');
    localStorage.setItem(
      'pikone:recent-recommendation-destinations',
      JSON.stringify([{ locationId: 1 }]),
    );

    expect(readRecommendationResult()).toEqual({});
    expect(readRecentRecommendationDestinations()).toEqual([]);
  });

  it('저장소가 차단되어도 추천 흐름을 중단하지 않는다', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked');
    });

    expect(() =>
      writeRecommendationResult({ recommendations: [recommendation], request }),
    ).not.toThrow();
    expect(() => writeRecentRecommendationDestinations([destination])).not.toThrow();
  });

  it('최근 명시적 선택의 최소 attribution context를 저장하고 읽는다', () => {
    const context = {
      recommendationRequestId: 'request-1',
      candidateSnapshotId: 101,
      kakaoPlaceId: 'place-1',
      selectedAt: new Date('2026-09-07T00:00:00.000Z').toISOString(),
    };

    writeSelectedRecommendation(context);

    expect(readSelectedRecommendation(new Date('2026-09-07T23:59:59.000Z').getTime())).toEqual(
      context,
    );
  });

  it('24시간을 지난 context와 손상된 context를 사용하지 않고 제거한다', () => {
    writeSelectedRecommendation({
      recommendationRequestId: 'request-1',
      candidateSnapshotId: 101,
      kakaoPlaceId: 'place-1',
      selectedAt: new Date('2026-09-05T00:00:00.000Z').toISOString(),
    });

    expect(
      readSelectedRecommendation(new Date('2026-09-07T00:00:01.000Z').getTime()),
    ).toBeUndefined();
    expect(localStorage.getItem('pikone:selected-recommendation')).toBeNull();

    localStorage.setItem('pikone:selected-recommendation', '{broken');
    expect(readSelectedRecommendation()).toBeUndefined();
    expect(localStorage.getItem('pikone:selected-recommendation')).toBeNull();
  });

  it('명시적으로 attribution context만 정리한다', () => {
    localStorage.setItem('unrelated', 'keep');
    writeSelectedRecommendation({
      recommendationRequestId: 'request-1',
      candidateSnapshotId: 101,
      kakaoPlaceId: 'place-1',
      selectedAt: new Date().toISOString(),
    });

    clearSelectedRecommendation();

    expect(localStorage.getItem('pikone:selected-recommendation')).toBeNull();
    expect(localStorage.getItem('unrelated')).toBe('keep');
  });
});
