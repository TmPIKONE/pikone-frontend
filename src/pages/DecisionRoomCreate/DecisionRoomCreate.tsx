import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  LocateFixed,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  FOOD_PREFERENCE_OPTIONS,
  type RecommendationLocationResponse,
  type RecommendationOccasion,
  type RecommendationRequest,
} from '~/apis/recommendation/recommendation.types';
import { DateTimeWheelPicker } from '~/components/DateTimeWheelPicker/DateTimeWheelPicker';
import { useCreateDecisionRoom } from '~/features/decisionRooms/decisionRoom.queries';
import { writeDecisionRoomParticipantToken } from '~/features/decisionRooms/decisionRoomStorage';
import { useRecommendationLocationSearch } from '~/features/recommendations/recommendation.queries';
import { useCurrentLocation } from '~/hooks/useCurrentLocation';
import * as S from './DecisionRoomCreate.styles';

const ROOM_OCCASION_OPTIONS = [
  { value: 'QUICK_MEAL', label: '빠른 한 끼' },
  { value: 'DATE', label: '데이트' },
  { value: 'FRIEND', label: '친구 모임' },
  { value: 'FAMILY', label: '가족 식사' },
  { value: 'NORMAL', label: '편한 식사' },
  { value: 'SPECIAL', label: '특별한 날' },
] as const satisfies readonly { value: RecommendationOccasion; label: string }[];

const DISTANCE_OPTIONS = [
  { value: 1400, label: '가까이', description: '만날 곳에서 1.5km' },
  { value: 3000, label: '보통', description: '만날 곳에서 3km' },
  { value: 5000, label: '넓게', description: '만날 곳에서 5km' },
] as const;

const DecisionRoomCreate = () => {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const sourceRequest = (
    routeLocation.state as {
      recommendationRequest?: RecommendationRequest;
    } | null
  )?.recommendationRequest;
  const [searchParams] = useSearchParams();
  const companionName = searchParams.get('companionName')?.trim() ?? '';
  const currentLocation = useCurrentLocation();
  const createRoom = useCreateDecisionRoom();

  const [title, setTitle] = useState(() =>
    companionName ? `${companionName}님과 식사` : '같이 먹을 곳 정하기',
  );
  const [mealAt, setMealAt] = useState('');
  const [isDateTimePickerOpen, setIsDateTimePickerOpen] = useState(false);
  const [occasion, setOccasion] = useState<RecommendationOccasion>(
    () => sourceRequest?.occasion ?? 'FRIEND',
  );
  const [foodPreferences, setFoodPreferences] = useState<string[]>(
    () => sourceRequest?.foodPreferences ?? [],
  );
  const [maxDistanceMeters, setMaxDistanceMeters] = useState(
    () => sourceRequest?.radiusMeters ?? 3000,
  );
  const [locationMode, setLocationMode] = useState<'current' | 'search'>(() =>
    sourceRequest ? 'search' : 'search',
  );
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<RecommendationLocationResponse | null>(
    () =>
      sourceRequest
        ? {
            locationId: `recommendation:${sourceRequest.latitude}:${sourceRequest.longitude}`,
            placeName: sourceRequest.locationLabel ?? '이전 추천 위치',
            latitude: sourceRequest.latitude,
            longitude: sourceRequest.longitude,
          }
        : null,
  );
  const [showPreferences, setShowPreferences] = useState(
    Boolean(sourceRequest?.foodPreferences?.length || sourceRequest?.occasion),
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  const locationSearch = useRecommendationLocationSearch(
    debouncedQuery,
    currentLocation.latitude,
    currentLocation.longitude,
    locationMode === 'search' && !selectedLocation,
  );

  const mealAtLabel = useMemo(() => {
    if (!mealAt) return '날짜와 시간을 선택해주세요';
    const date = new Date(mealAt);
    if (Number.isNaN(date.getTime())) return '날짜와 시간을 선택해주세요';
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }, [mealAt]);

  const effectiveLocation = useMemo(() => {
    if (locationMode === 'search') {
      return selectedLocation
        ? {
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            label: selectedLocation.placeName,
          }
        : null;
    }

    if (currentLocation.latitude == null || currentLocation.longitude == null) return null;
    return {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      label: '현재 위치',
    };
  }, [currentLocation.latitude, currentLocation.longitude, locationMode, selectedLocation]);

  const toggleFood = (food: string) => {
    setFoodPreferences((previous) =>
      previous.includes(food)
        ? previous.filter((value) => value !== food)
        : previous.length >= 4
          ? previous
          : [...previous, food],
    );
  };

  const handleLocationMode = (mode: 'current' | 'search') => {
    setLocationMode(mode);
    setQuery('');
    if (mode === 'current') setSelectedLocation(null);
  };

  const handleCreate = () => {
    if (!title.trim() || !effectiveLocation || createRoom.isPending) return;

    createRoom.mutate(
      {
        title: title.trim(),
        mealAt: mealAt || undefined,
        occasion: showPreferences ? occasion : undefined,
        foodPreferences: showPreferences && foodPreferences.length ? foodPreferences : undefined,
        meetingLatitude: effectiveLocation.latitude,
        meetingLongitude: effectiveLocation.longitude,
        meetingLocationLabel: effectiveLocation.label,
        meetingRadiusMeters: maxDistanceMeters,
      },
      {
        onSuccess: (response) => {
          writeDecisionRoomParticipantToken(response.inviteCode, response.hostParticipantToken);
          navigate(`/decision-room/${response.inviteCode}`);
        },
      },
    );
  };

  const backDestination = companionName ? '/companion' : '/ai';

  return (
    <S.Page>
      <S.TopBar>
        <S.IconButton
          type="button"
          aria-label="뒤로 가기"
          onClick={() => navigate(backDestination)}
        >
          <ArrowLeft size={22} strokeWidth={2.2} />
        </S.IconButton>
        <S.TopBarTitle>약속 만들기</S.TopBarTitle>
        <S.TopBarSpacer aria-hidden="true" />
      </S.TopBar>

      <S.Intro>
        <S.Title>같이 먹을 곳을 정해볼까요?</S.Title>
        <S.Description>
          {companionName
            ? `${companionName}님과 먹을 약속이에요. 꼭 필요한 것만 먼저 정해요.`
            : '먼저 만날 위치를 정하고, 링크를 보내 취향만 가볍게 맞춰보세요.'}
        </S.Description>
      </S.Intro>

      <S.Section>
        <S.SectionHeading>
          <S.SectionIcon aria-hidden="true">
            <CalendarDays size={18} />
          </S.SectionIcon>
          <div>
            <strong>약속 정보</strong>
            <span>이름과 시간은 나중에 친구들이 다시 확인하기 쉬워요.</span>
          </div>
        </S.SectionHeading>

        <S.Field>
          <S.Label htmlFor="decision-title">약속 이름</S.Label>
          <S.Input
            id="decision-title"
            value={title}
            maxLength={80}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="예: 금요일 저녁, 성수에서 만나기"
          />
        </S.Field>

        <S.Field>
          <S.Label>
            날짜 · 시간 <S.OptionalText>선택</S.OptionalText>
          </S.Label>
          <S.DateTimeButton
            type="button"
            $selected={Boolean(mealAt)}
            onClick={() => setIsDateTimePickerOpen(true)}
            aria-label={`약속 날짜와 시간 ${mealAt ? mealAtLabel : '선택'}`}
          >
            <span>
              <CalendarDays size={18} strokeWidth={2.1} aria-hidden="true" />
              <span>
                <strong>{mealAt ? mealAtLabel : '날짜와 시간을 선택해주세요'}</strong>
                <small>
                  {mealAt ? '눌러서 다시 선택할 수 있어요' : '휠을 돌려 편하게 정할 수 있어요'}
                </small>
              </span>
            </span>
            <ChevronRight size={18} strokeWidth={2.2} aria-hidden="true" />
          </S.DateTimeButton>
        </S.Field>
      </S.Section>

      <S.Section>
        <S.SectionHeading>
          <S.SectionIcon aria-hidden="true">
            <MapPin size={18} />
          </S.SectionIcon>
          <div>
            <strong>만날 위치</strong>
            <span>이 위치 주변에서 함께 갈 식당을 찾아요.</span>
          </div>
        </S.SectionHeading>

        <S.SegmentedControl role="tablist" aria-label="만날 위치 선택 방법">
          <S.SegmentButton
            type="button"
            role="tab"
            aria-selected={locationMode === 'current'}
            $selected={locationMode === 'current'}
            onClick={() => handleLocationMode('current')}
          >
            <LocateFixed size={15} /> 현재 위치 근처
          </S.SegmentButton>
          <S.SegmentButton
            type="button"
            role="tab"
            aria-selected={locationMode === 'search'}
            $selected={locationMode === 'search'}
            onClick={() => handleLocationMode('search')}
          >
            <MapPin size={15} /> 직접 찾기
          </S.SegmentButton>
        </S.SegmentedControl>

        {locationMode === 'current' ? (
          <S.LocationState $ready={Boolean(effectiveLocation)}>
            <LocateFixed size={17} />
            <div>
              <strong>
                {!currentLocation.isResolved
                  ? '현재 위치 확인 중'
                  : effectiveLocation
                    ? '현재 위치 근처에서 만날게요'
                    : '위치 권한을 확인해주세요'}
              </strong>
              <span>
                {effectiveLocation
                  ? '현재 위치 주변 식당을 만날 후보로 찾아요.'
                  : '권한을 허용하거나 직접 찾기로 위치를 선택할 수 있어요.'}
              </span>
            </div>
          </S.LocationState>
        ) : (
          <S.SearchArea>
            <S.Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelectedLocation(null);
              }}
              placeholder="성수역, 강남역, 건물명"
              aria-label="만날 위치 검색"
            />

            {selectedLocation && (
              <S.LocationState $ready>
                <MapPin size={17} />
                <div>
                  <strong>{selectedLocation.placeName}</strong>
                  <span>{selectedLocation.address || '선택한 위치'}</span>
                </div>
              </S.LocationState>
            )}

            {!selectedLocation && !!locationSearch.data?.length && (
              <S.SearchResults>
                {locationSearch.data.map((location) => (
                  <S.SearchResult
                    key={location.locationId}
                    type="button"
                    onClick={() => setSelectedLocation(location)}
                  >
                    <MapPin size={15} aria-hidden="true" />
                    <span>
                      <strong>{location.placeName}</strong>
                      <small>{location.address || location.category}</small>
                    </span>
                  </S.SearchResult>
                ))}
              </S.SearchResults>
            )}
          </S.SearchArea>
        )}
      </S.Section>

      <S.OptionalSection>
        <S.OptionalToggle
          type="button"
          aria-expanded={showPreferences}
          onClick={() => setShowPreferences((value) => !value)}
        >
          <span>
            <S.SectionIcon aria-hidden="true">
              <Sparkles size={18} />
            </S.SectionIcon>
            <span>
              <strong>취향 · 검색 범위</strong>
              <small>기본값으로도 바로 약속을 만들 수 있어요.</small>
            </span>
          </span>
          {showPreferences ? <ChevronUp size={19} /> : <ChevronDown size={19} />}
        </S.OptionalToggle>

        {showPreferences && (
          <S.OptionalContent>
            <S.Field>
              <S.Label>식당 검색 범위</S.Label>
              <S.DistanceGrid>
                {DISTANCE_OPTIONS.map((option) => (
                  <S.DistanceButton
                    key={option.value}
                    type="button"
                    $selected={maxDistanceMeters === option.value}
                    onClick={() => setMaxDistanceMeters(option.value)}
                  >
                    <strong>{option.label}</strong>
                    <span>{option.description}</span>
                  </S.DistanceButton>
                ))}
              </S.DistanceGrid>
            </S.Field>

            <S.Field>
              <S.Label>어떤 자리인가요?</S.Label>
              <S.ChipRow>
                {ROOM_OCCASION_OPTIONS.map((option) => (
                  <S.Chip
                    key={option.value}
                    type="button"
                    $selected={occasion === option.value}
                    onClick={() => setOccasion(option.value)}
                  >
                    {option.label}
                  </S.Chip>
                ))}
              </S.ChipRow>
            </S.Field>

            <S.Field>
              <S.Label>
                먹고 싶은 메뉴 <S.OptionalText>최대 4개</S.OptionalText>
              </S.Label>
              <S.ChipRow>
                {FOOD_PREFERENCE_OPTIONS.map((food) => (
                  <S.Chip
                    key={food}
                    type="button"
                    $selected={foodPreferences.includes(food)}
                    onClick={() => toggleFood(food)}
                  >
                    {food}
                  </S.Chip>
                ))}
              </S.ChipRow>
            </S.Field>
          </S.OptionalContent>
        )}
      </S.OptionalSection>

      <DateTimeWheelPicker
        isOpen={isDateTimePickerOpen}
        value={mealAt}
        onClose={() => setIsDateTimePickerOpen(false)}
        onChange={setMealAt}
        onClear={() => setMealAt('')}
        actionLabel="이 시간으로 선택"
      />

      {createRoom.isError && (
        <S.ErrorText role="alert">약속을 만들지 못했어요. 잠시 후 다시 시도해주세요.</S.ErrorText>
      )}

      <S.BottomBar>
        <S.SubmitButton
          type="button"
          disabled={!title.trim() || !effectiveLocation || createRoom.isPending}
          onClick={handleCreate}
        >
          {createRoom.isPending ? '약속 만드는 중...' : '약속 만들기'}
        </S.SubmitButton>
      </S.BottomBar>
    </S.Page>
  );
};

export default DecisionRoomCreate;
