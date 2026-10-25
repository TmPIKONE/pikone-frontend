import type { RecommendationResponse } from '~/apis/recommendation/recommendation.types';

const NAVER_MAP_SEARCH_BASE = 'https://map.naver.com/p/search/';

const appName = () => {
  const configured = import.meta.env.VITE_NAVER_MAP_APPNAME?.trim();
  if (configured) return configured;
  if (typeof window !== 'undefined' && window.location.origin) return window.location.origin;
  return 'pikone';
};

// Full street addresses can over-constrain NAVER Maps text search and return no
// result even when the restaurant exists. The web fallback therefore searches
// by the restaurant name only. Exact coordinates are used by the app scheme.
export const buildNaverPlaceSearchUrl = (restaurant: Pick<RecommendationResponse, 'placeName'>) =>
  `${NAVER_MAP_SEARCH_BASE}${encodeURIComponent(restaurant.placeName)}`;

export const buildNaverPlaceScheme = (
  restaurant: Pick<RecommendationResponse, 'placeName' | 'latitude' | 'longitude'>,
) => {
  if (restaurant.latitude == null || restaurant.longitude == null) return undefined;

  const params = new URLSearchParams({
    lat: String(restaurant.latitude),
    lng: String(restaurant.longitude),
    name: restaurant.placeName,
    appname: appName(),
  });

  return `nmap://place?${params.toString()}`;
};

export const openNaverPlaceWithFallback = (
  restaurant: Pick<RecommendationResponse, 'placeName' | 'latitude' | 'longitude'>,
) => {
  const fallbackUrl = buildNaverPlaceSearchUrl(restaurant);
  const scheme = buildNaverPlaceScheme(restaurant);

  if (!scheme) {
    window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  let hidden = false;
  const markHidden = () => {
    if (document.visibilityState === 'hidden') hidden = true;
  };

  document.addEventListener('visibilitychange', markHidden, { once: true });
  window.location.href = scheme;

  window.setTimeout(() => {
    if (!hidden && document.visibilityState === 'visible') {
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    }
  }, 900);
};
