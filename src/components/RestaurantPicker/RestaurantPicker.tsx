import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, MapPin, PenLine, Search, Sparkles } from 'lucide-react';
import { BottomSheet } from '~/components/BottomSheet/BottomSheet';
import type { RestaurantCandidate } from '~/apis/record/record.types';
import { useRestaurantSearch } from '~/features/records/record.queries';
import type { RestaurantPickerProps } from './RestaurantPicker.types';
import * as S from './RestaurantPicker.styles';

const getMeta = (candidate: RestaurantCandidate) => candidate.address?.trim() || '주소 정보 없음';

const createManualCandidate = (placeName: string): RestaurantCandidate => {
  const hash = Array.from(placeName).reduce(
    (value, character) => (Math.imul(value, 31) + (character.codePointAt(0) ?? 0)) >>> 0,
    2166136261,
  );

  return {
    kakaoPlaceId: `manual-${hash.toString(36)}`,
    placeName,
    category: '직접 입력',
  };
};

export const RestaurantPicker = ({
  value,
  options,
  recommendedRestaurant,
  latitude,
  longitude,
  onChange,
}: RestaurantPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [pendingValue, setPendingValue] = useState<RestaurantCandidate | null>(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 280);
    return () => window.clearTimeout(timer);
  }, [query]);

  const {
    data: searchedOptions = [],
    isFetching: isSearching,
    isError: isSearchError,
    refetch: retrySearch,
  } = useRestaurantSearch(debouncedQuery, latitude, longitude);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ko-KR');
    if (!normalizedQuery) return options;

    const localMatches = options.filter((candidate) =>
      [candidate.placeName, candidate.category, candidate.address]
        .filter(Boolean)
        .some((text) => text?.toLocaleLowerCase('ko-KR').includes(normalizedQuery)),
    );

    const merged = new Map<string, RestaurantCandidate>();
    [...localMatches, ...searchedOptions].forEach((candidate) =>
      merged.set(candidate.kakaoPlaceId, candidate),
    );
    return [...merged.values()];
  }, [options, query, searchedOptions]);

  const recommendedId = recommendedRestaurant?.kakaoPlaceId;
  const normalizedQuery = query.trim();
  const isSettledQuery = normalizedQuery === debouncedQuery;
  const canUseManualEntry = normalizedQuery.length >= 2 && isSettledQuery && !isSearching;

  const selectManualEntry = () => {
    setPendingValue(createManualCandidate(normalizedQuery));
  };

  return (
    <>
      <S.Trigger
        type="button"
        onClick={() => {
          setPendingValue(value);
          setQuery('');
          setDebouncedQuery('');
          setIsOpen(true);
        }}
        aria-haspopup="dialog"
      >
        <S.TriggerIcon>
          <MapPin size={19} strokeWidth={2.4} aria-hidden="true" />
        </S.TriggerIcon>
        <S.TriggerCopy>
          <S.TriggerName>{value?.placeName ?? '식당을 선택해주세요'}</S.TriggerName>
          <S.TriggerMeta>{value ? getMeta(value) : '근처 식당 후보 보기'}</S.TriggerMeta>
        </S.TriggerCopy>
        <ChevronDown size={19} color="currentColor" aria-hidden="true" />
      </S.Trigger>

      <BottomSheet
        isOpen={isOpen}
        title="식당 선택"
        ariaLabel="식당 후보 선택"
        closeLabel="식당 선택 닫기"
        actionLabel="이 식당으로 선택"
        actionDisabled={!pendingValue}
        onClose={() => setIsOpen(false)}
        onAction={() => {
          if (!pendingValue) return;
          onChange(pendingValue);
          setIsOpen(false);
        }}
      >
        <S.SearchBox>
          <Search size={18} strokeWidth={2.2} aria-hidden="true" />
          <S.SearchInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="식당 이름 또는 주소"
            aria-label="식당 후보 검색"
          />
        </S.SearchBox>
        <S.ResultSummary>
          <span>
            {isSearching
              ? '지도에서 식당 찾는 중'
              : query.trim()
                ? `검색 결과 ${filteredOptions.length}개`
                : `가까운 후보 ${options.length}개`}
          </span>
          <span>{query.trim() ? '전국 식당 검색' : '주소로 확인해 주세요'}</span>
        </S.ResultSummary>
        {isSearchError && canUseManualEntry ? (
          <S.SearchNotice role="alert">
            <span>지도 검색이 잠시 불안정해요.</span>
            <button type="button" onClick={() => void retrySearch()}>
              다시 검색
            </button>
          </S.SearchNotice>
        ) : null}
        {filteredOptions.length > 0 ? (
          <S.RestaurantList>
            {filteredOptions.map((candidate) => {
              const isSelected = pendingValue?.kakaoPlaceId === candidate.kakaoPlaceId;
              const isRecommended = recommendedId === candidate.kakaoPlaceId;

              return (
                <S.RestaurantCard
                  key={candidate.kakaoPlaceId}
                  type="button"
                  $selected={isSelected}
                  aria-pressed={isSelected}
                  onClick={() => setPendingValue(candidate)}
                >
                  <S.RestaurantCopy>
                    <S.NameRow>
                      <S.RestaurantName>{candidate.placeName}</S.RestaurantName>
                      {isRecommended && (
                        <S.RecommendBadge>
                          <Sparkles size={10} aria-hidden="true" /> 자동 선택
                        </S.RecommendBadge>
                      )}
                    </S.NameRow>
                    <S.RestaurantMeta>{getMeta(candidate)}</S.RestaurantMeta>
                  </S.RestaurantCopy>
                  <S.CheckCircle $selected={isSelected}>
                    {isSelected && <Check size={15} strokeWidth={3} aria-hidden="true" />}
                  </S.CheckCircle>
                </S.RestaurantCard>
              );
            })}
          </S.RestaurantList>
        ) : isSearching || !isSettledQuery ? (
          <S.EmptyResult>지도에서 식당을 찾고 있어요.</S.EmptyResult>
        ) : normalizedQuery.length < 2 ? (
          <S.EmptyResult>식당 이름을 두 글자 이상 입력해 주세요.</S.EmptyResult>
        ) : (
          <S.EmptyResult>
            <strong>지도 검색 결과가 없어요.</strong>
            <span>상호가 새로 생겼거나 등록되지 않았다면 직접 기록할 수 있어요.</span>
          </S.EmptyResult>
        )}
        {canUseManualEntry && (
          <S.ManualEntryButton
            type="button"
            $selected={
              pendingValue?.kakaoPlaceId === createManualCandidate(normalizedQuery).kakaoPlaceId
            }
            onClick={selectManualEntry}
          >
            <S.ManualIcon>
              <PenLine size={17} aria-hidden="true" />
            </S.ManualIcon>
            <span>
              <strong>‘{normalizedQuery}’ 직접 기록</strong>
              <small>원하는 검색 결과가 없을 때 사용하세요</small>
            </span>
            <ChevronDown size={17} aria-hidden="true" />
          </S.ManualEntryButton>
        )}
      </BottomSheet>
    </>
  );
};
