import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Sparkles, Heart, MessageCircleMore } from 'lucide-react';
import type { RecommendationResponse } from '~/apis/recommendation/recommendation.types';
import * as S from './AIResult.styles';

interface AIResultLocationState {
  recommendations?: RecommendationResponse[];
}

const getTypeBadge = (recommendType?: string) => {
  if (recommendType === 'MY_TASTE') {
    return {
      variant: 'taste' as const,
      label: '내 취향 저격',
      icon: <Heart size={11} fill="currentColor" strokeWidth={0} />,
    };
  }
  if (recommendType === 'NEW_PLACE') {
    return {
      variant: 'new' as const,
      label: '새로운 발견',
      icon: <Sparkles size={11} />,
    };
  }
  return null;
};

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
        <S.BackButton onClick={() => navigate('/ai')} aria-label="뒤로 가기">
          <ArrowLeft size={20} />
        </S.BackButton>
        <S.Title>추천 결과</S.Title>
      </S.HeaderRow>

      {recommendations.length > 0 ? (
        <S.ResultList>
          {recommendations.map((item, index) => {
            const typeBadge = getTypeBadge(item.recommendType);
            const isTopPick = index === 0;

            return (
              <S.ResultCard key={item.kakaoPlaceId} $isTopPick={isTopPick}>
                {isTopPick && (
                  <S.TopPickRibbon>
                    <Sparkles size={10} />
                    AI 첫 번째 추천
                  </S.TopPickRibbon>
                )}

                <S.NameRow>
                  <S.PlaceName>{item.placeName}</S.PlaceName>
                  {item.distance != null && (
                    <S.DistanceTag>
                      <MapPin size={12} />
                      {item.distance}m
                    </S.DistanceTag>
                  )}
                </S.NameRow>

                <S.MetaRow>
                  {typeBadge && (
                    <S.TypeBadge $variant={typeBadge.variant}>
                      {typeBadge.icon}
                      {typeBadge.label}
                    </S.TypeBadge>
                  )}
                  {item.category && <S.MetaTag>{item.category}</S.MetaTag>}
                  {item.address && <S.MetaTag>{item.address}</S.MetaTag>}
                </S.MetaRow>

                {item.recommendationReason && (
                  <S.ReasonBox>
                    <S.ReasonIcon>
                      <MessageCircleMore size={14} />
                    </S.ReasonIcon>
                    <S.RecommendReason>{item.recommendationReason}</S.RecommendReason>
                  </S.ReasonBox>
                )}
              </S.ResultCard>
            );
          })}
        </S.ResultList>
      ) : (
        <S.EmptyState>조건에 맞는 추천을 찾지 못했어요.</S.EmptyState>
      )}

      <S.RetryButton onClick={() => navigate('/ai')}>다시 추천받기</S.RetryButton>
    </S.Container>
  );
};

export default AIResult;
