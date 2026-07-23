import CompanionSelector from '~/components/CompanionSelector/CompanionSelector';
import PlaceTypeWheelPicker from '~/components/PlaceTypeWheelPicker/PlaceTypeWheelPicker';
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
  onApplyAnalysis,
  onRetryAnalysis,
  foodName,
  onFoodNameChange,
  selectedRestaurant,
  onSelectRestaurant,
  companionId,
  onCompanionChange,
  visitDate,
  onVisitDateChange,
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
  const hasAnalysisFailed = !isAnalyzing && !analysis;
  const hasRestaurants = !!analysis && analysis.restaurants.length > 0;

  return (
    <S.Container>
      {/* AI 분석 상태 배너 — 항상 맨 위, 상태에 따라 셋 중 하나만 표시 */}
      {isAnalyzing && (
        <S.AnalysisBanner $state="analyzing">
          <S.Spinner />
          <S.AnalysisText>AI가 사진을 분석하고 있어요...</S.AnalysisText>
        </S.AnalysisBanner>
      )}

      {!isAnalyzing && analysis && (
        <S.AnalysisBanner $state="ready">
          <S.AnalysisText>AI가 분석을 끝냈어요.</S.AnalysisText>
          <S.UseAnalysisButton type="button" onClick={onApplyAnalysis}>
            분석 내용 사용하기
          </S.UseAnalysisButton>
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

      {/* 직접 입력 폼 — AI 분석 대기 중에도 바로 편집 가능 */}
      <S.Field>
        <S.Label>음식 이름</S.Label>
        <S.Input
          value={foodName}
          onChange={(e) => onFoodNameChange(e.target.value)}
          placeholder="음식 이름을 입력해주세요"
        />
      </S.Field>

      {analysis && analysis.foodTags.length > 0 && (
        <S.TagRow>
          {analysis.foodTags.map((tag) => (
            <S.Tag key={tag}>{tag}</S.Tag>
          ))}
        </S.TagRow>
      )}

      <S.Field>
        <S.Label>어디서 드셨어요?</S.Label>

        {isAnalyzing && <S.StatusBox>근처 식당을 찾고 있어요...</S.StatusBox>}

        {hasAnalysisFailed && (
          <S.EmptyRestaurantBox>
            분석에 실패해서 식당 후보를 찾지 못했어요. 위의 '다시 시도'를 눌러주세요.
          </S.EmptyRestaurantBox>
        )}

        {!isAnalyzing &&
          analysis &&
          (hasRestaurants ? (
            <S.RestaurantList>
              {analysis.restaurants.map((candidate) => (
                <S.RestaurantCard
                  key={candidate.kakaoPlaceId}
                  type="button"
                  $selected={selectedRestaurant?.kakaoPlaceId === candidate.kakaoPlaceId}
                  onClick={() => onSelectRestaurant(candidate)}
                >
                  <S.RestaurantName>{candidate.placeName}</S.RestaurantName>
                  <S.RestaurantMeta>
                    {[candidate.category, candidate.address].filter(Boolean).join(' · ')}
                  </S.RestaurantMeta>
                </S.RestaurantCard>
              ))}
            </S.RestaurantList>
          ) : (
            <S.EmptyRestaurantBox>
              근처 식당을 찾지 못했어요. 위치 권한을 허용했는지 확인하고 다시 촬영해보세요.
            </S.EmptyRestaurantBox>
          ))}
      </S.Field>

      <CompanionSelector value={companionId} onChange={onCompanionChange} />

      <S.Field>
        <S.Label>방문 날짜</S.Label>
        <S.Input
          type="date"
          value={visitDate}
          onChange={(e) => onVisitDateChange(e.target.value)}
        />
      </S.Field>

      <S.Field>
        <S.Label>장소 유형</S.Label>
        <PlaceTypeWheelPicker
          value={locationType}
          options={LOCATION_TYPE_OPTIONS}
          onChange={(value) => onLocationTypeChange(value as LocationType)}
        />
      </S.Field>

      <S.ToggleRow>
        <S.ToggleLabel>재방문 의사가 있어요</S.ToggleLabel>
        <S.Switch $on={willRevisit} onClick={() => onWillRevisitChange(!willRevisit)} />
      </S.ToggleRow>

      <S.ToggleRow>
        <S.ToggleLabel>다른 사람에게 공개할래요</S.ToggleLabel>
        <S.Switch $on={isPublic} onClick={() => onIsPublicChange(!isPublic)} />
      </S.ToggleRow>

      <S.ButtonRow>
        <S.BackButton type="button" onClick={onBack} disabled={isSaving}>
          이전
        </S.BackButton>
        <S.SaveButton
          type="button"
          onClick={onSave}
          disabled={isSaving || !selectedRestaurant || !foodName.trim()}
        >
          {isSaving ? '저장 중...' : '기록하기'}
        </S.SaveButton>
      </S.ButtonRow>
    </S.Container>
  );
};

export default Step2Save;
