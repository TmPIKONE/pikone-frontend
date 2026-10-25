// @vitest-environment jsdom

import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
import AI from './AI';
import { writeRecommendationDraft } from '~/features/recommendations/recommendationStorage';

const mocks = vi.hoisted(() => ({
  parse: vi.fn(),
  recommend: vi.fn(),
  suggest: vi.fn(),
  suggestionEvent: vi.fn(),
  submission: vi.fn(),
  empty: [],
  exhausted: false,
  companions: [] as { companionId: number; displayName: string }[],
}));

vi.mock('~/hooks/useCurrentLocation', () => ({
  useCurrentLocation: () => ({
    latitude: 37.5,
    longitude: 127,
    isResolved: true,
    permissionDenied: false,
  }),
}));
vi.mock('~/features/homeLocations/homeLocation.queries', () => ({
  useHomeLocations: () => ({ data: mocks.empty }),
}));
vi.mock('~/features/companions/companion.queries', () => ({
  useCompanions: () => ({ data: mocks.companions }),
}));
vi.mock('~/components/LocationPinMap/LocationPinMap', () => ({ LocationPinMap: () => null }));
vi.mock('~/features/recommendations/recommendation.queries', () => ({
  useRecommendations: () => ({ mutate: mocks.recommend, isPending: false, error: null }),
  useRecommendationContextParser: () => ({ mutate: mocks.parse, isPending: false }),
  useRecommendationUsage: () => ({ data: { dailyLimit: 3, exhausted: mocks.exhausted } }),
  useRecommendationHistory: () => ({ data: mocks.empty }),
  useRecommendationWorkspaces: () => ({ data: mocks.empty }),
  useRecommendationLocationReverse: () => ({ mutate: vi.fn(), isPending: false }),
  useRecommendationLocationSearch: () => ({ data: mocks.empty, isLoading: false }),
  usePromptSuggestions: () => ({ mutate: mocks.suggest, isPending: false }),
  usePromptSuggestionEvent: () => ({ mutate: mocks.suggestionEvent }),
  usePromptSubmission: () => ({ mutate: mocks.submission }),
}));

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  vi.clearAllMocks();
  mocks.companions = [];
  mocks.exhausted = false;
});
afterEach(cleanup);

const mount = () =>
  render(
    <MemoryRouter>
      <AI />
    </MemoryRouter>,
  );

const parsed = {
  occasion: 'NORMAL',
  mobility: 'WALK',
  discoveryIntent: 'BALANCED',
  timeBudget: 'NORMAL',
  budgetPreference: 'NORMAL',
  foodPreferences: ['초밥'],
  contextSearchTerms: ['초밥'],
  contextNotes: [],
  source: 'LLM',
};

const next = (view: ReturnType<typeof mount>) => {
  fireEvent.click(view.getByRole('button', { name: /^다음/ }));
};

const goToContextCard = (view: ReturnType<typeof mount>) => {
  next(view);
  next(view);
};

const goToReviewCard = (view: ReturnType<typeof mount>) => {
  goToContextCard(view);
  fireEvent.click(view.getByRole('button', { name: /기준 확인/ }));
};

it('기본 화면은 한 번에 한 장씩 보는 카드 흐름으로 시작한다', () => {
  const view = mount();

  expect(view.queryByText('오늘 어떤 식사인가요?')).toBeNull();
  expect(view.getByText('1 / 4')).toBeTruthy();
  expect(view.getByRole('heading', { name: '어디에서 먹을까요?' })).toBeTruthy();
  expect(view.queryByRole('textbox', { name: /원하는 게 있으면 말해줘/ })).toBeNull();
  expect(view.getByRole('button', { name: /^다음/ })).toBeTruthy();

  next(view);
  expect(view.getByText('2 / 4')).toBeTruthy();
  expect(view.getByRole('heading', { name: '누구와 먹나요?' })).toBeTruthy();

  next(view);
  expect(view.getByText('3 / 4')).toBeTruthy();
  expect(view.getByRole('textbox', { name: /원하는 게 있으면 말해줘/ })).toBeTruthy();
  expect(view.queryByRole('button', { name: '가까운 곳' })).toBeNull();
  expect(view.queryByRole('button', { name: '새로운 곳' })).toBeNull();
  expect(view.queryByRole('button', { name: '시간 빠듯' })).toBeNull();
});

it('메뉴 선택은 마지막 카드의 토글에서 기본적으로 선호로 전달한다', () => {
  const view = mount();
  goToReviewCard(view);

  fireEvent.click(view.getByRole('button', { name: '초밥' }));
  fireEvent.click(view.getByRole('button', { name: '지금 먹을 곳 골라줘' }));

  expect(mocks.recommend.mock.calls[0][0]).toMatchObject({
    foodPreferences: ['초밥'],
    strictFoodPreferences: false,
  });
});

it('메뉴를 필수로 바꿨을 때만 strictFoodPreferences를 보낸다', () => {
  const view = mount();
  goToReviewCard(view);

  fireEvent.click(view.getByRole('button', { name: '초밥' }));
  fireEvent.click(view.getByRole('button', { name: '이 메뉴 아니면 제외' }));
  fireEvent.click(view.getByRole('button', { name: '지금 먹을 곳 골라줘' }));

  expect(mocks.recommend.mock.calls[0][0]).toMatchObject({
    foodPreferences: ['초밥'],
    strictFoodPreferences: true,
  });
});

it('동행자는 두 번째 카드에서 고르고 메뉴는 마지막 카드에서 별도로 입력한다', () => {
  mocks.companions = [{ companionId: 7, displayName: '친구' }];
  const view = mount();

  next(view);
  fireEvent.click(view.getByRole('button', { name: /친구/ }));
  next(view);
  fireEvent.click(view.getByRole('button', { name: /기준 확인/ }));
  fireEvent.click(view.getByRole('button', { name: '동행자 메뉴 초밥' }));
  fireEvent.click(view.getByRole('button', { name: '지금 먹을 곳 골라줘' }));

  expect(mocks.recommend.mock.calls[0][0]).toMatchObject({
    companionId: 7,
    companionFoodPreferences: ['초밥'],
    strictCompanionFoodPreferences: false,
  });
});

it('자연어는 세 번째 카드에서 입력하고 마지막 CTA 한 번으로 해석한 뒤 추천한다', () => {
  mocks.parse.mockImplementation((_body, options) => options.onSuccess(parsed));
  const view = mount();
  goToContextCard(view);

  fireEvent.change(view.getByRole('textbox', { name: /원하는 게 있으면 말해줘/ }), {
    target: { value: '초밥이 먹고 싶고 너무 멀진 않았으면 좋겠어' },
  });
  fireEvent.click(view.getByRole('button', { name: /기준 확인/ }));
  fireEvent.click(view.getByRole('button', { name: '지금 먹을 곳 골라줘' }));

  expect(mocks.parse).toHaveBeenCalledTimes(1);
  expect(mocks.recommend.mock.calls[0][0]).toMatchObject({
    naturalContext: '초밥이 먹고 싶고 너무 멀진 않았으면 좋겠어',
    foodPreferences: ['초밥'],
    contextSearchTerms: ['초밥'],
    strictFoodPreferences: false,
  });
});

it('빠른 조건은 마지막 카드에서 고른 값만 추천 요청에 반영한다', () => {
  const view = mount();
  goToReviewCard(view);

  fireEvent.click(view.getByRole('button', { name: '새로운 곳' }));
  fireEvent.click(view.getByRole('button', { name: '시간 빠듯' }));
  fireEvent.click(view.getByRole('button', { name: '지금 먹을 곳 골라줘' }));

  expect(mocks.recommend.mock.calls[0][0]).toMatchObject({
    discoveryIntent: 'NEW_PLACE',
    timeBudget: 'SHORT',
    priority: 'DISCOVERY',
  });
});

it('새 비교에서는 저장된 메뉴를 자동으로 다시 고르지 않는다', () => {
  sessionStorage.setItem(
    'pikone:recommendation-draft',
    JSON.stringify({
      foodPreferences: ['삼겹살'],
      updatedAt: new Date().toISOString(),
    }),
  );
  const view = render(
    <MemoryRouter initialEntries={['/ai?mode=new']}>
      <AI />
    </MemoryRouter>,
  );

  fireEvent.click(view.getByRole('button', { name: /^다음/ }));
  fireEvent.click(view.getByRole('button', { name: /^다음/ }));
  fireEvent.click(view.getByRole('button', { name: /기준 확인/ }));
  fireEvent.click(view.getByRole('button', { name: '지금 먹을 곳 골라줘' }));
  expect(mocks.recommend.mock.calls[0][0].foodPreferences).toBeUndefined();
});

it('strict companion menu is submitted only when explicitly selected', () => {
  mocks.companions = [{ companionId: 7, displayName: '친구' }];
  const view = mount();
  next(view);
  fireEvent.click(view.getByRole('button', { name: /친구/ }));
  next(view);
  fireEvent.click(view.getByRole('button', { name: /기준 확인/ }));
  fireEvent.click(view.getByRole('button', { name: '동행자 메뉴 초밥' }));
  fireEvent.click(view.getByRole('button', { name: '이 메뉴 아니면 제외' }));
  fireEvent.click(view.getByRole('button', { name: '지금 먹을 곳 골라줘' }));
  expect(mocks.recommend.mock.calls[0][0]).toMatchObject({
    companionId: 7,
    companionFoodPreferences: ['초밥'],
    strictCompanionFoodPreferences: true,
  });
});

it('removing the last strict menu resets the toggle before a different menu is selected', () => {
  const view = mount();
  goToReviewCard(view);
  fireEvent.click(view.getByRole('button', { name: '초밥' }));
  fireEvent.click(view.getByRole('button', { name: '이 메뉴 아니면 제외' }));
  fireEvent.click(view.getByRole('button', { name: '초밥' }));
  fireEvent.click(view.getByRole('button', { name: '치킨' }));
  fireEvent.click(view.getByRole('button', { name: '지금 먹을 곳 골라줘' }));
  expect(mocks.recommend.mock.calls[0][0]).toMatchObject({
    foodPreferences: ['치킨'],
    strictFoodPreferences: false,
  });
});

it('editing restored exploration retains strict flags, family/place exclusions and newest parent', () => {
  mocks.companions = [{ companionId: 7, displayName: '친구' }];
  writeRecommendationDraft({
    naturalContext: '',
    selectedLocationKey: 'current',
    selectedDestination: null,
    companionId: 7,
    foodPreferences: ['초밥'],
    companionFoodPreferences: ['치킨'],
    occasion: 'NORMAL',
    mobility: 'WALK',
    discoveryIntent: 'BALANCED',
    timeBudget: 'NORMAL',
    radiusMeters: 1400,
    strictFoodPreferences: true,
    strictCompanionFoodPreferences: true,
    explorationRequest: {
      latitude: 37.5,
      longitude: 127,
      excludedCategoryFamilies: ['MEAT'],
      excludedPlaceIds: ['excluded'],
      seenPlaceIds: ['seen'],
      parentRecommendationRequestId: 'newest-parent',
    },
  });
  const view = mount();
  goToReviewCard(view);
  fireEvent.click(view.getByRole('button', { name: '지금 먹을 곳 골라줘' }));
  expect(mocks.recommend.mock.calls[0][0]).toMatchObject({
    strictFoodPreferences: true,
    strictCompanionFoodPreferences: true,
    foodPreferences: ['초밥'],
    companionFoodPreferences: ['치킨'],
    excludedCategoryFamilies: ['MEAT'],
    excludedPlaceIds: ['excluded'],
    seenPlaceIds: ['seen'],
    parentRecommendationRequestId: 'newest-parent',
  });
});

it('quota exhaustion prevents form submission and parsing', () => {
  mocks.exhausted = true;
  const view = mount();
  goToReviewCard(view);
  const submit = view.getByRole('button', { name: /오늘 추천을 모두 사용|지금 먹을 곳 골라줘/ });
  expect(submit.hasAttribute('disabled')).toBe(true);
  fireEvent.click(submit);
  expect(mocks.recommend).not.toHaveBeenCalled();
  expect(mocks.parse).not.toHaveBeenCalled();
});

it('prompt suggestions do not refetch on each text keystroke', () => {
  const view = mount();
  goToContextCard(view);
  const count = mocks.suggest.mock.calls.length;
  fireEvent.change(view.getByRole('textbox', { name: /원하는 게 있으면 말해줘/ }), {
    target: { value: '새 요청 문장' },
  });
  expect(mocks.suggest).toHaveBeenCalledTimes(count);
  fireEvent.click(view.getByRole('button', { name: '다른 예시 보기' }));
  expect(mocks.suggest.mock.calls[mocks.suggest.mock.calls.length - 1]?.[0]).toMatchObject({
    refresh: true,
    naturalContext: '새 요청 문장',
  });
});
