import { resolveOptimizedImageUrl } from '~/utils/image';
import { RecordPlaceholderIllustration } from '~/components/RecordPlaceholderIllustration/RecordPlaceholderIllustration';
import type { DailyRecordCardProps } from './DailyRecordCard.types';
import * as S from './DailyRecordCard.styles';

const formatVisitDate = (value: string) =>
  new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(new Date(`${value}T00:00:00`));

export const DailyRecordCard = ({
  record,
  visitDate,
  onClick,
}: DailyRecordCardProps) => {
  const imageUrl = resolveOptimizedImageUrl(record.imageUrl);
  const locationLabel = record.restaurantName?.trim() || '위치 정보 없음';
  const dateLabel = formatVisitDate(visitDate);

  return (
    <S.Card
      type="button"
      onClick={onClick}
      aria-label={`${dateLabel} ${locationLabel} 기록 보기`}
    >
      {imageUrl ? (
        <S.Image
          src={imageUrl}
          loading="lazy"
          decoding="async"
          alt={`${locationLabel}에서 남긴 식사 기록`}
        />
      ) : (
        <S.ImageFallback>
          <RecordPlaceholderIllustration />
        </S.ImageFallback>
      )}

      <S.Shade />
      <S.Meta>
        <S.Date>{dateLabel}</S.Date>
        <S.Location>{locationLabel}</S.Location>
      </S.Meta>
    </S.Card>
  );
};
