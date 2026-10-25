import type {
  RecommendationRequest,
  RecommendationResponse,
} from '~/apis/recommendation/recommendation.types';

export const uniqueValues = (...groups: Array<Array<string | undefined> | undefined>) =>
  Array.from(
    new Set(
      groups
        .flatMap((group) => group ?? [])
        .map((value) => value?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  );

// Mirrors the server family identifiers; the response value is authoritative when present.
export const categoryFamily = (category?: string) => {
  const valueWithHierarchy = (category ?? '').toLowerCase();
  const separator = valueWithHierarchy.lastIndexOf('>');
  // Match the server's distinction between an exactly trailing delimiter and a blank leaf.
  const leaf =
    separator >= 0 && separator + 1 < valueWithHierarchy.length
      ? valueWithHierarchy.slice(separator + 1)
      : valueWithHierarchy;
  const value = leaf.replace(/[\s,·/_&()-]+/g, '');
  const groups: Array<[string, string[]]> = [
    ['MEAT', ['육류', '고기', '삼겹', '갈비', '구이']],
    ['CHICKEN', ['치킨', '닭']],
    ['CAFE_DESSERT', ['카페', '커피', '디저트', '베이커리', '빵']],
    ['SUSHI_RAW', ['초밥', '스시', '회', '사시미']],
    ['WESTERN', ['파스타', '이탈리', '피자', '양식']],
    ['CHINESE', ['중식', '중국', '마라', '딤섬']],
    ['KOREAN_MEAL', ['국밥', '찌개', '백반', '칼국수', '국수', '한식']],
  ];
  return groups.find(([, words]) => words.some((word) => value.includes(word)))?.[0] ?? value;
};

export const resultFamily = (item: RecommendationResponse) =>
  item.categoryFamily ?? categoryFamily(item.category);

export const withSeenCandidates = (
  request: RecommendationRequest,
  candidates: RecommendationResponse[],
): RecommendationRequest => ({
  ...request,
  seenPlaceIds: uniqueValues(
    request.seenPlaceIds,
    candidates.map((item) => item.kakaoPlaceId),
  ),
});
