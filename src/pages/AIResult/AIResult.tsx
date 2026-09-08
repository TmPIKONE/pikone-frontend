import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Footprints, MapPin, RefreshCw, Utensils } from 'lucide-react';
import {
  useRecommendationAction,
  useRecommendationImpressions,
  useRecommendations,
  useRecommendationUsage,
} from '~/features/recommendations/recommendation.queries';
import {
  readRecommendationResult,
  readSelectedRecommendation,
  clearSelectedRecommendation,
  writeSelectedRecommendation,
  writeRecommendationResult,
  type RecommendationResultState,
} from '~/features/recommendations/recommendationStorage';
import {
  createClientEventId,
  beginRecommendationImpression,
  getRenderedImpressionCandidates,
  getTrackableCandidateId,
  resolveRecommendationRequestId,
} from '~/features/recommendations/recommendationTracking';
import type {
  RecommendationActionType,
  RecommendationRequest,
  RecommendationResponse,
} from '~/apis/recommendation/recommendation.types';
import { buildRestaurantMapUrl } from '~/features/records/restaurantMap';
import * as S from './AIResult.styles';

const MAX_EXCLUDED_PLACE_IDS = 100;

const normalizePlaceIds = (...groups: Array<Array<string | undefined> | undefined>) => {
  const ids = groups
    .flatMap((group) => group ?? [])
    .map((placeId) => placeId?.trim())
    .filter((placeId): placeId is string => Boolean(placeId));

  return Array.from(new Set(ids)).slice(-MAX_EXCLUDED_PLACE_IDS);
};

const createRerecommendRequest = (
  request: RecommendationRequest,
  excludedPlaceIds: string[],
  parentRecommendationRequestId: string | undefined,
) => {
  const nextRequest: RecommendationRequest = { ...request, excludedPlaceIds };
  if (parentRecommendationRequestId) {
    nextRequest.parentRecommendationRequestId = parentRecommendationRequestId;
  } else {
    delete nextRequest.parentRecommendationRequestId;
  }
  return nextRequest;
};

const getFallbackCategoryLabel = (category?: string) => {
  if (!category) return undefined;
  const parts = category
    .split('>')
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1].replace(/,/g, ' · ') : undefined;
};

const formatDistance = (item: RecommendationResponse) => {
  if (item.walkingMinutes != null) return `도보 ${item.walkingMinutes}분`;
  if (item.distance == null) return undefined;
  return item.distance < 1000
    ? `${Math.round(item.distance)}m`
    : `${(item.distance / 1000).toFixed(1)}km`;
};

const getPickLabel = (item: RecommendationResponse, index: number) => {
  if (index === 0) return '오늘 1순위';
  if (item.recommendType === 'NEW_PLACE') return '새로운 선택';
  if (item.recommendType === 'COMPANION_TASTE') return '함께 취향';
  return '취향 선택';
};

const AIResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state as RecommendationResultState | null) ?? {};
  const storedState = useMemo(() => readRecommendationResult(), []);
  const initialState = routeState.recommendations ? routeState : storedState;

  const [recommendations, setRecommendations] = useState<RecommendationResponse[]>(
    initialState.recommendations ?? [],
  );
  const [request, setRequest] = useState<RecommendationRequest | undefined>(initialState.request);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const selectedPlaceIdRef = useRef<string | null>(null);
  const { mutate: refreshRecommendations, isPending } = useRecommendations();
  const recommendationRequestId = resolveRecommendationRequestId(recommendations);
  const { mutate: recordImpressions } = useRecommendationImpressions();
  const { mutate: recordAction } = useRecommendationAction();
  const recommendationUsage = useRecommendationUsage();
  const usage = recommendationUsage.data;
  const isQuotaExhausted = usage?.exhausted ?? false;

  useEffect(() => {
    if (recommendations.length === 0 || !request) return;
    writeRecommendationResult({ recommendations, request });
  }, [recommendations, request]);

  useEffect(() => {
    if (!recommendationRequestId) return;

    const candidates = getRenderedImpressionCandidates(recommendations, recommendationRequestId);
    if (candidates.length === 0) return;
    const dedupeKey = beginRecommendationImpression(recommendationRequestId, candidates);
    if (!dedupeKey) return;

    recordImpressions({
      requestId: recommendationRequestId,
      body: { candidates },
      dedupeKey,
    });
  }, [recommendationRequestId, recommendations, recordImpressions]);

  const trackCandidateAction = (
    recommendation: RecommendationResponse,
    actionType: Exclude<RecommendationActionType, 'RERECOMMEND'>,
  ) => {
    const candidateSnapshotId = getTrackableCandidateId(recommendation, recommendationRequestId);
    if (!recommendationRequestId || candidateSnapshotId == null) return;

    recordAction({
      requestId: recommendationRequestId,
      body: {
        candidateSnapshotId,
        actionType,
        clientEventId: createClientEventId(),
      },
    });
  };

  const trackRerecommend = () => {
    if (!recommendationRequestId) return;
    recordAction({
      requestId: recommendationRequestId,
      body: { actionType: 'RERECOMMEND', clientEventId: createClientEventId() },
    });
  };

  const resetVisibleSelection = () => {
    selectedPlaceIdRef.current = null;
    setSelectedPlaceId(null);
  };

  const clearSelectionForCandidate = (recommendation: RecommendationResponse) => {
    const candidateSnapshotId = getTrackableCandidateId(recommendation, recommendationRequestId);
    const placeId = recommendation.kakaoPlaceId?.trim();
    const selectedRecommendation = readSelectedRecommendation();
    const isSelectedCandidate =
      selectedRecommendation != null &&
      selectedRecommendation.recommendationRequestId === recommendationRequestId &&
      selectedRecommendation.candidateSnapshotId === candidateSnapshotId &&
      selectedRecommendation.kakaoPlaceId === placeId;

    if (selectedPlaceIdRef.current === placeId) resetVisibleSelection();
    if (isSelectedCandidate) clearSelectedRecommendation();
  };

  const clearSelectionForNewSession = () => {
    resetVisibleSelection();
    clearSelectedRecommendation();
  };

  const selectRecommendation = (recommendation: RecommendationResponse) => {
    const placeId = recommendation.kakaoPlaceId?.trim();
    if (!placeId || selectedPlaceIdRef.current === placeId) return;

    selectedPlaceIdRef.current = placeId;
    setSelectedPlaceId(placeId);
    clearSelectedRecommendation();

    const candidateSnapshotId = getTrackableCandidateId(recommendation, recommendationRequestId);
    if (!recommendationRequestId || candidateSnapshotId == null) return;

    writeSelectedRecommendation({
      recommendationRequestId,
      candidateSnapshotId,
      kakaoPlaceId: placeId,
      selectedAt: new Date().toISOString(),
    });
    recordAction({
      requestId: recommendationRequestId,
      body: {
        candidateSnapshotId,
        actionType: 'SELECT',
        clientEventId: createClientEventId(),
      },
    });
  };

  const replaceOneRecommendation = (target: RecommendationResponse) => {
    if (isQuotaExhausted) {
      setFeedbackMessage('오늘 추천 3회를 모두 사용했어요. 지도 보기는 계속 이용할 수 있어요.');
      return;
    }
    const targetPlaceId = target.kakaoPlaceId?.trim();
    if (!request || !targetPlaceId) {
      setFeedbackMessage('이 식당의 장소 정보가 없어 새 후보로 바꿀 수 없어요.');
      return;
    }

    setFeedbackMessage(null);
    trackCandidateAction(target, 'EXCLUDE');
    trackRerecommend();
    clearSelectionForCandidate(target);

    // 사용자가 실제로 거절한 식당만 다음 화면 상태에 누적한다.
    const rejectedPlaceIds = normalizePlaceIds(request.excludedPlaceIds, [targetPlaceId]);

    // 응답 전체를 새 session의 snapshot으로 갱신해야 이후 interaction이
    // 이전 session ID와 섞이지 않는다. 제외 대상은 사용자가 거절한 식당만 유지한다.
    const nextRequest = createRerecommendRequest(
      request,
      rejectedPlaceIds,
      recommendationRequestId,
    );

    refreshRecommendations(nextRequest, {
      onSuccess: (nextRecommendations) => {
        if (nextRecommendations.length === 0) {
          setFeedbackMessage('조건 안에서 바꿀 새 식당을 찾지 못했어요. 이동 범위를 넓혀보세요.');
          return;
        }

        setRecommendations(nextRecommendations);
        setRequest(nextRequest);
        clearSelectionForNewSession();
        setFeedbackMessage(`${target.placeName}을 빼고 새 후보를 골랐어요.`);
      },
      onError: () => {
        setFeedbackMessage('새 식당을 불러오지 못했어요. 잠시 후 다시 눌러주세요.');
      },
    });
  };

  const replaceAllRecommendations = () => {
    if (isQuotaExhausted) {
      setFeedbackMessage('오늘 추천 3회를 모두 사용했어요. 내일 다시 골라드릴게요.');
      return;
    }

    if (!request) {
      navigate('/ai');
      return;
    }

    setFeedbackMessage(null);
    recommendations.forEach((recommendation) => trackCandidateAction(recommendation, 'EXCLUDE'));
    trackRerecommend();
    resetVisibleSelection();
    clearSelectedRecommendation();
    const visiblePlaceIds = recommendations.map((item) => item.kakaoPlaceId);
    const excludedPlaceIds = normalizePlaceIds(request.excludedPlaceIds, visiblePlaceIds);
    const nextRequest = createRerecommendRequest(
      request,
      excludedPlaceIds,
      recommendationRequestId,
    );

    refreshRecommendations(nextRequest, {
      onSuccess: (nextRecommendations) => {
        if (nextRecommendations.length === 0) {
          setFeedbackMessage('조건 안에서 더 찾을 식당이 없어요. 이동 범위를 넓혀보세요.');
          return;
        }

        setRecommendations(nextRecommendations);
        setRequest(nextRequest);
        clearSelectionForNewSession();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onError: () => {
        setFeedbackMessage('새 추천을 불러오지 못했어요. 잠시 후 다시 눌러주세요.');
      },
    });
  };

  if (!initialState.recommendations && recommendations.length === 0) {
    return (
      <S.Container>
        <S.EmptyState>
          <S.EmptyTitle>추천 결과가 없어요</S.EmptyTitle>
          <S.EmptyDescription>조건을 다시 고르면 바로 추천해드릴게요.</S.EmptyDescription>
          <S.RetryButton onClick={() => navigate('/ai')}>다시 추천받기</S.RetryButton>
        </S.EmptyState>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.HeaderRow>
        <S.BackButton onClick={() => navigate('/ai')} aria-label="뒤로 가기">
          <ArrowLeft size={20} />
        </S.BackButton>
        <S.HeaderText>
          <S.Title>딱 3곳만 골랐어요</S.Title>
        </S.HeaderText>
      </S.HeaderRow>

      {usage && (
        <S.UsageStrip $exhausted={isQuotaExhausted}>
          <S.UsageStripText $exhausted={isQuotaExhausted}>
            <span>오늘 추천</span>
            <strong>{isQuotaExhausted ? '3회 모두 사용' : `${usage.remainingCount}번 남음`}</strong>
          </S.UsageStripText>
          <S.UsageStripCount $exhausted={isQuotaExhausted}>
            {usage.usedCount}/{usage.dailyLimit}
          </S.UsageStripCount>
        </S.UsageStrip>
      )}

      {isPending && (
        <S.RefreshStatus>
          <RefreshCw size={14} />
          선택한 자리의 새 식당을 찾는 중이에요
        </S.RefreshStatus>
      )}

      {!isPending && feedbackMessage && (
        <S.RefreshStatus role="status">{feedbackMessage}</S.RefreshStatus>
      )}

      {recommendations.length > 0 ? (
        <S.ResultList aria-busy={isPending}>
          {recommendations.map((item, index) => {
            const isTopPick = index === 0;
            const distanceLabel = formatDistance(item);
            const categoryLabel = item.categoryLabel ?? getFallbackCategoryLabel(item.category);
            const menuKeywords =
              item.menuKeywords && item.menuKeywords.length > 0
                ? item.menuKeywords
                : categoryLabel
                  ? [categoryLabel]
                  : [];
            const summary =
              item.oneLineSummary ??
              item.recommendationReason ??
              (categoryLabel ? `${categoryLabel} 중심으로 고른 곳` : '오늘 조건에 맞는 선택');

            return (
              <S.ResultCard
                key={item.kakaoPlaceId}
                $isTopPick={isTopPick}
                $isSelected={selectedPlaceId === item.kakaoPlaceId?.trim()}
              >
                <S.CardTopRow>
                  <S.PickLabel $isTopPick={isTopPick}>{getPickLabel(item, index)}</S.PickLabel>
                  {distanceLabel && (
                    <S.DistanceTag>
                      <Footprints size={12} />
                      {distanceLabel}
                    </S.DistanceTag>
                  )}
                </S.CardTopRow>

                <S.PlaceName>{item.placeName}</S.PlaceName>

                {menuKeywords.length > 0 && (
                  <S.MenuSection>
                    <S.MenuLabel>
                      <Utensils size={13} />
                      대표 음식
                    </S.MenuLabel>
                    <S.MenuKeywordRow>
                      {menuKeywords.slice(0, 3).map((keyword) => (
                        <S.MenuKeyword key={keyword}>{keyword}</S.MenuKeyword>
                      ))}
                    </S.MenuKeywordRow>
                  </S.MenuSection>
                )}

                <S.OneLineSummary>{summary}</S.OneLineSummary>

                {item.address && (
                  <S.Address>
                    <MapPin size={12} />
                    {item.address}
                  </S.Address>
                )}

                <S.ActionRow>
                  <S.SkipButton
                    type="button"
                    disabled={
                      isPending || isQuotaExhausted || !request || !item.kakaoPlaceId?.trim()
                    }
                    onClick={() => replaceOneRecommendation(item)}
                  >
                    {isQuotaExhausted ? '오늘 재추천 끝' : '이건 빼고 다시'}
                  </S.SkipButton>
                  <S.MapButton
                    type="button"
                    onClick={() => {
                      const mapUrl = buildRestaurantMapUrl({
                        mapUrl: item.mapUrl,
                        kakaoPlaceId: item.kakaoPlaceId,
                        placeName: item.placeName,
                        address: item.address,
                      });
                      window.open(mapUrl, '_blank', 'noopener,noreferrer');
                      trackCandidateAction(item, 'PLACE_OPEN');
                    }}
                  >
                    메뉴·지도 보기
                  </S.MapButton>
                  <S.SelectButton
                    type="button"
                    $selected={selectedPlaceId === item.kakaoPlaceId?.trim()}
                    aria-pressed={selectedPlaceId === item.kakaoPlaceId?.trim()}
                    onClick={() => selectRecommendation(item)}
                  >
                    {selectedPlaceId === item.kakaoPlaceId?.trim()
                      ? '이곳으로 선택했어요'
                      : '여기로 갈래요'}
                  </S.SelectButton>
                </S.ActionRow>
              </S.ResultCard>
            );
          })}
        </S.ResultList>
      ) : (
        <S.EmptyState>
          <S.EmptyTitle>새 후보를 찾지 못했어요</S.EmptyTitle>
          <S.EmptyDescription>이동 범위나 메뉴 조건을 조금 넓혀보세요.</S.EmptyDescription>
          <S.RetryButton type="button" onClick={() => navigate('/ai')}>
            조건 바꾸기
          </S.RetryButton>
        </S.EmptyState>
      )}

      {recommendations.length > 0 && (
        <S.RetryButton
          type="button"
          disabled={isPending || isQuotaExhausted || !request}
          onClick={replaceAllRecommendations}
        >
          <RefreshCw size={14} />
          {isQuotaExhausted ? '오늘 추천 3회 사용 완료' : '세 곳 다 별로예요'}
        </S.RetryButton>
      )}
    </S.Container>
  );
};

export default AIResult;
