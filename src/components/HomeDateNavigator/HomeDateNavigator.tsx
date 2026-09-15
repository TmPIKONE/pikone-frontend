import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePendingDraftCount } from '~/features/drafts/draft.queries';
import * as S from './HomeDateNavigator.styles';

export const HomeDateNavigator = () => {
  const navigate = useNavigate();
  const { data: pendingCount = 0 } = usePendingDraftCount();

  return (
    <S.Shell aria-label="홈 메뉴">
      <S.HeaderRow>
        <S.ActiveModule>기록</S.ActiveModule>

        <S.HeaderActions>
          <S.IconButton type="button" aria-label="대기 기록" onClick={() => navigate('/draft')}>
            <Bell size={24} strokeWidth={2.2} />
            {pendingCount > 0 && (
              <S.NotificationBadge>{pendingCount > 9 ? '9+' : pendingCount}</S.NotificationBadge>
            )}
          </S.IconButton>
        </S.HeaderActions>
      </S.HeaderRow>
    </S.Shell>
  );
};
