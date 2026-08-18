import { useState } from 'react';
import { Bell, CalendarDays, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HomeDatePicker } from '~/components/HomeDatePicker/HomeDatePicker';
import { usePendingDraftCount } from '~/features/drafts/draft.queries';
import type { HomeDateNavigatorProps } from './HomeDateNavigator.types';
import * as S from './HomeDateNavigator.styles';

export const HomeDateNavigator = ({ selectedDate, onDateChange }: HomeDateNavigatorProps) => {
  const navigate = useNavigate();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const { data: pendingCount = 0 } = usePendingDraftCount();

  return (
    <>
      <S.Shell aria-label="홈 메뉴">
        <S.HeaderRow>
          <S.ActiveModule>기록</S.ActiveModule>

          <S.HeaderActions>
            <S.IconButton type="button" aria-label="AI 추천" onClick={() => navigate('/ai')}>
              <Sparkles size={25} strokeWidth={2.4} />
            </S.IconButton>
            <S.IconButton
              type="button"
              aria-label="날짜 선택"
              onClick={() => setIsDatePickerOpen(true)}
            >
              <CalendarDays size={24} strokeWidth={2.2} />
            </S.IconButton>
            <S.IconButton type="button" aria-label="대기 기록" onClick={() => navigate('/draft')}>
              <Bell size={24} strokeWidth={2.2} />
              {pendingCount > 0 && (
                <S.NotificationBadge>{pendingCount > 9 ? '9+' : pendingCount}</S.NotificationBadge>
              )}
            </S.IconButton>
          </S.HeaderActions>
        </S.HeaderRow>
      </S.Shell>

      {isDatePickerOpen && (
        <HomeDatePicker
          isOpen
          selectedDate={selectedDate}
          onClose={() => setIsDatePickerOpen(false)}
          onDateChange={onDateChange}
        />
      )}
    </>
  );
};
