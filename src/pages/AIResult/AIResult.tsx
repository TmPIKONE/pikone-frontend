import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ChevronDown, MapPin, RefreshCw } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BottomSheet } from '~/components/BottomSheet/BottomSheet';
import {
  useRecommendationAction,
  useRecommendationHistory,
  useRecommendationImpressions,
  useRecommendations,
  useRecommendationUsage,
  useRecommendationWorkspaces,
  useSaveRecommendationWorkspace,
} from '~/features/recommendations/recommendation.queries';
import {
  clearRecommendationTrip,
  clearSelectedRecommendation,
  readRecommendationDraft,
  readRecommendationResult,
  writeRecommendationDraft,
  writeRecommendationResult,
  writeRecommendationTrip,
  writeRecommendationWorkflow,
  writeSelectedRecommendation,
  type RecommendationResultState,
} from '~/features/recommendations/recommendationStorage';
import {
  beginRecommendationImpression,
  createClientEventId,
  getTrackableCandidateId,
  resolveRecommendationRequestId,
} from '~/features/recommendations/recommendationTracking';
import { openNaverPlaceWithFallback } from '~/features/recommendations/naverNavigation';
import {
  OCCASION_OPTIONS,
  type RecommendationActionType,
  type RecommendationRequest,
  type RecommendationResponse,
} from '~/apis/recommendation/recommendation.types';
import {
  categoryFamily,
  resultFamily,
  uniqueValues,
  withSeenCandidates,
} from '~/features/recommendations/recommendationContext';
import * as S from './AIResult.styles';

const MAX_EXCLUDED_PLACE_IDS = 500;

const getFallbackCategoryLabel = (category?: string) => {
  if (!category) return undefined;
  const parts = category
    .split('>')
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1].replace(/,/g, ' · ') : undefined;
};

const formatDistance = (item: RecommendationResponse) => {
  if (item.distance == null || item.distance < 0) return undefined;
  return item.distance < 1000
    ? `${Math.round(item.distance)}m`
    : `${(item.distance / 1000).toFixed(1)}km`;
};

const formatPrice = (price?: number | null) =>
  price == null || price <= 0 ? undefined : `${price.toLocaleString('ko-KR')}원`;

// Recommendation evidence belongs to the server; old stored results may have neither field.
const getGroundedReason = (item: RecommendationResponse) =>
  item.reasonTags?.find((tag) => tag.trim()) ?? item.recommendationReason?.trim();

const getImportantConditionNote = (item: RecommendationResponse) => {
  const notes = item.contextNotes ?? [];
  if (notes.some((note) => note.includes('식사비 자료가 없어'))) {
    return '입력한 가격 조건은 자료가 없어 반영하지 못했어요.';
  }
  if (notes.some((note) => note.includes('메뉴 제외·재료 조건'))) {
    return '입력한 재료·메뉴 제외 조건은 확인할 자료가 없어요.';
  }
  if (notes.some((note) => note.includes('상황 검색어와 연결된 결과가 아니라'))) {
    return '입력한 추가 조건과 맞는 근거는 확인하지 못했어요.';
  }
  return undefined;
};

const getDisplayMenus = (item: RecommendationResponse) =>
  item.menuInfoSource && item.menuInfoSource !== 'RESTAURANT_MENU'
    ? []
    : (item.menus ?? []).filter((menu) => menu.name?.trim());

const getMenuLine = (item: RecommendationResponse) => {
  const menu = getDisplayMenus(item)[0];
  if (!menu) return undefined;
  const price = formatPrice(menu.priceWon);
  return price ? `${menu.name} · ${price}` : menu.name;
};

const AIResultView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state as RecommendationResultState | null) ?? {};
  const storedState = useMemo(() => readRecommendationResult(), []);
  const routeUpdatedAt = routeState.updatedAt ? Date.parse(routeState.updatedAt) : 0;
  const storedUpdatedAt = storedState.updatedAt ? Date.parse(storedState.updatedAt) : 0;
  const initialState = routeState.historyPreview
    ? routeState
    : routeState.recommendations && routeUpdatedAt >= storedUpdatedAt
      ? routeState
      : storedState;
  const historyPreview = Boolean(routeState.historyPreview);

  const [recommendations, setRecommendations] = useState<RecommendationResponse[]>(
    initialState.recommendations ?? [],
  );
  const [request, setRequest] = useState<RecommendationRequest | undefined>(initialState.request);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [explorationExhausted, setExplorationExhausted] = useState(false);
  const retryInFlight = useRef(false);
  const [isPreparingRerecommend, setIsPreparingRerecommend] = useState(false);
  const [latestRecommendationRequestId, setLatestRecommendationRequestId] = useState<
    string | undefined
  >(
    () =>
      resolveRecommendationRequestId(initialState.recommendations ?? []) ??
      initialState.request?.parentRecommendationRequestId,
  );
  const [workspaceId] = useState<string | undefined>(() => initialState.workspaceId);
  const [rootRequestId] = useState<string | undefined>(
    () =>
      initialState.rootRequestId ??
      resolveRecommendationRequestId(initialState.recommendations ?? []),
  );
  const [workspaceSelection, setWorkspaceSelection] = useState<{
    candidateSnapshotId?: number;
    kakaoPlaceId?: string;
  } | null>(() =>
    initialState.selectedCandidateSnapshotId || initialState.selectedKakaoPlaceId
      ? {
          candidateSnapshotId: initialState.selectedCandidateSnapshotId,
          kakaoPlaceId: initialState.selectedKakaoPlaceId,
        }
      : null,
  );
  const [focusedPlaceId, setFocusedPlaceId] = useState<string | undefined>(
    () => initialState.selectedKakaoPlaceId ?? initialState.recommendations?.[0]?.kakaoPlaceId,
  );
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const [showHistory, setShowHistory] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [selectionPanelOpen, setSelectionPanelOpen] = useState(
    Boolean(!historyPreview && initialState.selectedKakaoPlaceId),
  );

  const seenImpressionsRef = useRef(new Set<string>());
  const initialWorkspaceSavedRef = useRef(false);

  const { mutate: refreshRecommendations, isPending } = useRecommendations();
  const { mutate: recordImpressions } = useRecommendationImpressions();
  const { mutate: recordAction, mutateAsync: recordActionAsync } = useRecommendationAction();
  const recommendationUsage = useRecommendationUsage();
  const recommendationHistory = useRecommendationHistory();
  const recommendationWorkspaces = useRecommendationWorkspaces();
  const saveWorkspace = useSaveRecommendationWorkspace(workspaceId);
  const usage = recommendationUsage.data;
  const isDevelopmentUnlimited = (usage?.dailyLimit ?? 0) >= 999;
  const isQuotaExhausted = !isDevelopmentUnlimited && (usage?.exhausted ?? false);
  const isRerecommending = isPending || isPreparingRerecommend;

  const focusedRecommendation =
    recommendations.find((item) => item.kakaoPlaceId === focusedPlaceId) ?? recommendations[0];
  const alternatives = focusedRecommendation
    ? recommendations.filter((item) => item.kakaoPlaceId !== focusedRecommendation.kakaoPlaceId)
    : [];
  const selectedRecommendation = recommendations.find(
    (item) => item.kakaoPlaceId === workspaceSelection?.kakaoPlaceId,
  );

  useEffect(() => {
    if (historyPreview || recommendations.length === 0 || !request) return;
    writeRecommendationResult({
      recommendations,
      request,
      workspaceId,
      rootRequestId,
      selectedCandidateSnapshotId: workspaceSelection?.candidateSnapshotId,
      selectedKakaoPlaceId: workspaceSelection?.kakaoPlaceId,
    });
  }, [historyPreview, recommendations, request, workspaceId, rootRequestId, workspaceSelection]);

  useEffect(() => {
    if (historyPreview || initialWorkspaceSavedRef.current || !routeState.persistWorkspace) return;
    if (!workspaceId || !rootRequestId || !request || recommendations.length === 0) return;
    initialWorkspaceSavedRef.current = true;
    saveWorkspace.mutate({
      rootRequestId,
      request,
      recommendations,
      selectedCandidateSnapshotId: workspaceSelection?.candidateSnapshotId,
      selectedKakaoPlaceId: workspaceSelection?.kakaoPlaceId,
      status: workspaceSelection ? 'SELECTED' : 'COMPARING',
    });
  }, [
    historyPreview,
    routeState.persistWorkspace,
    workspaceId,
    rootRequestId,
    request,
    recommendations,
    workspaceSelection,
    saveWorkspace,
  ]);

  useEffect(() => {
    if (historyPreview) return;
    const byRequest = new Map<string, { candidateSnapshotId: number; position: number }[]>();

    recommendations.slice(0, 3).forEach((recommendation, index) => {
      const requestId = recommendation.recommendationRequestId?.trim();
      const candidateSnapshotId = getTrackableCandidateId(recommendation, requestId);
      if (!requestId || candidateSnapshotId == null) return;

      const position = recommendation.responsePosition ?? index + 1;
      const impressionIdentity = `${requestId}:${candidateSnapshotId}@${position}`;
      if (seenImpressionsRef.current.has(impressionIdentity)) return;

      seenImpressionsRef.current.add(impressionIdentity);
      const candidates = byRequest.get(requestId) ?? [];
      candidates.push({ candidateSnapshotId, position });
      byRequest.set(requestId, candidates);
    });

    byRequest.forEach((candidates, requestId) => {
      const dedupeKey = beginRecommendationImpression(requestId, candidates);
      if (!dedupeKey) return;
      recordImpressions({ requestId, body: { candidates }, dedupeKey });
    });
  }, [historyPreview, recommendations, recordImpressions]);

  const trackCandidateAction = (
    recommendation: RecommendationResponse,
    actionType: Exclude<RecommendationActionType, 'RERECOMMEND'>,
  ) => {
    const requestId = recommendation.recommendationRequestId?.trim();
    const candidateSnapshotId = getTrackableCandidateId(recommendation, requestId);
    if (!requestId || candidateSnapshotId == null) return;
    recordAction({
      requestId,
      body: { candidateSnapshotId, actionType, clientEventId: createClientEventId() },
    });
  };

  const trackCandidateActionAsync = async (
    recommendation: RecommendationResponse,
    actionType: Exclude<RecommendationActionType, 'RERECOMMEND'>,
  ) => {
    const requestId = recommendation.recommendationRequestId?.trim();
    const candidateSnapshotId = getTrackableCandidateId(recommendation, requestId);
    if (!requestId || candidateSnapshotId == null) return;
    await recordActionAsync({
      requestId,
      body: { candidateSnapshotId, actionType, clientEventId: createClientEventId() },
    });
  };

  const trackRerecommendAsync = async (requestId?: string) => {
    if (!requestId) return;
    await recordActionAsync({
      requestId,
      body: { actionType: 'RERECOMMEND', clientEventId: createClientEventId() },
    });
  };

  const persistWorkspaceSelection = (
    nextSelection: { candidateSnapshotId?: number; kakaoPlaceId?: string } | null,
    nextRecommendations = recommendations,
    nextRequest = request,
  ) => {
    if (!workspaceId || !rootRequestId || !nextRequest || nextRecommendations.length === 0) return;
    saveWorkspace.mutate({
      rootRequestId,
      request: nextRequest,
      recommendations: nextRecommendations,
      selectedCandidateSnapshotId: nextSelection?.candidateSnapshotId,
      selectedKakaoPlaceId: nextSelection?.kakaoPlaceId,
      status: nextSelection ? 'SELECTED' : 'COMPARING',
    });
  };

  const persistEditableRequest = (
    sourceRequest: RecommendationRequest,
    parentId = latestRecommendationRequestId ?? sourceRequest.parentRecommendationRequestId,
  ) => {
    const draft = readRecommendationDraft();
    writeRecommendationDraft({
      naturalContext: sourceRequest.naturalContext ?? '',
      selectedLocationKey: draft.selectedLocationKey ?? 'destination',
      selectedDestination: draft.selectedDestination ?? {
        locationId: `request:${sourceRequest.latitude}:${sourceRequest.longitude}`,
        placeName: sourceRequest.locationLabel ?? '이전 추천 위치',
        latitude: sourceRequest.latitude,
        longitude: sourceRequest.longitude,
      },
      companionId: sourceRequest.companionId ?? null,
      foodPreferences: sourceRequest.foodPreferences ?? [],
      companionFoodPreferences: sourceRequest.companionFoodPreferences ?? [],
      occasion: sourceRequest.occasion ?? 'NORMAL',
      mobility: sourceRequest.mobility ?? 'WALK',
      discoveryIntent: sourceRequest.discoveryIntent ?? 'BALANCED',
      timeBudget: sourceRequest.timeBudget ?? 'NORMAL',
      budgetPreference: sourceRequest.budgetPreference ?? 'NORMAL',
      radiusMeters: sourceRequest.radiusMeters ?? 1400,
      nearbyFirst: sourceRequest.priority === 'NEARBY',
      touchedFields: draft.touchedFields,
      strictFoodPreferences: sourceRequest.strictFoodPreferences,
      strictCompanionFoodPreferences: sourceRequest.strictCompanionFoodPreferences,
      explorationRequest: withSeenCandidates(
        { ...sourceRequest, parentRecommendationRequestId: parentId },
        recommendations,
      ),
      contextSearchTerms: sourceRequest.contextSearchTerms,
      parsedFields: Object.keys(sourceRequest.contextSources ?? {}).filter(
        (key) => sourceRequest.contextSources?.[key] === 'TEXT',
      ),
    });
  };

  const editConditions = () => {
    if (historyPreview) {
      navigate('/ai');
      return;
    }

    if (request) persistEditableRequest(request);
    writeRecommendationWorkflow('EDITING');
    navigate('/ai');
  };

  const selectRecommendation = (recommendation: RecommendationResponse) => {
    if (!request) return;
    const placeId = recommendation.kakaoPlaceId?.trim();
    if (!placeId) return;

    const requestId = recommendation.recommendationRequestId?.trim();
    const candidateSnapshotId = getTrackableCandidateId(recommendation, requestId);
    const alreadySelected = workspaceSelection?.kakaoPlaceId === placeId;
    const selectedAt = new Date().toISOString();

    if (!alreadySelected && requestId && candidateSnapshotId != null) {
      clearSelectedRecommendation();
      writeSelectedRecommendation({
        recommendationRequestId: requestId,
        candidateSnapshotId,
        kakaoPlaceId: placeId,
        selectedAt,
      });
      trackCandidateAction(recommendation, 'SELECT');
    }

    const nextSelection =
      candidateSnapshotId != null
        ? { candidateSnapshotId, kakaoPlaceId: placeId }
        : { kakaoPlaceId: placeId };
    setWorkspaceSelection(nextSelection);
    setFocusedPlaceId(placeId);
    writeRecommendationWorkflow('SELECTED');
    writeRecommendationResult({
      recommendations,
      request,
      workspaceId,
      rootRequestId,
      selectedCandidateSnapshotId: candidateSnapshotId ?? undefined,
      selectedKakaoPlaceId: placeId,
    });
    persistWorkspaceSelection(nextSelection);
    writeRecommendationTrip({ recommendation, request, selectedAt });
    setSelectionPanelOpen(true);
  };

  const chooseAgain = () => {
    clearSelectedRecommendation();
    clearRecommendationTrip();
    setWorkspaceSelection(null);
    setSelectionPanelOpen(false);
    writeRecommendationWorkflow('COMPARING');
    if (request) {
      writeRecommendationResult({ recommendations, request, workspaceId, rootRequestId });
      persistWorkspaceSelection(null);
    }
  };

  const openRecommendationInNaver = (recommendation: RecommendationResponse) => {
    openNaverPlaceWithFallback(recommendation);
    if (!historyPreview) trackCandidateAction(recommendation, 'PLACE_OPEN');
  };

  const openSelectedInNaver = () => {
    if (!selectedRecommendation) return;
    openRecommendationInNaver(selectedRecommendation);
  };

  const commitFullRecommendationSet = (
    nextRecommendations: RecommendationResponse[],
    nextRequest: RecommendationRequest,
    successMessage: string | null,
  ) => {
    clearSelectedRecommendation();
    clearRecommendationTrip();
    setWorkspaceSelection(null);
    setSelectionPanelOpen(false);
    writeRecommendationWorkflow('COMPARING');
    setExplorationExhausted(false);
    retryInFlight.current = false;
    setRecommendations(nextRecommendations);
    setFocusedPlaceId(nextRecommendations[0]?.kakaoPlaceId);
    setRequest(nextRequest);
    const nextRequestId =
      resolveRecommendationRequestId(nextRecommendations) ??
      nextRequest.parentRecommendationRequestId;
    persistEditableRequest(nextRequest, nextRequestId);
    setLatestRecommendationRequestId(nextRequestId);
    persistWorkspaceSelection(null, nextRecommendations, nextRequest);
    setFeedbackMessage(successMessage);
    setIsPreparingRerecommend(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const refreshFullRecommendationSet = async (
    changes: RecommendationRequest,
    successMessage: string,
    target?: RecommendationResponse,
    actionType?: 'EXCLUDE' | 'MENU_EXCLUDE',
    replaceOne = false,
  ) => {
    if (retryInFlight.current || isRerecommending || !request || isQuotaExhausted) return;
    const parentId =
      latestRecommendationRequestId ?? resolveRecommendationRequestId(recommendations);
    const nextRequest = withSeenCandidates(
      { ...changes, parentRecommendationRequestId: parentId },
      recommendations,
    );
    if (
      (nextRequest.seenPlaceIds?.length ?? 0) > MAX_EXCLUDED_PLACE_IDS ||
      (nextRequest.excludedPlaceIds?.length ?? 0) > MAX_EXCLUDED_PLACE_IDS ||
      (nextRequest.excludedCategoryFamilies?.length ?? 0) > 50
    ) {
      setExplorationExhausted(true);
      setFeedbackMessage('이번 탐색에서 많은 후보를 확인했어요. 새 식사로 시작할 수 있어요.');
      return;
    }
    retryInFlight.current = true;
    setIsPreparingRerecommend(true);
    setFeedbackMessage(null);
    // Exclusions are part of the request, so a failed analytics call cannot undo them.
    setRequest(nextRequest);
    if (
      workspaceSelection?.kakaoPlaceId &&
      (nextRequest.excludedPlaceIds?.includes(workspaceSelection.kakaoPlaceId) ||
        recommendations.some(
          (item) =>
            item.kakaoPlaceId === workspaceSelection.kakaoPlaceId &&
            nextRequest.excludedCategoryFamilies?.includes(resultFamily(item)),
        ))
    ) {
      clearSelectedRecommendation();
      clearRecommendationTrip();
      setWorkspaceSelection(null);
      setSelectionPanelOpen(false);
      writeRecommendationWorkflow('COMPARING');
    }
    persistEditableRequest(nextRequest);
    await Promise.allSettled([
      trackRerecommendAsync(parentId),
      ...(target && actionType ? [trackCandidateActionAsync(target, actionType)] : []),
    ]);
    const blocked = new Set(uniqueValues(nextRequest.seenPlaceIds, nextRequest.excludedPlaceIds));
    const excludedFamilies = new Set(nextRequest.excludedCategoryFamilies ?? []);
    refreshRecommendations(nextRequest, {
      onSuccess: (items) => {
        const seen = new Set<string>();
        const fresh = items
          .filter((item) => {
            const id = item.kakaoPlaceId?.trim();
            if (!id || blocked.has(id) || seen.has(id) || excludedFamilies.has(resultFamily(item)))
              return false;
            seen.add(id);
            return true;
          })
          .slice(0, 3);
        retryInFlight.current = false;
        setIsPreparingRerecommend(false);
        if (fresh.length === 0) {
          setExplorationExhausted(true);
          setFeedbackMessage(
            '현재 범위에서 새 후보를 더 찾지 못했어요. 이미 받은 후보와 제외한 메뉴는 반복하지 않아요. 아래는 이전 후보예요.',
          );
          clearSelectedRecommendation();
          clearRecommendationTrip();
          setWorkspaceSelection(null);
          setSelectionPanelOpen(false);
          writeRecommendationWorkflow('COMPARING');
          persistWorkspaceSelection(null, recommendations, nextRequest);
          return;
        }
        const nextList =
          replaceOne && target
            ? recommendations.map((item) =>
                item.kakaoPlaceId === target.kakaoPlaceId ? fresh[0] : item,
              )
            : fresh;
        // Persist the newest parent even when retained cards belong to older responses.
        const newestParentId = resolveRecommendationRequestId(fresh) ?? parentId;
        commitFullRecommendationSet(
          nextList,
          { ...nextRequest, parentRecommendationRequestId: newestParentId },
          successMessage,
        );
      },
      onError: () => {
        retryInFlight.current = false;
        setIsPreparingRerecommend(false);
        setFeedbackMessage(
          '새 후보 요청에 실패했어요. 제외 조건은 유지했으니 다시 시도할 수 있어요.',
        );
      },
    });
  };

  const excludeRecommendation = (target: RecommendationResponse) => {
    if (!request) return;
    return refreshFullRecommendationSet(
      {
        ...request,
        excludedPlaceIds: uniqueValues(request.excludedPlaceIds, [target.kakaoPlaceId]),
      },
      target.placeName + '은 이번 식사에서 제외했어요.',
      target,
      'EXCLUDE',
      true,
    );
  };

  const replaceAllRecommendations = () => {
    if (!request || explorationExhausted) return;
    return refreshFullRecommendationSet(
      request,
      '이번 탐색에서 이미 받은 후보를 제외하고 새로 찾았어요.',
    );
  };

  const requestCloserRecommendations = () => {
    if (!request) return;
    const currentDistance = focusedRecommendation?.distance;
    const radius =
      currentDistance != null && currentDistance > 300
        ? Math.max(300, Math.min(request.radiusMeters ?? 1400, Math.floor(currentDistance) - 1))
        : (request.radiusMeters ?? 1400);
    return refreshFullRecommendationSet(
      {
        ...request,
        radiusMeters: radius,
        priority: 'NEARBY',
        timeBudget: 'SHORT',
        contextSources: { ...request.contextSources, timeBudget: 'MANUAL' },
      },
      '이미 받은 후보를 제외하고 더 가까운 범위에서 골랐어요.',
    );
  };

  const requestDifferentMenu = (target: RecommendationResponse) => {
    if (!request) return;
    const family = resultFamily(target);
    if (!family) {
      setFeedbackMessage('이 식당의 음식 분류를 확인할 수 없어요. 원하는 메뉴를 직접 바꿔주세요.');
      return;
    }
    const families = uniqueValues(request.excludedCategoryFamilies, [family]);
    const keep = (value: string) => !families.includes(categoryFamily(value));
    const nextFood = (request.foodPreferences ?? []).filter(keep);
    const nextCompanionFood = (request.companionFoodPreferences ?? []).filter(keep);
    return refreshFullRecommendationSet(
      {
        ...request,
        foodPreferences: nextFood,
        companionFoodPreferences: nextCompanionFood,
        contextSearchTerms: (request.contextSearchTerms ?? []).filter(keep),
        // The sentence has been superseded by structured edits; don't parse its old food again.
        naturalContext: undefined,
        strictFoodPreferences: nextFood.length > 0 && request.strictFoodPreferences,
        strictCompanionFoodPreferences:
          nextCompanionFood.length > 0 && request.strictCompanionFoodPreferences,
        excludedCategoryFamilies: families,
        excludedPlaceIds: uniqueValues(request.excludedPlaceIds, [target.kakaoPlaceId]),
      },
      '이 음식 분류를 이번 식사에서 제외했어요. 이전에 제외한 메뉴도 유지해요.',
      target,
      'MENU_EXCLUDE',
    );
  };

  const expandSearch = () => {
    if (!request) return;
    const radius = Math.min(
      5000,
      Math.max(
        (request.radiusMeters ?? 1400) + 700,
        Math.round((request.radiusMeters ?? 1400) * 1.5),
      ),
    );
    return refreshFullRecommendationSet(
      { ...request, radiusMeters: radius },
      '범위를 넓혀 새 후보를 찾았어요. 이전 제외 조건은 유지했어요.',
    );
  };

  const openHistoryPreview = (state: RecommendationResultState) => {
    navigate('/ai/result', {
      state: { ...state, historyPreview: true, activeResultSnapshot: readRecommendationResult() },
      replace: false,
    });
  };

  const returnToActiveRecommendation = () => navigate('/ai');

  const contextSummary = request
    ? [
        request.locationLabel,
        ...(focusedRecommendation?.effectiveContext ?? []),
        request.occasion && request.occasion !== 'NORMAL'
          ? OCCASION_OPTIONS.find((option) => option.value === request.occasion)?.label
          : undefined,
        ...(request.foodPreferences ?? []).slice(0, 2),
        ...(request.companionFoodPreferences ?? []).map((food) => `동행자 ${food}`),
        request.priority === 'NEARBY' ? '가까운 곳 우선' : undefined,
        request.discoveryIntent === 'NEW_PLACE' ? '최근 방문 제외' : undefined,
      ].filter((value): value is string => Boolean(value))
    : [];

  const renderFocusedCard = (item: RecommendationResponse) => {
    const excluded =
      request?.excludedPlaceIds?.includes(item.kakaoPlaceId) ||
      request?.excludedCategoryFamilies?.includes(resultFamily(item));
    const distanceLabel = formatDistance(item);
    const categoryLabel = item.categoryLabel ?? getFallbackCategoryLabel(item.category);
    const menus = getDisplayMenus(item).slice(0, 2);
    const groundedReason = getGroundedReason(item);
    const importantConditionNote = getImportantConditionNote(item);
    const detailNotes = (item.contextNotes ?? []).filter((note) => note !== importantConditionNote);
    const detailReason = item.recommendationReason?.trim();
    const hasDetails = Boolean(detailReason || detailNotes.length > 0);
    const showImage = Boolean(
      item.imageUrl &&
      !failedImages.has(item.kakaoPlaceId) &&
      (!item.imageSource || item.imageSource === 'USER_DINING_RECORD'),
    );
    const isSelected = workspaceSelection?.kakaoPlaceId === item.kakaoPlaceId;

    return (
      <S.ResultCard key={item.kakaoPlaceId}>
        {showImage && (
          <S.CardMedia>
            <img
              src={item.imageUrl}
              alt={`${item.placeName} 기록 사진`}
              onError={() =>
                setFailedImages((previous) => new Set(previous).add(item.kakaoPlaceId))
              }
            />
          </S.CardMedia>
        )}

        <S.CardBody>
          {isSelected && (
            <S.BadgeRow>
              <S.SelectedBadge>선택한 곳</S.SelectedBadge>
            </S.BadgeRow>
          )}

          <S.PlaceName>{item.placeName}</S.PlaceName>

          {menus.length > 0 ? (
            <S.MenuList>
              {menus.map((menu) => (
                <li key={`${item.kakaoPlaceId}:${menu.name}`}>
                  <strong>{menu.name}</strong>
                  {formatPrice(menu.priceWon) && <span>{formatPrice(menu.priceWon)}</span>}
                </li>
              ))}
            </S.MenuList>
          ) : categoryLabel ? (
            <S.CategoryText>{categoryLabel}</S.CategoryText>
          ) : null}

          {distanceLabel && <S.DistanceText>직선거리 {distanceLabel}</S.DistanceText>}
          {groundedReason && <S.GroundedReason>{groundedReason}</S.GroundedReason>}
          {importantConditionNote && (
            <S.ConditionWarning>{importantConditionNote}</S.ConditionWarning>
          )}

          {hasDetails && (
            <S.ReasonDetails>
              <summary>
                추천 근거 보기 <ChevronDown size={15} />
              </summary>
              <div>
                {detailReason && <p>{detailReason}</p>}
                {detailNotes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
            </S.ReasonDetails>
          )}

          <S.CardActionRow>
            <S.MapButton type="button" onClick={() => openRecommendationInNaver(item)}>
              <MapPin size={16} /> 지도·상세
            </S.MapButton>
            {!historyPreview && (
              <S.SelectButton
                type="button"
                disabled={isRerecommending || Boolean(excluded)}
                onClick={() => selectRecommendation(item)}
              >
                {excluded
                  ? '이번 식사에서 제외됨'
                  : isSelected
                    ? '선택 내용 보기'
                    : '여기로 정하기'}
              </S.SelectButton>
            )}
          </S.CardActionRow>
        </S.CardBody>
      </S.ResultCard>
    );
  };

  if (recommendations.length === 0) {
    return (
      <S.Container>
        <S.EmptyState>
          <S.EmptyTitle>추천 결과가 없어요</S.EmptyTitle>
          <S.EmptyDescription>조건을 조금 바꿔 다시 골라볼게요.</S.EmptyDescription>
          <S.RetryButton type="button" onClick={editConditions}>
            조건 바꾸기
          </S.RetryButton>
        </S.EmptyState>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.HeaderRow>
        <S.BackButton
          type="button"
          onClick={historyPreview ? returnToActiveRecommendation : editConditions}
          aria-label={historyPreview ? '현재 추천으로 돌아가기' : '조건 바꾸기'}
        >
          <ArrowLeft size={19} />
        </S.BackButton>
        <S.HeaderText>
          <S.Title>
            {historyPreview
              ? '지난 추천이에요'
              : explorationExhausted
                ? '이전에 받은 후보예요'
                : '오늘은 여기 어때요?'}
          </S.Title>
          {historyPreview && <S.HeaderSub>조회만 해도 추천 횟수는 차감되지 않아요.</S.HeaderSub>}
        </S.HeaderText>
      </S.HeaderRow>

      {contextSummary.length > 0 && (
        <S.ContextSummary>
          <span>{contextSummary.join(' · ')}</span>
          {!historyPreview && (
            <button type="button" onClick={editConditions}>
              조건 바꾸기
            </button>
          )}
        </S.ContextSummary>
      )}

      {isRerecommending && (
        <S.RefreshStatus>
          <RefreshCw size={14} /> 새 후보를 고르는 중이에요
        </S.RefreshStatus>
      )}
      {!isRerecommending && feedbackMessage && (
        <S.RefreshStatus role="status">{feedbackMessage}</S.RefreshStatus>
      )}

      <S.FocusedResults aria-busy={isPending}>
        {focusedRecommendation && renderFocusedCard(focusedRecommendation)}

        {alternatives.length > 0 && (
          <>
            <S.ResultSectionLabel>다른 후보</S.ResultSectionLabel>
            <S.AlternativeList>
              {alternatives.map((item) => {
                const menuLine = getMenuLine(item);
                const distance = formatDistance(item);
                const category = item.categoryLabel ?? getFallbackCategoryLabel(item.category);
                return (
                  <S.AlternativeButton
                    key={item.kakaoPlaceId}
                    type="button"
                    aria-current={
                      item.kakaoPlaceId === focusedRecommendation?.kakaoPlaceId ? 'true' : undefined
                    }
                    onClick={() => setFocusedPlaceId(item.kakaoPlaceId)}
                  >
                    <span>
                      <strong>{item.placeName}</strong>
                      {(menuLine || category) && <small>{menuLine ?? category}</small>}
                    </span>
                    {distance && <b>직선거리 {distance}</b>}
                  </S.AlternativeButton>
                );
              })}
            </S.AlternativeList>
          </>
        )}
      </S.FocusedResults>

      {!historyPreview && (
        <S.SecondaryArea>
          <S.UsageHint>
            {isDevelopmentUnlimited
              ? '후보를 눌러 비교하는 건 무료예요. 새 후보 찾기만 서버에 다시 요청해요.'
              : isQuotaExhausted
                ? '오늘 추천을 모두 사용했어요. 지금 받은 후보는 계속 비교할 수 있어요.'
                : `후보 비교는 횟수를 쓰지 않아요 · 새 후보 요청 ${usage?.remainingCount ?? 0}회 남음`}
          </S.UsageHint>
          <S.RetryButton
            type="button"
            disabled={isRerecommending || isQuotaExhausted || !request || explorationExhausted}
            onClick={() => void replaceAllRecommendations()}
          >
            <RefreshCw size={14} />{' '}
            {explorationExhausted ? '현재 조건의 새 후보 소진' : '새 후보 찾기'}
          </S.RetryButton>

          {explorationExhausted && (
            <S.ContextSummary role="status">
              <span>이미 본 식당과 제외한 메뉴는 유지해요.</span>
              {(request?.radiusMeters ?? 1400) < 5000 && (
                <button
                  type="button"
                  disabled={isRerecommending || isQuotaExhausted}
                  onClick={() => void expandSearch()}
                >
                  범위를 넓혀 찾기
                </button>
              )}
              <button type="button" onClick={editConditions}>
                조건 수정
              </button>
              <button type="button" onClick={() => navigate('/ai?mode=new')}>
                새 식사 시작
              </button>
            </S.ContextSummary>
          )}

          <S.MoreDetails
            open={showMore}
            onToggle={(event) => setShowMore(event.currentTarget.open)}
          >
            <summary>
              조건을 바꿔 다시 찾기 <ChevronDown size={16} />
            </summary>
            <div>
              <button
                type="button"
                disabled={isRerecommending || isQuotaExhausted || !focusedRecommendation}
                onClick={() =>
                  focusedRecommendation && void excludeRecommendation(focusedRecommendation)
                }
              >
                이 식당 제외 · 추천 1회
              </button>
              <button
                type="button"
                disabled={isRerecommending || isQuotaExhausted || !focusedRecommendation}
                onClick={() =>
                  focusedRecommendation && void requestDifferentMenu(focusedRecommendation)
                }
              >
                오늘은 이 메뉴 말고
              </button>
              <button
                type="button"
                disabled={isRerecommending || isQuotaExhausted || !request}
                onClick={() => void requestCloserRecommendations()}
              >
                너무 멀어요 · 더 가까이 찾기
              </button>
              <button type="button" onClick={() => setShowHistory((value) => !value)}>
                {showHistory ? '최근 추천 닫기' : '최근 추천 보기'}
              </button>
              <button
                type="button"
                onClick={() =>
                  navigate('/decision-rooms/new', { state: { recommendationRequest: request } })
                }
              >
                친구와 함께 정하기
              </button>
            </div>
          </S.MoreDetails>
        </S.SecondaryArea>
      )}

      {showHistory && !historyPreview && (
        <S.HistoryPanel>
          {(recommendationWorkspaces.data ?? []).map((workspace) => {
            const recentRecommendation =
              workspace.recommendations.find(
                (item) => item.kakaoPlaceId === workspace.selectedKakaoPlaceId,
              ) ?? workspace.recommendations[0];
            const locationLabel = workspace.request.locationLabel?.trim();
            return (
              <S.HistoryItem
                key={`workspace:${workspace.workspaceId}`}
                type="button"
                onClick={() =>
                  openHistoryPreview({
                    recommendations: workspace.recommendations,
                    request: workspace.request,
                    updatedAt: workspace.createdAt,
                    workspaceId: workspace.workspaceId,
                    rootRequestId: workspace.rootRequestId,
                    selectedCandidateSnapshotId: workspace.selectedCandidateSnapshotId,
                    selectedKakaoPlaceId: workspace.selectedKakaoPlaceId,
                  })
                }
              >
                <strong>{recentRecommendation?.placeName ?? '최근 추천'}</strong>
                <span>
                  {[locationLabel, new Date(workspace.createdAt).toLocaleString('ko-KR')]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
              </S.HistoryItem>
            );
          })}
          {(recommendationHistory.data ?? []).map((history) => {
            const recentRecommendation =
              history.recommendations.find(
                (item) => item.kakaoPlaceId === history.selectedKakaoPlaceId,
              ) ?? history.recommendations[0];
            const locationLabel = (history.locationLabel ?? history.request.locationLabel)?.trim();
            return (
              <S.HistoryItem
                key={`history:${history.recommendationRequestId}`}
                type="button"
                onClick={() =>
                  openHistoryPreview({
                    recommendations: history.recommendations,
                    request: history.request,
                    updatedAt: history.createdAt,
                  })
                }
              >
                <strong>{recentRecommendation?.placeName ?? '최근 추천'}</strong>
                <span>
                  {[locationLabel, new Date(history.createdAt).toLocaleString('ko-KR')]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
              </S.HistoryItem>
            );
          })}
          {!(recommendationWorkspaces.data?.length || recommendationHistory.data?.length) && (
            <S.HistoryEmpty>아직 불러올 최근 추천이 없어요.</S.HistoryEmpty>
          )}
        </S.HistoryPanel>
      )}

      <BottomSheet
        isOpen={selectionPanelOpen && Boolean(selectedRecommendation) && !historyPreview}
        title="오늘 먹을 곳 정했어요"
        ariaLabel="선택한 식당"
        closeLabel="선택 내용 닫기"
        onClose={() => setSelectionPanelOpen(false)}
        blurBackdrop
      >
        {selectedRecommendation && (
          <S.SelectionSheetContent>
            <S.SelectionSummary>
              <strong>{selectedRecommendation.placeName}</strong>
              {selectedRecommendation.address?.trim() && <p>{selectedRecommendation.address}</p>}
            </S.SelectionSummary>
            <S.PanelPrimary type="button" onClick={openSelectedInNaver}>
              <MapPin size={17} /> 네이버 지도에서 보기
            </S.PanelPrimary>
            <S.PanelSecondary type="button" onClick={chooseAgain}>
              다시 고르기
            </S.PanelSecondary>
          </S.SelectionSheetContent>
        )}
      </BottomSheet>
    </S.Container>
  );
};

// Each navigation owns its own local result state; storage remains the restoration boundary.
const AIResult = () => {
  const location = useLocation();
  return <AIResultView key={location.key} />;
};

export default AIResult;
