import { useNavigate } from 'react-router-dom';
import { usePendingDrafts } from '~/hooks/usePendingDrafts';
import DraftCard from '~/components/DraftCard/DraftCard';
import * as S from './Draft.styles';

const Draft = () => {
  const navigate = useNavigate();
  const { data: drafts, isLoading } = usePendingDrafts();

  return (
    <S.Container>
      <S.HeaderRow>
        <S.BackButton onClick={() => navigate(-1)}>{'<'}</S.BackButton>
        <S.Title>확인할 자동 기록</S.Title>
        {!!drafts?.length && <S.CountBadge>{drafts.length}</S.CountBadge>}
      </S.HeaderRow>

      {isLoading ? (
        <S.EmptyState>불러오는 중...</S.EmptyState>
      ) : drafts && drafts.length > 0 ? (
        <S.DraftList>
          {drafts.map((draft) => (
            <DraftCard
              key={draft.draftId}
              draft={draft}
              onClick={() => navigate(`/draft/${draft.draftId}`)}
            />
          ))}
        </S.DraftList>
      ) : (
        <S.EmptyState>확인할 자동 기록이 없어요.</S.EmptyState>
      )}
    </S.Container>
  );
};

export default Draft;
