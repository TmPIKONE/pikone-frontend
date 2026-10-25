import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, LocateFixed, MapPin, Search, Users, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCurrentLocation } from '~/hooks/useCurrentLocation';
import {
  useRecommendationContextParser,
  useRecommendationHistory,
  useRecommendationLocationReverse,
  useRecommendationLocationSearch,
  useRecommendations,
  useRecommendationUsage,
  useRecommendationWorkspaces,
  usePromptSuggestions,
  usePromptSuggestionEvent,
  usePromptSubmission,
} from '~/features/recommendations/recommendation.queries';
import {
  clearRecommendationDraft,
  clearRecommendationTrip,
  clearSelectedRecommendation,
  readRecentRecommendationDestinations,
  readRecommendationDraft,
  readRecommendationResult,
  readRecommendationWorkflow,
  writeRecentRecommendationDestinations,
  writeRecommendationDraft,
  writeRecommendationResult,
  writeRecommendationWorkflow,
} from '~/features/recommendations/recommendationStorage';
import { useHomeLocations } from '~/features/homeLocations/homeLocation.queries';
import { useCompanions } from '~/features/companions/companion.queries';
import { LocationPinMap } from '~/components/LocationPinMap/LocationPinMap';
import { createClientEventId } from '~/features/recommendations/recommendationTracking';
import {
  FOOD_PREFERENCE_OPTIONS,
  DISCOVERY_INTENT_OPTIONS,
  MOBILITY_OPTIONS,
  OCCASION_OPTIONS,
  TIME_BUDGET_OPTIONS,
  type NaturalLanguageContextResponse,
  type RecommendationDiscoveryIntent,
  type RecommendationLocationResponse,
  type RecommendationMobility,
  type RecommendationOccasion,
  type RecommendationPriority,
  type RecommendationRequest,
  type RecommendationTimeBudget,
  type PromptSuggestionResponse,
} from '~/apis/recommendation/recommendation.types';
import * as S from './AI.styles';

const MAX_FOOD_PREFERENCES = 4;
const MAX_RECENT_DESTINATIONS = 4;
const DEFAULT_MAP_CENTER = { latitude: 37.5665, longitude: 126.978 };

type ContextField = 'occasion' | 'mobility' | 'discoveryIntent' | 'timeBudget' | 'foodPreferences';

const radiusForMobility = (value: RecommendationMobility) => {
  if (value === 'PUBLIC_TRANSPORT') return 3000;
  if (value === 'CAR') return 5000;
  return 1400;
};

const AI = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentLocation = useCurrentLocation();
  const { data: homeLocations = [] } = useHomeLocations();
  const { data: companions = [] } = useCompanions();
  const recommendationUsage = useRecommendationUsage();
  const recommendationHistory = useRecommendationHistory();
  const recommendationWorkspaces = useRecommendationWorkspaces();
  const storedResult = useMemo(() => readRecommendationResult(), []);
  const [restoredDraft] = useState(() =>
    searchParams.get('mode') === 'new' ? {} : readRecommendationDraft(),
  );
  const restoredWorkflow = useMemo(() => readRecommendationWorkflow(), []);

  const [selectedLocationKey, setSelectedLocationKey] = useState(
    () => restoredDraft.selectedLocationKey ?? 'current',
  );
  const [destinationQuery, setDestinationQuery] = useState('');
  const [debouncedDestinationQuery, setDebouncedDestinationQuery] = useState('');
  const [selectedDestination, setSelectedDestination] =
    useState<RecommendationLocationResponse | null>(() =>
      restoredDraft.selectedDestination && typeof restoredDraft.selectedDestination === 'object'
        ? (restoredDraft.selectedDestination as RecommendationLocationResponse)
        : null,
    );
  const [recentDestinations, setRecentDestinations] = useState<RecommendationLocationResponse[]>(
    readRecentRecommendationDestinations,
  );
  const restoredDestination =
    restoredDraft.selectedDestination && typeof restoredDraft.selectedDestination === 'object'
      ? (restoredDraft.selectedDestination as RecommendationLocationResponse)
      : null;
  const [mapCenter, setMapCenter] = useState(() =>
    restoredDestination
      ? { latitude: restoredDestination.latitude, longitude: restoredDestination.longitude }
      : DEFAULT_MAP_CENTER,
  );
  const [pinLocation, setPinLocation] = useState<RecommendationLocationResponse | null>(null);
  const [pinFeedback, setPinFeedback] = useState<string | null>(null);
  const reverseRequestSequenceRef = useRef(0);

  const [companionId, setCompanionId] = useState<number | null>(() =>
    typeof restoredDraft.companionId === 'number' ? restoredDraft.companionId : null,
  );
  const [soloQuickSelected, setSoloQuickSelected] = useState(
    () => typeof restoredDraft.companionId !== 'number',
  );
  const [foodPreferences, setFoodPreferences] = useState<string[]>(() =>
    Array.isArray(restoredDraft.foodPreferences) ? restoredDraft.foodPreferences : [],
  );
  const [companionFoodPreferences, setCompanionFoodPreferences] = useState<string[]>(() =>
    Array.isArray(restoredDraft.companionFoodPreferences)
      ? restoredDraft.companionFoodPreferences
      : [],
  );
  const [occasion, setOccasion] = useState<RecommendationOccasion>(
    () => (restoredDraft.occasion as RecommendationOccasion) ?? 'NORMAL',
  );
  const [mobility, setMobility] = useState<RecommendationMobility>(
    () => (restoredDraft.mobility as RecommendationMobility) ?? 'WALK',
  );
  const [discoveryIntent, setDiscoveryIntent] = useState<RecommendationDiscoveryIntent>(
    () => (restoredDraft.discoveryIntent as RecommendationDiscoveryIntent) ?? 'BALANCED',
  );
  const [timeBudget, setTimeBudget] = useState<RecommendationTimeBudget>(
    () => (restoredDraft.timeBudget as RecommendationTimeBudget) ?? 'NORMAL',
  );
  const [naturalContext, setNaturalContext] = useState(() =>
    typeof restoredDraft.naturalContext === 'string' ? restoredDraft.naturalContext : '',
  );
  const [contextParsed, setContextParsed] = useState(Boolean(restoredDraft.contextSearchTerms));
  const [strictFoodPreferences, setStrictFoodPreferences] = useState(
    Boolean(restoredDraft.strictFoodPreferences),
  );
  const [strictCompanionFoodPreferences, setStrictCompanionFoodPreferences] = useState(
    Boolean(restoredDraft.strictCompanionFoodPreferences),
  );
  const [explorationRequest, setExplorationRequest] = useState<RecommendationRequest | undefined>(
    restoredDraft.explorationRequest,
  );
  const [parsedFields, setParsedFields] = useState<string[]>(restoredDraft.parsedFields ?? []);
  const [contextSearchTerms, setContextSearchTerms] = useState<string[]>(
    restoredDraft.contextSearchTerms ?? [],
  );
  const [contextParserSource, setContextParserSource] = useState<string | undefined>(
    restoredDraft.contextParserSource,
  );
  const [submitFeedback, setSubmitFeedback] = useState<string | null>(null);
  const [cardStep, setCardStep] = useState(0);
  const [cardDirection, setCardDirection] = useState<'forward' | 'backward'>('forward');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationExplicit, setLocationExplicit] = useState(() =>
    Boolean(restoredDraft.selectedLocationKey && restoredDraft.selectedLocationKey !== 'current'),
  );
  const [radiusMeters, setRadiusMeters] = useState(() =>
    typeof restoredDraft.radiusMeters === 'number' ? restoredDraft.radiusMeters : 1400,
  );
  const [quickNearby, setQuickNearby] = useState(() => Boolean(restoredDraft.nearbyFirst));
  const [touchedFields, setTouchedFields] = useState<Set<ContextField>>(() => {
    const restoredTouched = Array.isArray(restoredDraft.touchedFields)
      ? restoredDraft.touchedFields
      : [];
    const allowed = new Set<ContextField>([
      'occasion',
      'mobility',
      'discoveryIntent',
      'timeBudget',
      'foodPreferences',
    ]);
    return new Set(
      restoredTouched.filter((field): field is ContextField => allowed.has(field as ContextField)),
    );
  });
  const [promptSuggestionResult, setPromptSuggestions] = useState<{
    contextKey: string;
    response: PromptSuggestionResponse;
  } | null>(null);
  const [selectedPromptSuggestionId, setSelectedPromptSuggestionId] = useState<string | null>(
    () => restoredDraft.promptSuggestionId ?? null,
  );
  const [selectedPromptSuggestionGroupId, setSelectedPromptSuggestionGroupId] = useState<
    string | null
  >(() => restoredDraft.promptSuggestionGroupId ?? null);
  const promptSuggestionSequenceRef = useRef(0);

  useEffect(() => {
    if (restoredWorkflow.phase === 'EDITING' || searchParams.get('mode') === 'new') return;
    if (new Date(restoredWorkflow.updatedAt).toDateString() !== new Date().toDateString()) return;

    if (storedResult.recommendations?.length && storedResult.request) {
      navigate('/ai/result', { replace: true });
      return;
    }

    const activeWorkspace =
      recommendationWorkspaces.data?.find(
        (workspace) =>
          workspace.status === restoredWorkflow.phase && workspace.recommendations.length > 0,
      ) ??
      recommendationWorkspaces.data?.find(
        (workspace) => workspace.status === 'COMPARING' && workspace.recommendations.length > 0,
      );
    if (!activeWorkspace) return;

    const state = {
      recommendations: activeWorkspace.recommendations,
      request: activeWorkspace.request,
      updatedAt: activeWorkspace.updatedAt,
      workspaceId: activeWorkspace.workspaceId,
      rootRequestId: activeWorkspace.rootRequestId,
      selectedCandidateSnapshotId: activeWorkspace.selectedCandidateSnapshotId,
      selectedKakaoPlaceId: activeWorkspace.selectedKakaoPlaceId,
    };
    writeRecommendationResult(state);
    navigate('/ai/result', { replace: true, state });
  }, [
    navigate,
    recommendationWorkspaces.data,
    restoredWorkflow.phase,
    restoredWorkflow.updatedAt,
    searchParams,
    storedResult,
  ]);

  const { mutate: getRecommendations, isPending, error } = useRecommendations();
  const { mutate: parseContext, isPending: isParsingContext } = useRecommendationContextParser();
  const {
    mutate: getPromptSuggestions,
    isPending: isPromptSuggestionPending,
    error: promptSuggestionError,
  } = usePromptSuggestions();
  const { mutate: recordPromptSuggestionEvent } = usePromptSuggestionEvent();
  const { mutate: recordPromptSubmission } = usePromptSubmission();
  const reverseLocation = useRecommendationLocationReverse();

  const usage = recommendationUsage.data;
  const isDevelopmentUnlimited = (usage?.dailyLimit ?? 0) >= 999;
  const isQuotaExhausted = !isDevelopmentUnlimited && (usage?.exhausted ?? false);
  const isSubmitting = isPending || isParsingContext;
  const activeLocationKey = selectedLocationKey;

  const markTouched = (field: ContextField) => {
    setTouchedFields((previous) => {
      const next = new Set(previous);
      next.add(field);
      return next;
    });
  };

  useEffect(() => {
    writeRecommendationDraft({
      naturalContext,
      selectedLocationKey,
      selectedDestination,
      companionId,
      foodPreferences,
      companionFoodPreferences,
      occasion,
      mobility,
      discoveryIntent,
      timeBudget,
      radiusMeters,
      nearbyFirst: quickNearby,
      touchedFields: Array.from(touchedFields),
      strictFoodPreferences,
      strictCompanionFoodPreferences,
      explorationRequest,
      contextSearchTerms,
      parsedFields,
      contextParserSource,
      promptSuggestionGroupId: selectedPromptSuggestionGroupId ?? undefined,
      promptSuggestionId: selectedPromptSuggestionId ?? undefined,
    });
  }, [
    naturalContext,
    selectedLocationKey,
    selectedDestination,
    companionId,
    foodPreferences,
    companionFoodPreferences,
    occasion,
    mobility,
    discoveryIntent,
    timeBudget,
    radiusMeters,
    quickNearby,
    touchedFields,
    strictFoodPreferences,
    strictCompanionFoodPreferences,
    explorationRequest,
    contextSearchTerms,
    parsedFields,
    contextParserSource,
    selectedPromptSuggestionGroupId,
    selectedPromptSuggestionId,
  ]);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedDestinationQuery(destinationQuery.trim()),
      300,
    );
    return () => window.clearTimeout(timer);
  }, [destinationQuery]);

  const destinationSearch = useRecommendationLocationSearch(
    debouncedDestinationQuery,
    currentLocation.latitude ?? undefined,
    currentLocation.longitude ?? undefined,
    activeLocationKey === 'destination' && !selectedDestination,
  );

  const selectedSavedLocation = useMemo(() => {
    if (!activeLocationKey.startsWith('saved:')) return undefined;
    const locationId = Number(activeLocationKey.replace('saved:', ''));
    return homeLocations.find((location) => location.id === locationId);
  }, [activeLocationKey, homeLocations]);

  const selectedCompanion = useMemo(
    () => companions.find((companion) => companion.companionId === companionId),
    [companionId, companions],
  );

  const effectiveLocation = useMemo(() => {
    if (activeLocationKey === 'destination') {
      return selectedDestination
        ? {
            latitude: selectedDestination.latitude,
            longitude: selectedDestination.longitude,
            label: selectedDestination.placeName,
          }
        : undefined;
    }

    if (activeLocationKey.startsWith('saved:')) {
      return selectedSavedLocation
        ? {
            latitude: selectedSavedLocation.latitude,
            longitude: selectedSavedLocation.longitude,
            label: selectedSavedLocation.label,
          }
        : undefined;
    }

    if (
      activeLocationKey === 'current' &&
      currentLocation.latitude != null &&
      currentLocation.longitude != null
    ) {
      return {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        label: '현재 위치',
      };
    }

    return undefined;
  }, [
    activeLocationKey,
    currentLocation.latitude,
    currentLocation.longitude,
    selectedDestination,
    selectedSavedLocation,
  ]);

  const promptSuggestionContextKey = useMemo(
    () =>
      JSON.stringify({
        locationLabel: effectiveLocation?.label ?? null,
        companionId: soloQuickSelected ? null : companionId,
        occasion,
        mobility,
        discoveryIntent,
        timeBudget,
        foodPreferences,
      }),
    [
      effectiveLocation?.label,
      soloQuickSelected,
      companionId,
      occasion,
      mobility,
      discoveryIntent,
      timeBudget,
      foodPreferences,
    ],
  );
  const promptSuggestionContextKeyRef = useRef(promptSuggestionContextKey);
  const promptSuggestions =
    promptSuggestionResult?.contextKey === promptSuggestionContextKey
      ? promptSuggestionResult.response
      : null;
  useEffect(() => {
    promptSuggestionContextKeyRef.current = promptSuggestionContextKey;
  }, [promptSuggestionContextKey]);

  const requestPromptSuggestions = useCallback(
    (refresh = false, text?: string) => {
      const sequence = ++promptSuggestionSequenceRef.current;
      const requestedContextKey = promptSuggestionContextKey;
      getPromptSuggestions(
        {
          locationLabel: effectiveLocation?.label,
          companionId: soloQuickSelected ? undefined : (companionId ?? undefined),
          occasion,
          mobility,
          discoveryIntent,
          timeBudget,
          foodPreferences: foodPreferences.length > 0 ? foodPreferences : undefined,
          naturalContext: refresh ? text?.trim() || undefined : undefined,
          refresh,
        },
        {
          onSuccess: (response) => {
            if (sequence !== promptSuggestionSequenceRef.current) return;
            if (requestedContextKey !== promptSuggestionContextKeyRef.current) return;
            setPromptSuggestions({ contextKey: requestedContextKey, response });
            if (!refresh) {
              setSelectedPromptSuggestionId(null);
              setSelectedPromptSuggestionGroupId(null);
            }
          },
        },
      );
    },
    [
      getPromptSuggestions,
      promptSuggestionContextKey,
      effectiveLocation?.label,
      soloQuickSelected,
      companionId,
      occasion,
      mobility,
      discoveryIntent,
      timeBudget,
      foodPreferences,
    ],
  );

  useEffect(() => {
    if (cardStep === 2) requestPromptSuggestions(false);
  }, [cardStep, requestPromptSuggestions]);

  useEffect(() => {
    if (cardStep !== 2 || !promptSuggestions) return;
    // Count only examples that reached the rendered prompt stage. Server-side clientEventId
    // deduplication prevents StrictMode/re-render/retry from inflating exposure counts.
    promptSuggestions.suggestions.forEach((suggestion) => {
      recordPromptSuggestionEvent({
        clientEventId: `exposed:${promptSuggestions.groupId}:${suggestion.suggestionId}`,
        eventType: 'EXPOSED',
        groupId: promptSuggestions.groupId,
        suggestionId: suggestion.suggestionId,
      });
    });
  }, [cardStep, promptSuggestions, recordPromptSuggestionEvent]);

  const handlePromptSuggestionSelect = (suggestionId: string, text: string) => {
    if (!promptSuggestions) return;
    setSelectedPromptSuggestionId(suggestionId);
    setSelectedPromptSuggestionGroupId(promptSuggestions.groupId);
    setNaturalContext(text.slice(0, 500));
    setContextParsed(false);
    setContextSearchTerms([]);
    setContextParserSource(undefined);
    recordPromptSuggestionEvent({
      clientEventId: `selected:${promptSuggestions.groupId}:${suggestionId}:${createClientEventId()}`,
      eventType: 'SELECTED',
      groupId: promptSuggestions.groupId,
      suggestionId,
    });
  };

  const handleMobilityChange = (next: RecommendationMobility) => {
    markTouched('mobility');
    setMobility(next);
    setRadiusMeters(radiusForMobility(next));
  };

  const beginDestinationSelection = () => {
    const seed =
      effectiveLocation ??
      (currentLocation.latitude != null && currentLocation.longitude != null
        ? {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            label: '현재 위치',
          }
        : undefined);

    setLocationExplicit(true);
    setSelectedLocationKey('destination');
    setSelectedDestination(null);
    setPinLocation(null);
    setPinFeedback(null);
    setDestinationQuery('');
    setMapCenter(
      seed ? { latitude: seed.latitude, longitude: seed.longitude } : DEFAULT_MAP_CENTER,
    );
  };

  const resolvePinLocation = (
    coordinates: { latitude: number; longitude: number },
    preferredName?: string,
  ) => {
    const requestSequence = ++reverseRequestSequenceRef.current;
    setMapCenter(coordinates);
    setPinLocation(null);
    setPinFeedback('핀 위치의 주소를 확인하는 중이에요.');

    reverseLocation.mutate(coordinates, {
      onSuccess: (location) => {
        if (requestSequence !== reverseRequestSequenceRef.current) return;
        setPinLocation(
          preferredName?.trim() ? { ...location, placeName: preferredName.trim() } : location,
        );
        setPinFeedback(null);
      },
      onError: () => {
        if (requestSequence !== reverseRequestSequenceRef.current) return;
        setPinLocation({
          locationId: `coordinate:${coordinates.longitude.toFixed(6)}:${coordinates.latitude.toFixed(6)}`,
          placeName: preferredName?.trim() || '선택한 위치',
          category: '핀 위치',
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        });
        setPinFeedback('주소를 확인하지 못했어요. 이 좌표로는 추천할 수 있어요.');
      },
    });
  };

  const previewDestination = (destination: RecommendationLocationResponse) => {
    setDestinationQuery('');
    resolvePinLocation(
      { latitude: destination.latitude, longitude: destination.longitude },
      destination.placeName,
    );
  };

  const handleSelectDestination = (destination: RecommendationLocationResponse) => {
    setLocationExplicit(true);
    setSelectedDestination(destination);
    setDestinationQuery('');
    setPinLocation(null);
    setPinFeedback(null);
    setShowLocationPicker(false);
    setRecentDestinations((previous) => {
      const next = [
        destination,
        ...previous.filter((item) => item.locationId !== destination.locationId),
      ].slice(0, MAX_RECENT_DESTINATIONS);
      return writeRecentRecommendationDestinations(next);
    });
  };

  const handleToggleFood = (food: string) => {
    markTouched('foodPreferences');
    const next = foodPreferences.includes(food)
      ? foodPreferences.filter((item) => item !== food)
      : foodPreferences.length < MAX_FOOD_PREFERENCES
        ? [...foodPreferences, food]
        : foodPreferences;
    setFoodPreferences(next);
    if (next.length === 0) setStrictFoodPreferences(false);
  };

  const handleToggleCompanionFood = (food: string) => {
    const next = companionFoodPreferences.includes(food)
      ? companionFoodPreferences.filter((item) => item !== food)
      : companionFoodPreferences.length < MAX_FOOD_PREFERENCES
        ? [...companionFoodPreferences, food]
        : companionFoodPreferences;
    setCompanionFoodPreferences(next);
    if (next.length === 0) setStrictCompanionFoodPreferences(false);
  };

  const applyParsedContext = (parsed: NaturalLanguageContextResponse) => {
    const conflicts: string[] = [];

    if (parsed.occasion) {
      if (!touchedFields.has('occasion')) setOccasion(parsed.occasion);
      else if (occasion !== parsed.occasion) conflicts.push('식사 목적');
    }

    if (parsed.mobility && !touchedFields.has('mobility')) {
      setMobility(parsed.mobility);
      setRadiusMeters(radiusForMobility(parsed.mobility));
    } else if (parsed.mobility && mobility !== parsed.mobility) conflicts.push('이동수단');

    if (parsed.discoveryIntent) {
      if (!touchedFields.has('discoveryIntent')) setDiscoveryIntent(parsed.discoveryIntent);
      else if (discoveryIntent !== parsed.discoveryIntent) conflicts.push('익숙함');
    }

    if (parsed.timeBudget) {
      if (!touchedFields.has('timeBudget')) setTimeBudget(parsed.timeBudget);
      else if (timeBudget !== parsed.timeBudget) conflicts.push('시간 여유');
    }

    if (!touchedFields.has('foodPreferences') && parsed.foodPreferences) {
      setFoodPreferences(parsed.foodPreferences.slice(0, MAX_FOOD_PREFERENCES));
    } else if (
      touchedFields.has('foodPreferences') &&
      parsed.foodPreferences?.length &&
      parsed.foodPreferences.join('|') !== foodPreferences.join('|')
    ) {
      conflicts.push('메뉴');
    }

    setContextSearchTerms(parsed.contextSearchTerms ?? []);
    setContextParserSource(parsed.source);
    setParsedFields(
      ['occasion', 'mobility', 'discoveryIntent', 'timeBudget', 'foodPreferences'].filter((key) => {
        const value = parsed[key as keyof NaturalLanguageContextResponse];
        return Array.isArray(value) ? value.length > 0 : Boolean(value);
      }),
    );
    setContextParsed(true);
    return conflicts;
  };

  const resolveInternalPriority = (
    nextDiscoveryIntent: RecommendationDiscoveryIntent = discoveryIntent,
    nextTimeBudget: RecommendationTimeBudget = timeBudget,
  ): RecommendationPriority => {
    if (quickNearby) return 'NEARBY';
    if (nextDiscoveryIntent === 'FAMILIAR') return 'FAMILIAR';
    if (nextDiscoveryIntent === 'NEW_PLACE') return 'DISCOVERY';
    if (nextTimeBudget === 'SHORT') return 'NEARBY';
    return 'BALANCED';
  };

  const requestRecommendations = (parsed?: NaturalLanguageContextResponse) => {
    if (!effectiveLocation || isQuotaExhausted) return;

    const parsedFood = parsed?.foodPreferences?.length
      ? parsed.foodPreferences.slice(0, MAX_FOOD_PREFERENCES)
      : undefined;
    const nextFoodPreferences =
      parsedFood && !touchedFields.has('foodPreferences') ? parsedFood : foodPreferences;
    const nextOccasion =
      parsed?.occasion && !touchedFields.has('occasion') ? parsed.occasion : occasion;
    const nextMobility =
      parsed?.mobility && !touchedFields.has('mobility') ? parsed.mobility : mobility;
    const nextDiscoveryIntent =
      parsed?.discoveryIntent && !touchedFields.has('discoveryIntent')
        ? parsed.discoveryIntent
        : discoveryIntent;
    const nextTimeBudget =
      parsed?.timeBudget && !touchedFields.has('timeBudget') ? parsed.timeBudget : timeBudget;

    const request: RecommendationRequest = {
      ...explorationRequest,
      strictFoodPreferences,
      strictCompanionFoodPreferences,
      contextSources: Object.fromEntries(
        ['occasion', 'mobility', 'discoveryIntent', 'timeBudget', 'foodPreferences'].map((key) => [
          key,
          touchedFields.has(key as ContextField)
            ? 'MANUAL'
            : (
                  parsed
                    ? Boolean(parsed[key as keyof NaturalLanguageContextResponse])
                    : parsedFields.includes(key)
                )
              ? 'TEXT'
              : 'DEFAULT',
        ]),
      ) as RecommendationRequest['contextSources'],
      latitude: effectiveLocation.latitude,
      longitude: effectiveLocation.longitude,
      locationLabel: effectiveLocation.label,
      foodPreferences: nextFoodPreferences.length > 0 ? nextFoodPreferences : undefined,
      companionFoodPreferences:
        !soloQuickSelected && companionId != null && companionFoodPreferences.length > 0
          ? companionFoodPreferences
          : undefined,
      companionId: soloQuickSelected ? undefined : (companionId ?? undefined),
      occasion: nextOccasion,
      mobility: nextMobility,
      discoveryIntent: nextDiscoveryIntent,
      timeBudget: nextTimeBudget,
      naturalContext: naturalContext.trim() || undefined,
      contextSearchTerms: parsed?.contextSearchTerms ?? contextSearchTerms,
      priority: resolveInternalPriority(nextDiscoveryIntent, nextTimeBudget),
      radiusMeters:
        parsed && !touchedFields.has('mobility') ? radiusForMobility(nextMobility) : radiusMeters,
    };

    setSubmitFeedback(null);
    getRecommendations(request, {
      onSuccess: (recommendations) => {
        if (recommendations.length === 0) {
          setSubmitFeedback(
            nextDiscoveryIntent === 'FAMILIAR'
              ? '현재 범위에 최근 2개월 동안 다시 가고 싶다고 기록한 식당이 없어요. 위치나 익숙함 조건을 바꿔주세요.'
              : '오늘 고른 메뉴·동행자 메뉴·이동 범위를 함께 만족하는 후보가 없어요. 메뉴나 범위를 조정해주세요.',
          );
          return;
        }

        const rootRequestId = recommendations[0]?.recommendationRequestId?.trim();
        if (rootRequestId) {
          recordPromptSubmission({
            requestId: rootRequestId,
            body: {
              clientEventId: `prompt-submit:${rootRequestId}`,
              groupId: selectedPromptSuggestionGroupId ?? undefined,
              suggestionId: selectedPromptSuggestionId ?? undefined,
              finalText: naturalContext.trim() || undefined,
              locationLabel: request.locationLabel,
              occasion: request.occasion,
              mobility: request.mobility,
              discoveryIntent: request.discoveryIntent,
              timeBudget: request.timeBudget,
              foodPreferences: request.foodPreferences,
              companionId: request.companionId,
              contextSearchTerms: request.contextSearchTerms,
              contextSources: request.contextSources,
              contextParserSource: parsed?.source ?? contextParserSource,
            },
          });
        }
        const workspaceId =
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `ws-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const resultState = {
          recommendations,
          request,
          updatedAt: new Date().toISOString(),
          workspaceId,
          rootRequestId,
        };
        clearSelectedRecommendation();
        clearRecommendationTrip();
        writeRecommendationResult(resultState);
        writeRecommendationWorkflow('COMPARING');
        navigate('/ai/result', { state: { ...resultState, persistWorkspace: true } });
      },
      onError: () => {
        setSubmitFeedback('추천을 불러오지 못했어요. 보던 결과와 입력 내용은 그대로 유지했어요.');
      },
    });
  };

  const handleSubmit = () => {
    if (isQuotaExhausted || isSubmitting) return;
    const text = naturalContext.trim();

    if (!text || contextParsed) {
      requestRecommendations();
      return;
    }

    parseContext(
      { text },
      {
        onSuccess: (parsed) => {
          const conflicts = applyParsedContext(parsed);

          if (parsed.area?.trim() && !locationExplicit) {
            setSelectedLocationKey('destination');
            setSelectedDestination(null);
            setPinLocation(null);
            setPinFeedback(null);
            if (currentLocation.latitude != null && currentLocation.longitude != null) {
              setMapCenter({
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              });
            }
            setDestinationQuery(parsed.area.trim());
            setShowLocationPicker(true);
            setCardDirection('backward');
            setCardStep(0);
            setSubmitFeedback('지역 후보를 찾았어요. 정확한 위치만 선택해주세요.');
            return;
          }

          if (conflicts.length > 0) {
            setSubmitFeedback(
              conflicts.join('·') + '은 직접 고른 값과 달라서 직접 선택한 조건을 유지했어요.',
            );
          }
          requestRecommendations(parsed);
        },
        onError: () =>
          setSubmitFeedback(
            '문장을 해석하지 못했어요. 입력은 유지했으니 조건을 직접 고르거나 다시 시도해주세요.',
          ),
      },
    );
  };

  const handleContextNext = () => {
    // 3단계에서는 네트워크 요청 없이 바로 최종 기준 확인으로 이동한다.
    // 자연어 해석은 최종 추천 시점(handleSubmit)에서 수행하고,
    // 사용자가 4단계에서 직접 바꾼 값(touchedFields)을 우선한다.
    setSubmitFeedback(null);
    setCardDirection('forward');
    setCardStep(3);
  };

  const startNewRecommendation = () => {
    clearRecommendationDraft();
    clearRecommendationTrip();
    writeRecommendationWorkflow('EDITING');
    setExplorationRequest(undefined);
    setParsedFields([]);
    setStrictFoodPreferences(false);
    setStrictCompanionFoodPreferences(false);
    setNaturalContext('');
    setSelectedLocationKey('current');
    setLocationExplicit(false);
    setSelectedDestination(null);
    setDestinationQuery('');
    setCompanionId(null);
    setSoloQuickSelected(true);
    setFoodPreferences([]);
    setCompanionFoodPreferences([]);
    setOccasion('NORMAL');
    setMobility('WALK');
    setDiscoveryIntent('BALANCED');
    setTimeBudget('NORMAL');
    setRadiusMeters(1400);
    setQuickNearby(false);
    setTouchedFields(new Set());
    setContextParsed(false);
    setContextSearchTerms([]);
    setContextParserSource(undefined);
    setPromptSuggestions(null);
    setSelectedPromptSuggestionId(null);
    setSelectedPromptSuggestionGroupId(null);
    setSubmitFeedback(null);
    setCardDirection('forward');
    setCardStep(0);
    navigate('/ai?mode=new', { replace: true });
  };

  const nearbyFirstSelected = quickNearby;

  const cannotUseCurrentLocation =
    activeLocationKey === 'current' &&
    currentLocation.isResolved &&
    currentLocation.permissionDenied;
  const needsLocationBeforeSubmit = !effectiveLocation;
  const locationPickerOpen =
    showLocationPicker || needsLocationBeforeSubmit || cannotUseCurrentLocation;

  return (
    <S.Container>
      <S.Header>
        <S.Title>오늘 뭐 먹지?</S.Title>
        <S.Subtitle>위치와 동행자를 고르고, 원하는 건 한 번에 말해주세요.</S.Subtitle>
      </S.Header>

      {storedResult.recommendations?.length && storedResult.request ? (
        <S.ResumeCard>
          <S.ResumeTop>
            <div>
              <strong>보던 추천 이어보기</strong>
              <span>
                {storedResult.request.locationLabel ?? '이전 위치'} ·{' '}
                {storedResult.recommendations[0]?.placeName}
              </span>
            </div>
          </S.ResumeTop>
          <S.ResumeActions>
            <button type="button" onClick={() => navigate('/ai/result')}>
              이어보기
            </button>
            <button type="button" onClick={startNewRecommendation}>
              새로
            </button>
          </S.ResumeActions>
        </S.ResumeCard>
      ) : null}

      {((recommendationWorkspaces.data?.length ?? 0) > 0 ||
        (recommendationHistory.data?.length ?? 0) > 0) && (
        <S.CompactHistoryNote>
          최근 추천은 결과 화면의 더보기에서 확인할 수 있어요.
        </S.CompactHistoryNote>
      )}

      <S.CardFlowHeader>
        <S.CardProgressMeta>
          <span>{cardStep + 1} / 4</span>
          <strong>
            {
              ['어디에서 먹을까요?', '누구와 먹나요?', '원하는 걸 말해주세요', '기준 확인'][
                cardStep
              ]
            }
          </strong>
        </S.CardProgressMeta>
        <S.CardDots aria-label="추천 단계">
          {[0, 1, 2, 3].map((step) => (
            <span key={step} data-active={step === cardStep} data-done={step < cardStep} />
          ))}
        </S.CardDots>
      </S.CardFlowHeader>

      <S.CardDeck>
        <S.FlowCard key={cardStep} $direction={cardDirection}>
          {cardStep === 0 && (
            <>
              <S.FlowCardHeader>
                <S.FlowEyebrow>LOCATION</S.FlowEyebrow>
                <S.FlowTitle>어디에서 먹을까요?</S.FlowTitle>
                <S.FlowDescription>
                  현재 위치를 그대로 쓰거나, 오늘 만날 장소만 바꿔주세요.
                </S.FlowDescription>
              </S.FlowCardHeader>

              <S.LocationCard>
                <S.LocationSummary>
                  <div>
                    <MapPin size={17} />
                    <strong>{effectiveLocation?.label ?? '위치를 선택해주세요'}</strong>
                  </div>
                  <S.ChangeLocationButton
                    type="button"
                    onClick={() => setShowLocationPicker((value) => !value)}
                  >
                    {locationPickerOpen ? '닫기' : '변경'}
                  </S.ChangeLocationButton>
                </S.LocationSummary>

                {cannotUseCurrentLocation && (
                  <S.Warning>
                    현재 위치 권한을 사용할 수 없어요. 저장 위치나 다른 지역을 직접 선택해주세요.
                  </S.Warning>
                )}

                {locationPickerOpen && (
                  <S.DestinationArea>
                    <S.LocationOptions>
                      <S.LocationChip
                        type="button"
                        $selected={activeLocationKey === 'current'}
                        disabled={currentLocation.isResolved && currentLocation.permissionDenied}
                        onClick={() => {
                          setLocationExplicit(true);
                          setSelectedLocationKey('current');
                          setSelectedDestination(null);
                        }}
                      >
                        <LocateFixed size={14} /> 현재 위치
                      </S.LocationChip>

                      {homeLocations.map((savedLocation) => (
                        <S.LocationChip
                          key={savedLocation.id}
                          type="button"
                          $selected={activeLocationKey === `saved:${savedLocation.id}`}
                          onClick={() => {
                            setLocationExplicit(true);
                            setSelectedLocationKey(`saved:${savedLocation.id}`);
                            setSelectedDestination(null);
                            setShowLocationPicker(false);
                          }}
                        >
                          {savedLocation.label}
                        </S.LocationChip>
                      ))}

                      <S.LocationChip
                        type="button"
                        $selected={activeLocationKey === 'destination'}
                        onClick={beginDestinationSelection}
                      >
                        <Search size={14} /> 지도에서 선택
                      </S.LocationChip>
                    </S.LocationOptions>

                    {activeLocationKey === 'destination' && (
                      <>
                        {selectedDestination ? (
                          <S.SelectedDestination>
                            <div>
                              <strong>{selectedDestination.placeName}</strong>
                              <span>
                                {selectedDestination.address ??
                                  selectedDestination.category ??
                                  '선택한 지역'}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setMapCenter({
                                  latitude: selectedDestination.latitude,
                                  longitude: selectedDestination.longitude,
                                });
                                setSelectedDestination(null);
                                setPinLocation(null);
                                setPinFeedback(null);
                                setDestinationQuery('');
                              }}
                            >
                              다시 찾기
                            </button>
                          </S.SelectedDestination>
                        ) : (
                          <>
                            <S.SearchBox>
                              <Search size={16} />
                              <input
                                value={destinationQuery}
                                onChange={(event) => setDestinationQuery(event.target.value)}
                                placeholder="성수역, 강남역처럼 검색"
                              />
                              {destinationQuery && (
                                <button
                                  type="button"
                                  onClick={() => setDestinationQuery('')}
                                  aria-label="검색어 지우기"
                                >
                                  <X size={15} />
                                </button>
                              )}
                            </S.SearchBox>

                            {destinationSearch.isLoading && (
                              <S.SearchStatus>장소를 찾는 중...</S.SearchStatus>
                            )}
                            {!destinationSearch.isLoading && destinationSearch.data?.length ? (
                              <S.SearchResults>
                                {destinationSearch.data.slice(0, 5).map((destination) => (
                                  <button
                                    key={destination.locationId}
                                    type="button"
                                    onClick={() => previewDestination(destination)}
                                  >
                                    <MapPin size={15} />
                                    <span>
                                      <strong>{destination.placeName}</strong>
                                      <small>{destination.address ?? destination.category}</small>
                                    </span>
                                  </button>
                                ))}
                              </S.SearchResults>
                            ) : null}

                            {recentDestinations.length > 0 && !destinationQuery.trim() && (
                              <>
                                <S.RecentLocationLabel>최근 선택 위치</S.RecentLocationLabel>
                                <S.RecentRow>
                                  {recentDestinations.map((destination) => (
                                    <button
                                      key={destination.locationId}
                                      type="button"
                                      onClick={() => previewDestination(destination)}
                                    >
                                      {destination.placeName}
                                    </button>
                                  ))}
                                </S.RecentRow>
                              </>
                            )}

                            <LocationPinMap
                              center={mapCenter}
                              currentLocation={
                                currentLocation.latitude != null &&
                                currentLocation.longitude != null
                                  ? {
                                      latitude: currentLocation.latitude,
                                      longitude: currentLocation.longitude,
                                    }
                                  : null
                              }
                              onCenterChange={resolvePinLocation}
                            />

                            <S.PinLocationCard>
                              <div>
                                <strong>
                                  {pinLocation?.placeName ?? '핀으로 위치를 정해주세요'}
                                </strong>
                                <span>
                                  {pinLocation?.address ??
                                    pinFeedback ??
                                    '지도를 움직이거나 검색 결과를 눌러 핀을 옮길 수 있어요.'}
                                </span>
                              </div>
                              <button
                                type="button"
                                disabled={!pinLocation || reverseLocation.isPending}
                                onClick={() => pinLocation && handleSelectDestination(pinLocation)}
                              >
                                이 위치로 선택
                              </button>
                            </S.PinLocationCard>
                          </>
                        )}
                      </>
                    )}
                  </S.DestinationArea>
                )}
              </S.LocationCard>
            </>
          )}

          {cardStep === 1 && (
            <>
              <S.FlowCardHeader>
                <S.FlowEyebrow>COMPANION</S.FlowEyebrow>
                <S.FlowTitle>누구와 먹나요?</S.FlowTitle>
                <S.FlowDescription>
                  동행자를 고르면 함께 먹었던 기록을 참고해요. 메뉴를 대신 정하게 하진 않아요.
                </S.FlowDescription>
              </S.FlowCardHeader>

              <S.CompanionCardGrid>
                <S.CompanionChoice
                  type="button"
                  $selected={soloQuickSelected && companionId === null}
                  onClick={() => {
                    setCompanionId(null);
                    setCompanionFoodPreferences([]);
                    setStrictCompanionFoodPreferences(false);
                    setSoloQuickSelected(true);
                  }}
                >
                  <S.CompanionAvatar>
                    <Users size={18} />
                  </S.CompanionAvatar>
                  <span>
                    <strong>나 혼자</strong>
                    <small>내 기록과 취향으로 추천</small>
                  </span>
                </S.CompanionChoice>
                {companions.map((companion) => (
                  <S.CompanionChoice
                    key={companion.companionId}
                    type="button"
                    $selected={!soloQuickSelected && companionId === companion.companionId}
                    onClick={() => {
                      if (companion.companionId !== companionId) {
                        setCompanionFoodPreferences([]);
                        setStrictCompanionFoodPreferences(false);
                      }
                      setCompanionId(companion.companionId);
                      setSoloQuickSelected(false);
                    }}
                  >
                    <S.CompanionAvatar>{companion.displayName.slice(0, 1)}</S.CompanionAvatar>
                    <span>
                      <strong>{companion.displayName}</strong>
                      <small>함께 먹었던 기록도 참고</small>
                    </span>
                  </S.CompanionChoice>
                ))}
              </S.CompanionCardGrid>

              {companions.length === 0 && (
                <S.FlowHint>
                  등록된 동행자가 없어도 괜찮아요. 이 단계는 그대로 넘기면 됩니다.
                </S.FlowHint>
              )}
            </>
          )}

          {cardStep === 2 && (
            <>
              <S.FlowCardHeader>
                <S.FlowEyebrow>CONTEXT</S.FlowEyebrow>
                <S.FlowTitle>원하는 걸 편하게 말해주세요.</S.FlowTitle>
                <S.FlowDescription>
                  메뉴, 분위기, 시간 같은 걸 자연스럽게 한 번에 적으면 돼요. 비워도 괜찮아요.
                </S.FlowDescription>
              </S.FlowCardHeader>

              <S.PromptStageInput
                id="recommendation-context"
                aria-label="원하는 게 있으면 말해줘"
                value={naturalContext}
                onChange={(event) => {
                  const nextValue = event.target.value.slice(0, 500);
                  setNaturalContext(nextValue);
                  setContextParsed(false);
                  setContextSearchTerms([]);
                  setContextParserSource(undefined);
                  if (!nextValue.trim()) {
                    // An example that was selected and then deleted before submit is not a final use.
                    setSelectedPromptSuggestionId(null);
                    setSelectedPromptSuggestionGroupId(null);
                  }
                }}
                placeholder="예: 성수에서 친구랑 오래 얘기할 수 있고, 너무 무겁지 않은 메뉴였으면 좋겠어"
                rows={8}
              />

              <S.PromptSuggestionArea>
                <S.PromptSuggestionHeader>
                  <div>
                    <strong>이렇게 요청해 보세요</strong>
                    <span>예시를 눌러 넣은 뒤 마음대로 고쳐도 돼요.</span>
                  </div>
                  <button
                    type="button"
                    disabled={isPromptSuggestionPending}
                    onClick={() => requestPromptSuggestions(true, naturalContext)}
                  >
                    다른 예시 보기
                  </button>
                </S.PromptSuggestionHeader>

                {isPromptSuggestionPending && !promptSuggestions ? (
                  <S.PromptSuggestionStatus>
                    현재 조건에 맞는 예시를 만들고 있어요...
                  </S.PromptSuggestionStatus>
                ) : promptSuggestions?.suggestions?.length ? (
                  <>
                    <S.PromptSuggestionList>
                      {promptSuggestions.suggestions.map((suggestion) => (
                        <S.PromptSuggestionButton
                          key={suggestion.suggestionId}
                          type="button"
                          data-selected={selectedPromptSuggestionId === suggestion.suggestionId}
                          onClick={() =>
                            handlePromptSuggestionSelect(suggestion.suggestionId, suggestion.text)
                          }
                        >
                          {suggestion.text}
                        </S.PromptSuggestionButton>
                      ))}
                    </S.PromptSuggestionList>
                    <S.PromptSuggestionMeta>
                      {promptSuggestions.personalHistoryApplied
                        ? `최근 실제 사용 ${promptSuggestions.personalSampleCount}건을 참고했어요.`
                        : '아직 충분한 사용 이력이 없어 현재 조건을 중심으로 만들었어요.'}
                      {promptSuggestions.notice ? ` ${promptSuggestions.notice}` : ''}
                    </S.PromptSuggestionMeta>
                  </>
                ) : promptSuggestionError ? (
                  <S.PromptSuggestionStatus>
                    예시를 불러오지 못했어요. 직접 입력하거나 비워둔 채 넘어가도 돼요.
                  </S.PromptSuggestionStatus>
                ) : null}
              </S.PromptSuggestionArea>
            </>
          )}

          {cardStep === 3 && (
            <>
              <S.FlowCardHeader>
                <S.FlowEyebrow>READY</S.FlowEyebrow>
                <S.FlowTitle>마지막으로 기준만 확인해주세요.</S.FlowTitle>
                <S.FlowDescription>
                  프롬프트에서 읽은 값도 여기서 바로 바꿀 수 있어요. 아무것도 안 건드리면 기본
                  추천으로 갑니다.
                </S.FlowDescription>
              </S.FlowCardHeader>

              <S.CriteriaSummaryList>
                <S.CriteriaSummaryRow>
                  <span>위치</span>
                  <strong>{effectiveLocation?.label ?? '위치 선택 필요'}</strong>
                </S.CriteriaSummaryRow>
                <S.CriteriaSummaryRow>
                  <span>동행</span>
                  <strong>
                    {soloQuickSelected || companionId == null
                      ? '나 혼자'
                      : (selectedCompanion?.displayName ?? '동행자')}
                  </strong>
                </S.CriteriaSummaryRow>
                {naturalContext.trim() && (
                  <S.CriteriaSummaryRow $multiline>
                    <span>요청</span>
                    <strong>{naturalContext.trim()}</strong>
                  </S.CriteriaSummaryRow>
                )}
              </S.CriteriaSummaryList>

              <S.FinalCriteriaPanel>
                <S.OptionGroup>
                  <S.OptionLabel>빠른 조건</S.OptionLabel>
                  <S.OptionChips>
                    <S.OptionChip
                      type="button"
                      $selected={nearbyFirstSelected}
                      onClick={() => setQuickNearby((value) => !value)}
                    >
                      가까운 곳
                    </S.OptionChip>
                    <S.OptionChip
                      type="button"
                      $selected={discoveryIntent === 'NEW_PLACE'}
                      onClick={() => {
                        markTouched('discoveryIntent');
                        setDiscoveryIntent((value) =>
                          value === 'NEW_PLACE' ? 'BALANCED' : 'NEW_PLACE',
                        );
                      }}
                    >
                      새로운 곳
                    </S.OptionChip>
                    <S.OptionChip
                      type="button"
                      $selected={timeBudget === 'SHORT'}
                      onClick={() => {
                        markTouched('timeBudget');
                        setTimeBudget((value) => (value === 'SHORT' ? 'NORMAL' : 'SHORT'));
                      }}
                    >
                      시간 빠듯
                    </S.OptionChip>
                  </S.OptionChips>
                </S.OptionGroup>

                <S.OptionGroup>
                  <S.OptionLabel>식사 목적</S.OptionLabel>
                  <S.OptionChips>
                    {OCCASION_OPTIONS.map((option) => (
                      <S.OptionChip
                        key={option.value}
                        type="button"
                        $selected={occasion === option.value}
                        onClick={() => {
                          markTouched('occasion');
                          setOccasion(option.value);
                        }}
                      >
                        {option.label}
                      </S.OptionChip>
                    ))}
                  </S.OptionChips>
                  {occasion === 'FRIEND' && (
                    <S.GroupDecisionLink
                      type="button"
                      onClick={() => navigate('/decision-rooms/new')}
                    >
                      각자 조건을 입력하고 함께 정하기
                    </S.GroupDecisionLink>
                  )}
                </S.OptionGroup>

                <S.OptionGroup>
                  <S.OptionLabel>시간 여유</S.OptionLabel>
                  <S.OptionChips>
                    {TIME_BUDGET_OPTIONS.map((option) => (
                      <S.OptionChip
                        key={option.value}
                        type="button"
                        $selected={timeBudget === option.value}
                        onClick={() => {
                          markTouched('timeBudget');
                          setTimeBudget(option.value);
                        }}
                      >
                        {option.label}
                      </S.OptionChip>
                    ))}
                  </S.OptionChips>
                </S.OptionGroup>

                <S.OptionGroup>
                  <S.OptionLabel>이동수단</S.OptionLabel>
                  <S.OptionChips>
                    {MOBILITY_OPTIONS.map((option) => (
                      <S.OptionChip
                        key={option.value}
                        type="button"
                        $selected={mobility === option.value}
                        onClick={() => handleMobilityChange(option.value)}
                      >
                        {option.label}
                      </S.OptionChip>
                    ))}
                  </S.OptionChips>
                </S.OptionGroup>

                <S.OptionGroup>
                  <S.OptionLabel>방문 성향</S.OptionLabel>
                  <S.OptionChips>
                    {DISCOVERY_INTENT_OPTIONS.map((option) => (
                      <S.OptionChip
                        key={option.value}
                        type="button"
                        $selected={discoveryIntent === option.value}
                        onClick={() => {
                          markTouched('discoveryIntent');
                          setDiscoveryIntent(option.value);
                        }}
                      >
                        {option.label}
                      </S.OptionChip>
                    ))}
                  </S.OptionChips>
                </S.OptionGroup>

                <S.OptionGroup>
                  <S.OptionLabel>
                    내가 원하는 메뉴 <small>선택 · 최대 4개</small>
                  </S.OptionLabel>
                  <S.OptionHelp>
                    정한 메뉴가 있을 때만 골라주세요. 기본은 선호로만 반영해요.
                  </S.OptionHelp>
                  <S.OptionChips>
                    {FOOD_PREFERENCE_OPTIONS.map((food) => (
                      <S.OptionChip
                        key={food}
                        type="button"
                        $selected={foodPreferences.includes(food)}
                        onClick={() => handleToggleFood(food)}
                      >
                        {food}
                      </S.OptionChip>
                    ))}
                  </S.OptionChips>
                  {foodPreferences.length > 0 && (
                    <S.ConstraintChoice>
                      <button
                        type="button"
                        data-selected={!strictFoodPreferences}
                        onClick={() => setStrictFoodPreferences(false)}
                      >
                        먹고 싶은 메뉴예요
                      </button>
                      <button
                        type="button"
                        data-selected={strictFoodPreferences}
                        onClick={() => setStrictFoodPreferences(true)}
                      >
                        이 메뉴 아니면 제외
                      </button>
                    </S.ConstraintChoice>
                  )}
                </S.OptionGroup>

                {!soloQuickSelected && companionId != null && (
                  <S.OptionGroup>
                    <S.OptionLabel>
                      동행자가 원하는 메뉴 <small>선택 · 최대 4개</small>
                    </S.OptionLabel>
                    <S.OptionHelp>대화해서 정한 메뉴가 있을 때만 넣어주세요.</S.OptionHelp>
                    <S.OptionChips>
                      {FOOD_PREFERENCE_OPTIONS.map((food) => (
                        <S.OptionChip
                          key={food}
                          type="button"
                          aria-label={'동행자 메뉴 ' + food}
                          $selected={companionFoodPreferences.includes(food)}
                          onClick={() => handleToggleCompanionFood(food)}
                        >
                          {food}
                        </S.OptionChip>
                      ))}
                    </S.OptionChips>
                    {companionFoodPreferences.length > 0 && (
                      <S.ConstraintChoice>
                        <button
                          type="button"
                          data-selected={!strictCompanionFoodPreferences}
                          onClick={() => setStrictCompanionFoodPreferences(false)}
                        >
                          먹고 싶은 메뉴예요
                        </button>
                        <button
                          type="button"
                          data-selected={strictCompanionFoodPreferences}
                          onClick={() => setStrictCompanionFoodPreferences(true)}
                        >
                          이 메뉴 아니면 제외
                        </button>
                      </S.ConstraintChoice>
                    )}
                  </S.OptionGroup>
                )}
              </S.FinalCriteriaPanel>

              {explorationRequest && (
                <S.FlowHint>
                  이번 탐색에서 본 식당과 제외한 메뉴는 그대로 유지합니다.{' '}
                  <button type="button" onClick={startNewRecommendation}>
                    새 식사 시작
                  </button>
                </S.FlowHint>
              )}
              {Boolean(error) && (
                <S.ErrorText>추천을 불러오지 못했어요. 잠시 후 다시 시도해주세요.</S.ErrorText>
              )}
              {submitFeedback && <S.ErrorText role="status">{submitFeedback}</S.ErrorText>}
            </>
          )}

          <S.CardNavigation>
            {cardStep > 0 ? (
              <S.CardBackButton
                type="button"
                onClick={() => {
                  setCardDirection('backward');
                  setCardStep((step) => Math.max(0, step - 1));
                }}
              >
                <ChevronLeft size={18} /> 이전
              </S.CardBackButton>
            ) : (
              <span />
            )}

            {cardStep < 3 ? (
              <S.CardNextButton
                type="button"
                disabled={cardStep === 0 && needsLocationBeforeSubmit}
                onClick={() => {
                  if (cardStep === 2) {
                    handleContextNext();
                    return;
                  }
                  setCardDirection('forward');
                  setCardStep((step) => Math.min(3, step + 1));
                }}
              >
                {cardStep === 2 ? '기준 확인' : '다음'} <ChevronRight size={18} />
              </S.CardNextButton>
            ) : (
              <S.CardSubmitButton
                type="button"
                disabled={needsLocationBeforeSubmit || isSubmitting || isQuotaExhausted}
                onClick={handleSubmit}
              >
                {isParsingContext
                  ? '입력을 해석하는 중...'
                  : isPending
                    ? '먹을 곳을 고르는 중...'
                    : '지금 먹을 곳 골라줘'}
              </S.CardSubmitButton>
            )}
          </S.CardNavigation>

          {cardStep === 3 && !isDevelopmentUnlimited && usage && (
            <S.UsageInline>
              {isQuotaExhausted
                ? '오늘 추천을 모두 사용했어요.'
                : `오늘 ${usage.remainingCount}회 남았어요.`}
            </S.UsageInline>
          )}
        </S.FlowCard>
      </S.CardDeck>
    </S.Container>
  );
};

export default AI;
