const NAVER_MAP_SEARCH_BASE = 'https://map.naver.com/p/search/';
const KAKAO_PLACE_BASE = 'https://place.map.kakao.com/';

interface RestaurantMapTarget {
  mapUrl?: string;
  kakaoPlaceId?: string;
  placeName: string;
  address?: string;
}

const normalizeExactKakaoUrl = (mapUrl?: string) => {
  if (!mapUrl) return undefined;

  try {
    const url = new URL(mapUrl);
    if (url.hostname !== 'place.map.kakao.com') return undefined;
    url.protocol = 'https:';
    return url.toString();
  } catch {
    return undefined;
  }
};

export const buildNaverMapUrl = (placeName: string, address?: string) => {
  const query = [placeName.trim(), address?.trim()].filter(Boolean).join(' ');
  return `${NAVER_MAP_SEARCH_BASE}${encodeURIComponent(query)}`;
};

/**
 * 추천 후보는 카카오 지역 API에서 생성되므로 카카오의 고유 장소 URL을 우선 사용한다.
 * 식당명만 다른 지도에서 재검색하면 동명의 타 지역 지점이 열릴 수 있다.
 */
export const buildRestaurantMapUrl = ({
  mapUrl,
  kakaoPlaceId,
  placeName,
  address,
}: RestaurantMapTarget) => {
  const exactUrl = normalizeExactKakaoUrl(mapUrl);
  if (exactUrl) return exactUrl;

  const normalizedPlaceId = kakaoPlaceId?.trim();
  if (normalizedPlaceId && /^[0-9]+$/.test(normalizedPlaceId)) {
    return `${KAKAO_PLACE_BASE}${normalizedPlaceId}`;
  }

  return buildNaverMapUrl(placeName, address);
};
