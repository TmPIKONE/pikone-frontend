const NAVER_MAP_SEARCH_BASE = 'https://map.naver.com/p/search/';

interface RestaurantMapTarget {
  mapUrl?: string;
  kakaoPlaceId?: string;
  placeName: string;
  address?: string;
}

export const buildNaverMapUrl = (placeName: string, address?: string) => {
  const query = [placeName.trim(), address?.trim()].filter(Boolean).join(' ');
  return `${NAVER_MAP_SEARCH_BASE}${encodeURIComponent(query)}`;
};

/**
 * 사용자가 여는 외부 지도는 네이버 지도로 통일한다.
 * 기존 mapUrl/kakaoPlaceId는 추천 데이터 계약 호환을 위해 입력 타입에 남겨둔다.
 */
export const buildRestaurantMapUrl = ({ placeName, address }: RestaurantMapTarget) =>
  buildNaverMapUrl(placeName, address);
