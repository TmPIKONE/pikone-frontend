import { useState } from 'react';
import { Plus, RefreshCw, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CalendarResponse } from '~/apis/record/record.types';
import { useHomeRepresentativeRecord } from '~/features/records/record.queries';
import { createRecordViewState, RECORD_VIEW_PATH } from '~/features/records/recordViewNavigation';
import { parseLocalDate, toLocalIsoDate } from '~/utils/date';
import { resolveThumbnailUrl } from '~/utils/image';
import type { DailyRecordsSectionProps } from './DailyRecordsSection.types';
import * as S from './DailyRecordsSection.styles';

const formatRecordName = (record: CalendarResponse) =>
  record.foodName?.trim() || record.restaurantName?.trim() || '한 끼';

const formatDateLabel = (dateValue: string) => {
  const date = parseLocalDate(dateValue);
  const today = toLocalIsoDate(new Date());

  if (dateValue === today) return '오늘';
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const formatFullDateLabel = (dateValue: string) => {
  const date = parseLocalDate(dateValue);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const RecordThumbnail = ({ record }: { record: CalendarResponse }) => {
  const imageUrl = resolveThumbnailUrl(record.thumbnailUrl);
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const hasError = Boolean(imageUrl && imageUrl === failedImageUrl);

  if (!imageUrl || hasError) {
    return (
      <S.ImageFallback aria-hidden="true">
        <Utensils size={28} strokeWidth={1.55} />
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
  const emptyLead = isSelectedToday
    ? '오늘은 아직 비어 있어요.'
    : `${selectedDateLabel}은 아직 비어 있어요.`;

  const openRecordAdd = () => navigate(`/record/add?date=${selectedDate}`);
  const openRecord = (date: string) =>
    navigate(RECORD_VIEW_PATH, { state: createRecordViewState(date) });

  if (isLoading) {
    return (
      <S.Section aria-label={`${selectedDateLabel} 대표 기록 불러오는 중`}>
        <S.HeroSkeleton>
          <S.SkeletonLine $width="52%" $large />
          <S.SkeletonLine $width="42%" />
          <S.SkeletonButton />
          <S.SkeletonLine $width="48%" />
          <S.SkeletonPhoto />
          <S.SkeletonLine $width="38%" $large />
          <S.SkeletonLine $width="54%" />
        </S.HeroSkeleton>
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
          <strong>홈 기록을 불러오지 못했어요</strong>
          <span>눌러서 다시 시도해 주세요.</span>
        </S.StatusButton>
      </S.Section>
    );
  }

  if (!representativeRecord) {
    return (
      <S.Section>
        <S.EmptyState>
          <S.EmptyCopy>
            <S.HeroEyebrow>{isSelectedToday ? '오늘의 기록' : selectedDateLabel}</S.HeroEyebrow>
            <S.HeroLead>{emptyLead}</S.HeroLead>
            <S.HeroDescription>사진 한 장으로 오늘의 한 끼를 남겨보세요.</S.HeroDescription>
          </S.EmptyCopy>

          <S.PrimaryAddRecordButton type="button" onClick={openRecordAdd}>
            <Plus size={18} strokeWidth={2.2} aria-hidden="true" />
            {recordButtonLabel}
          </S.PrimaryAddRecordButton>

          <S.FirstRecordHint>
            첫 기록을 남기면 다음부터 여기에서 지난 한 끼도 함께 꺼내볼 수 있어요.
          </S.FirstRecordHint>
        </S.EmptyState>
      </S.Section>
    );
  }

  const isExactDateRecord = representativeRecord.visitDate === selectedDate;
  const representativeDateLabel = formatDateLabel(representativeRecord.visitDate);
  const restaurantName = representativeRecord.restaurantName?.trim();
  const recordName = formatRecordName(representativeRecord);
  const showRestaurantName = Boolean(restaurantName && restaurantName !== recordName);

  if (!isExactDateRecord) {
    return (
      <S.Section>
        <S.EmptyTodayHero>
          <S.HeroIntro $compact>
            <S.HeroEyebrow>{isSelectedToday ? '오늘의 기록' : selectedDateLabel}</S.HeroEyebrow>
            <S.HeroLead>{emptyLead}</S.HeroLead>
            <S.HeroDescription>오늘의 한 끼를 남겨볼까요?</S.HeroDescription>
          </S.HeroIntro>

          <S.PrimaryAddRecordButton type="button" onClick={openRecordAdd}>
            <Plus size={18} strokeWidth={2.2} aria-hidden="true" />
            {recordButtonLabel}
          </S.PrimaryAddRecordButton>

          <S.MemorySection aria-label="지난 기록 추천">
            <S.MemoryHeading>오늘 대신, 이런 기억은 어때요?</S.MemoryHeading>

            <S.PhotoButton
              type="button"
              onClick={() => openRecord(representativeRecord.visitDate)}
              aria-label={`${representativeRecord.visitDate} ${recordName} 기록 보기`}
            >
              <S.PhotoViewport>
                <RecordThumbnail record={representativeRecord} />
                <S.PhotoDateBadge>{representativeDateLabel}</S.PhotoDateBadge>
              </S.PhotoViewport>
            </S.PhotoButton>

            <S.RecordSummary>
              <S.RecordTitle>{recordName}</S.RecordTitle>
              <S.RecordMeta>
                <span>{formatFullDateLabel(representativeRecord.visitDate)}</span>
                {showRestaurantName && (
                  <>
                    <i aria-hidden="true">·</i>
                    <span>{restaurantName}</span>
                  </>
                )}
              </S.RecordMeta>
            </S.RecordSummary>
          </S.MemorySection>
        </S.EmptyTodayHero>
      </S.Section>
    );
  }

  return (
    <S.Section>
      <S.Hero>
        <S.HeroIntro>
          <S.HeroEyebrow>{isSelectedToday ? '오늘의 기록' : `${selectedDateLabel}의 기록`}</S.HeroEyebrow>
          <S.HeroLead>
            {isSelectedToday ? '오늘 남긴 한 끼예요.' : `${selectedDateLabel}에 남긴 한 끼예요.`}
          </S.HeroLead>
        </S.HeroIntro>

        <S.PhotoButton
          type="button"
          onClick={() => openRecord(representativeRecord.visitDate)}
          aria-label={`${representativeRecord.visitDate} ${recordName} 기록 보기`}
        >
          <S.PhotoViewport>
            <RecordThumbnail record={representativeRecord} />
          </S.PhotoViewport>
        </S.PhotoButton>

        <S.RecordSummary>
          <S.RecordTitle>{recordName}</S.RecordTitle>
          <S.RecordMeta>
            <span>{formatFullDateLabel(representativeRecord.visitDate)}</span>
            {showRestaurantName && (
              <>
                <i aria-hidden="true">·</i>
                <span>{restaurantName}</span>
              </>
            )}
          </S.RecordMeta>
        </S.RecordSummary>
      </S.Hero>
    </S.Section>
  );
};
