import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useRecordsByDate } from '~/hooks/useRecordsByDate';
import { useUpdateRecord } from '~/hooks/useUpdateRecord';
import { useUpdateVisibility } from '~/hooks/useUpdateVisibility';
import { useDeleteRecord } from '~/hooks/useDeleteRecord';
import Switch from '~/components/Switch/Switch';
import type { RecordDetailResponse } from '~/apis/record/record.types';
import * as S from './RecordDetail.styles';

interface RecordItemProps {
  record: RecordDetailResponse;
  highlighted: boolean;
}

const RecordItem = ({ record, highlighted }: RecordItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [foodName, setFoodName] = useState(record.foodName);

  const { mutate: updateRecord, isPending: isUpdating } = useUpdateRecord(record.recordId);
  const { mutate: updateVisibility } = useUpdateVisibility(record.recordId);
  const { mutate: deleteRecord, isPending: isDeleting } = useDeleteRecord(record.recordId);

  const handleSaveFoodName = () => {
    const trimmed = foodName.trim();
    if (!trimmed || trimmed === record.foodName) {
      setIsEditing(false);
      return;
    }
    updateRecord({ foodName: trimmed }, { onSuccess: () => setIsEditing(false) });
  };

  const handleToggleWillRevisit = () => {
    updateRecord({ willRevisit: !record.willRevisit });
  };

  const handleToggleIsPublic = () => {
    updateVisibility({ isPublic: !record.isPublic });
  };

  const handleDelete = () => {
    if (!window.confirm('이 기록을 삭제할까요? 삭제하면 되돌릴 수 없어요.')) return;
    deleteRecord();
  };

  return (
    <S.RecordCard $highlighted={highlighted}>
      <S.RecordImage src={record.imageUrl} alt={record.foodName} />

      <S.RecordInfo>
        <S.FoodNameRow>
          {isEditing ? (
            <S.FoodNameInput
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveFoodName()}
              autoFocus
            />
          ) : (
            <S.FoodName>{record.foodName}</S.FoodName>
          )}
        </S.FoodNameRow>

        <S.RestaurantName>{record.restaurantName}</S.RestaurantName>

        {record.companionName && <S.CompanionTag>{record.companionName}</S.CompanionTag>}

        <S.ToggleRow>
          <S.ToggleLabel>재방문 의사</S.ToggleLabel>
          <Switch checked={record.willRevisit} onChange={handleToggleWillRevisit} />
        </S.ToggleRow>

        <S.ToggleRow>
          <S.ToggleLabel>공개</S.ToggleLabel>
          <Switch checked={record.isPublic} onChange={handleToggleIsPublic} />
        </S.ToggleRow>

        <S.ActionRow>
          {isEditing ? (
            <S.EditButton onClick={handleSaveFoodName} disabled={isUpdating}>
              저장
            </S.EditButton>
          ) : (
            <S.EditButton onClick={() => setIsEditing(true)}>이름수정</S.EditButton>
          )}
          <S.DeleteButton onClick={handleDelete} disabled={isDeleting}>
            삭제
          </S.DeleteButton>
        </S.ActionRow>
      </S.RecordInfo>
    </S.RecordCard>
  );
};

const RecordDetail = () => {
  const navigate = useNavigate();
  const { date } = useParams<{ date: string }>();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');

  const { data: records, isLoading } = useRecordsByDate(date ?? '');

  return (
    <S.Container>
      <S.HeaderRow>
        <S.BackButton onClick={() => navigate(-1)}>{'<'}</S.BackButton>
        <S.DateTitle>{date}</S.DateTitle>
      </S.HeaderRow>

      {isLoading ? (
        <S.EmptyState>불러오는 중...</S.EmptyState>
      ) : records && records.length > 0 ? (
        <S.RecordList>
          {records.map((record) => (
            <RecordItem
              key={record.recordId}
              record={record}
              highlighted={String(record.recordId) === highlightId}
            />
          ))}
        </S.RecordList>
      ) : (
        <S.EmptyState>
          <span>이 날짜엔 기록이 없어요.</span>
          <S.AddRecordButton onClick={() => navigate(`/record/add?date=${date}`)}>
            기록 추가하기
          </S.AddRecordButton>
        </S.EmptyState>
      )}
    </S.Container>
  );
};

export default RecordDetail;
