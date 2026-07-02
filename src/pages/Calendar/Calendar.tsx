import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendar } from '~/hooks/useCalendar';
import * as S from './Calendar.styles';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

const pad = (n: number) => String(n).padStart(2, '0');

const formatDateStr = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const formatMonthTitle = (year: number, month: number) => `${year}.${pad(month)}`;

interface CalendarCell {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
}

const getCalendarCells = (year: number, month: number): CalendarCell[] => {
  const cells: CalendarCell[] = [];

  const firstOfMonth = new Date(year, month - 1, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const prevMonthDays = new Date(year, month - 1, 0).getDate();

  for (let i = startWeekday - 1; i >= 0; i -= 1) {
    const day = prevMonthDays - i;
    cells.push({ date: new Date(year, month - 2, day), day, isCurrentMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ date: new Date(year, month - 1, day), day, isCurrentMonth: true });
  }

  const remainder = cells.length % 7;
  if (remainder !== 0) {
    const needed = 7 - remainder;
    for (let day = 1; day <= needed; day += 1) {
      cells.push({ date: new Date(year, month, day), day, isCurrentMonth: false });
    }
  }

  return cells;
};

const Calendar = () => {
  const navigate = useNavigate();
  const today = new Date();
  const todayStr = formatDateStr(today);

  const [current, setCurrent] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });

  const { data: records, isLoading } = useCalendar(current.year, current.month);

  const recordsByDate = useMemo(() => {
    const map = new Map<string, (typeof records)[number]>();
    records?.forEach((record) => {
      if (!map.has(record.visitDate)) {
        map.set(record.visitDate, record);
      }
    });
    return map;
  }, [records]);

  const cells = useMemo(
    () => getCalendarCells(current.year, current.month),
    [current.year, current.month],
  );

  const handlePrevMonth = () => {
    setCurrent((prev) =>
      prev.month === 1
        ? { year: prev.year - 1, month: 12 }
        : { year: prev.year, month: prev.month - 1 },
    );
  };

  const handleNextMonth = () => {
    setCurrent((prev) =>
      prev.month === 12
        ? { year: prev.year + 1, month: 1 }
        : { year: prev.year, month: prev.month + 1 },
    );
  };

  const handleDayClick = (dateStr: string) => {
    navigate(`/record/${dateStr}`);
  };

  return (
    <S.Container>
      <S.MonthNavRow>
        <S.NavButton onClick={handlePrevMonth} aria-label="이전 달">
          <ChevronLeft size={18} strokeWidth={2} />
        </S.NavButton>
        <S.MonthTitle>{formatMonthTitle(current.year, current.month)}</S.MonthTitle>
        <S.NavButton onClick={handleNextMonth} aria-label="다음 달">
          <ChevronRight size={18} strokeWidth={2} />
        </S.NavButton>
      </S.MonthNavRow>

      <div>
        <S.WeekdayRow>
          {WEEKDAY_LABELS.map((label, index) => (
            <S.WeekdayLabel key={label} $isSunday={index === 0} $isSaturday={index === 6}>
              {label}
            </S.WeekdayLabel>
          ))}
        </S.WeekdayRow>

        {isLoading ? (
          <S.EmptyState>불러오는 중...</S.EmptyState>
        ) : (
          <S.DayGrid>
            {cells.map((cell) => {
              const dateStr = formatDateStr(cell.date);
              const record = recordsByDate.get(dateStr);
              const isToday = dateStr === todayStr;

              return (
                <S.DayCell key={dateStr} onClick={() => handleDayClick(dateStr)}>
                  <S.DayNumberBadge $isToday={isToday} $isCurrentMonth={cell.isCurrentMonth}>
                    {cell.day}
                  </S.DayNumberBadge>
                  <S.DayPhotoSlot>
                    {record && (
                      <S.DayPhotoCard>
                        <S.DayThumbnail src={record.thumbnailUrl} alt={`${dateStr} 기록`} />
                      </S.DayPhotoCard>
                    )}
                  </S.DayPhotoSlot>
                </S.DayCell>
              );
            })}
          </S.DayGrid>
        )}
      </div>
    </S.Container>
  );
};

export default Calendar;
