import { useState } from 'react';
import { CalendarDays, Check, ChevronDown } from 'lucide-react';
import MultiCompanionSelector from '~/components/MultiCompanionSelector/MultiCompanionSelector';
import { HomeDatePicker } from '~/components/HomeDatePicker/HomeDatePicker';
import { RestaurantPicker } from '~/components/RestaurantPicker/RestaurantPicker';
import Switch from '~/components/Switch/Switch';
import { MAX_RECORDS_PER_DAY } from '~/features/records/record.constants';
import { parseLocalDate } from '~/utils/date';
import * as S from './Step2Save.styles';
import type { Step2SaveProps } from './Step2Save.types';
import type { LocationType } from '~/apis/record/record.types';

const LOCATION_TYPE_OPTIONS: { value: LocationType; label: string }[] = [
  { value: 'RESTAURANT', label: '식당' },
  { value: 'HOME', label: '집' },
  { value: 'OFFICE', label: '회사' },
  { value: 'DELIVERY', label: '배달' },
];

const Step2Save = ({
  isAnalyzing,
  analysis,
  onRetryAnalysis,
  foodName,
  onFoodNameChange,
  selectedRestaurant,
  onSelectRestaurant,
  companionIds,
  onCompanionChange,
  latitude,
  longitude,
  visitDate,
  onVisitDateChange,
  existingRecordCount,
  isDateCapacityLoading,
  willRevisit,
  onWillRevisitChange,
  isPublic,
  onIsPublicChange,
  locationType,
  onLocationTypeChange,
  isSaving,
  onSave,
  onBack,
}: Step2SaveProps) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const hasAnalysisFailed = !isAnalyzing && !analysis;
  const isDateLimitReached = existingRecordCount >= MAX_RECORDS_PER_DAY;
  const visitDateLabel = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(parseLocalDate(visitDate));

  return (
    <S.Container>
      <S.PageTitle>
        확인만 하면
        <br />
        기록 끝
      </S.PageTitle>
      <S.PageDescription>사진으로 채운 메뉴와 식당이 맞는지만 봐주세요.</S.PageDescription>

      {/* AI 분석 상태 배너 — 항상 맨 위, 상태에 따라 셋 중 하나만 표시 */}
      {isAnalyzing && (
        <S.AnalysisBanner $state="analyzing">
          <S.Spinner />
          <S.AnalysisText>AI가 사진을 분석하고 있어요...</S.AnalysisText>
        </S.AnalysisBanner>
      )}

      {!isAnalyzing && analysis && (
        <S.AnalysisBanner $state="ready">
          <Check size={18} strokeWidth={2.8} aria-hidden="true" />
          <S.AnalysisText>자동으로 채웠어요. 틀린 부분만 눌러 바꾸세요.</S.AnalysisText>
        </S.AnalysisBanner>
      )}

      {hasAnalysisFailed && (
        <S.AnalysisBanner $state="error">
          <S.AnalysisText>AI 분석에 실패했어요.</S.AnalysisText>
          <S.RetryButton type="button" onClick={onRetryAnalysis}>
            다시 시도
          </S.RetryButton>
        </S.AnalysisBanner>
      )}

      <S.AutoCard>
        <S.Field>
          <S.Label htmlFor="record-food-name">메뉴</S.Label>
          <S.Input
            id="record-food-name"
            value={foodName}
            onChange={(e) => onFoodNameChange(e.target.value)}
            placeholder="메뉴 이름"
          />
        </S.Field>

        <S.Field>
          <S.Label>식당</S.Label>

          {isAnalyzing && <S.StatusBox>근처 식당을 찾고 있어요...</S.StatusBox>}

          {hasAnalysisFailed && (
            <S.EmptyRestaurantBox>
              자동 탐색에 실패했어요. 식당 이름을 검색해 직접 고를 수 있어요.
            </S.EmptyRestaurantBox>
          )}

          {!isAnalyzing && (
            <RestaurantPicker
              value={selectedRestaurant}
              options={analysis?.restaurants ?? []}
              recommendedRestaurant={analysis?.recommendedRestaurant}
              latitude={latitude}
              longitude={longitude}
              onChange={onSelectRestaurant}
            />
          )}
        </S.Field>
      </S.AutoCard>

      <MultiCompanionSelector value={companionIds} onChange={onCompanionChange} />

      <S.Field>
        <S.Label>방문 날짜</S.Label>
        <S.DatePickerButton type="button" onClick={() => setIsDatePickerOpen(true)}>
          <S.DateIcon>
            <CalendarDays size={19} strokeWidth={2.3} aria-hidden="true" />
          </S.DateIcon>
          <span>{visitDateLabel}</span>
          <ChevronDown size={19} aria-hidden="true" />
        </S.DatePickerButton>
      </S.Field>

      {isDatePickerOpen && (
        <HomeDatePicker
          isOpen
          selectedDate={visitDate}
          title="방문 날짜 선택"
          ariaLabel="방문 날짜 선택"
          actionLabel="날짜선택"
          onClose={() => setIsDatePickerOpen(false)}
          onDateChange={onVisitDateChange}
        />
      )}

      <S.Field>
        <S.Label>어떤 식사였나요?</S.Label>
        <S.LocationTypeRow>
          {LOCATION_TYPE_OPTIONS.map((option) => (
            <S.LocationTypeChip
              key={option.value}
              type="button"
              $active={locationType === option.value}
              onClick={() => onLocationTypeChange(option.value)}
            >
              {option.label}
            </S.LocationTypeChip>
          ))}
        </S.LocationTypeRow>
      </S.Field>

      <S.OptionsCard>
        <S.ToggleRow>
          <S.ToggleCopy>
            <S.ToggleLabel>또 가고 싶어요</S.ToggleLabel>
          </S.ToggleCopy>
          <Switch checked={willRevisit} onChange={onWillRevisitChange} ariaLabel="재방문 의사" />
        </S.ToggleRow>

        <S.ToggleRow>
          <S.ToggleCopy>
            <S.ToggleLabel>동행자에게 공개</S.ToggleLabel>
          </S.ToggleCopy>
          <Switch checked={isPublic} onChange={onIsPublicChange} ariaLabel="기록 공개 여부" />
        </S.ToggleRow>
      </S.OptionsCard>

      <S.ButtonRow>
        <S.BackButton type="button" onClick={onBack} disabled={isSaving}>
          이전
        </S.BackButton>
        <S.SaveButton
          type="button"
          onClick={onSave}
          disabled={
            isSaving ||
            isDateCapacityLoading ||
            isDateLimitReached ||
            !selectedRestaurant ||
            !foodName.trim()
          }
        >
          {isSaving ? '저장 중...' : isDateLimitReached ? '다른 날짜를 골라주세요' : '기록하기'}
        </S.SaveButton>
      </S.ButtonRow>
    </S.Container>
  );
};

export default Step2Save;
