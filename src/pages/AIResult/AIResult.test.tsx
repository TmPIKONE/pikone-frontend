// @vitest-environment jsdom

import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type {
  RecommendationActionRequest,
  RecommendationHistoryResponse,
  RecommendationImpressionRequest,
  RecommendationRequest,
  RecommendationResponse,
} from '~/apis/recommendation/recommendation.types';
import { writeRecommendationResult } from '~/features/recommendations/recommendationStorage';
import {
  beginRecommendationImpression,
  completeRecommendationImpression,
} from '~/features/recommendations/recommendationTracking';
import AIResult from './AIResult';

type RefreshOptions = {
  onSuccess: (recommendations: RecommendationResponse[]) => void;
  onError: () => void;
};

const mocks = vi.hoisted(() => ({
  refresh: vi.fn<(request: RecommendationRequest, options: RefreshOptions) => void>(),
  impression:
    vi.fn<
      (requestId: string, payload: RecommendationImpressionRequest, dedupeKey: string) => void
    >(),
  empty: [] as never[],
  history: [] as RecommendationHistoryResponse[],
  exhausted: false,
  openMap: vi.fn(),
  save: vi.fn(),
  action: vi.fn<(requestId: string, payload: RecommendationActionRequest) => void>(),
}));

vi.mock('~/features/recommendations/naverNavigation', () => ({
  openNaverPlaceWithFallback: (...args: unknown[]) => mocks.openMap(...args),
}));
vi.mock('~/features/recommendations/recommendation.queries', () => ({
  useRecommendationHistory: () => ({ data: mocks.history }),
  useRecommendationWorkspaces: () => ({ data: mocks.empty }),
  useSaveRecommendationWorkspace: () => ({ mutate: mocks.save }),
  useRecommendations: () => ({ mutate: mocks.refresh, isPending: false }),
  useRecommendationUsage: () => ({
    data: {
      dailyLimit: 3,
      usedCount: 1,
      remainingCount: 2,
      exhausted: mocks.exhausted,
      resetAt: '2026-09-08T00:00:00+09:00',
    },
  }),
  useRecommendationImpressions: () => ({
    mutate: ({
      requestId,
      body,
      dedupeKey,
    }: {
      requestId: string;
      body: RecommendationImpressionRequest;
      dedupeKey: string;
    }) => mocks.impression(requestId, body, dedupeKey),
  }),
  useRecommendationAction: () => ({
    mutate: ({ requestId, body }: { requestId: string; body: RecommendationActionRequest }) =>
      mocks.action(requestId, body),
    mutateAsync: async ({
      requestId,
      body,
    }: {
      requestId: string;
      body: RecommendationActionRequest;
    }) => {
      mocks.action(requestId, body);
    },
  }),
}));

const request: RecommendationRequest = {
  latitude: 37.5,
  longitude: 127,
  locationLabel: '성수',
  priority: 'BALANCED',
  occasion: 'DATE',
  mobility: 'WALK',
  discoveryIntent: 'NEW_PLACE',
  timeBudget: 'NORMAL',
  budgetPreference: 'NORMAL',
};

const recommendations = (requestId: string, prefix = 'place'): RecommendationResponse[] =>
  [1, 2, 3].map((number) => ({
    recommendationRequestId: requestId,
    candidateSnapshotId: number * 10 + (requestId === 'session-b' ? 100 : 0),
    kakaoPlaceId: `${prefix}-${number}`,
    placeName: `${prefix} 식당 ${number}`,
    latitude: 37.5 + number * 0.001,
    longitude: 127 + number * 0.001,
    recommendType:
      number === 1 ? 'PERSONAL_PICK' : number === 2 ? 'CONTEXT_PICK' : 'EXPLORATION_PICK',
    reasonTags: number === 1 ? ['기록 취향과 비슷함', '내 재방문 기록'] : ['현재 상황 반영'],
    menus: [{ name: `대표 메뉴 ${number}`, priceWon: 10000 + number * 1000 }],
  }));

const renderResult = (
  resultRecommendations: RecommendationResponse[],
  options: {
    strict?: boolean;
    routeState?: boolean;
    request?: RecommendationRequest;
    historyPreview?: boolean;
  } = {},
) => {
  const route =
    options.routeState === false
      ? { pathname: '/ai/result' }
      : {
          pathname: '/ai/result',
          state: {
            recommendations: resultRecommendations,
            request: options.request ?? request,
            historyPreview: options.historyPreview,
          },
        };
  const tree = (
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/ai/result" element={<AIResult />} />
        <Route path="/ai" element={<div>추천 조건 화면</div>} />
        <Route path="/ai/trip" element={<div>이동 화면</div>} />
      </Routes>
    </MemoryRouter>
  );

  return render(options.strict ? <StrictMode>{tree}</StrictMode> : tree);
};

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  vi.clearAllMocks();
  mocks.refresh.mockReset();
  mocks.action.mockReset();
  mocks.history = [];
  mocks.exhausted = false;
  mocks.impression.mockImplementation((_requestId, _payload, dedupeKey) =>
    completeRecommendationImpression(dedupeKey),
  );
  vi.spyOn(window, 'open').mockImplementation(() => null);
  Object.defineProperty(window, 'scrollTo', { configurable: true, value: vi.fn() });
});

it('연속 새 후보 찾기는 2·3순위를 포함한 모든 이전 후보를 누적 제외한다', async () => {
  const current = recommendations('session-a');
  const second = recommendations('session-b', 'second');
  const third = recommendations('session-c', 'third');
  mocks.refresh.mockImplementationOnce((_request, options) => options.onSuccess(second));
  // Simulate a stale server response containing the first round's second alternative.
  mocks.refresh.mockImplementationOnce((_request, options) =>
    options.onSuccess([current[1], ...third]),
  );
  const view = renderResult(current);
  fireEvent.click(view.getByRole('button', { name: /새 후보 찾기/ }));
  await waitFor(() => expect(view.getByRole('heading', { name: 'second 식당 1' })).toBeTruthy());
  fireEvent.click(view.getByRole('button', { name: /새 후보 찾기/ }));
  await waitFor(() => expect(view.getByRole('heading', { name: 'third 식당 1' })).toBeTruthy());
  expect(mocks.refresh.mock.calls[1][0].seenPlaceIds).toEqual([
    'place-1',
    'place-2',
    'place-3',
    'second-1',
    'second-2',
    'second-3',
  ]);
  expect(view.queryByText('place 식당 2')).toBeNull();
});

it('제외한 식당을 서버가 다시 주면 단일 교체에서도 받지 않는다', async () => {
  const current = recommendations('session-a');
  mocks.refresh.mockImplementationOnce((_request, options) => options.onSuccess([current[0]]));
  const view = renderResult(current);
  fireEvent.click(view.getByText('조건을 바꿔 다시 찾기'));
  fireEvent.click(view.getByRole('button', { name: '이 식당 제외 · 추천 1회' }));
  await waitFor(() =>
    expect(view.getByText(/현재 범위에서 새 후보를 더 찾지 못했어요/)).toBeTruthy(),
  );
  expect(mocks.refresh.mock.calls[0][0].excludedPlaceIds).toEqual(['place-1']);
  expect(view.getByRole('heading', { name: 'place 식당 1' })).toBeTruthy();
});

it('100곳 이상을 확인해도 초기 후보 제외 내역을 버리지 않는다', async () => {
  const excluded = Array.from({ length: 102 }, (_, i) => 'seen-' + i);
  writeRecommendationResult({
    recommendations: recommendations('session-a'),
    request: { ...request, excludedPlaceIds: excluded },
  });
  mocks.refresh.mockImplementationOnce((_request, options) =>
    options.onSuccess(recommendations('session-b', 'fresh')),
  );
  const view = renderResult([], { routeState: false });
  fireEvent.click(view.getByRole('button', { name: /새 후보 찾기/ }));
  await waitFor(() => expect(mocks.refresh).toHaveBeenCalled());
  expect(mocks.refresh.mock.calls[0][0].excludedPlaceIds).toEqual(excluded);
  expect(mocks.refresh.mock.calls[0][0].seenPlaceIds).toEqual(['place-1', 'place-2', 'place-3']);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('AIResult CBRS result UX and behavior tracking', () => {
  it('대표 카드에는 확인 가능한 핵심 정보만 먼저 보여주고 상세 근거는 접어둔다', () => {
    const current = recommendations('reason-session');
    current[0] = {
      ...current[0],
      recommendationReason: '가까운 곳을 원해서 이동 부담이 적은 후보예요.',
      contextNotes: ['취향 적합도를 판단하지 못했어요.'],
      distance: 420,
    };

    const view = renderResult(current);

    expect(view.getByText('오늘은 여기 어때요?')).toBeTruthy();
    expect(view.getByText(/성수 · 데이트/)).toBeTruthy();
    expect(view.getByText('대표 메뉴 1')).toBeTruthy();
    expect(view.getByText('직선거리 420m')).toBeTruthy();
    expect(
      view.getByText('취향 적합도를 판단하지 못했어요.').closest('details')?.hasAttribute('open'),
    ).toBe(false);
    fireEvent.click(view.getByText('추천 근거 보기'));
    expect(view.getByText('가까운 곳을 원해서 이동 부담이 적은 후보예요.')).toBeTruthy();
    expect(view.getByText('취향 적합도를 판단하지 못했어요.')).toBeTruthy();
  });

  it('StrictMode에서도 Top-3 impression을 UI 순서로 한 번만 기록한다', async () => {
    const current = recommendations('strict-session').map((item, index) =>
      index === 1 ? { ...item, candidateSnapshotId: undefined } : item,
    );

    const view = renderResult(current, { strict: true });

    expect(view.getByText('place 식당 1')).toBeTruthy();
    await waitFor(() => expect(mocks.impression).toHaveBeenCalledOnce());
    expect(mocks.impression).toHaveBeenCalledWith(
      'strict-session',
      {
        candidates: [
          { candidateSnapshotId: 10, position: 1 },
          { candidateSnapshotId: 30, position: 3 },
        ],
      },
      expect.any(String),
    );
  });

  it('선택 전 지도 확인은 PLACE_OPEN만 기록하고 SELECT는 기록하지 않는다', async () => {
    const current = recommendations('map-session');
    const view = renderResult(current);
    await waitFor(() => expect(mocks.impression).toHaveBeenCalled());

    mocks.action.mockClear();
    fireEvent.click(view.getByRole('button', { name: '지도·상세' }));

    expect(mocks.openMap).toHaveBeenCalledWith(current[0]);
    expect(mocks.action).toHaveBeenCalledTimes(1);
    expect(mocks.action).toHaveBeenCalledWith(
      'map-session',
      expect.objectContaining({
        candidateSnapshotId: 10,
        actionType: 'PLACE_OPEN',
        clientEventId: expect.any(String),
      }),
    );
    expect(mocks.action).not.toHaveBeenCalledWith(
      'map-session',
      expect.objectContaining({ actionType: 'SELECT' }),
    );
  });

  it('선택은 SELECT와 snapshot을 저장하고 결정 내용을 보여준다', async () => {
    const current = recommendations('select-session', 'select-place');
    const view = renderResult(current);
    await waitFor(() => expect(mocks.impression).toHaveBeenCalled());

    fireEvent.click(view.getByRole('button', { name: '여기로 정하기' }));

    expect(mocks.action).toHaveBeenCalledWith(
      'select-session',
      expect.objectContaining({ candidateSnapshotId: 10, actionType: 'SELECT' }),
    );
    expect(JSON.parse(localStorage.getItem('pikone:selected-recommendation') ?? '')).toMatchObject({
      recommendationRequestId: 'select-session',
      candidateSnapshotId: 10,
      kakaoPlaceId: 'select-place-1',
    });
    expect(JSON.parse(sessionStorage.getItem('pikone:recommendation-trip') ?? '')).toMatchObject({
      recommendation: { kakaoPlaceId: 'select-place-1' },
      request: { latitude: 37.5, longitude: 127 },
    });
    expect(view.getByText('오늘 먹을 곳 정했어요')).toBeTruthy();
  });

  it('대안 후보 비교는 서버 재요청이나 행동 기록 없이 프런트 상태만 바꾼다', async () => {
    const current = recommendations('compare-session');
    const view = renderResult(current);
    await waitFor(() => expect(mocks.impression).toHaveBeenCalled());
    mocks.action.mockClear();
    mocks.refresh.mockClear();

    fireEvent.click(view.getByRole('button', { name: /place 식당 2/ }));

    expect(view.getByRole('heading', { name: 'place 식당 2' })).toBeTruthy();
    expect(mocks.refresh).not.toHaveBeenCalled();
    expect(mocks.action).not.toHaveBeenCalled();
  });

  it('단일 후보 교체는 나머지 두 곳을 유지하고 새 후보만 끼운다', async () => {
    const current = recommendations('session-a');
    const next = recommendations('session-b', 'new-place');
    mocks.refresh.mockImplementation((_nextRequest, options) => options.onSuccess(next));
    const view = renderResult(current);

    fireEvent.click(view.getByText('조건을 바꿔 다시 찾기'));
    fireEvent.click(view.getByRole('button', { name: '이 식당 제외 · 추천 1회' }));

    expect(mocks.action).toHaveBeenCalledWith(
      'session-a',
      expect.objectContaining({ candidateSnapshotId: 10, actionType: 'EXCLUDE' }),
    );
    expect(mocks.action).toHaveBeenCalledWith(
      'session-a',
      expect.objectContaining({ actionType: 'RERECOMMEND' }),
    );
    await waitFor(() =>
      expect(mocks.refresh).toHaveBeenCalledWith(
        expect.objectContaining({
          excludedPlaceIds: ['place-1'],
          seenPlaceIds: ['place-1', 'place-2', 'place-3'],
          parentRecommendationRequestId: 'session-a',
        }),
        expect.any(Object),
      ),
    );
    await waitFor(() => expect(view.getByText('new-place 식당 1')).toBeTruthy());
    expect(view.getByText('place 식당 2')).toBeTruthy();
    expect(view.getByText('place 식당 3')).toBeTruthy();
    expect(view.queryByText('new-place 식당 2')).toBeNull();
    expect(view.queryByText('new-place 식당 3')).toBeNull();
    await waitFor(() =>
      expect(mocks.impression).toHaveBeenCalledWith(
        'session-b',
        { candidates: [{ candidateSnapshotId: 110, position: 1 }] },
        expect.any(String),
      ),
    );
  });

  it('sessionStorage hydration으로 결과와 tracking context를 복원한다', async () => {
    const stored = recommendations('hydrated-session', 'hydrated');
    writeRecommendationResult({ recommendations: stored, request });

    const view = renderResult([], { routeState: false });

    expect(view.getByText('hydrated 식당 1')).toBeTruthy();
    await waitFor(() =>
      expect(mocks.impression).toHaveBeenCalledWith(
        'hydrated-session',
        expect.anything(),
        expect.any(String),
      ),
    );
  });

  it('이미 기록한 hydration impression은 다시 보내지 않는다', async () => {
    const stored = recommendations('deduped-hydration-session', 'deduped');
    writeRecommendationResult({ recommendations: stored, request });
    const dedupeKey = beginRecommendationImpression('deduped-hydration-session', [
      { candidateSnapshotId: 10, position: 1 },
      { candidateSnapshotId: 20, position: 2 },
      { candidateSnapshotId: 30, position: 3 },
    ]);
    completeRecommendationImpression(dedupeKey!);

    const view = renderResult([], { routeState: false });

    expect(view.getByText('deduped 식당 1')).toBeTruthy();
    await waitFor(() => expect(mocks.impression).not.toHaveBeenCalled());
  });
});

describe('final backend recommendation contract', () => {
  it('server order survives refresh regardless of distance, lane and responsePosition', async () => {
    const fresh = recommendations('order-response', 'ordered');
    fresh[0] = { ...fresh[0], distance: 1200, responsePosition: 3 };
    fresh[1] = { ...fresh[1], distance: 20, responsePosition: 1 };
    mocks.refresh.mockImplementationOnce((_body, options) => options.onSuccess(fresh));
    const view = renderResult(recommendations('order-parent'));
    fireEvent.click(view.getByRole('button', { name: /새 후보 찾기/ }));
    await waitFor(() => expect(view.getByRole('heading', { name: 'ordered 식당 1' })).toBeTruthy());
    expect(
      view
        .getAllByRole('button')
        .filter((button) => button.textContent?.includes('ordered 식당'))
        .map((button) => button.textContent),
    ).toEqual([
      expect.stringContaining('ordered 식당 2'),
      expect.stringContaining('ordered 식당 3'),
    ]);
  });

  it('family exclusions accumulate in the request even if both tracking calls fail', async () => {
    mocks.action.mockImplementation(() => {
      throw new Error('analytics unavailable');
    });
    const current = recommendations('family-parent');
    current[0] = {
      ...current[0],
      categoryFamily: 'SUSHI_RAW',
      category: '한식',
      menuKeywords: ['국밥'],
    };
    const fresh = recommendations('family-next', 'family-new');
    mocks.refresh.mockImplementationOnce((_body, options) => options.onSuccess(fresh));
    const view = renderResult(current, {
      request: {
        ...request,
        foodPreferences: ['초밥', '치킨'],
        strictFoodPreferences: true,
        excludedCategoryFamilies: ['MEAT'],
      },
    });
    fireEvent.click(view.getByText('조건을 바꿔 다시 찾기'));
    fireEvent.click(view.getByRole('button', { name: '오늘은 이 메뉴 말고' }));
    await waitFor(() => expect(mocks.refresh).toHaveBeenCalled());
    expect(mocks.refresh.mock.calls[0][0]).toMatchObject({
      excludedCategoryFamilies: ['MEAT', 'SUSHI_RAW'],
      excludedPlaceIds: ['place-1'],
      foodPreferences: ['치킨'],
      strictFoodPreferences: true,
    });
    await waitFor(() =>
      expect(view.getByRole('heading', { name: 'family-new 식당 1' })).toBeTruthy(),
    );
    expect(
      JSON.parse(sessionStorage.getItem('pikone:recommendation-result') ?? '{}').request
        .excludedCategoryFamilies,
    ).toEqual(['MEAT', 'SUSHI_RAW']);
  });

  it('mixed replace-one persists the newest parent for the next request and editing', async () => {
    mocks.refresh.mockImplementationOnce((_body, options) =>
      options.onSuccess(recommendations('newest-b', 'newest')),
    );
    const view = renderResult(recommendations('original-a'));
    fireEvent.click(view.getByText('조건을 바꿔 다시 찾기'));
    fireEvent.click(view.getByRole('button', { name: '이 식당 제외 · 추천 1회' }));
    await waitFor(() => expect(view.getByRole('heading', { name: 'newest 식당 1' })).toBeTruthy());
    expect(
      JSON.parse(sessionStorage.getItem('pikone:recommendation-result') ?? '{}').request
        .parentRecommendationRequestId,
    ).toBe('newest-b');
    fireEvent.click(view.getByRole('button', { name: /새 후보 찾기/ }));
    await waitFor(() => expect(mocks.refresh).toHaveBeenCalledTimes(2));
    expect(mocks.refresh.mock.calls[1][0].parentRecommendationRequestId).toBe('newest-b');
    expect(mocks.refresh.mock.calls[1][0].seenPlaceIds).toEqual([
      'place-1',
      'place-2',
      'place-3',
      'newest-1',
    ]);
    view.unmount();
    const restored = renderResult([], { routeState: false });
    fireEvent.click(restored.getAllByRole('button', { name: '조건 바꾸기' })[0]);
    expect(
      JSON.parse(sessionStorage.getItem('pikone:recommendation-draft') ?? '{}').explorationRequest
        .parentRecommendationRequestId,
    ).toBe('newest-b');
  });

  it('defensive stale checks drop duplicates, seen IDs and authoritative families without sorting', async () => {
    const fresh = recommendations('defensive-next', 'safe');
    const stale = { ...fresh[0], kakaoPlaceId: 'place-2' };
    const excluded = {
      ...fresh[0],
      kakaoPlaceId: 'blocked-family',
      categoryFamily: 'MEAT',
      category: '초밥',
    };
    mocks.refresh.mockImplementationOnce((_body, options) =>
      options.onSuccess([stale, excluded, fresh[2], fresh[2], fresh[0], fresh[1]]),
    );
    const view = renderResult(recommendations('defensive-parent'), {
      request: { ...request, excludedCategoryFamilies: ['MEAT'] },
    });
    fireEvent.click(view.getByRole('button', { name: /새 후보 찾기/ }));
    await waitFor(() => expect(view.getByRole('heading', { name: 'safe 식당 3' })).toBeTruthy());
    expect(view.queryByText('place 식당 2')).toBeNull();
    expect(
      JSON.parse(
        sessionStorage.getItem('pikone:recommendation-result') ?? '{}',
      ).recommendations.map((item: RecommendationResponse) => item.kakaoPlaceId),
    ).toEqual(['safe-3', 'safe-1', 'safe-2']);
  });

  it('server evidence renders without inventing a menu-match claim', () => {
    const current = recommendations('evidence');
    current[0] = {
      ...current[0],
      category: '초밥',
      menuKeywords: ['초밥'],
      reasonTags: ['서버가 확인한 근거'],
      recommendationReason: '서버 추천 설명',
      contextNotes: ['서버가 제공한 한계 설명'],
    };
    const view = renderResult(current, { request: { ...request, foodPreferences: ['초밥'] } });
    expect(view.getByText('서버가 확인한 근거')).toBeTruthy();
    expect(view.getByText('서버 추천 설명')).toBeTruthy();
    expect(view.getByText('서버가 제공한 한계 설명')).toBeTruthy();
    expect(view.queryByText(/오늘 고른 초밥 조건에 맞는 후보/)).toBeNull();
  });

  it('old results without evidence remain displayable without inferred reasons', () => {
    const view = renderResult(
      [{ kakaoPlaceId: 'old-result', placeName: '이전 저장 식당', category: '초밥' }],
      { request: { ...request, foodPreferences: ['초밥'] } },
    );
    expect(view.getByRole('heading', { name: '이전 저장 식당' })).toBeTruthy();
    expect(view.queryByText(/조건에 맞는 후보예요/)).toBeNull();
  });

  it('quota exhaustion blocks every new request while local comparison stays available', () => {
    mocks.exhausted = true;
    const view = renderResult(recommendations('quota'));
    const button = view.getByRole('button', { name: /새 후보 찾기/ });
    expect(button.hasAttribute('disabled')).toBe(true);
    fireEvent.click(button);
    fireEvent.click(view.getByRole('button', { name: /place 식당 2/ }));
    expect(view.getByRole('heading', { name: 'place 식당 2' })).toBeTruthy();
    expect(mocks.refresh).not.toHaveBeenCalled();
  });

  it('history preview is read-only and does not replace the active workspace or track actions', () => {
    writeRecommendationResult({
      recommendations: recommendations('active'),
      request,
      workspaceId: 'active-space',
    });
    const before = sessionStorage.getItem('pikone:recommendation-result');
    const view = renderResult(recommendations('preview'), { historyPreview: true });
    expect(view.getByText('지난 추천이에요')).toBeTruthy();
    expect(view.queryByRole('button', { name: /새 후보 찾기|여기로 정하기/ })).toBeNull();
    fireEvent.click(view.getByRole('button', { name: '지도·상세' }));
    expect(mocks.action).not.toHaveBeenCalled();
    expect(mocks.impression).not.toHaveBeenCalled();
    expect(mocks.save).not.toHaveBeenCalled();
    expect(mocks.refresh).not.toHaveBeenCalled();
    expect(sessionStorage.getItem('pikone:recommendation-result')).toBe(before);
  });

  it('same-route history navigation resets view state without overwriting active storage', async () => {
    const active = recommendations('navigation-active');
    mocks.history = [
      {
        recommendationRequestId: 'navigation-old',
        createdAt: new Date(0).toISOString(),
        recommendations: recommendations('navigation-old', 'old-card'),
        request,
      },
    ];
    const view = renderResult(active);
    fireEvent.click(view.getByText('조건을 바꿔 다시 찾기'));
    fireEvent.click(view.getByRole('button', { name: '최근 추천 보기' }));
    fireEvent.click(view.getByRole('button', { name: /old-card 식당 1/ }));
    await waitFor(() => expect(view.getByText('지난 추천이에요')).toBeTruthy());
    expect(view.getByRole('heading', { name: 'old-card 식당 1' })).toBeTruthy();
    expect(
      JSON.parse(sessionStorage.getItem('pikone:recommendation-result') ?? '{}').recommendations,
    ).toEqual(active);
  });

  it('failed refresh keeps accepted constraints and clears an excluded selection', async () => {
    mocks.refresh.mockImplementationOnce((_body, options) => options.onError());
    const view = renderResult(recommendations('failure-parent'));
    fireEvent.click(view.getByRole('button', { name: '여기로 정하기' }));
    fireEvent.click(view.getByRole('button', { name: '선택 내용 닫기' }));
    fireEvent.click(view.getByText('조건을 바꿔 다시 찾기'));
    fireEvent.click(view.getByRole('button', { name: '이 식당 제외 · 추천 1회' }));
    await waitFor(() => expect(view.getByText(/새 후보 요청에 실패했어요/)).toBeTruthy());
    expect(localStorage.getItem('pikone:selected-recommendation')).toBeNull();
    expect(sessionStorage.getItem('pikone:recommendation-trip')).toBeNull();
    expect(
      JSON.parse(sessionStorage.getItem('pikone:recommendation-result') ?? '{}').request
        .excludedPlaceIds,
    ).toEqual(['place-1']);
  });

  it('closer and expanded searches preserve exclusions and the current parent', async () => {
    const current = recommendations('radius-parent');
    current[0].distance = 900;
    mocks.refresh.mockImplementationOnce((_body, options) => options.onSuccess([]));
    const view = renderResult(current, {
      request: {
        ...request,
        radiusMeters: 1400,
        excludedCategoryFamilies: ['MEAT'],
        excludedPlaceIds: ['older-exclusion'],
      },
    });
    fireEvent.click(view.getByText('조건을 바꿔 다시 찾기'));
    fireEvent.click(view.getByRole('button', { name: '너무 멀어요 · 더 가까이 찾기' }));
    await waitFor(() => expect(mocks.refresh).toHaveBeenCalledTimes(1));
    expect(mocks.refresh.mock.calls[0][0]).toMatchObject({
      radiusMeters: 899,
      priority: 'NEARBY',
      timeBudget: 'SHORT',
    });
    await waitFor(() =>
      expect(view.getByRole('button', { name: '범위를 넓혀 찾기' })).toBeTruthy(),
    );
    fireEvent.click(view.getByRole('button', { name: '범위를 넓혀 찾기' }));
    await waitFor(() => expect(mocks.refresh).toHaveBeenCalledTimes(2));
    expect(mocks.refresh.mock.calls[1][0]).toMatchObject({
      radiusMeters: 1599,
      parentRecommendationRequestId: 'radius-parent',
      excludedCategoryFamilies: ['MEAT'],
      excludedPlaceIds: ['older-exclusion'],
      seenPlaceIds: ['place-1', 'place-2', 'place-3'],
    });
  });
});
