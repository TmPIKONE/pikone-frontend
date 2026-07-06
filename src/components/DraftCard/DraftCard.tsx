import { AlertTriangle, ChevronRight } from 'lucide-react';
import { resolveImageUrl } from '~/utils/image';
import * as S from './DraftCard.styles';
import type { DraftCardProps } from './DraftCard.types';

const formatCapturedAt = (isoString: string) => {
  const date = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
};

const DraftCard = ({ draft, onClick }: DraftCardProps) => {
  return (
    <S.Card type="button" onClick={onClick}>
      <S.Thumbnail src={resolveImageUrl(draft.imageUrl)} alt={draft.foodName} />

      <S.Info>
        <S.FoodName>{draft.foodName || '음식 이름 없음'}</S.FoodName>
        {draft.shared && draft.sourceUserNickname && (
          <S.SharedText>{draft.sourceUserNickname}님이 함께한 기록을 보냈어요.</S.SharedText>
        )}
        <S.CapturedAt>{formatCapturedAt(draft.capturedAt)}</S.CapturedAt>

        {!draft.hasExifGps && (
          <S.WarningBadge>
            <AlertTriangle size={12} strokeWidth={2} />
            위치 확인 필요
          </S.WarningBadge>
        )}
      </S.Info>

      <S.ChevronWrapper>
        <ChevronRight size={18} />
      </S.ChevronWrapper>
    </S.Card>
  );
};

export default DraftCard;
