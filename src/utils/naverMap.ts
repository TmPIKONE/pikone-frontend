const NAVER_MAP_SEARCH_BASE = 'https://map.naver.com/p/search/';

export const buildNaverMapUrl = (placeName: string) => {
  const query = placeName.trim();
  return `${NAVER_MAP_SEARCH_BASE}${encodeURIComponent(query)}`;
};
