import { expect, it } from 'vitest';
import {
  categoryFamily,
  resultFamily,
  uniqueValues,
  withSeenCandidates,
} from './recommendationContext';

it.each([
  [undefined, ''],
  ['', ''],
  ['   ', ''],
  ['음식점 > 고기 치킨', 'MEAT'],
  ['음식점 > 닭갈비', 'MEAT'],
  ['음식점 > 치킨 카페', 'CHICKEN'],
  ['음식점 > 카페 회', 'CAFE_DESSERT'],
  ['음식점 > 초밥 파스타', 'SUSHI_RAW'],
  ['음식점 > 피자 마라', 'WESTERN'],
  ['음식점 > 마라 국밥', 'CHINESE'],
  ['음식점 > 한식', 'KOREAN_MEAL'],
  ['음식점 > Foo, · /_&()-BAR', 'foobar'],
  ['한식>', 'KOREAN_MEAL'],
  ['한식> ', ''],
  ['음식점>모르는분류>', '음식점>모르는분류>'],
])(
  'legacy family fallback matches backend precedence and delimiter semantics: %s',
  (category, expected) => {
    expect(categoryFamily(category)).toBe(expected);
  },
);

it('response family is authoritative even when empty or contradictory to category', () => {
  const place = { kakaoPlaceId: 'id', placeName: 'name', category: '초밥' };
  expect(resultFamily({ ...place, categoryFamily: 'MEAT' })).toBe('MEAT');
  expect(resultFamily({ ...place, categoryFamily: '' })).toBe('');
  expect(resultFamily(place)).toBe('SUSHI_RAW');
});

it('seen IDs accumulate uniquely without changing response order or request constraints', () => {
  const request = {
    latitude: 1,
    longitude: 2,
    seenPlaceIds: ['old'],
    excludedCategoryFamilies: ['MEAT'],
    strictFoodPreferences: true,
  };
  const results = [
    { kakaoPlaceId: ' b ', placeName: 'b' },
    { kakaoPlaceId: 'a', placeName: 'a' },
  ];
  expect(withSeenCandidates(request, results)).toEqual({
    ...request,
    seenPlaceIds: ['old', 'b', 'a'],
  });
  expect(results.map((item) => item.kakaoPlaceId)).toEqual([' b ', 'a']);
  expect(uniqueValues([' a ', '', undefined], ['a', 'b'])).toEqual(['a', 'b']);
});
