import { useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, TouchEvent } from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HomeDatePicker } from '~/components/HomeDatePicker/HomeDatePicker';
import { usePendingDraftCount } from '~/hooks/usePendingDraftCount';
import type { HomeDateNavigatorProps } from './HomeDateNavigator.types';
import * as S from './HomeDateNavigator.styles';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;
const SWIPE_THRESHOLD_PX = 42;

const parseLocalDate = (value: string) => new Date(`${value}T00:00:00`);

const toLocalIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const addDays = (value: string, amount: number) => {
  const date = parseLocalDate(value);
  date.setDate(date.getDate() + amount);
  return toLocalIsoDate(date);
};

const formatMonthDay = (value: string) => {
  const date = parseLocalDate(value);
  return `${date.getMonth() + 1}.${date.getDate()}`;
};

const formatHeaderDate = (value: string) => {
  const date = parseLocalDate(value);

  return {
    year: `${date.getFullYear()}년`,
    monthDay: `${date.getMonth() + 1}월 ${date.getDate()}일`,
  };
};

const getWeekday = (value: string) => WEEKDAYS[parseLocalDate(value).getDay()];

const getAccessibleDate = (value: string) =>
  new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(parseLocalDate(value));

export const HomeDateNavigator = ({
  selectedDate,
  onDateChange,
}: HomeDateNavigatorProps) => {
  const navigate = useNavigate();
  const touchStartX = useRef<number | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const { data: pendingCount = 0 } = usePendingDraftCount();
  const today = useMemo(() => toLocalIsoDate(new Date()), []);
  const previousDate = addDays(selectedDate, -1);
  const nextDate = addDays(selectedDate, 1);
  const isToday = selectedDate === today;
  const headerDate = formatHeaderDate(selectedDate);

  const moveDate = (amount: number) => {
    onDateChange(addDays(selectedDate, amount));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveDate(-1);
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveDate(1);
    }

    if (event.key === 'Home') {
      event.preventDefault();
      onDateChange(today);
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (touchStartX.current === null) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const distance = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(distance) < SWIPE_THRESHOLD_PX) return;

    moveDate(distance > 0 ? -1 : 1);
  };

  return (
    <>
      <S.Shell
        aria-label="홈 기록 날짜 선택"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <S.HeaderRow>
          <S.DatePickerButton
            type="button"
            onClick={() => setIsDatePickerOpen(true)}
            aria-label={`${getAccessibleDate(selectedDate)} 날짜 직접 선택`}
            aria-expanded={isDatePickerOpen}
          >
            <S.HeaderDateCopy>
              <S.HeaderYear>{headerDate.year}</S.HeaderYear>
              <S.HeaderMonthDay>{headerDate.monthDay}</S.HeaderMonthDay>
            </S.HeaderDateCopy>
            <ChevronDown size={18} strokeWidth={2.4} />
          </S.DatePickerButton>

          <S.NotificationButton
            type="button"
            onClick={() => navigate('/draft')}
            aria-label={
              pendingCount > 0
                ? `확인 대기 기록 ${pendingCount}개 보기`
                : '확인 대기 기록 보기'
            }
          >
            <Bell size={26} strokeWidth={2.1} />
            {pendingCount > 0 && <S.NotificationBadge>N</S.NotificationBadge>}
          </S.NotificationButton>
        </S.HeaderRow>

        <S.Rail>
          <S.SideDate
            type="button"
            $side="previous"
            onClick={() => onDateChange(previousDate)}
            aria-label={`${getAccessibleDate(previousDate)} 기록 보기`}
          >
            <S.SideNumber>{formatMonthDay(previousDate)}</S.SideNumber>
            <S.SideWeekday>{getWeekday(previousDate)}</S.SideWeekday>
          </S.SideDate>

          <S.Selected aria-current="date">
            <S.SelectedNumber>{formatMonthDay(selectedDate)}</S.SelectedNumber>
            <S.SelectedBadge $isToday={isToday}>
              {isToday ? '오늘' : getWeekday(selectedDate)}
            </S.SelectedBadge>
          </S.Selected>

          <S.SideDate
            type="button"
            $side="next"
            onClick={() => onDateChange(nextDate)}
            aria-label={`${getAccessibleDate(nextDate)} 기록 보기`}
          >
            <S.SideNumber>{formatMonthDay(nextDate)}</S.SideNumber>
            <S.SideWeekday>{getWeekday(nextDate)}</S.SideWeekday>
          </S.SideDate>
        </S.Rail>
      </S.Shell>

      <HomeDatePicker
        isOpen={isDatePickerOpen}
        selectedDate={selectedDate}
        onClose={() => setIsDatePickerOpen(false)}
        onDateChange={onDateChange}
      />
    </>
  );
};
