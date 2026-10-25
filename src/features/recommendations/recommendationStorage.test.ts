// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearSelectedRecommendation,
  readSelectedRecommendation,
  readRecentRecommendationDestinations,
  readRecommendationResult,
  readRecommendationDraft,
  readRecommendationTrip,
  writeRecentRecommendationDestinations,
  writeRecommendationResult,
  writeRecommendationDraft,
  writeRecommendationTrip,
  writeSelectedRecommendation,
} from './recommendationStorage';

const request = { latitude: 37.5, longitude: 127, priority: 'BALANCED' as const };

it('같은 비교의 새 결과에도 갱신 시간을 기록해 오래된 라우트보다 최신 결과를 복원한다', () => {
  const oldTime = new Date(Date.now() - 60000).toISOString();
  writeRecommendationResult({
    recommendations: [{ kakaoPlaceId: 'old', placeName: '이전' }],
    request,
    workspaceId: 'same',
    updatedAt: oldTime,
  });
  writeRecommendationResult({
    recommendations: [{ kakaoPlaceId: 'new', placeName: '새 후보' }],
    request,
    workspaceId: 'same',
  });
  expect(Date.parse(readRecommendationResult().updatedAt!)).toBeGreaterThan(Date.parse(oldTime));
});

it('전날 메뉴 초안을 오늘 먹고 싶은 메뉴로 자동 복원하지 않는다', () => {
  sessionStorage.setItem(
    'pikone:recommendation-draft',
    JSON.stringify({
      foodPreferences: ['삼겹살'],
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    }),
  );
  expect(readRecommendationDraft()).toEqual({});
});
const recommendation = { kakaoPlaceId: '123', placeName: '정우 식당' };
const trackedRecommendation = {
  ...recommendation,
  recommendationRequestId: 'request-1',
  candidateSnapshotId: 101,
};
const destination = {
  locationId: 'place-1',
  placeName: '서울역',
  latitude: 37.55,
  longitude: 126.97,
};

describe('recommendation browser storage contract', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('기존 storage key와 payload를 유지한다', () => {
    writeRecommendationResult({ recommendations: [recommendation], request });
    writeRecentRecommendationDestinations([destination]);

    expect(JSON.parse(sessionStorage.getItem('pikone:recommendation-result') ?? '')).toEqual(
      expect.objectContaining({ recommendations: [recommendation], request }),
    );
    expect(
      JSON.parse(localStorage.getItem('pikone:recent-recommendation-destinations') ?? ''),
    ).toEqual([destination]);
    expect(readRecommendationResult()).toEqual(
      expect.objectContaining({
        recommendations: [recommendation],
        request,
        updatedAt: expect.any(String),
      }),
    );
    expect(readRecentRecommendationDestinations()).toEqual([destination]);
  });

  it('tracking field와 parent request를 sessionStorage에서 그대로 복원한다', () => {
    const rerecommendRequest = { ...request, parentRecommendationRequestId: 'parent-request' };

    writeRecommendationResult({
      recommendations: [trackedRecommendation],
      request: rerecommendRequest,
    });

    expect(readRecommendationResult()).toEqual(
      expect.objectContaining({
        recommendations: [trackedRecommendation],
        request: rerecommendRequest,
      }),
    );
  });

  it('best-effort tracking field의 null contract도 추천 결과로 보존한다', () => {
    const legacyRecommendation = {
      ...recommendation,
      recommendationRequestId: null,
      candidateSnapshotId: null,
    };

    writeRecommendationResult({ recommendations: [legacyRecommendation], request });

    expect(readRecommendationResult()).toEqual(
      expect.objectContaining({ recommendations: [legacyRecommendation], request }),
    );
  });

  it('workspace metadata와 입력 초안을 별도로 복원한다', () => {
    writeRecommendationResult({
      recommendations: [trackedRecommendation],
      request,
      workspaceId: 'workspace-1',
      rootRequestId: 'request-1',
    });
    writeRecommendationDraft({
      naturalContext: '퇴근 후 친구와 조용한 곳',
      selectedLocationKey: 'destination',
      selectedDestination: destination,
      companionId: null,
      foodPreferences: ['한식'],
      occasion: 'FRIEND',
      mobility: 'WALK',
      discoveryIntent: 'BALANCED',
      timeBudget: 'NORMAL',
      budgetPreference: 'NORMAL',
      radiusMeters: 1400,
    });

    expect(readRecommendationResult()).toEqual(
      expect.objectContaining({ workspaceId: 'workspace-1', rootRequestId: 'request-1' }),
    );
    expect(readRecommendationDraft()).toEqual(
      expect.objectContaining({
        naturalContext: '퇴근 후 친구와 조용한 곳',
        selectedDestination: destination,
      }),
    );
  });

  it('손상된 저장 값은 화면 데이터로 사용하지 않는다', () => {
    sessionStorage.setItem('pikone:recommendation-result', '{broken');
    localStorage.setItem(
      'pikone:recent-recommendation-destinations',
      JSON.stringify([{ locationId: 1 }]),
    );

    expect(readRecommendationResult()).toEqual({});
    expect(readRecentRecommendationDestinations()).toEqual([]);
  });

  it('저장소가 차단되어도 추천 흐름을 중단하지 않는다', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked');
    });

    expect(() =>
      writeRecommendationResult({ recommendations: [recommendation], request }),
    ).not.toThrow();
    expect(() => writeRecentRecommendationDestinations([destination])).not.toThrow();
  });

  it('최근 명시적 선택의 최소 attribution context를 저장하고 읽는다', () => {
    const context = {
      recommendationRequestId: 'request-1',
      candidateSnapshotId: 101,
      kakaoPlaceId: 'place-1',
      selectedAt: new Date('2026-09-07T00:00:00.000Z').toISOString(),
    };

    writeSelectedRecommendation(context);

    expect(readSelectedRecommendation(new Date('2026-09-07T23:59:59.000Z').getTime())).toEqual(
      context,
    );
  });

  it('24시간을 지난 context와 손상된 context를 사용하지 않고 제거한다', () => {
    writeSelectedRecommendation({
      recommendationRequestId: 'request-1',
      candidateSnapshotId: 101,
      kakaoPlaceId: 'place-1',
      selectedAt: new Date('2026-09-05T00:00:00.000Z').toISOString(),
    });

    expect(
      readSelectedRecommendation(new Date('2026-09-07T00:00:01.000Z').getTime()),
    ).toBeUndefined();
    expect(localStorage.getItem('pikone:selected-recommendation')).toBeNull();

    localStorage.setItem('pikone:selected-recommendation', '{broken');
    expect(readSelectedRecommendation()).toBeUndefined();
    expect(localStorage.getItem('pikone:selected-recommendation')).toBeNull();
  });

  it('여기로 갈래요 이후 이동 화면용 snapshot을 sessionStorage에서 복원한다', () => {
    const trip = {
      recommendation: {
        ...trackedRecommendation,
        latitude: 37.51,
        longitude: 127.01,
        menus: [{ name: '파스타', priceWon: 17000 }],
      },
      request: { ...request, mobility: 'CAR' as const },
      selectedAt: new Date('2026-09-07T01:00:00.000Z').toISOString(),
    };

    writeRecommendationTrip(trip);

    expect(readRecommendationTrip()).toEqual(trip);
  });

  it('명시적으로 attribution context만 정리한다', () => {
    localStorage.setItem('unrelated', 'keep');
    writeSelectedRecommendation({
      recommendationRequestId: 'request-1',
      candidateSnapshotId: 101,
      kakaoPlaceId: 'place-1',
      selectedAt: new Date().toISOString(),
    });

    clearSelectedRecommendation();

    expect(localStorage.getItem('pikone:selected-recommendation')).toBeNull();
    expect(localStorage.getItem('unrelated')).toBe('keep');
  });
});

it.each([
  { excludedCategoryFamilies: 'MEAT' },
  { seenPlaceIds: [3] },
  { strictFoodPreferences: 'false' },
  { strictCompanionFoodPreferences: 1 },
])('rejects malformed restored request constraints %j', (invalid) => {
  sessionStorage.setItem(
    'pikone:recommendation-result',
    JSON.stringify({ recommendations: [recommendation], request: { ...request, ...invalid } }),
  );
  expect(readRecommendationResult()).toEqual({});
});

it.each([{ categoryFamily: 1 }, { contextNotes: 'not a list' }, { effectiveContext: [false] }])(
  'does not restore malformed server evidence %j',
  (invalid) => {
    sessionStorage.setItem(
      'pikone:recommendation-result',
      JSON.stringify({ recommendations: [{ ...recommendation, ...invalid }], request }),
    );
    expect(readRecommendationResult().recommendations).toEqual([]);
  },
);

it('round-trips accepted strict/exclusion/evidence fields and excludes route-only preview state', () => {
  const fullRequest = {
    ...request,
    excludedCategoryFamilies: ['MEAT'],
    seenPlaceIds: ['old'],
    strictFoodPreferences: true,
    strictCompanionFoodPreferences: false,
  };
  const fullResult = {
    ...recommendation,
    categoryFamily: 'SUSHI_RAW',
    contextNotes: ['server note'],
    reasonTags: ['server reason'],
  };
  writeRecommendationResult({
    recommendations: [fullResult],
    request: fullRequest,
    historyPreview: true,
    persistWorkspace: true,
    activeResultSnapshot: { request },
    workspaceId: 'retained',
  });
  expect(readRecommendationResult()).toMatchObject({
    request: fullRequest,
    recommendations: [fullResult],
    workspaceId: 'retained',
  });
  const saved = JSON.parse(sessionStorage.getItem('pikone:recommendation-result') ?? '{}');
  expect(saved).not.toHaveProperty('historyPreview');
  expect(saved).not.toHaveProperty('persistWorkspace');
  expect(saved).not.toHaveProperty('activeResultSnapshot');
});

it.each([
  { foodPreferences: [1] },
  { strictFoodPreferences: 'yes' },
  { explorationRequest: { latitude: 1 } },
  { selectedDestination: {} },
])('rejects malformed same-day draft values %j', (invalid) => {
  sessionStorage.setItem(
    'pikone:recommendation-draft',
    JSON.stringify({ updatedAt: new Date().toISOString(), ...invalid }),
  );
  expect(readRecommendationDraft()).toEqual({});
});
