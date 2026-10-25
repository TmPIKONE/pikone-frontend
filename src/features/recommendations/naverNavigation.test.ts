import { describe, expect, it } from 'vitest';
import type { RecommendationResponse } from '~/apis/recommendation/recommendation.types';
import { buildNaverPlaceScheme, buildNaverPlaceSearchUrl } from './naverNavigation';

describe('naverNavigation', () => {
  it('웹 검색 fallback은 전체 주소로 검색어를 과도하게 제한하지 않는다', () => {
    const restaurant = {
      kakaoPlaceId: 'test-place',
      placeName: '수피자 안서점',
      address: '충남 천안시 동남구 각원사길 123',
    } as RecommendationResponse;

    const decoded = decodeURIComponent(buildNaverPlaceSearchUrl(restaurant));

    expect(decoded).toContain('수피자 안서점');
    expect(decoded).not.toContain('각원사길');
  });

  it('좌표가 있으면 NAVER Maps place scheme으로 정확한 위치를 연다', () => {
    const scheme = buildNaverPlaceScheme({
      placeName: '수피자 안서점',
      latitude: 36.8301,
      longitude: 127.1802,
    });

    expect(scheme).toContain('nmap://place?');
    expect(scheme).toContain('lat=36.8301');
    expect(scheme).toContain('lng=127.1802');
    expect(scheme).toContain('name=%EC%88%98%ED%94%BC%EC%9E%90+%EC%95%88%EC%84%9C%EC%A0%90');
  });
});
