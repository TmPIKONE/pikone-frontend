import { useLayoutEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, ImageOff, MapPin } from 'lucide-react';
import { useCompanionRecords, useCompanions } from '~/features/companions/companion.queries';
import { resolveOptimizedImageUrl } from '~/utils/image';
import * as S from './CompanionRecordFeed.styles';
import type {
  CompanionRecordFeedLocationState,
  CompanionRecordFeedRouteParams,
} from './CompanionRecordFeed.types';

const formatVisitDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const CompanionRecordFeed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, recordId } = useParams<CompanionRecordFeedRouteParams>();
  const companionId = id ? Number(id) : undefined;
  const selectedRecordId = recordId ? Number(recordId) : undefined;
  const recordElements = useRef(new Map<number, HTMLElement>());

  const { data: companions } = useCompanions();
  const { data: records, isLoading, isError, refetch } = useCompanionRecords(companionId);

  const companion = useMemo(
    () => companions?.find((item) => item.companionId === companionId),
    [companions, companionId],
  );

  useLayoutEffect(() => {
    if (selectedRecordId == null || !records?.length) return undefined;

    const frameId = window.requestAnimationFrame(() => {
      recordElements.current.get(selectedRecordId)?.scrollIntoView({
        block: 'start',
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [records, selectedRecordId]);

  const displayName = companion?.displayName ?? '동반자';
  const profileInitial = displayName.trim().charAt(0) || '함';
  const locationState = location.state as CompanionRecordFeedLocationState | null;
  const handleBack = () => {
    if (locationState?.fromRecordGrid) {
      navigate(-1);
      return;
    }

    if (companionId == null) {
      navigate('/companion');
      return;
    }

    navigate(`/companion/${companionId}/records`);
  };

  return (
    <S.Container>
      <S.Header>
        <S.BackButton type="button" aria-label="기록 모아보기로 돌아가기" onClick={handleBack}>
          <ArrowLeft size={21} strokeWidth={2.3} />
        </S.BackButton>
        <S.HeaderTitleBox>
          <S.HeaderTitle>{displayName}님 기록</S.HeaderTitle>
        </S.HeaderTitleBox>
        <S.HeaderCount aria-label={`공개 기록 ${records?.length ?? 0}개`}>
          {records?.length ?? 0}
        </S.HeaderCount>
      </S.Header>

      {isLoading ? (
        <S.LoadingFeed aria-label="기록을 불러오는 중">
          <S.LoadingCard />
          <S.LoadingCard />
        </S.LoadingFeed>
      ) : isError ? (
        <S.EmptyState>
          <ImageOff size={30} strokeWidth={1.8} aria-hidden="true" />
          <strong>기록을 불러오지 못했어요.</strong>
          <span>잠시 후 다시 시도해주세요.</span>
          <S.RetryButton type="button" onClick={() => void refetch()}>
            다시 불러오기
          </S.RetryButton>
        </S.EmptyState>
      ) : records && records.length > 0 ? (
        <S.Feed aria-label={`${displayName}의 공개 기록 피드`}>
          {records.map((record) => (
            <S.Post
              key={record.recordId}
              ref={(element) => {
                if (element) {
                  recordElements.current.set(record.recordId, element);
                } else {
                  recordElements.current.delete(record.recordId);
                }
              }}
            >
              <S.PostHeader>
                <S.ProfileBadge aria-hidden="true">{profileInitial}</S.ProfileBadge>
                <S.PostHeading>
                  <S.ProfileName>{displayName}</S.ProfileName>
                  <S.RestaurantName>{record.restaurantName}</S.RestaurantName>
                </S.PostHeading>
                <S.CompactDate dateTime={record.visitDate}>
                  {record.visitDate.slice(5)}
                </S.CompactDate>
              </S.PostHeader>

              <S.ImageFrame>
                <S.PostImage
                  src={resolveOptimizedImageUrl(record.imageUrl)}
                  alt={`${record.foodName} 음식 기록`}
                  loading={record.recordId === selectedRecordId ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </S.ImageFrame>

              <S.PostBody>
                <S.FoodName>{record.foodName}</S.FoodName>
                <S.MetaList>
                  <S.MetaItem>
                    <MapPin size={15} strokeWidth={2} aria-hidden="true" />
                    <span>{record.restaurantAddress ?? record.restaurantName}</span>
                  </S.MetaItem>
                  <S.MetaItem>
                    <CalendarDays size={15} strokeWidth={2} aria-hidden="true" />
                    <time dateTime={record.visitDate}>{formatVisitDate(record.visitDate)}</time>
                  </S.MetaItem>
                </S.MetaList>
              </S.PostBody>
            </S.Post>
          ))}
        </S.Feed>
      ) : (
        <S.EmptyState>
          <S.EmptyIcon aria-hidden="true">
            <ImageOff size={29} strokeWidth={1.8} />
          </S.EmptyIcon>
          <strong>볼 수 있는 기록이 없어요.</strong>
          <span>{displayName}님이 기록을 공개하면 이곳에서 볼 수 있어요.</span>
        </S.EmptyState>
      )}
    </S.Container>
  );
};

export default CompanionRecordFeed;
