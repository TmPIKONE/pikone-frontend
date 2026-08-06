import { useMemo, useState } from 'react';
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Grid3X3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MonthWheelPicker } from '~/components/MonthWheelPicker/MonthWheelPicker';
import type { CalendarResponse } from '~/apis/record/record.types';
import { MAX_RECORDS_PER_DAY } from '~/features/records/record.constants';
import {
  createRecordViewState,
  RECORD_VIEW_PATH,
} from '~/features/records/recordViewNavigation';
import { useCalendar } from '~/features/records/record.queries';
import { padTwoDigits, parseLocalDate, toLocalIsoDate, toLocalIsoDateParts } from '~/utils/date';
import { resolveThumbnailUrl } from '~/utils/image';
import * as S from './Calendar.styles';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
type CalendarFilter = 'all' | 'revisit';
type CalendarView = 'calendar' | 'feed';

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
    for (let day = 1; day <= 7 - remainder; day += 1) {
      cells.push({ date: new Date(year, month, day), day, isCurrentMonth: false });
    }
  }
  return cells;
};

const Calendar = () => {
  const navigate = useNavigate();
  const today = new Date();
  const todayStr = toLocalIsoDate(today);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [filter, setFilter] = useState<CalendarFilter>('all');
  const [view, setView] = useState<CalendarView>('calendar');
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [current, setCurrent] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });

  const { data: records, isLoading, isError, refetch } = useCalendar(current.year, current.month);

  const filteredRecords = useMemo(
    () =>
      records?.filter((record) => {
        if (filter === 'revisit') return record.willRevisit;
        return true;
      }) ?? [],
    [filter, records],
  );

  const recordsByDate = useMemo(() => {
    const map = new Map<string, CalendarResponse[]>();
    filteredRecords.forEach((record) => {
      const dateRecords = map.get(record.visitDate) ?? [];
      dateRecords.push(record);
      map.set(record.visitDate, dateRecords);
    });
    return map;
  }, [filteredRecords]);

  const recordCountsByDate = useMemo(() => {
    const map = new Map<string, number>();
    records?.forEach((record) => map.set(record.visitDate, (map.get(record.visitDate) ?? 0) + 1));
    return map;
  }, [records]);

  const cells = useMemo(
    () => getCalendarCells(current.year, current.month),
    [current.year, current.month],
  );

  const moveMonth = (amount: number) => {
    const next = new Date(current.year, current.month - 1 + amount, 1);
    const nextYear = next.getFullYear();
    const nextMonth = next.getMonth() + 1;
    const selectedDay = parseLocalDate(selectedDate).getDate();
    const safeDay = Math.min(selectedDay, new Date(nextYear, nextMonth, 0).getDate());

    setCurrent({ year: nextYear, month: nextMonth });
    setSelectedDate(toLocalIsoDateParts(nextYear, nextMonth, safeDay));
  };

  const goToday = () => {
    setCurrent({ year: today.getFullYear(), month: today.getMonth() + 1 });
    setSelectedDate(todayStr);
  };

  const handleMonthChange = ({ year, month }: { year: number; month: number }) => {
    const selectedDay = parseLocalDate(selectedDate).getDate();
    const safeDay = Math.min(selectedDay, new Date(year, month, 0).getDate());
    setCurrent({ year, month });
    setSelectedDate(toLocalIsoDateParts(year, month, safeDay));
  };

  const selectedRecordCount = recordCountsByDate.get(selectedDate) ?? 0;
  const isSelectedDateFull = selectedRecordCount >= MAX_RECORDS_PER_DAY;
  const sortedFeedRecords = useMemo(
    () =>
      [...filteredRecords].sort(
        (a, b) => a.visitDate.localeCompare(b.visitDate) || a.recordId - b.recordId,
      ),
    [filteredRecords],
  );

  return (
    <S.Container>
      <S.PageHeader>
        <div>
          <S.PageTitle>달력</S.PageTitle>
        </div>
        <S.TodayButton type="button" onClick={goToday}>
          오늘 선택
        </S.TodayButton>
      </S.PageHeader>

      <S.StickyControls>
        <S.MonthRow>
          <S.MonthButton type="button" onClick={() => moveMonth(-1)} aria-label="이전 달">
            <ChevronLeft size={22} />
          </S.MonthButton>
          <S.MonthTitle
            type="button"
            onClick={() => setIsMonthPickerOpen(true)}
            aria-label={`${current.year}년 ${current.month}월, 달력 이동`}
          >
            {current.year}.{padTwoDigits(current.month)}
            <ChevronDown size={18} fill="currentColor" />
          </S.MonthTitle>
          <S.MonthButton type="button" onClick={() => moveMonth(1)} aria-label="다음 달">
            <ChevronRight size={22} />
          </S.MonthButton>
        </S.MonthRow>

        <S.Filters aria-label="기록 필터와 보기 방식">
          <S.FilterButton type="button" $active={filter === 'all'} onClick={() => setFilter('all')}>
            <i className="all" /> 기록 있어요
          </S.FilterButton>
          <S.FilterButton
            type="button"
            $active={filter === 'revisit'}
            onClick={() => setFilter('revisit')}
          >
            <i className="revisit" /> 또 갈래요
          </S.FilterButton>
          <S.ViewToggle
            type="button"
            $feed={view === 'feed'}
            aria-label={view === 'calendar' ? '사진 피드로 보기' : '달력으로 보기'}
            aria-pressed={view === 'feed'}
            onClick={() => setView((previous) => (previous === 'calendar' ? 'feed' : 'calendar'))}
          >
            {view === 'calendar' ? (
              <Grid3X3 size={20} strokeWidth={2.3} />
            ) : (
              <CalendarDays size={20} strokeWidth={2.3} />
            )}
          </S.ViewToggle>
        </S.Filters>

        <S.WeekdayRow>
          {WEEKDAY_LABELS.map((label) => (
            <S.WeekdayLabel key={label}>{label}</S.WeekdayLabel>
          ))}
        </S.WeekdayRow>
      </S.StickyControls>

      {isLoading ? (
        <S.EmptyState>달력을 불러오고 있어요.</S.EmptyState>
      ) : isError ? (
        <S.EmptyState>
          <span>달력을 불러오지 못했어요.</span>
          <button type="button" onClick={() => void refetch()}>
            다시 불러오기
          </button>
        </S.EmptyState>
      ) : view === 'calendar' ? (
        <S.DayGrid>
          {cells.map((cell) => {
            const dateStr = toLocalIsoDate(cell.date);
            const dateRecords = recordsByDate.get(dateStr) ?? [];
            const record = dateRecords[0];
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === todayStr;

            return (
              <S.DayCell
                key={dateStr}
                type="button"
                $currentMonth={cell.isCurrentMonth}
                onClick={() => setSelectedDate(dateStr)}
                aria-label={`${dateStr}${record ? ' 기록 있음' : ' 기록 없음'}`}
                aria-pressed={isSelected}
              >
                {isToday && <S.TodayBadge>오늘</S.TodayBadge>}
                <S.DayCircle $selected={isSelected} $hasRecord={Boolean(record)}>
                  {record ? (
                    <S.DayImage
                      src={resolveThumbnailUrl(record.thumbnailUrl)}
                      loading="lazy"
                      decoding="async"
                      alt=""
                    />
                  ) : (
                    <span>{cell.day}</span>
                  )}
                  {record && <S.DayNumber>{cell.day}</S.DayNumber>}
                </S.DayCircle>
              </S.DayCell>
            );
          })}
        </S.DayGrid>
      ) : sortedFeedRecords.length > 0 ? (
        <S.FeedGrid aria-label={`${current.year}년 ${current.month}월 사진 기록`}>
          {sortedFeedRecords.map((record) => (
            <S.FeedItem
              key={record.recordId}
              type="button"
              onClick={() =>
                navigate(RECORD_VIEW_PATH, { state: createRecordViewState(record.visitDate) })
              }
              aria-label={`${record.visitDate} ${record.foodName ?? record.restaurantName ?? '식사'} 기록 보기`}
            >
              <S.FeedImage
                src={resolveThumbnailUrl(record.thumbnailUrl)}
                loading="lazy"
                decoding="async"
                alt=""
              />
              <S.FeedDate>{padTwoDigits(parseLocalDate(record.visitDate).getDate())}</S.FeedDate>
            </S.FeedItem>
          ))}
        </S.FeedGrid>
      ) : (
        <S.EmptyState>
          <span>
            {filter === 'revisit' ? '또 가고 싶은 기록이 없어요.' : '이번 달 기록이 없어요.'}
          </span>
        </S.EmptyState>
      )}

      <S.BottomActions $feed={view === 'feed'}>
        {view === 'calendar' && selectedRecordCount > 0 && (
          <S.WriteButton
            type="button"
            disabled={isSelectedDateFull}
            onClick={() => navigate(`/record/add?date=${selectedDate}`)}
          >
            {isSelectedDateFull ? '3개 완료' : '기록하기'}
          </S.WriteButton>
        )}
        {view === 'calendar' ? (
          <S.ViewButton
            type="button"
            $wide={selectedRecordCount === 0}
            onClick={() => {
              if (selectedRecordCount === 0) {
                navigate(`/record/add?date=${selectedDate}`);
                return;
              }
              navigate(RECORD_VIEW_PATH, { state: createRecordViewState(selectedDate) });
            }}
          >
            {selectedRecordCount === 0 ? '이 날짜 기록하기' : '기록 보기'}
          </S.ViewButton>
        ) : (
          <S.FeedWriteButton
            type="button"
            disabled={isSelectedDateFull}
            onClick={() => navigate(`/record/add?date=${selectedDate}`)}
          >
            {isSelectedDateFull ? '3개 완료' : '기록하기'}
          </S.FeedWriteButton>
        )}
      </S.BottomActions>

      {isMonthPickerOpen && (
        <MonthWheelPicker
          isOpen
          year={current.year}
          month={current.month}
          onClose={() => setIsMonthPickerOpen(false)}
          onChange={handleMonthChange}
        />
      )}
    </S.Container>
  );
};

export default Calendar;
