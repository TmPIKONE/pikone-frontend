import { describe, expect, it } from 'vitest';
import { buildNaverMapUrl } from './naverMap';

describe('buildNaverMapUrl', () => {
  it('주소를 섞지 않고 식당명만 네이버지도 검색어로 만든다', () => {
    expect(buildNaverMapUrl('정우 식당')).toBe(
      `https://map.naver.com/p/search/${encodeURIComponent('정우 식당')}`,
    );
  });
});
