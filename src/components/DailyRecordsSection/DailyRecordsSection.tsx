import { ChevronRight, ImagePlus, RefreshCw, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { RecordDetailResponse } from '~/apis/record/record.types';
import { useRecordsByDate } from '~/features/records/record.queries';
import { createRecordViewState, RECORD_VIEW_PATH } from '~/features/records/recordViewNavigation';
import { parseLocalDate, toLocalIsoDate } from '~/utils/date';
import { resolveOptimizedImageUrl } from '~/utils/image';
import type { DailyRecordsSectionProps } from './DailyRecordsSection.types';
import * as S from './DailyRecordsSection.styles';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

const formatSelectedDate = (selectedDate: string) => {
  const date = parseLocalDate(selectedDate);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const formatPhotoDate = (selectedDate: string) => {
  const date = parseLocalDate(selectedDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}. ${month}. ${day}. ${WEEKDAYS[date.getDay()]}`;
};

const getRecordImageUrl = (record?: RecordDetailResponse) =>
  record ? resolveOptimizedImageUrl(record.imageUrl) : undefined;

const RecordImage = ({
  record,
  eager = false,
}: {
  record?: RecordDetailResponse;
  eager?: boolean;
}) => {
  const imageUrl = getRecordImageUrl(record);
  const alt = record?.foodName?.trim() || record?.restaurantName?.trim() || '식사 기록 사진';

  if (!imageUrl) {
    return (
      <S.ImageFallback aria-hidden="true">
        <Utensils size={30} strokeWidth={1.7} />
      </S.ImageFallback>
    );
  }

  return (
    <S.RecordImage src={imageUrl} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
  );
};

export const DailyRecordsSection = ({ selectedDate }: DailyRecordsSectionProps) => {
  const navigate = useNavigate();
  const { data = [], isLoading, isError, refetch } = useRecordsByDate(selectedDate);
  const isToday = selectedDate === toLocalIsoDate(new Date());
  const dateLabel = isToday ? '오늘' : formatSelectedDate(selectedDate);
  const featuredRecord = data[0];
  const galleryRecords = data.slice(0, 3);

  const openRecordAdd = () => navigate(`/record/add?date=${selectedDate}`);
  const openRecords = () =>
    navigate(RECORD_VIEW_PATH, { state: createRecordViewState(selectedDate) });

  if (isLoading) {
    return (
      <S.Section aria-label={`${dateLabel} 기록 불러오는 중`}>
        <S.Card>
          <S.CardHeader>
            <S.SkeletonLine $width="36%" />
            <S.SkeletonLine $width="18%" />
          </S.CardHeader>
          <S.SkeletonPhoto $height="128px" />
        </S.Card>

        <S.Card>
          <S.CardHeader>
            <S.SkeletonLine $width="28%" />
            <S.SkeletonLine $width="18%" />
          </S.CardHeader>
          <S.SkeletonPhoto $height="206px" />
        </S.Card>
      </S.Section>
    );
  }

  if (isError) {
    return (
      <S.Section>
        <S.StatusCard type="button" onClick={() => void refetch()}>
          <S.StatusIcon>
            <RefreshCw size={24} strokeWidth={2} />
          </S.StatusIcon>
          <S.StatusCopy>
            <strong>사진을 불러오지 못했어요</strong>
            <span>눌러서 다시 불러와 주세요.</span>
          </S.StatusCopy>
          <ChevronRight size={20} strokeWidth={2} />
        </S.StatusCard>
      </S.Section>
    );
  }

  if (!featuredRecord) {
    return (
      <S.Section>
        <S.Card>
          <S.CardHeader>
            <S.TitleGroup>
              <S.CardTitle>기억하고 싶은 한 끼</S.CardTitle>
              <S.Count>0</S.Count>
            </S.TitleGroup>
          </S.CardHeader>

          <S.EmptyPhotoButton
            type="button"
            onClick={openRecordAdd}
            aria-label={`${dateLabel} 방문한 식당과 음식 사진 추가`}
          >
            <S.EmptyIcon>
              <ImagePlus size={25} strokeWidth={1.9} />
            </S.EmptyIcon>
            <S.EmptyText>
              <strong>
                {isToday ? '오늘 방문한 식당과' : `${dateLabel} 방문한 식당과`}
                <br />
                음식 사진을 추가해 보세요
              </strong>
              <span>사진 한 장으로 오늘의 식사를 남길 수 있어요.</span>
            </S.EmptyText>
            <S.AddLabel>
              사진 추가
              <ChevronRight size={16} strokeWidth={2.2} />
            </S.AddLabel>
          </S.EmptyPhotoButton>
        </S.Card>
      </S.Section>
    );
  }

  return (
    <S.Section>
      <S.Card>
        <S.CardHeader>
          <S.TitleGroup>
            <S.CardTitle>기억하고 싶은 한 끼</S.CardTitle>
            <S.Count>{data.length}</S.Count>
          </S.TitleGroup>
          <S.ViewAllButton type="button" onClick={openRecords}>
            전체보기
            <ChevronRight size={15} strokeWidth={2} />
          </S.ViewAllButton>
        </S.CardHeader>

        <S.FeaturedPhotoButton type="button" onClick={openRecords}>
          <RecordImage record={featuredRecord} eager />
          <S.FeaturedOverlay />
          <S.PhotoDate>{formatPhotoDate(selectedDate)}</S.PhotoDate>
        </S.FeaturedPhotoButton>
      </S.Card>

      <S.Card>
        <S.CardHeader>
          <S.TitleGroup>
            <S.CardTitle>갤러리</S.CardTitle>
            <S.Count>{data.length}</S.Count>
          </S.TitleGroup>
          <S.ViewAllButton type="button" onClick={openRecords}>
            전체보기
            <ChevronRight size={15} strokeWidth={2} />
          </S.ViewAllButton>
        </S.CardHeader>

        <S.GalleryButton
          type="button"
          onClick={openRecords}
          aria-label={`${dateLabel} 식사 사진 ${data.length}개 전체보기`}
          $count={galleryRecords.length}
        >
          {galleryRecords.map((record, index) => (
            <S.GalleryCell key={record.recordId} $index={index} $count={galleryRecords.length}>
              <RecordImage record={record} />
            </S.GalleryCell>
          ))}
        </S.GalleryButton>
      </S.Card>
    </S.Section>
  );
};
