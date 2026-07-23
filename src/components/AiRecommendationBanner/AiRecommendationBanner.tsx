import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as S from './AiRecommendationBanner.styles';

export const AiRecommendationBanner = () => {
  const navigate = useNavigate();

  return (
    <S.Banner type="button" onClick={() => navigate('/ai')}>
      <S.Copy>

        <S.Title>
          오늘 뭐 먹을지
          <br />
          고민된다면?
        </S.Title>

        <S.Description>
          내 기록과 취향을 바탕으로
          <br />
          AI가 오늘의 맛집을 추천해드려요.
        </S.Description>

        <S.Action>
          AI 추천받기
          <ArrowRight size={17} strokeWidth={2.5} />
        </S.Action>
      </S.Copy>
    </S.Banner>
  );
};