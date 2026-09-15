import { Bell, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePendingDraftCount } from '~/features/drafts/draft.queries';
import * as S from './HomeDateNavigator.styles';

export const HomeDateNavigator = () => {
  const navigate = useNavigate();
  const { data: pendingCount = 0 } = usePendingDraftCount();

  return (
    <S.Shell aria-label="홈 메뉴">
      <S.HeaderRow>
        <S.Brand type="button" onClick={() => navigate('/home')} aria-label="PIKONE 홈">
          <S.BrandName>𝗣𝗶𝗸𝗼𝗻𝗲</S.BrandName>
        </S.Brand>

        <S.HeaderActions>
          <S.IconButton type="button" aria-label="소식" onClick={() => navigate('/draft')}>
            <Bell size={25} strokeWidth={2.35} />
            {pendingCount > 0 && (
              <S.NotificationBadge>{pendingCount > 9 ? '9+' : pendingCount}</S.NotificationBadge>
            )}
          </S.IconButton>

          <S.IconButton
            type="button"
            aria-label="설정"
            onClick={() => navigate('/mypage/settings')}
          >
            <Settings size={25} strokeWidth={2.35} />
          </S.IconButton>
        </S.HeaderActions>
      </S.HeaderRow>
    </S.Shell>
  );
};
