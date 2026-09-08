import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Grid3X3, Images, UsersRound } from 'lucide-react';
import { useCompanionRecords, useCompanions } from '~/features/companions/companion.queries';
import { resolveThumbnailUrl } from '~/utils/image';
import * as S from './CompanionRecord.styles';
import type { CompanionRecordRouteParams } from './CompanionRecord.types';

const CompanionRecord = () => {
  const navigate = useNavigate();
  const { id } = useParams<CompanionRecordRouteParams>();
  const companionId = id ? Number(id) : undefined;

  const { data: companions } = useCompanions();
  const { data: records, isLoading, isError, refetch } = useCompanionRecords(companionId);

  const companion = useMemo(
    () => companions?.find((item) => item.companionId === companionId),
    [companions, companionId],
  );
  const displayName = companion?.displayName ?? '동반자';

  return (
    <S.Container>
      <S.TopBar>
        <S.BackButton
          type="button"
          aria-label="동반자 목록으로 돌아가기"
          onClick={() => navigate('/companion')}
        >
          <ArrowLeft size={21} strokeWidth={2.3} />
        </S.BackButton>
      </S.TopBar>

      <S.PageHeader>
        <S.PageTitle>{displayName}님 기록</S.PageTitle>
        <S.PageDescription>상대방이 공개한 식사 기록만 보여요.</S.PageDescription>
      </S.PageHeader>

      <S.SummaryCard>
        <S.ProfileBadge aria-hidden="true">{displayName.trim().charAt(0) || '함'}</S.ProfileBadge>
        <S.SummaryText>
          <strong>{displayName}</strong>
          <span>피코원 동반자</span>
        </S.SummaryText>
        <S.RecordCount>
          <strong>{records?.length ?? 0}</strong>
          <span>공개 기록</span>
        </S.RecordCount>
      </S.SummaryCard>

      <S.GridHeader>
        <S.GridTitle>
          <Grid3X3 size={17} strokeWidth={2.2} aria-hidden="true" />
          기록 모아보기
        </S.GridTitle>
        <S.GridHint>사진을 누르면 자세히 볼 수 있어요.</S.GridHint>
      </S.GridHeader>

      {isLoading ? (
        <S.SkeletonGrid aria-label="기록을 불러오는 중">
          {Array.from({ length: 9 }, (_, index) => (
            <S.SkeletonTile key={index} />
          ))}
        </S.SkeletonGrid>
      ) : isError ? (
        <S.EmptyState>
          <UsersRound size={30} strokeWidth={1.8} aria-hidden="true" />
          <strong>기록을 불러오지 못했어요.</strong>
          <span>잠시 후 다시 시도해주세요.</span>
          <S.RetryButton type="button" onClick={() => void refetch()}>
            다시 불러오기
          </S.RetryButton>
        </S.EmptyState>
      ) : records && records.length > 0 ? (
        <S.RecordGrid aria-label={`${displayName}의 공개 기록`}>
          {records.map((record) => (
            <S.GridItem
              key={record.recordId}
              type="button"
              aria-label={`${record.foodName}, ${record.visitDate} 기록 보기`}
              onClick={() =>
                navigate(`/companion/${companionId}/records/${record.recordId}`, {
                  state: { fromRecordGrid: true },
                })
              }
            >
              <S.RecordImage
                src={resolveThumbnailUrl(record.imageUrl)}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <S.ImageOverlay aria-hidden="true">
                <Images size={15} strokeWidth={2.4} />
              </S.ImageOverlay>
            </S.GridItem>
          ))}
        </S.RecordGrid>
      ) : (
        <S.EmptyState>
          <S.EmptyIcon aria-hidden="true">
            <Images size={29} strokeWidth={1.8} />
          </S.EmptyIcon>
          <strong>아직 공개된 기록이 없어요.</strong>
          <span>{displayName}님이 기록을 공개하면 이곳에 모아 보여드릴게요.</span>
        </S.EmptyState>
      )}
    </S.Container>
  );
};

export default CompanionRecord;
