import * as S from './Step2Analyze.styles';
import type { Step2AnalyzeProps } from './Step2Analyze.types';

const Step2Analyze = ({
  isAnalyzing,
  analysis,
  foodName,
  onFoodNameChange,
  selectedRestaurant,
  onSelectRestaurant,
  onNext,
  onBack,
}: Step2AnalyzeProps) => {
  if (isAnalyzing) {
    return (
      <S.Container>
        <S.StatusBox>AI가 사진을 분석하고 있어요...</S.StatusBox>
      </S.Container>
    );
  }

  if (!analysis) {
    return (
      <S.Container>
        <S.StatusBox>분석에 실패했어요. 다시 시도해주세요.</S.StatusBox>
        <S.ButtonRow>
          <S.BackButton type="button" onClick={onBack}>
            다시 촬영
          </S.BackButton>
        </S.ButtonRow>
      </S.Container>
    );
  }

  const hasRestaurants = analysis.restaurants.length > 0;

  return (
    <S.Container>
      <S.Field>
        <S.Label>음식 이름</S.Label>
        <S.Input value={foodName} onChange={(e) => onFoodNameChange(e.target.value)} />
      </S.Field>

      {analysis.foodTags.length > 0 && (
        <S.TagRow>
          {analysis.foodTags.map((tag) => (
            <S.Tag key={tag}>{tag}</S.Tag>
          ))}
        </S.TagRow>
      )}

      <S.Field>
        <S.Label>어디서 드셨어요?</S.Label>

        {hasRestaurants ? (
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
        )}
      </S.Field>

      <S.ButtonRow>
        <S.BackButton type="button" onClick={onBack}>
          다시 촬영
        </S.BackButton>
        <S.NextButton
          type="button"
          disabled={!selectedRestaurant || !foodName.trim()}
          onClick={onNext}
        >
          다음
        </S.NextButton>
      </S.ButtonRow>
    </S.Container>
  );
};

export default Step2Analyze;
