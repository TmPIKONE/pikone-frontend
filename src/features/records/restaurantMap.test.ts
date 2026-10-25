import { describe, expect, it } from 'vitest';
import { buildNaverMapUrl, buildRestaurantMapUrl } from './restaurantMap';

describe('restaurant map url', () => {
  it('추천 후보도 항상 네이버 지도 검색으로 연다', () => {
    expect(
      buildRestaurantMapUrl({
        mapUrl: 'https://place.map.kakao.com/123456',
        kakaoPlaceId: '123456',
        placeName: '정우 식당',
        address: '충남 천안시 서북구 테스트로 1',
      }),
    ).toBe(
      `https://map.naver.com/p/search/${encodeURIComponent(
        '정우 식당 충남 천안시 서북구 테스트로 1',
      )}`,
    );
  });

  it('주소가 없어도 네이버 지도에서 식당명을 검색한다', () => {
    expect(
      buildRestaurantMapUrl({
        kakaoPlaceId: '987654',
        placeName: '정우 식당',
      }),
    ).toBe(`https://map.naver.com/p/search/${encodeURIComponent('정우 식당')}`);
  });

  it('식당명과 주소를 함께 검색한다', () => {
    expect(buildNaverMapUrl('정우 식당', '충남 천안시 서북구 테스트로 1')).toBe(
      `https://map.naver.com/p/search/${encodeURIComponent(
        '정우 식당 충남 천안시 서북구 테스트로 1',
      )}`,
    );
  });
});
