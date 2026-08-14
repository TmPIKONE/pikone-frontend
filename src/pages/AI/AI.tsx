import { useEffect, useMemo, useState } from 'react';
import { Clock, MapPin, Navigation, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrentLocation } from '~/hooks/useCurrentLocation';
import {
  useRecommendationLocationSearch,
  useRecommendations,
  useRecommendationUsage,
} from '~/features/recommendations/recommendation.queries';
import {
  readRecentRecommendationDestinations,
  writeRecentRecommendationDestinations,
  writeRecommendationResult,
} from '~/features/recommendations/recommendationStorage';
import { useHomeLocations } from '~/features/homeLocations/homeLocation.queries';
import CompanionSelector from '~/components/CompanionSelector/CompanionSelector';
import AccordionStep from '~/components/AccordionStep/AccordionStep';
import {
  DISTANCE_OPTIONS,
  FOOD_PREFERENCE_OPTIONS,
  PURPOSE_OPTIONS,
  RECOMMENDATION_PRIORITY_OPTIONS,
  type RecommendationLocationResponse,
  type RecommendationPriority,
  type RecommendationRequest,
} from '~/apis/recommendation/recommendation.types';
import * as S from './AI.styles';

const TOTAL_REQUIRED_STEPS = 2;
const MAX_FOOD_PREFERENCES = 4;
const MAX_RECENT_DESTINATIONS = 4;

const AI = () => {
  const navigate = useNavigate();
  const currentLocation = useCurrentLocation();
  const { data: homeLocations = [] } = useHomeLocations();
  const recommendationUsage = useRecommendationUsage();

  const [selectedLocationKey, setSelectedLocationKey] = useState('current');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [debouncedDestinationQuery, setDebouncedDestinationQuery] = useState('');
  const [selectedDestination, setSelectedDestination] =
    useState<RecommendationLocationResponse | null>(null);
  const [recentDestinations, setRecentDestinations] = useState<RecommendationLocationResponse[]>(
    readRecentRecommendationDestinations,
  );

  const [companionId, setCompanionId] = useState<number | null>(null);
  const [purposes, setPurposes] = useState<string[]>([]);
  const [foodPreferences, setFoodPreferences] = useState<string[]>([]);
  const [priority, setPriority] = useState<RecommendationPriority>('BALANCED');
  const [radiusMeters, setRadiusMeters] = useState(1400);

  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [editingStep, setEditingStep] = useState<1 | 2 | null>(null);

  const { mutate: getRecommendations, isPending, error } = useRecommendations();
  const usage = recommendationUsage.data;
  const isQuotaExhausted = usage?.exhausted ?? false;
  const activeLocationKey =
    selectedLocationKey === 'current' &&
    currentLocation.isResolved &&
    currentLocation.permissionDenied &&
    homeLocations.length > 0
      ? `saved:${homeLocations[0].id}`
      : selectedLocationKey;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedDestinationQuery(destinationQuery.trim());
    }, 300);
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

    if (selectedSavedLocation) {
      return {
        latitude: selectedSavedLocation.latitude,
        longitude: selectedSavedLocation.longitude,
        label: selectedSavedLocation.label,
      };
    }

    if (currentLocation.latitude != null && currentLocation.longitude != null) {
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

  const completedCount = (step1Done ? 1 : 0) + (step2Done ? 1 : 0);

  const handleSelectCompanion = (id: number | null) => {
    setCompanionId(id);
    setStep1Done(true);
    setEditingStep(null);
  };

  const handleConfirmStep2 = () => {
    setStep2Done(true);
    setEditingStep(null);
  };

  const handleSelectDestination = (destination: RecommendationLocationResponse) => {
    setSelectedDestination(destination);
    setDestinationQuery('');

    setRecentDestinations((previous) => {
      const next = [
        destination,
        ...previous.filter((item) => item.locationId !== destination.locationId),
      ].slice(0, MAX_RECENT_DESTINATIONS);
      return writeRecentRecommendationDestinations(next);
    });
  };

  const handleToggleFood = (food: string) => {
    setFoodPreferences((previous) => {
      if (previous.includes(food)) {
        return previous.filter((item) => item !== food);
      }
      if (previous.length >= MAX_FOOD_PREFERENCES) {
        return previous;
      }
      return [...previous, food];
    });
  };

  const handleSubmit = () => {
    if (!effectiveLocation || isQuotaExhausted) return;

    const request: RecommendationRequest = {
      latitude: effectiveLocation.latitude,
      longitude: effectiveLocation.longitude,
      locationLabel: effectiveLocation.label,
      purposes: purposes.length > 0 ? purposes : undefined,
      foodPreferences: foodPreferences.length > 0 ? foodPreferences : undefined,
      companionId: companionId ?? undefined,
      priority,
      radiusMeters,
    };

    getRecommendations(request, {
      onSuccess: (recommendations) => {
        const resultState = { recommendations, request };
        writeRecommendationResult(resultState);
        navigate('/ai/result', { state: resultState });
      },
    });
  };

  const companionSummary = companionId === null ? '혼자' : '동반자 선택됨';
  const purposeSummary = purposes.length > 0 ? purposes.join(', ') : '상관없음';
  const cannotUseCurrentLocation =
    activeLocationKey === 'current' &&
    currentLocation.isResolved &&
    currentLocation.permissionDenied &&
    !selectedSavedLocation;
  const locationValue =
    effectiveLocation?.label ??
    (activeLocationKey === 'destination' ? '갈 장소를 검색해주세요' : undefined);

  return (
    <S.Container>
      <S.Hero>
        <S.Title>오늘, 어디서 뭐 먹지?</S.Title>
      </S.Hero>

      <S.UsageCard $exhausted={isQuotaExhausted}>
        <S.UsageHeader>
          <S.UsageText>
            <S.UsageEyebrow $exhausted={isQuotaExhausted}>오늘 추천</S.UsageEyebrow>
            <S.UsageTitle $exhausted={isQuotaExhausted}>
              {recommendationUsage.isLoading
                ? '사용 횟수를 확인하고 있어요'
                : recommendationUsage.error
                  ? '추천할 때 서버에서 횟수를 확인해요'
                  : isQuotaExhausted
                    ? '오늘 추천을 모두 사용했어요'
                    : `${usage?.remainingCount ?? 0}번 남았어요`}
            </S.UsageTitle>
          </S.UsageText>
          {usage && (
            <S.UsageCount $exhausted={isQuotaExhausted}>
              {usage.usedCount}/{usage.dailyLimit}회 사용
            </S.UsageCount>
          )}
        </S.UsageHeader>

        <S.UsageDots aria-label={usage ? `오늘 ${usage.usedCount}회 사용` : '추천 횟수 확인 중'}>
          {Array.from({ length: usage?.dailyLimit ?? 3 }).map((_, index) => (
            <S.UsageDot
              key={index}
              $used={index < (usage?.usedCount ?? 0)}
              $exhausted={isQuotaExhausted}
            />
          ))}
        </S.UsageDots>
        <S.UsageHint $exhausted={isQuotaExhausted}>
          추천받기와 다시 고르기는 각각 1회 사용 · 매일 0시 초기화
        </S.UsageHint>
      </S.UsageCard>

      <S.LocationSection>
        <S.SectionHeader>
          <S.SectionLabel>어디 주변에서 찾을까요?</S.SectionLabel>
          {locationValue && <S.LocationValue>{locationValue}</S.LocationValue>}
        </S.SectionHeader>

        <S.LocationChipRow>
          <S.LocationChip
            type="button"
            $selected={activeLocationKey === 'current'}
            disabled={currentLocation.isResolved && currentLocation.permissionDenied}
            onClick={() => setSelectedLocationKey('current')}
          >
            <Navigation size={13} />
            {currentLocation.isResolved ? '현재 위치' : '위치 확인 중'}
          </S.LocationChip>

          {homeLocations.map((location) => (
            <S.LocationChip
              key={location.id}
              type="button"
              $selected={activeLocationKey === `saved:${location.id}`}
              onClick={() => setSelectedLocationKey(`saved:${location.id}`)}
            >
              <MapPin size={13} />
              {location.label}
            </S.LocationChip>
          ))}

          <S.LocationChip
            type="button"
            $selected={activeLocationKey === 'destination'}
            onClick={() => setSelectedLocationKey('destination')}
          >
            <Search size={13} />갈 장소 검색
          </S.LocationChip>
        </S.LocationChipRow>

        {activeLocationKey === 'destination' && (
          <S.DestinationPanel>
            {selectedDestination ? (
              <S.SelectedDestination>
                <S.SelectedDestinationIcon>
                  <MapPin size={16} />
                </S.SelectedDestinationIcon>
                <S.SelectedDestinationText>
                  <strong>{selectedDestination.placeName}</strong>
                  <span>{selectedDestination.address || '선택한 장소 주변'}</span>
                </S.SelectedDestinationText>
                <S.ChangeDestinationButton
                  type="button"
                  onClick={() => {
                    setSelectedDestination(null);
                    setDestinationQuery('');
                  }}
                >
                  변경
                </S.ChangeDestinationButton>
              </S.SelectedDestination>
            ) : (
              <>
                <S.DestinationSearchBox>
                  <Search size={16} />
                  <S.DestinationInput
                    value={destinationQuery}
                    onChange={(event) => setDestinationQuery(event.target.value)}
                    placeholder="강남역, 성수역, 약속 장소 검색"
                    aria-label="추천받을 목적지 검색"
                    maxLength={80}
                  />
                  {destinationQuery && (
                    <S.ClearSearchButton
                      type="button"
                      aria-label="검색어 지우기"
                      onClick={() => setDestinationQuery('')}
                    >
                      <X size={14} />
                    </S.ClearSearchButton>
                  )}
                </S.DestinationSearchBox>

                {destinationQuery.trim().length < 2 && recentDestinations.length === 0 && (
                  <S.DestinationHint>
                    지금 있는 곳이 아니라, 앞으로 갈 동네나 약속 장소 기준으로 추천받을 수 있어요.
                  </S.DestinationHint>
                )}

                {destinationQuery.trim().length < 2 && recentDestinations.length > 0 && (
                  <S.RecentDestinationSection>
                    <S.RecentDestinationLabel>
                      <Clock size={12} /> 최근 목적지
                    </S.RecentDestinationLabel>
                    <S.RecentDestinationRow>
                      {recentDestinations.map((destination) => (
                        <S.RecentDestinationChip
                          key={destination.locationId}
                          type="button"
                          onClick={() => handleSelectDestination(destination)}
                        >
                          {destination.placeName}
                        </S.RecentDestinationChip>
                      ))}
                    </S.RecentDestinationRow>
                  </S.RecentDestinationSection>
                )}

                {destinationSearch.isFetching && (
                  <S.DestinationStatus>장소를 찾고 있어요...</S.DestinationStatus>
                )}

                {!!destinationSearch.error && (
                  <S.DestinationStatus>
                    장소 검색에 실패했어요. 다시 입력해주세요.
                  </S.DestinationStatus>
                )}

                {!destinationSearch.isFetching &&
                  debouncedDestinationQuery.length >= 2 &&
                  destinationSearch.data?.length === 0 && (
                    <S.DestinationStatus>
                      검색 결과가 없어요. 역이나 건물 이름으로 찾아보세요.
                    </S.DestinationStatus>
                  )}

                {!!destinationSearch.data?.length && (
                  <S.DestinationResultList>
                    {destinationSearch.data.map((destination) => (
                      <S.DestinationResultButton
                        key={destination.locationId}
                        type="button"
                        onClick={() => handleSelectDestination(destination)}
                      >
                        <S.ResultLocationIcon>
                          <MapPin size={15} />
                        </S.ResultLocationIcon>
                        <S.DestinationResultText>
                          <strong>{destination.placeName}</strong>
                          <span>
                            {[destination.category, destination.address]
                              .filter(Boolean)
                              .join(' · ')}
                          </span>
                        </S.DestinationResultText>
                      </S.DestinationResultButton>
                    ))}
                  </S.DestinationResultList>
                )}
              </>
            )}
          </S.DestinationPanel>
        )}
      </S.LocationSection>

      <S.ProgressSection>
        <S.ProgressHeader>
          <strong>추천 준비</strong>
          <S.ProgressLabel>
            {completedCount}/{TOTAL_REQUIRED_STEPS}
          </S.ProgressLabel>
        </S.ProgressHeader>
        <S.ProgressBarTrack>
          <S.ProgressBarFill $percent={(completedCount / TOTAL_REQUIRED_STEPS) * 100} />
        </S.ProgressBarTrack>
      </S.ProgressSection>

      {cannotUseCurrentLocation && homeLocations.length === 0 && (
        <S.LocationWarning>
          현재 위치 권한이 꺼져 있어요. 위의 ‘갈 장소 검색’에서 원하는 지역을 직접 고를 수 있어요.
        </S.LocationWarning>
      )}

      <S.StepList>
        <AccordionStep
          stepNumber={1}
          title="누구와 함께 드시나요?"
          isCompleted={step1Done}
          isEditing={editingStep === 1}
          summaryLabel="누구와 함께"
          summaryValue={companionSummary}
          onEditClick={() => setEditingStep(1)}
        >
          <CompanionSelector value={companionId} onChange={handleSelectCompanion} />
        </AccordionStep>

        {step1Done && (
          <AccordionStep
            stepNumber={2}
            title="어떤 자리인가요?"
            isCompleted={step2Done}
            isEditing={editingStep === 2}
            summaryLabel="오늘의 자리"
            summaryValue={purposeSummary}
            onEditClick={() => setEditingStep(2)}
            footer={
              (!step2Done || editingStep === 2) && (
                <S.ConfirmButton type="button" onClick={handleConfirmStep2}>
                  선택 완료
                </S.ConfirmButton>
              )
            }
          >
            <S.ChipRow>
              {PURPOSE_OPTIONS.map((purpose) => (
                <S.Chip
                  key={purpose}
                  type="button"
                  $selected={purposes.includes(purpose)}
                  onClick={() =>
                    setPurposes((previous) => (previous.includes(purpose) ? [] : [purpose]))
                  }
                >
                  {purpose}
                </S.Chip>
              ))}
            </S.ChipRow>
            <S.OptionalHint>고르지 않아도 추천받을 수 있어요.</S.OptionalHint>
          </AccordionStep>
        )}
      </S.StepList>

      {step2Done && (
        <S.PreferenceCard>
          <S.PreferenceTitle>딱 맞게 좁혀볼까요?</S.PreferenceTitle>

          <S.OptionGroup>
            <S.OptionLabel>오늘 가장 중요한 기준</S.OptionLabel>
            <S.ChipRow>
              {RECOMMENDATION_PRIORITY_OPTIONS.map((option) => (
                <S.Chip
                  key={option.value}
                  type="button"
                  $selected={priority === option.value}
                  onClick={() => setPriority(option.value)}
                >
                  {option.label}
                </S.Chip>
              ))}
            </S.ChipRow>
          </S.OptionGroup>

          <S.OptionGroup>
            <S.OptionLabel>이동 범위</S.OptionLabel>
            <S.ChipRow>
              {DISTANCE_OPTIONS.map((option) => (
                <S.Chip
                  key={option.value}
                  type="button"
                  $selected={radiusMeters === option.value}
                  onClick={() => setRadiusMeters(option.value)}
                >
                  {option.label}
                </S.Chip>
              ))}
            </S.ChipRow>
          </S.OptionGroup>

          <S.OptionGroup>
            <S.OptionLabel>
              먹고 싶은 메뉴{' '}
              <S.OptionalText>선택 안 해도 돼요 · 최대 {MAX_FOOD_PREFERENCES}개</S.OptionalText>
            </S.OptionLabel>
            <S.ChipRow>
              <S.Chip
                type="button"
                $selected={foodPreferences.length === 0}
                onClick={() => setFoodPreferences([])}
              >
                상관없음
              </S.Chip>
              {FOOD_PREFERENCE_OPTIONS.map((food) => (
                <S.Chip
                  key={food}
                  type="button"
                  $selected={foodPreferences.includes(food)}
                  onClick={() => handleToggleFood(food)}
                >
                  {food}
                </S.Chip>
              ))}
            </S.ChipRow>
            <S.OptionalHint>메뉴를 고르지 않으면 주변 식당 전체에서 골라드려요.</S.OptionalHint>
          </S.OptionGroup>
        </S.PreferenceCard>
      )}

      {!!error && !isQuotaExhausted && (
        <S.ErrorText>추천을 받아오지 못했어요. 잠시 후 다시 시도해주세요.</S.ErrorText>
      )}

      {step2Done && (
        <S.SubmitButton
          type="button"
          onClick={handleSubmit}
          disabled={isPending || !effectiveLocation || isQuotaExhausted}
        >
          {isPending
            ? '딱 맞는 3곳을 고르는 중...'
            : isQuotaExhausted
              ? '오늘 추천 3회 사용 완료'
              : effectiveLocation
                ? '이 위치 주변 3곳만 골라줘'
                : '추천받을 장소를 먼저 골라주세요'}
        </S.SubmitButton>
      )}
    </S.Container>
  );
};

export default AI;
