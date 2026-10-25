import { useState } from 'react';
import { ArrowLeft, Bookmark, ExternalLink, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '~/components/Toast/useToast';
import {
  useDiscoveryAction,
  useDiscoveryCommentReaction,
  useDiscoveryDetail,
} from '~/features/discovery/discovery.queries';
import { useCurrentLocation } from '~/hooks/useCurrentLocation';
import * as S from './DiscoveryDetail.styles';

const DiscoveryDetail = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const parsedId = restaurantId ? Number(restaurantId) : undefined;
  const location = useCurrentLocation();
  const detail = useDiscoveryDetail(parsedId, location.latitude, location.longitude);
  const commentReaction = useDiscoveryCommentReaction(
    detail.data?.youtubeEmbedUrl ? parsedId : undefined,
  );
  const action = useDiscoveryAction();
  const { showToast } = useToast();
  const [savedOverride, setSavedOverride] = useState<boolean | undefined>(undefined);

  if (detail.isLoading) return <S.State>식당을 불러오고 있어요...</S.State>;
  if (!detail.data) return <S.State>식당 정보를 불러오지 못했어요.</S.State>;

  const { restaurant, mapUrl, youtubeEmbedUrl, menus = [] } = detail.data;
  const heroImage = restaurant.heroImageUrl;
  const saved = savedOverride ?? restaurant.saved;

  const sendPassiveAction = (actionType: 'VIDEO_VIEW') =>
    action.mutate({
      restaurantId: restaurant.restaurantId,
      creatorContentId: restaurant.content?.id,
      actionType,
    });

  const toggleSave = () => {
    const previousSaved = saved;
    const nextSaved = !previousSaved;
    setSavedOverride(nextSaved);

    action.mutate(
      {
        restaurantId: restaurant.restaurantId,
        creatorContentId: restaurant.content?.id,
        actionType: previousSaved ? 'UNSAVE' : 'SAVE',
      },
      {
        onSuccess: (response) => {
          setSavedOverride(response.saved);
          showToast(response.saved ? '저장했어요.' : '저장을 해제했어요.', 'success');
        },
        onError: () => {
          setSavedOverride(previousSaved);
          showToast('저장 상태를 바꾸지 못했어요.', 'error');
        },
      },
    );
  };

  return (
    <S.Page>
      <S.Hero $image={heroImage}>
        <S.Scrim />
        <S.BackButton type="button" aria-label="뒤로 가기" onClick={() => navigate(-1)}>
          <ArrowLeft size={21} />
        </S.BackButton>
        <S.HeroCopy>
          {restaurant.creator && <S.Creator>{restaurant.creator.name} Pick</S.Creator>}
          <h1>{restaurant.name}</h1>
          <p>{[restaurant.category, restaurant.address].filter(Boolean).join(' · ')}</p>
        </S.HeroCopy>
      </S.Hero>

      <S.Body>
        <S.Story>{restaurant.story}</S.Story>
        <S.Tags>
          {restaurant.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </S.Tags>

        <S.PrimaryRow>
          <S.PrimaryButton type="button" onClick={toggleSave}>
            <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
            {saved ? '저장 취소' : '저장하기'}
          </S.PrimaryButton>
        </S.PrimaryRow>

        {youtubeEmbedUrl && (
          <S.Section>
            <S.SectionHeader>
              <strong>소개 영상</strong>
              {restaurant.content?.youtubeVideoId && (
                <button
                  type="button"
                  onClick={() => {
                    sendPassiveAction('VIDEO_VIEW');
                    window.open(
                      `https://www.youtube.com/watch?v=${encodeURIComponent(restaurant.content!.youtubeVideoId)}`,
                      '_blank',
                      'noopener,noreferrer',
                    );
                  }}
                >
                  YouTube <ExternalLink size={13} />
                </button>
              )}
            </S.SectionHeader>
            <S.VideoFrame
              src={youtubeEmbedUrl}
              title={`${restaurant.name} 소개 영상`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </S.Section>
        )}

        {youtubeEmbedUrl && (
          <S.Section>
            <S.SectionHeader>
              <strong>이 식당에 대한 댓글 반응</strong>
            </S.SectionHeader>
            <S.CommentReactionCard>
              {commentReaction.isLoading ? (
                <S.CommentReactionState>댓글 반응을 확인하고 있어요...</S.CommentReactionState>
              ) : commentReaction.data?.status === 'READY' && commentReaction.data.summary ? (
                <>
                  <S.CommentReactionSummary>
                    {commentReaction.data.summary}
                  </S.CommentReactionSummary>
                  <S.CommentReactionMeta>
                    <span>관련 댓글 {commentReaction.data.relatedCommentCount}개</span>
                    <span>분석 표본 {commentReaction.data.sampledCommentCount}개</span>
                    {commentReaction.data.sourceVideoTitle && (
                      <span>출처 영상: {commentReaction.data.sourceVideoTitle}</span>
                    )}
                    {commentReaction.data.generatedAt && (
                      <span>
                        갱신 {new Date(commentReaction.data.generatedAt).toLocaleString('ko-KR')}
                      </span>
                    )}
                  </S.CommentReactionMeta>
                  {commentReaction.data.notice && (
                    <S.CommentReactionNotice>{commentReaction.data.notice}</S.CommentReactionNotice>
                  )}
                </>
              ) : (
                <S.CommentReactionState>
                  {commentReaction.data?.notice ??
                    '댓글 반응을 불러오지 못했어요. 식당 정보는 그대로 확인할 수 있어요.'}
                </S.CommentReactionState>
              )}
            </S.CommentReactionCard>
          </S.Section>
        )}

        {menus.length > 0 && (
          <S.Section>
            <S.SectionHeader>
              <strong>메뉴</strong>
            </S.SectionHeader>
            <S.MenuList>
              {menus.map((menu) => (
                <S.MenuItem key={menu.id}>
                  <span>{menu.name}</span>
                  <strong>
                    {menu.priceWon != null
                      ? `${menu.priceWon.toLocaleString('ko-KR')}원`
                      : '가격 정보 없음'}
                  </strong>
                </S.MenuItem>
              ))}
            </S.MenuList>
          </S.Section>
        )}

        <S.Section>
          <S.SectionHeader>
            <strong>위치</strong>
          </S.SectionHeader>
          <S.LocationCard>
            <MapPin size={18} />
            <div>
              <strong>{restaurant.address || '주소 정보 없음'}</strong>
              {restaurant.distanceMeters != null && (
                <span>현재 위치에서 직선거리 {restaurant.distanceMeters}m</span>
              )}
            </div>
          </S.LocationCard>
          {mapUrl && (
            <S.MapButton
              type="button"
              onClick={() => window.open(mapUrl, '_blank', 'noopener,noreferrer')}
            >
              네이버 지도에서 보기 <ExternalLink size={14} />
            </S.MapButton>
          )}
        </S.Section>
      </S.Body>
    </S.Page>
  );
};

export default DiscoveryDetail;
