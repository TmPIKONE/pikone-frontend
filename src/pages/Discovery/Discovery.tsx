import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bookmark,
  Check,
  ChevronRight,
  ExternalLink,
  MapPin,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '~/components/Toast/useToast';
import type {
  DiscoveryActionType,
  DiscoveryFeedItem,
  DiscoveryFeedType,
} from '~/apis/discovery/discovery.types';
import {
  useDiscoveryAction,
  useDiscoveryCreators,
  useDiscoveryFeed,
} from '~/features/discovery/discovery.queries';
import * as S from './Discovery.styles';

const DISCOVERY_VIEW_KEY = 'pikone:discovery-view';

type DiscoveryViewState = {
  type?: DiscoveryFeedType;
  region?: string;
  creatorIds?: number[];
  creatorId?: number;
  scrollTop?: number;
};

const readDiscoveryView = (): DiscoveryViewState => {
  try {
    return JSON.parse(sessionStorage.getItem(DISCOVERY_VIEW_KEY) ?? '{}') as DiscoveryViewState;
  } catch {
    return {};
  }
};

const normalizeInitialType = (type?: DiscoveryFeedType): DiscoveryFeedType =>
  type === 'SAVED' ? 'SAVED' : 'YOUTUBE';

const Discovery = () => {
  const navigate = useNavigate();
  const restoredView = useMemo(() => readDiscoveryView(), []);
  const feedRef = useRef<HTMLElement | null>(null);
  const { showToast } = useToast();
  const [type, setType] = useState<DiscoveryFeedType>(() =>
    normalizeInitialType(restoredView.type),
  );
  const [region, setRegion] = useState(restoredView.region ?? '');
  const [creatorIds, setCreatorIds] = useState<number[]>(() => {
    if (Array.isArray(restoredView.creatorIds)) {
      return restoredView.creatorIds.filter((id): id is number => Number.isFinite(id));
    }
    return restoredView.creatorId != null ? [restoredView.creatorId] : [];
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showCreators, setShowCreators] = useState(false);
  const [skippedIds, setSkippedIds] = useState<Set<number>>(() => new Set());
  const [savedOverrides, setSavedOverrides] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const node = feedRef.current;
    if (!node || !restoredView.scrollTop) return;
    requestAnimationFrame(() => {
      node.scrollTop = restoredView.scrollTop ?? 0;
    });
  }, [restoredView.scrollTop]);

  useEffect(() => {
    const current = readDiscoveryView();
    sessionStorage.setItem(
      DISCOVERY_VIEW_KEY,
      JSON.stringify({ ...current, type, region, creatorIds, creatorId: undefined }),
    );
  }, [type, region, creatorIds]);

  const feed = useDiscoveryFeed({
    creatorIds: type === 'YOUTUBE' && creatorIds.length > 0 ? creatorIds : undefined,
    region: type === 'YOUTUBE' ? region.trim() || undefined : undefined,
    type,
    size: 10,
  });
  const creators = useDiscoveryCreators();
  const action = useDiscoveryAction();

  const items = useMemo(() => {
    const seenRestaurantIds = new Set<number>();
    return (feed.data?.pages.flatMap((page) => page.items) ?? []).filter((item) => {
      if (seenRestaurantIds.has(item.restaurantId)) return false;
      seenRestaurantIds.add(item.restaurantId);
      if (skippedIds.has(item.restaurantId)) return false;
      if (type === 'SAVED') {
        return savedOverrides[item.restaurantId] ?? item.saved;
      }
      return true;
    });
  }, [feed.data, savedOverrides, skippedIds, type]);

  const selectedCreators = useMemo(
    () => (creators.data ?? []).filter((creator) => creatorIds.includes(creator.id)),
    [creatorIds, creators.data],
  );

  const creatorTriggerLabel = useMemo(() => {
    if (creatorIds.length === 0) return '모든 크리에이터';
    if (selectedCreators.length === 0) return `${creatorIds.length}명 선택`;
    if (selectedCreators.length === 1) return selectedCreators[0].name;
    if (selectedCreators.length === 2)
      return selectedCreators.map((creator) => creator.name).join(', ');
    return `${selectedCreators[0].name} 외 ${selectedCreators.length - 1}명`;
  }, [creatorIds.length, selectedCreators]);

  const toggleCreator = (id: number) => {
    setCreatorIds((current) =>
      current.includes(id)
        ? current.filter((creatorId) => creatorId !== id)
        : [...current, id].sort((a, b) => a - b),
    );
  };

  const sendAction = (item: DiscoveryFeedItem, actionType: DiscoveryActionType) => {
    action.mutate({
      restaurantId: item.restaurantId,
      creatorContentId: item.content?.id,
      actionType,
    });
  };

  const handleSave = (item: DiscoveryFeedItem) => {
    const previousSaved = savedOverrides[item.restaurantId] ?? item.saved;
    const nextSaved = !previousSaved;

    setSavedOverrides((current) => ({ ...current, [item.restaurantId]: nextSaved }));
    action.mutate(
      {
        restaurantId: item.restaurantId,
        creatorContentId: item.content?.id,
        actionType: previousSaved ? 'UNSAVE' : 'SAVE',
      },
      {
        onSuccess: (response) => {
          setSavedOverrides((current) => ({
            ...current,
            [item.restaurantId]: response.saved,
          }));
          showToast(response.saved ? '저장했어요.' : '저장을 해제했어요.', 'success');
        },
        onError: () => {
          setSavedOverrides((current) => ({
            ...current,
            [item.restaurantId]: previousSaved,
          }));
          showToast('저장 상태를 바꾸지 못했어요.', 'error');
        },
      },
    );
  };

  const handleSkip = (item: DiscoveryFeedItem) => {
    setSkippedIds((current) => new Set(current).add(item.restaurantId));
    sendAction(item, 'SKIP');
  };

  const handleDetail = (item: DiscoveryFeedItem) => {
    sendAction(item, 'DETAIL_VIEW');
    navigate(`/discover/${item.restaurantId}`);
  };

  const handleVideo = (item: DiscoveryFeedItem) => {
    if (!item.content?.youtubeVideoId) return;
    sendAction(item, 'VIDEO_VIEW');
    window.open(
      `https://www.youtube.com/watch?v=${encodeURIComponent(item.content.youtubeVideoId)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const activeFilterCount = Number(Boolean(region.trim())) + Number(creatorIds.length > 0);

  return (
    <S.Page>
      <S.TopBar>
        <S.TitleRow>
          <div>
            <S.Eyebrow>DISCOVERY</S.Eyebrow>
            <S.Title>
              {type === 'SAVED'
                ? '저장'
                : region.trim()
                  ? `${region.trim()}에서 발견`
                  : '유튜버가 다녀간 맛집'}
            </S.Title>
          </div>
          <S.TopActions>
            <S.SavedShortcut
              type="button"
              $active={type === 'SAVED'}
              onClick={() => {
                setType((current) => (current === 'SAVED' ? 'YOUTUBE' : 'SAVED'));
                setShowCreators(false);
                setShowFilters(false);
              }}
            >
              <Bookmark size={15} fill={type === 'SAVED' ? 'currentColor' : 'none'} />
              {type === 'SAVED' ? '해제' : '저장'}
            </S.SavedShortcut>
            {type !== 'SAVED' && (
              <S.FilterToggle
                type="button"
                $active={showFilters || activeFilterCount > 0}
                onClick={() => setShowFilters((value) => !value)}
              >
                <SlidersHorizontal size={15} />
                필터{activeFilterCount > 0 ? ` ${activeFilterCount}` : ''}
              </S.FilterToggle>
            )}
          </S.TopActions>
        </S.TitleRow>

        {showFilters && type !== 'SAVED' && (
          <S.FilterPanel>
            <S.FilterHeading>
              <strong>어디에서 찾을까요?</strong>
            </S.FilterHeading>

            <S.RegionRow>
              <MapPin size={16} />
              <S.RegionInput
                value={region}
                placeholder="지역 검색 (예: 성수, 홍대)"
                aria-label="지역 필터"
                onChange={(event) => setRegion(event.target.value)}
              />
              {region && (
                <S.RegionClear
                  type="button"
                  aria-label="지역 필터 지우기"
                  onClick={() => setRegion('')}
                >
                  <X size={15} />
                </S.RegionClear>
              )}
            </S.RegionRow>

            <S.CreatorPicker>
              <S.CreatorTrigger
                type="button"
                aria-expanded={showCreators}
                onClick={() => setShowCreators((value) => !value)}
              >
                <S.CreatorTriggerCopy>
                  <span>크리에이터</span>
                  <strong>{creatorTriggerLabel}</strong>
                </S.CreatorTriggerCopy>
                <ChevronRight
                  size={20}
                  strokeWidth={2.2}
                  aria-hidden="true"
                  style={{ transform: showCreators ? 'rotate(90deg)' : 'none' }}
                />
              </S.CreatorTrigger>

              {showCreators && (
                <S.CreatorMenu>
                  <S.CreatorOption
                    type="button"
                    $active={creatorIds.length === 0}
                    onClick={() => setCreatorIds([])}
                  >
                    <span>
                      <strong>모든 크리에이터</strong>
                      <small>전체 채널에서 소개된 식당을 봅니다.</small>
                    </span>
                    {creatorIds.length === 0 && <Check size={18} strokeWidth={2.5} />}
                  </S.CreatorOption>

                  {(creators.data ?? []).map((creator) => (
                    <S.CreatorOption
                      key={creator.id}
                      type="button"
                      $active={creatorIds.includes(creator.id)}
                      onClick={() => toggleCreator(creator.id)}
                    >
                      <span>
                        <strong>{creator.name}</strong>
                        <small>
                          확인된 식당 {creator.verifiedRestaurantCount.toLocaleString('ko-KR')}곳
                        </small>
                      </span>
                      {creatorIds.includes(creator.id) && <Check size={18} strokeWidth={2.5} />}
                    </S.CreatorOption>
                  ))}
                </S.CreatorMenu>
              )}
            </S.CreatorPicker>
          </S.FilterPanel>
        )}
      </S.TopBar>

      <S.Feed
        ref={feedRef}
        onScroll={(event) => {
          const previous = readDiscoveryView();
          sessionStorage.setItem(
            DISCOVERY_VIEW_KEY,
            JSON.stringify({ ...previous, scrollTop: event.currentTarget.scrollTop }),
          );
          const target = event.currentTarget;
          const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
          if (
            distanceToBottom < target.clientHeight * 0.65 &&
            feed.hasNextPage &&
            !feed.isFetchingNextPage
          ) {
            void feed.fetchNextPage();
          }
        }}
      >
        {feed.isLoading && (
          <S.FeedState>
            <strong>식당을 불러오고 있어요.</strong>
            <span>잠시만 기다려주세요.</span>
          </S.FeedState>
        )}

        {feed.isError && (
          <S.FeedState>
            <strong>식당을 불러오지 못했어요.</strong>
            <span>연결을 확인한 뒤 다시 시도해주세요.</span>
            <button type="button" onClick={() => void feed.refetch()}>
              다시 불러오기
            </button>
          </S.FeedState>
        )}

        {!feed.isError &&
          items.map((item) => {
            const saved = savedOverrides[item.restaurantId] ?? item.saved;
            const heroImage = item.heroImageUrl;
            return (
              <S.Card key={item.restaurantId}>
                {heroImage && (
                  <S.RestaurantPhoto>
                    <img src={heroImage} alt={`${item.name} 식당 사진`} />
                  </S.RestaurantPhoto>
                )}

                <S.CardBody>
                  <S.RestaurantInfo>
                    <S.RestaurantName>{item.name}</S.RestaurantName>
                    <S.CategoryLine>
                      {[item.category, item.address].filter(Boolean).join(' · ')}
                    </S.CategoryLine>
                    <S.Story>{item.story}</S.Story>
                  </S.RestaurantInfo>

                  {item.content?.thumbnailUrl && item.content.youtubeVideoId && (
                    <S.VideoPreview type="button" onClick={() => handleVideo(item)}>
                      <img src={item.content.thumbnailUrl} alt="" />
                      <span>
                        <strong>소개 영상</strong>
                        <small>{item.content.title ?? 'YouTube에서 소개된 영상'}</small>
                      </span>
                      <ExternalLink size={15} />
                    </S.VideoPreview>
                  )}

                  <S.ActionGrid>
                    <S.PrimaryAction type="button" $active={saved} onClick={() => handleSave(item)}>
                      <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
                      {saved ? '해제' : '저장'}
                    </S.PrimaryAction>
                    <S.DetailAction type="button" onClick={() => handleDetail(item)}>
                      자세히 보기
                    </S.DetailAction>
                  </S.ActionGrid>

                  <S.SecondaryActions>
                    <button type="button" onClick={() => handleSkip(item)}>
                      관심 없어요
                    </button>
                  </S.SecondaryActions>
                </S.CardBody>
              </S.Card>
            );
          })}

        {feed.hasNextPage && (
          <S.LoadMore
            type="button"
            disabled={feed.isFetchingNextPage}
            onClick={() => feed.fetchNextPage()}
          >
            {feed.isFetchingNextPage ? '다음 장소를 찾는 중...' : '다음 장소 더 보기'}
          </S.LoadMore>
        )}

        {!feed.isLoading && !feed.isError && items.length === 0 && (
          <S.Empty>
            <strong>
              {type === 'SAVED'
                ? '아직 저장한 식당이 없어요.'
                : '조건에 맞는 유튜버 맛집을 찾지 못했어요.'}
            </strong>
            <span>
              {type === 'SAVED'
                ? '발견에서 가보고 싶은 식당을 저장해보세요.'
                : '지역 이름을 조금 넓게 바꾸거나 모든 크리에이터로 확인해보세요.'}
            </span>
          </S.Empty>
        )}
      </S.Feed>
    </S.Page>
  );
};

export default Discovery;
