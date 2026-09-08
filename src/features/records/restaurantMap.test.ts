import { describe, expect, it } from 'vitest';
import { buildNaverMapUrl, buildRestaurantMapUrl } from './restaurantMap';

describe('restaurant map url', () => {
  it('카카오 고유 장소 URL이 있으면 해당 식당을 그대로 연다', () => {
    expect(
      buildRestaurantMapUrl({
        mapUrl: 'http://place.map.kakao.com/123456',
        kakaoPlaceId: '123456',
        placeName: '정우 식당',
        address: '충남 천안시 서북구 테스트로 1',
      }),
    ).toBe('https://place.map.kakao.com/123456');
  });

  it('고유 URL이 없어도 카카오 장소 ID로 정확한 페이지를 연다', () => {
    expect(
      buildRestaurantMapUrl({
        kakaoPlaceId: '987654',
        placeName: '정우 식당',
      }),
    ).toBe('https://place.map.kakao.com/987654');
  });

  it('장소 ID가 없을 때만 식당명과 주소를 함께 검색한다', () => {
    expect(buildNaverMapUrl('정우 식당', '충남 천안시 서북구 테스트로 1')).toBe(
      `https://map.naver.com/p/search/${encodeURIComponent(
        '정우 식당 충남 천안시 서북구 테스트로 1',
      )}`,
    );
  });
});
