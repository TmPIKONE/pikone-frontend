import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useRecordsByDate } from '~/hooks/useRecordsByDate';
import * as S from './RecordDetail.styles';

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
            <S.RecordCard
              key={record.recordId}
              $highlighted={String(record.recordId) === highlightId}
            >
              <S.RecordImage src={record.imageUrl} alt={record.foodName} />
              <S.RecordInfo>
                <S.FoodName>{record.foodName}</S.FoodName>
                <S.RestaurantName>{record.restaurantName}</S.RestaurantName>
                <S.MetaRow>
                  {record.companionName && <S.MetaTag>{record.companionName}</S.MetaTag>}
                  {record.willRevisit && <S.MetaTag>재방문 의사 있음</S.MetaTag>}
                  <S.MetaTag>{record.isPublic ? '공개' : '비공개'}</S.MetaTag>
                </S.MetaRow>
              </S.RecordInfo>
            </S.RecordCard>
          ))}
        </S.RecordList>
      ) : (
        <S.EmptyState>이 날짜엔 기록이 없어요.</S.EmptyState>
      )}
    </S.Container>
  );
};

export default RecordDetail;
