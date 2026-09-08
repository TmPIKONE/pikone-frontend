// @vitest-environment jsdom

import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type {
  RecommendationActionRequest,
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
  action: vi.fn<(requestId: string, payload: RecommendationActionRequest) => void>(),
}));

vi.mock('~/features/recommendations/recommendation.queries', () => ({
  useRecommendations: () => ({ mutate: mocks.refresh, isPending: false }),
  useRecommendationUsage: () => ({
    data: {
      dailyLimit: 3,
      usedCount: 1,
      remainingCount: 2,
      exhausted: false,
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
  }),
}));

const request: RecommendationRequest = {
  latitude: 37.5,
  longitude: 127,
  priority: 'BALANCED',
};

const recommendations = (requestId: string, prefix = 'place'): RecommendationResponse[] =>
  [1, 2, 3].map((number) => ({
    recommendationRequestId: requestId,
    candidateSnapshotId: number * 10 + (requestId === 'session-b' ? 100 : 0),
    kakaoPlaceId: `${prefix}-${number}`,
    placeName: `${prefix} 식당 ${number}`,
    mapUrl: `https://place.map.kakao.com/${prefix}-${number}`,
  }));

const renderResult = (
  resultRecommendations: RecommendationResponse[],
  options: { strict?: boolean; routeState?: boolean } = {},
) => {
  const route =
    options.routeState === false
      ? { pathname: '/ai/result' }
      : { pathname: '/ai/result', state: { recommendations: resultRecommendations, request } };
  const tree = (
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/ai/result" element={<AIResult />} />
        <Route path="/ai" element={<div>추천 조건 화면</div>} />
      </Routes>
    </MemoryRouter>
  );

  return render(options.strict ? <StrictMode>{tree}</StrictMode> : tree);
};

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  vi.clearAllMocks();
  mocks.impression.mockImplementation((_requestId, _payload, dedupeKey) =>
    completeRecommendationImpression(dedupeKey),
  );
  vi.spyOn(window, 'open').mockImplementation(() => null);
  Object.defineProperty(window, 'scrollTo', { configurable: true, value: vi.fn() });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('AIResult recommendation behavior tracking', () => {
  it('StrictMode 실제 render 뒤 Top-3 impression을 UI 순서로 한 번만 기록한다', async () => {
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

    view.rerender(
      <MemoryRouter
        initialEntries={[{ pathname: '/ai/result', state: { recommendations: current, request } }]}
      >
        <Routes>
          <Route path="/ai/result" element={<AIResult />} />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => expect(mocks.impression).toHaveBeenCalledOnce());
  });

  it('지도는 동기적으로 열고 PLACE_OPEN만 별도 action으로 기록한다', async () => {
    const current = recommendations('map-session');
    const view = renderResult(current);
    await waitFor(() => expect(mocks.impression).toHaveBeenCalled());

    fireEvent.click(view.getAllByRole('button', { name: '메뉴·지도 보기' })[0]);

    expect(window.open).toHaveBeenCalledWith(
      'https://place.map.kakao.com/place-1',
      '_blank',
      'noopener,noreferrer',
    );
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

  it('legacy candidate는 tracking 없이도 지도와 명시적 선택 UI가 동작한다', () => {
    const current = [{ kakaoPlaceId: 'legacy', placeName: 'legacy 식당' }];
    const view = renderResult(current);

    fireEvent.click(view.getByRole('button', { name: '메뉴·지도 보기' }));
    fireEvent.click(view.getByRole('button', { name: '여기로 갈래요' }));

    expect(window.open).toHaveBeenCalledOnce();
    expect(
      view.getByRole('button', { name: '이곳으로 선택했어요' }).getAttribute('aria-pressed'),
    ).toBe('true');
    expect(mocks.action).not.toHaveBeenCalled();
    expect(localStorage.getItem('pikone:selected-recommendation')).toBeNull();
  });

  it('단일 제외와 RERECOMMEND 후 parent와 새 session tracking으로 갱신한다', async () => {
    const current = recommendations('session-a');
    const next = recommendations('session-b', 'new-place');
    mocks.refresh.mockImplementation((_nextRequest, options) => options.onSuccess(next));
    const view = renderResult(current);
    await waitFor(() =>
      expect(mocks.impression).toHaveBeenCalledWith(
        'session-a',
        expect.anything(),
        expect.any(String),
      ),
    );

    fireEvent.click(view.getAllByRole('button', { name: '이건 빼고 다시' })[0]);

    expect(mocks.action).toHaveBeenCalledWith(
      'session-a',
      expect.objectContaining({ candidateSnapshotId: 10, actionType: 'EXCLUDE' }),
    );
    expect(mocks.action).toHaveBeenCalledWith(
      'session-a',
      expect.objectContaining({ actionType: 'RERECOMMEND' }),
    );
    expect(mocks.refresh).toHaveBeenCalledWith(
      expect.objectContaining({
        excludedPlaceIds: ['place-1'],
        parentRecommendationRequestId: 'session-a',
      }),
      expect.any(Object),
    );
    await waitFor(() => expect(view.getByText('new-place 식당 1')).toBeTruthy());
    await waitFor(() =>
      expect(mocks.impression).toHaveBeenCalledWith(
        'session-b',
        expect.anything(),
        expect.any(String),
      ),
    );

    fireEvent.click(view.getAllByRole('button', { name: '메뉴·지도 보기' })[0]);
    expect(mocks.action).toHaveBeenCalledWith(
      'session-b',
      expect.objectContaining({ candidateSnapshotId: 110, actionType: 'PLACE_OPEN' }),
    );

    fireEvent.click(view.getByRole('button', { name: '세 곳 다 별로예요' }));
    expect(mocks.refresh.mock.calls[1]?.[0]).toMatchObject({
      parentRecommendationRequestId: 'session-b',
    });
  });

  it('단일 재추천은 backend response 순서와 impression position을 그대로 유지한다', async () => {
    const current = recommendations('preserve-session-a', 'preserve');
    const next: RecommendationResponse[] = [
      {
        ...current[1],
        recommendationRequestId: 'preserve-session-b',
        candidateSnapshotId: 120,
      },
      {
        ...current[2],
        recommendationRequestId: 'preserve-session-b',
        candidateSnapshotId: 130,
      },
      {
        recommendationRequestId: 'preserve-session-b',
        candidateSnapshotId: 140,
        kakaoPlaceId: 'replacement',
        placeName: '교체 식당',
      },
    ];
    mocks.refresh.mockImplementation((_nextRequest, options) => options.onSuccess(next));
    const view = renderResult(current);

    fireEvent.click(view.getAllByRole('button', { name: '이건 빼고 다시' })[0]);

    await waitFor(() => expect(view.getByText('교체 식당')).toBeTruthy());
    expect(view.queryByText('preserve 식당 1')).toBeNull();
    expect(
      view.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent),
    ).toEqual(['preserve 식당 2', 'preserve 식당 3', '교체 식당']);
    await waitFor(() =>
      expect(mocks.impression).toHaveBeenCalledWith(
        'preserve-session-b',
        {
          candidates: [
            { candidateSnapshotId: 120, position: 1 },
            { candidateSnapshotId: 130, position: 2 },
            { candidateSnapshotId: 140, position: 3 },
          ],
        },
        expect.any(String),
      ),
    );

    fireEvent.click(view.getAllByRole('button', { name: '메뉴·지도 보기' })[0]);
    expect(mocks.action).toHaveBeenCalledWith(
      'preserve-session-b',
      expect.objectContaining({ candidateSnapshotId: 120, actionType: 'PLACE_OPEN' }),
    );
  });

  it('전체 거절은 candidate별 EXCLUDE와 RERECOMMEND 하나를 보내고 UX를 기다리지 않는다', () => {
    const current = recommendations('all-session', 'all-place');
    const next = recommendations('next-all-session', 'fresh');
    mocks.refresh.mockImplementation((_nextRequest, options) => options.onSuccess(next));
    const view = renderResult(current);

    fireEvent.click(view.getAllByRole('button', { name: '여기로 갈래요' })[0]);
    expect(localStorage.getItem('pikone:selected-recommendation')).not.toBeNull();
    mocks.action.mockClear();

    fireEvent.click(view.getByRole('button', { name: '세 곳 다 별로예요' }));

    expect(localStorage.getItem('pikone:selected-recommendation')).toBeNull();
    const actions = mocks.action.mock.calls.map(([, payload]) => payload);
    expect(actions.filter((payload) => payload.actionType === 'EXCLUDE')).toHaveLength(3);
    expect(actions.filter((payload) => payload.actionType === 'RERECOMMEND')).toHaveLength(1);
    expect(new Set(actions.map((payload) => payload.clientEventId)).size).toBe(4);
    expect(mocks.refresh).toHaveBeenCalledWith(
      expect.objectContaining({
        excludedPlaceIds: ['all-place-1', 'all-place-2', 'all-place-3'],
        parentRecommendationRequestId: 'all-session',
      }),
      expect.any(Object),
    );
  });

  it('명시적 SELECT 상태를 표시하고 연타를 막으며 최신 context를 갱신한다', () => {
    const current = recommendations('select-session', 'select-place');
    const view = renderResult(current);
    const selectButtons = view.getAllByRole('button', { name: '여기로 갈래요' });

    fireEvent.click(selectButtons[0]);
    fireEvent.click(selectButtons[0]);

    expect(
      mocks.action.mock.calls.filter(([, payload]) => payload.actionType === 'SELECT'),
    ).toHaveLength(1);
    expect(
      view.getByRole('button', { name: '이곳으로 선택했어요' }).getAttribute('aria-pressed'),
    ).toBe('true');
    expect(JSON.parse(localStorage.getItem('pikone:selected-recommendation') ?? '')).toMatchObject({
      recommendationRequestId: 'select-session',
      candidateSnapshotId: 10,
      kakaoPlaceId: 'select-place-1',
    });

    fireEvent.click(view.getAllByRole('button', { name: '여기로 갈래요' })[0]);

    expect(
      mocks.action.mock.calls.filter(([, payload]) => payload.actionType === 'SELECT'),
    ).toHaveLength(2);
    expect(JSON.parse(localStorage.getItem('pikone:selected-recommendation') ?? '')).toMatchObject({
      candidateSnapshotId: 20,
      kakaoPlaceId: 'select-place-2',
    });
  });

  it('A 선택은 성공한 B session 전환에서 제거되고 B에서 다시 선택해야 저장된다', async () => {
    const current = recommendations('selection-session-a', 'selection');
    const next: RecommendationResponse[] = [
      { ...current[0], recommendationRequestId: 'selection-session-b', candidateSnapshotId: 110 },
      { ...current[2], recommendationRequestId: 'selection-session-b', candidateSnapshotId: 130 },
      {
        recommendationRequestId: 'selection-session-b',
        candidateSnapshotId: 140,
        kakaoPlaceId: 'selection-new',
        placeName: '새 선택지',
      },
    ];
    mocks.refresh.mockImplementation((_nextRequest, options) => options.onSuccess(next));
    const view = renderResult(current);

    fireEvent.click(view.getAllByRole('button', { name: '여기로 갈래요' })[0]);
    expect(JSON.parse(localStorage.getItem('pikone:selected-recommendation') ?? '')).toMatchObject({
      recommendationRequestId: 'selection-session-a',
      candidateSnapshotId: 10,
      kakaoPlaceId: 'selection-1',
    });

    fireEvent.click(view.getAllByRole('button', { name: '이건 빼고 다시' })[1]);
    await waitFor(() => expect(view.getByText('새 선택지')).toBeTruthy());

    expect(localStorage.getItem('pikone:selected-recommendation')).toBeNull();
    expect(view.getAllByRole('button', { name: '여기로 갈래요' })).toHaveLength(3);

    fireEvent.click(view.getAllByRole('button', { name: '여기로 갈래요' })[0]);
    expect(JSON.parse(localStorage.getItem('pikone:selected-recommendation') ?? '')).toMatchObject({
      recommendationRequestId: 'selection-session-b',
      candidateSnapshotId: 110,
      kakaoPlaceId: 'selection-1',
    });
  });

  it('선택 candidate EXCLUDE는 재추천 실패여도 무효화하고 다른 candidate 실패는 유지한다', () => {
    mocks.refresh.mockImplementation((_nextRequest, options) => options.onError());
    const current = recommendations('exclude-selection-session', 'exclude-selection');
    const firstView = renderResult(current);

    fireEvent.click(firstView.getAllByRole('button', { name: '여기로 갈래요' })[0]);
    fireEvent.click(firstView.getAllByRole('button', { name: '이건 빼고 다시' })[1]);
    expect(JSON.parse(localStorage.getItem('pikone:selected-recommendation') ?? '')).toMatchObject({
      kakaoPlaceId: 'exclude-selection-1',
    });

    fireEvent.click(firstView.getAllByRole('button', { name: '이건 빼고 다시' })[0]);
    expect(localStorage.getItem('pikone:selected-recommendation')).toBeNull();
  });

  it('sessionStorage hydration으로 tracking field가 포함된 결과 UI를 복원한다', async () => {
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

  it('이미 기록한 sessionStorage hydration impression은 다시 전송하지 않는다', async () => {
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
