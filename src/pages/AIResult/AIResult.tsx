import { useLocation, useNavigate } from 'react-router-dom';
import type { RecommendationResponse } from '~/apis/recommendation/recommendation.types';
import * as S from './AIResult.styles';

interface AIResultLocationState {
  recommendations?: RecommendationResponse[];
}

const AIResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { recommendations } = (location.state as AIResultLocationState) ?? {};

  if (!recommendations) {
    return (
      <S.Container>
        <S.EmptyState>
          <span>추천 결과가 없어요. 다시 추천받아보세요.</span>
          <S.RetryButton onClick={() => navigate('/ai')}>추천받으러 가기</S.RetryButton>
        </S.EmptyState>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.HeaderRow>
        <S.BackButton onClick={() => navigate('/ai')}>{'<'}</S.BackButton>
        <S.Title>추천 결과</S.Title>
      </S.HeaderRow>

      {recommendations.length > 0 ? (
        <S.ResultList>
          {recommendations.map((item) => (
            <S.ResultCard key={item.kakaoPlaceId}>
              <S.NameRow>
                <S.PlaceName>{item.placeName}</S.PlaceName>
                {item.distance != null && <S.DistanceTag>{item.distance}m</S.DistanceTag>}
              </S.NameRow>

              <S.MetaRow>
                {item.category && <S.MetaTag>{item.category}</S.MetaTag>}
                {item.address && <S.MetaTag>{item.address}</S.MetaTag>}
                {item.recommendType && <S.MetaTag>{item.recommendType}</S.MetaTag>}
              </S.MetaRow>

              {item.recommendationReason && (
                <S.RecommendReason>{item.recommendationReason}</S.RecommendReason>
              )}
            </S.ResultCard>
          ))}
        </S.ResultList>
      ) : (
        <S.EmptyState>조건에 맞는 추천을 찾지 못했어요.</S.EmptyState>
      )}

      <S.RetryButton onClick={() => navigate('/ai')}>다시 추천받기</S.RetryButton>
    </S.Container>
  );
};

export default AIResult;
