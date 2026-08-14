// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  readRecentRecommendationDestinations,
  readRecommendationResult,
  writeRecentRecommendationDestinations,
  writeRecommendationResult,
} from './recommendationStorage';

const request = { latitude: 37.5, longitude: 127, priority: 'BALANCED' as const };
const recommendation = { kakaoPlaceId: '123', placeName: '정우 식당' };
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
});
