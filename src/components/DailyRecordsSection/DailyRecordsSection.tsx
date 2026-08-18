import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Layers3,
  Plus,
  RefreshCw,
  Utensils,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CalendarResponse } from '~/apis/record/record.types';
import { useCalendar } from '~/features/records/record.queries';
import { createRecordViewState, RECORD_VIEW_PATH } from '~/features/records/recordViewNavigation';
import { addLocalDays, parseLocalDate, toLocalIsoDate, toLocalIsoDateParts } from '~/utils/date';
import { resolveThumbnailUrl } from '~/utils/image';
import type { DailyRecordsSectionProps } from './DailyRecordsSection.types';
import * as S from './DailyRecordsSection.styles';

const WEEKDAYS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

const formatMonthKey = (year: number, month: number) => `${year}-${String(month).padStart(2, '0')}`;

const formatRecordName = (record: CalendarResponse) =>
  record.foodName?.trim() || record.restaurantName?.trim() || '한 끼';

const formatDayHeading = (dateValue: string) => {
  const date = parseLocalDate(dateValue);
  const today = toLocalIsoDate(new Date());
  const yesterday = addLocalDays(today, -1);

  if (dateValue === today) return { title: '오늘', weekday: WEEKDAYS[date.getDay()] };
  if (dateValue === yesterday) return { title: '어제', weekday: WEEKDAYS[date.getDay()] };

  return {
    title: `${date.getMonth() + 1}월 ${date.getDate()}일`,
    weekday: WEEKDAYS[date.getDay()],
  };
};

const RecordThumbnail = ({
  record,
  eager = false,
}: {
  record: CalendarResponse;
  eager?: boolean;
}) => {
  const imageUrl = resolveThumbnailUrl(record.thumbnailUrl);
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const hasError = Boolean(imageUrl && imageUrl === failedImageUrl);

  if (!imageUrl || hasError) {
    return (
      <S.ImageFallback aria-hidden="true">
        <Utensils size={22} strokeWidth={1.6} />
      </S.ImageFallback>
    );
  }

  return (
    <S.RecordImage
      src={imageUrl}
      alt=""
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
      onError={() => setFailedImageUrl(imageUrl)}
    />
  );
};

export const DailyRecordsSection = ({ selectedDate, onDateChange }: DailyRecordsSectionProps) => {
  const navigate = useNavigate();
  const selected = parseLocalDate(selectedDate);
  const year = selected.getFullYear();
  const month = selected.getMonth() + 1;
  const monthKey = formatMonthKey(year, month);
  const monthLabel = `${year}년 ${month}월`;
  const [viewState, setViewState] = useState({ monthKey, expanded: false });
  const isExpanded = viewState.monthKey === monthKey && viewState.expanded;
  const { data = [], isLoading, isError, refetch } = useCalendar(year, month);

  const records = [...data].sort(
    (first, second) =>
      second.visitDate.localeCompare(first.visitDate) || second.recordId - first.recordId,
  );
  const coverRecords = records.slice(0, 9);
  const recordsByDate = new Map<string, CalendarResponse[]>();

  records.forEach((record) => {
    const dateRecords = recordsByDate.get(record.visitDate) ?? [];
    dateRecords.push(record);
    recordsByDate.set(record.visitDate, dateRecords);
  });

  const dayGroups = [...recordsByDate.entries()].map(([date, dateRecords]) => ({
    date,
    records: dateRecords.slice(0, 3),
  }));

  const openRecord = (date: string) =>
    navigate(RECORD_VIEW_PATH, { state: createRecordViewState(date) });
  const openRecordAdd = () => navigate(`/record/add?date=${selectedDate}`);

  const moveMonth = (amount: number) => {
    const next = new Date(year, month - 1 + amount, 1);
    const nextYear = next.getFullYear();
    const nextMonth = next.getMonth() + 1;
    const safeDay = Math.min(selected.getDate(), new Date(nextYear, nextMonth, 0).getDate());
    const nextDate = toLocalIsoDateParts(nextYear, nextMonth, safeDay);

    setViewState({ monthKey: formatMonthKey(nextYear, nextMonth), expanded: true });
    onDateChange(nextDate);
  };

  if (isLoading) {
    return (
      <S.Section aria-label={`${monthLabel} 기록 불러오는 중`}>
        <S.CoverSkeleton>
          <S.SkeletonPile>
            <span />
            <span />
            <span />
          </S.SkeletonPile>
          <S.SkeletonLine $width="64%" $large />
          <S.SkeletonLine $width="42%" />
        </S.CoverSkeleton>
      </S.Section>
    );
  }

  if (isError) {
    return (
      <S.Section>
        <S.StatusButton type="button" onClick={() => void refetch()}>
          <S.StatusIcon>
            <RefreshCw size={25} strokeWidth={1.9} aria-hidden="true" />
          </S.StatusIcon>
          <strong>{month}월의 사진을 불러오지 못했어요</strong>
          <span>눌러서 다시 시도해 주세요.</span>
        </S.StatusButton>
      </S.Section>
    );
  }

  if (!isExpanded) {
    const hasRecords = coverRecords.length > 0;

    return (
      <S.Section>
        <S.CoverButton
          type="button"
          onClick={hasRecords ? () => setViewState({ monthKey, expanded: true }) : openRecordAdd}
          aria-label={
            hasRecords
              ? `${monthLabel} 사진 ${records.length}장 날짜별로 펼치기`
              : `${monthLabel} 첫 식사 기록하기`
          }
        >
          <S.PileStage>
            {hasRecords ? (
              coverRecords.map((record, index) => (
                <S.PilePhoto key={record.recordId} $index={index} $total={coverRecords.length}>
                  <S.PhotoViewport>
                    <RecordThumbnail record={record} eager={index === 0} />
                  </S.PhotoViewport>
                </S.PilePhoto>
              ))
            ) : (
              <S.EmptyPile aria-hidden="true">
                <span />
                <span />
                <span>
                  <ImagePlus size={27} strokeWidth={1.7} />
                </span>
              </S.EmptyPile>
            )}
          </S.PileStage>

          <S.CoverCopy>
            <strong>
              {hasRecords ? `${month}월의 한 끼가 쌓였어요` : `${month}월의 첫 한 끼를 남겨볼까요?`}
            </strong>
            <span>
              {hasRecords
                ? `사진 ${records.length}장 · 눌러서 날짜별로 펼쳐보기`
                : '사진 한 장이면 충분해요'}
              <ChevronRight size={15} strokeWidth={2} aria-hidden="true" />
            </span>
          </S.CoverCopy>
        </S.CoverButton>
      </S.Section>
    );
  }

  return (
    <S.ExpandedSection>
      <S.MonthToolbar>
        <S.CollapseButton
          type="button"
          onClick={() => setViewState({ monthKey, expanded: false })}
          aria-label={`${monthLabel} 사진 모아보기`}
        >
          <Layers3 size={18} strokeWidth={1.9} aria-hidden="true" />
          모아보기
        </S.CollapseButton>

        <S.MonthNavigation>
          <S.MonthArrow type="button" onClick={() => moveMonth(-1)} aria-label="이전 달">
            <ChevronLeft size={19} aria-hidden="true" />
          </S.MonthArrow>
          <S.MonthTitle>{monthLabel}</S.MonthTitle>
          <S.MonthArrow type="button" onClick={() => moveMonth(1)} aria-label="다음 달">
            <ChevronRight size={19} aria-hidden="true" />
          </S.MonthArrow>
        </S.MonthNavigation>
      </S.MonthToolbar>

      {dayGroups.length > 0 ? (
        <S.Timeline aria-label={`${monthLabel} 날짜별 식사 사진`}>
          {dayGroups.map((group, groupIndex) => {
            const heading = formatDayHeading(group.date);

            return (
              <S.DayGroup key={group.date}>
                <S.DayHeading>
                  <strong>{heading.title}</strong>
                  <span>·</span>
                  <span>{heading.weekday}</span>
                </S.DayHeading>
                <S.DayPhotos>
                  {group.records.map((record, index) => (
                    <S.DayPhotoButton
                      key={record.recordId}
                      type="button"
                      $index={index}
                      $count={group.records.length}
                      onClick={() => openRecord(group.date)}
                      aria-label={`${group.date} ${formatRecordName(record)} 기록 보기`}
                    >
                      <S.DayPhotoViewport>
                        <RecordThumbnail record={record} eager={groupIndex === 0 && index === 0} />
                      </S.DayPhotoViewport>
                      <S.PhotoNote>{formatRecordName(record)}</S.PhotoNote>
                    </S.DayPhotoButton>
                  ))}
                </S.DayPhotos>
              </S.DayGroup>
            );
          })}
        </S.Timeline>
      ) : (
        <S.EmptyMonth>
          <S.EmptyMonthIcon>
            <Utensils size={28} strokeWidth={1.6} aria-hidden="true" />
          </S.EmptyMonthIcon>
          <strong>{month}월에는 아직 남긴 한 끼가 없어요</strong>
          <span>사진으로 이달의 첫 기억을 시작해 보세요.</span>
          <S.AddButton type="button" onClick={openRecordAdd}>
            <Plus size={17} strokeWidth={2.1} aria-hidden="true" />한 끼 기록하기
          </S.AddButton>
        </S.EmptyMonth>
      )}
    </S.ExpandedSection>
  );
};
