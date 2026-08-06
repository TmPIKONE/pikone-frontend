import { CheckCircle2 } from 'lucide-react';
import { resolveOptimizedImageUrl } from '~/utils/image';
import type { DailyRecordCardProps } from './DailyRecordCard.types';
import * as S from './DailyRecordCard.styles';

export const DailyRecordCard = ({
  record,
  slotLabel,
  slotEmoji,
  onClick,
}: DailyRecordCardProps) => {
  const imageUrl = resolveOptimizedImageUrl(record.imageUrl);
  const foodLabel = record.foodName?.trim() || '오늘의 식사';

  return (
    <S.Card type="button" onClick={onClick} aria-label={`${slotLabel} ${foodLabel} 기록 보기`}>
      {imageUrl && <S.Image src={imageUrl} loading="lazy" decoding="async" alt={foodLabel} />}
      <S.Overlay $hasImage={Boolean(imageUrl)} />
      <S.TopRow>
        <S.Emoji>{slotEmoji}</S.Emoji>
        <S.Check>
          <CheckCircle2 size={22} strokeWidth={2.5} />
        </S.Check>
      </S.TopRow>
      <S.Copy>
        <S.SlotLabel>{slotLabel}</S.SlotLabel>
        <S.FoodName>{foodLabel}</S.FoodName>
        <S.Restaurant>{record.restaurantName || '장소 미등록'}</S.Restaurant>
      </S.Copy>
    </S.Card>
  );
};
