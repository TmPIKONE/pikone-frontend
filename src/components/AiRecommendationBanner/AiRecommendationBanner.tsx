import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as S from './AiRecommendationBanner.styles';

export const AiRecommendationBanner = () => {
  const navigate = useNavigate();

  return (
    <S.Banner type="button" onClick={() => navigate('/ai')}>
      <S.TopRow>
        <S.Theme>👨🏻‍🍳 취향 코치</S.Theme>
        <span>나의 하루</span>
      </S.TopRow>
      <S.Score>
        <strong>오늘 뭐 먹지?</strong>
        <span>기록을 읽고 골라드려요</span>
      </S.Score>
      <S.Mascot aria-hidden="true">
        <span>🍳</span>
      </S.Mascot>
      <S.Action>
        PIKONE AI 추천받기
        <ArrowRight size={19} strokeWidth={2.5} />
      </S.Action>
    </S.Banner>
  );
};
