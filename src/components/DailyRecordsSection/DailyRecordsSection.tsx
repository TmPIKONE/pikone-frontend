import { useState } from 'react';
import { ChevronRight, List, Plus, RefreshCw, Smile, Sparkles, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CalendarResponse } from '~/apis/record/record.types';
import { useHomeRepresentativeRecord } from '~/features/records/record.queries';
import { createRecordViewState, RECORD_VIEW_PATH } from '~/features/records/recordViewNavigation';
import { parseLocalDate, toLocalIsoDate } from '~/utils/date';
import { resolveThumbnailUrl } from '~/utils/image';
import type { DailyRecordsSectionProps } from './DailyRecordsSection.types';
import * as S from './DailyRecordsSection.styles';

const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];

const formatRecordName = (record: CalendarResponse) =>
  record.foodName?.trim() || record.restaurantName?.trim() || '한 끼';

const formatDateLabel = (dateValue: string) => {
  const date = parseLocalDate(dateValue);
  const today = toLocalIsoDate(new Date());

  if (dateValue === today) return '오늘';
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const formatCompactDate = (dateValue: string) => {
  const date = parseLocalDate(dateValue);
  return `${date.getMonth() + 1}. ${date.getDate()}. (${WEEKDAY[date.getDay()]})`;
};

const formatPastDate = (dateValue: string) => {
  const date = parseLocalDate(dateValue);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const RecordThumbnail = ({ record }: { record: CalendarResponse }) => {
  const imageUrl = resolveThumbnailUrl(record.thumbnailUrl);
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const hasError = Boolean(imageUrl && imageUrl === failedImageUrl);

  if (!imageUrl || hasError) {
    return (
      <S.ImageFallback aria-hidden="true">
        <Utensils size={29} strokeWidth={1.55} />
      </S.ImageFallback>
    );
  }

  return (
    <S.RecordImage
      src={imageUrl}
      alt=""
      loading="eager"
      fetchPriority="high"
      decoding="async"
      onError={() => setFailedImageUrl(imageUrl)}
    />
  );
};

export const DailyRecordsSection = ({ selectedDate }: DailyRecordsSectionProps) => {
  const navigate = useNavigate();
  const {
    data: representativeRecord = null,
    isLoading,
    isError,
    refetch,
  } = useHomeRepresentativeRecord(selectedDate);

  const today = toLocalIsoDate(new Date());
  const isSelectedToday = selectedDate === today;
  const selectedDateLabel = formatDateLabel(selectedDate);
  const recordButtonLabel = isSelectedToday
    ? '오늘 한 끼 기록하기'
    : `${selectedDateLabel} 한 끼 기록하기`;

  const openRecordAdd = () => navigate(`/record/add?date=${selectedDate}`);
  const openRecord = (date: string) =>
    navigate(RECORD_VIEW_PATH, { state: createRecordViewState(date) });

  if (isLoading) {
    return (
      <S.Section aria-label={`${selectedDateLabel} 대표 기록 불러오는 중`}>
        <S.CardSkeleton />
        <S.CardSkeleton $short />
      </S.Section>
    );
  }

  if (isError) {
    return (
      <S.Section>
        <S.StatusButton type="button" onClick={() => void refetch()}>
          <S.StatusIcon>
            <RefreshCw size={24} strokeWidth={1.9} aria-hidden="true" />
          </S.StatusIcon>
          <span>
            <strong>홈 기록을 불러오지 못했어요</strong>
            눌러서 다시 시도해 주세요.
          </span>
        </S.StatusButton>
      </S.Section>
    );
  }

  const isExactDateRecord = representativeRecord?.visitDate === selectedDate;
  const recordName = representativeRecord ? formatRecordName(representativeRecord) : '';
  const restaurantName = representativeRecord?.restaurantName?.trim();

  return (
    <S.Section>
      <S.TodayCard>
        <S.CardHeader>
          <S.CardTitleGroup>
            <S.CardTitle>{isSelectedToday ? '오늘' : selectedDateLabel}</S.CardTitle>
            <S.CardDate>{formatCompactDate(selectedDate)}</S.CardDate>
          </S.CardTitleGroup>
        </S.CardHeader>

        {representativeRecord && isExactDateRecord ? (
          <S.TodayPhotoButton
            type="button"
            onClick={() => openRecord(representativeRecord.visitDate)}
            aria-label={`${representativeRecord.visitDate} ${recordName} 기록 보기`}
          >
            <S.TodayPhotoViewport>
              <RecordThumbnail record={representativeRecord} />
              <S.PhotoScrim />
              <S.PhotoCopy>
                <strong>{recordName}</strong>
                {restaurantName && restaurantName !== recordName && <span>{restaurantName}</span>}
              </S.PhotoCopy>
            </S.TodayPhotoViewport>
          </S.TodayPhotoButton>
        ) : (
          <S.AddRecordButton
            type="button"
            aria-label={recordButtonLabel}
            onClick={openRecordAdd}
          >
            <Plus size={20} strokeWidth={2.1} aria-hidden="true" />
            <span>{isSelectedToday ? '한 끼를 추가하세요' : `${selectedDateLabel} 기록을 추가하세요`}</span>
          </S.AddRecordButton>
        )}
      </S.TodayCard>

      {representativeRecord && !isExactDateRecord ? (
        <S.SecondaryCard>
          <S.SecondaryHeader>
            <S.SecondaryTitle>지난 기록</S.SecondaryTitle>
          </S.SecondaryHeader>

          <S.PastRecordButton
            type="button"
            onClick={() => openRecord(representativeRecord.visitDate)}
            aria-label={`${representativeRecord.visitDate} ${recordName} 기록 보기`}
          >
            <S.PastImage>
              <RecordThumbnail record={representativeRecord} />
            </S.PastImage>
            <S.PastCopy>
              <strong>{recordName}</strong>
              <span>{formatPastDate(representativeRecord.visitDate)}</span>
            </S.PastCopy>
            <ChevronRight size={22} strokeWidth={2} aria-hidden="true" />
          </S.PastRecordButton>
        </S.SecondaryCard>
      ) : (
        <S.SecondaryCard>
          <S.SecondaryHeader>
            <S.SecondaryTitle>다음 한 끼</S.SecondaryTitle>
            <S.SmallListIcon aria-hidden="true">
              <Sparkles size={23} strokeWidth={1.8} />
            </S.SmallListIcon>
          </S.SecondaryHeader>

          <S.AiButton type="button" onClick={() => navigate('/ai')}>
            <Plus size={19} strokeWidth={2.05} aria-hidden="true" />
            <span>AI로 다음 한 끼 추천받기</span>
          </S.AiButton>
        </S.SecondaryCard>
      )}
    </S.Section>
  );
};
