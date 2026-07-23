import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePendingDraftCount } from '~/hooks/usePendingDraftCount';
import * as S from './PendingDraftBanner.styles';

export const PendingDraftBanner = () => {
  const navigate = useNavigate();
  const { data: pendingCount } = usePendingDraftCount();

  if (!pendingCount || pendingCount <= 0) {
    return null;
  }

  return (
    <S.Banner type="button" onClick={() => navigate('/draft')}>
      <S.Icon>
        <span>!</span>
      </S.Icon>
      <S.Copy>
        <strong>함께 작성한 기록이 도착했어요</strong>
        <span>확인 대기 중인 기록 {pendingCount}개</span>
      </S.Copy>
      <ChevronRight size={20} strokeWidth={2.3} />
    </S.Banner>
  );
};
