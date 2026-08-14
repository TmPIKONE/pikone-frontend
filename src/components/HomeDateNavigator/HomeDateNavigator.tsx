import { useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, TouchEvent } from 'react';
import { Bell, CalendarDays, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HomeDatePicker } from '~/components/HomeDatePicker/HomeDatePicker';
import { usePendingDraftCount } from '~/features/drafts/draft.queries';
import { addLocalDays, parseLocalDate, toLocalIsoDate } from '~/utils/date';
import type { HomeDateNavigatorProps } from './HomeDateNavigator.types';
import * as S from './HomeDateNavigator.styles';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;
const SWIPE_THRESHOLD_PX = 42;

const formatDate = (value: string) => {
  const date = parseLocalDate(value);
  return `${date.getMonth() + 1}.${date.getDate()}`;
};

const formatSideDate = (value: string) => {
  const date = parseLocalDate(value);
  return `${formatDate(value)} ${WEEKDAYS[date.getDay()]}`;
};

export const HomeDateNavigator = ({ selectedDate, onDateChange }: HomeDateNavigatorProps) => {
  const navigate = useNavigate();
  const touchStartX = useRef<number | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const { data: pendingCount = 0 } = usePendingDraftCount();
  const today = useMemo(() => toLocalIsoDate(new Date()), []);
  const previousDate = addLocalDays(selectedDate, -1);
  const nextDate = addLocalDays(selectedDate, 1);
  const isToday = selectedDate === today;

  const moveDate = (amount: number) => onDateChange(addLocalDays(selectedDate, amount));

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft') moveDate(-1);
    if (event.key === 'ArrowRight') moveDate(1);
    if (event.key === 'Home') onDateChange(today);
  };

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const distance = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(distance) >= SWIPE_THRESHOLD_PX) moveDate(distance > 0 ? -1 : 1);
  };

  return (
    <>
      <S.Shell
        aria-label="기록 날짜 선택"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <S.HeaderRow>
          <S.ModuleTabs>
            <S.ActiveModule>기록</S.ActiveModule>
          </S.ModuleTabs>

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

        <S.DateRail>
          <S.SideDate type="button" onClick={() => onDateChange(previousDate)}>
            {formatSideDate(previousDate)}
          </S.SideDate>
          <S.CurrentDate type="button" onClick={() => setIsDatePickerOpen(true)}>
            <strong>{formatDate(selectedDate)}</strong>
            {isToday && <span>오늘</span>}
          </S.CurrentDate>
          <S.SideDate type="button" onClick={() => onDateChange(nextDate)}>
            {formatSideDate(nextDate)}
          </S.SideDate>
        </S.DateRail>
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
