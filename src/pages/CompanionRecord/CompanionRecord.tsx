import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { useCompanions } from '~/hooks/useCompanions';
import { useCompanionRecords } from '~/hooks/useCompanionRecords';
import { resolveOptimizedImageUrl, resolveThumbnailUrl } from '~/utils/image';
import type { FriendRecordResponse } from '~/apis/companion/companion.types';
import * as S from './CompanionRecord.styles';
import type { CompanionRecordRouteParams } from './CompanionRecord.types';

const CompanionRecord = () => {
  const navigate = useNavigate();
  const { id } = useParams<CompanionRecordRouteParams>();
  const companionId = id ? Number(id) : undefined;
  const [selectedRecord, setSelectedRecord] = useState<FriendRecordResponse | null>(null);

  const { data: companions } = useCompanions();
  const { data: records, isLoading } = useCompanionRecords(companionId);

  const companion = useMemo(
    () => companions?.find((item) => item.companionId === companionId),
    [companions, companionId],
  );

  return (
    <S.Container>
      <S.HeaderRow>
        <S.BackButton onClick={() => navigate(-1)}>{'<'}</S.BackButton>
        <S.TitleBox>
          <S.Title>{companion?.displayName ?? '친구 기록'}</S.Title>
          <S.Subtitle>친구가 공개한 음식 사진, 식당 위치, 날짜만 보여요.</S.Subtitle>
        </S.TitleBox>
      </S.HeaderRow>

      {isLoading ? (
        <S.EmptyState>불러오는 중...</S.EmptyState>
      ) : records && records.length > 0 ? (
        <S.RecordList>
          {records.map((record) => (
            <S.RecordCard key={record.recordId}>
              <S.ImageButton type="button" onClick={() => setSelectedRecord(record)}>
                <S.RecordImage
                  src={resolveThumbnailUrl(record.imageUrl)}
                  alt={record.foodName}
                  loading="lazy"
                  decoding="async"
                />
              </S.ImageButton>
              <S.RecordInfo>
                <S.FoodNameRow>
                  <S.FoodName>{record.foodName}</S.FoodName>
                  <S.DateChip>{record.visitDate}</S.DateChip>
                </S.FoodNameRow>
                <S.RestaurantName>{record.restaurantName}</S.RestaurantName>
                <S.MetaText>{record.restaurantAddress ?? '식당 위치 정보 없음'}</S.MetaText>
              </S.RecordInfo>
            </S.RecordCard>
          ))}
        </S.RecordList>
      ) : (
        <S.EmptyState>아직 공개된 친구 기록이 없어요.</S.EmptyState>
      )}

      {selectedRecord && (
        <S.ImageViewer role="dialog" aria-modal="true" onClick={() => setSelectedRecord(null)}>
          <S.ViewerCloseButton
            type="button"
            aria-label="닫기"
            onClick={() => setSelectedRecord(null)}
          >
            <X size={22} strokeWidth={2.4} />
          </S.ViewerCloseButton>
          <S.ViewerContent onClick={(e) => e.stopPropagation()}>
            <S.ViewerImage
              src={resolveOptimizedImageUrl(selectedRecord.imageUrl)}
              decoding="async"
              alt={selectedRecord.foodName}
            />
            <S.ViewerCaption>
              <S.ViewerFoodName>{selectedRecord.foodName}</S.ViewerFoodName>
              <S.ViewerMeta>
                {selectedRecord.restaurantName} · {selectedRecord.visitDate}
              </S.ViewerMeta>
            </S.ViewerCaption>
          </S.ViewerContent>
        </S.ImageViewer>
      )}
    </S.Container>
  );
};

export default CompanionRecord;
