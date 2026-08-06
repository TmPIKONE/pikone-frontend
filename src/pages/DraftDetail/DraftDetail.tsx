import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useApproveDraft,
  usePendingDrafts,
  useRejectDraft,
  useUpdateDraftLocationType,
} from '~/features/drafts/draft.queries';
import CompanionSelector from '~/components/CompanionSelector/CompanionSelector';
import PlaceTypeWheelPicker from '~/components/PlaceTypeWheelPicker/PlaceTypeWheelPicker';
import Switch from '~/components/Switch/Switch';
import { resolveOptimizedImageUrl } from '~/utils/image';
import type { DraftResponse } from '~/apis/draft/draft.types';
import type { LocationType, RestaurantCandidate } from '~/apis/record/record.types';
import * as S from './DraftDetail.styles';

const LOCATION_TYPE_OPTIONS: { value: LocationType; label: string }[] = [
  { value: 'RESTAURANT', label: '식당' },
  { value: 'HOME', label: '집' },
  { value: 'OFFICE', label: '회사' },
  { value: 'DELIVERY', label: '배달' },
  { value: 'UNKNOWN', label: '미정' },
];

interface DraftEditorProps {
  draft: DraftResponse;
}

const DraftEditor = ({ draft }: DraftEditorProps) => {
  const navigate = useNavigate();
  const [foodName, setFoodName] = useState(draft.foodName);
  const [locationType, setLocationType] = useState<LocationType>(draft.locationType);
  const [selectedCandidate, setSelectedCandidate] = useState<RestaurantCandidate | null>(
    draft.restaurantCandidates[0] ?? null,
  );
  const [companionId, setCompanionId] = useState<number | null>(null);
  const [willRevisit, setWillRevisit] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  const { mutate: approveDraft, isPending: isApproving } = useApproveDraft(draft.draftId);
  const { mutate: rejectDraft, isPending: isRejecting } = useRejectDraft(draft.draftId);
  const { mutate: saveLocationType, isPending: isSavingLocation } = useUpdateDraftLocationType(
    draft.draftId,
  );

  const handleReject = () => {
    if (!window.confirm('이 기록을 거절할까요? 거절하면 되돌릴 수 없어요.')) return;
    rejectDraft(undefined, { onSuccess: () => navigate('/draft') });
  };

  const handleApprove = () => {
    const isRestaurant = locationType === 'RESTAURANT';

    approveDraft(
      {
        foodName: foodName.trim(),
        locationType,
        willRevisit,
        isPublic,
        companionId: companionId ?? undefined,
        kakaoPlaceId: isRestaurant ? selectedCandidate?.kakaoPlaceId : undefined,
        placeName: isRestaurant ? selectedCandidate?.placeName : undefined,
        category: isRestaurant ? selectedCandidate?.category : undefined,
        address: isRestaurant ? selectedCandidate?.address : undefined,
        latitude: isRestaurant ? selectedCandidate?.latitude : undefined,
        longitude: isRestaurant ? selectedCandidate?.longitude : undefined,
      },
      { onSuccess: () => navigate('/draft') },
    );
  };

  const canApprove = Boolean(
    foodName.trim() && (locationType !== 'RESTAURANT' || selectedCandidate),
  );

  return (
    <S.Container>
      <S.HeaderRow>
        <S.BackButton
          type="button"
          aria-label="기록 목록으로 돌아가기"
          onClick={() => navigate('/draft')}
        >
          <ChevronLeft size={22} />
        </S.BackButton>
        <S.Title>{draft.shared ? '공유받은 기록 확인' : '자동 기록 확인'}</S.Title>
      </S.HeaderRow>

      <S.Image
        src={resolveOptimizedImageUrl(draft.imageUrl)}
        alt={draft.foodName}
        decoding="async"
      />

      {draft.shared && draft.sourceUserNickname && (
        <S.GpsWarning>{draft.sourceUserNickname}님이 공유한 기록이에요.</S.GpsWarning>
      )}

      {!draft.shared && !draft.hasExifGps && (
        <S.GpsWarning>
          사진에 위치 정보가 없어 현재 위치 기준으로 찾았어요. 식당이 맞는지 확인해주세요.
        </S.GpsWarning>
      )}

      {draft.foodTags.length > 0 && (
        <S.TagRow>
          {draft.foodTags.map((tag) => (
            <S.Tag key={tag}>{tag}</S.Tag>
          ))}
        </S.TagRow>
      )}

      <S.Field>
        <S.Label htmlFor="draft-food-name">음식 이름</S.Label>
        <S.Input
          id="draft-food-name"
          value={foodName}
          onChange={(event) => setFoodName(event.target.value)}
        />
      </S.Field>

      <S.Field>
        <S.Label htmlFor="draft-location-type">장소 유형</S.Label>
        <PlaceTypeWheelPicker
          id="draft-location-type"
          value={locationType}
          options={LOCATION_TYPE_OPTIONS}
          onChange={(value) => setLocationType(value as LocationType)}
        />
        <S.SaveLocationButton
          type="button"
          onClick={() => saveLocationType({ locationType })}
          disabled={isSavingLocation}
        >
          {isSavingLocation ? '저장 중...' : '위치만 먼저 저장'}
        </S.SaveLocationButton>
      </S.Field>

      {locationType === 'RESTAURANT' && (
        <S.Field>
          <S.Label>어느 식당인가요?</S.Label>
          {draft.restaurantCandidates.length > 0 ? (
            <S.RestaurantList>
              {draft.restaurantCandidates.map((candidate) => (
                <S.RestaurantCard
                  key={candidate.kakaoPlaceId}
                  type="button"
                  $selected={selectedCandidate?.kakaoPlaceId === candidate.kakaoPlaceId}
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <S.RestaurantName>{candidate.placeName}</S.RestaurantName>
                  <S.RestaurantMeta>
                    {[candidate.category, candidate.address].filter(Boolean).join(' · ')}
                  </S.RestaurantMeta>
                </S.RestaurantCard>
              ))}
            </S.RestaurantList>
          ) : (
            <S.GpsWarning>후보 식당이 없어요. 다른 장소 유형을 선택해주세요.</S.GpsWarning>
          )}
        </S.Field>
      )}

      {!draft.shared && <CompanionSelector value={companionId} onChange={setCompanionId} />}

      <S.ToggleRow>
        <S.ToggleLabel>이 식당에 다시 가고 싶어요</S.ToggleLabel>
        <Switch checked={willRevisit} onChange={setWillRevisit} ariaLabel="재방문 의사" />
      </S.ToggleRow>

      <S.ToggleRow>
        <S.ToggleLabel>동반자에게 기록을 공개해요</S.ToggleLabel>
        <Switch checked={isPublic} onChange={setIsPublic} ariaLabel="동반자 공개 여부" />
      </S.ToggleRow>

      <S.ButtonRow>
        <S.RejectButton type="button" onClick={handleReject} disabled={isRejecting}>
          {isRejecting ? '처리 중...' : '제외'}
        </S.RejectButton>
        <S.ApproveButton
          type="button"
          onClick={handleApprove}
          disabled={!canApprove || isApproving}
        >
          {isApproving ? '추가 중...' : '내 기록에 추가'}
        </S.ApproveButton>
      </S.ButtonRow>
    </S.Container>
  );
};

const DraftDetail = () => {
  const navigate = useNavigate();
  const { draftId } = useParams<{ draftId: string }>();
  const numericDraftId = Number(draftId);
  const { data: drafts, isLoading } = usePendingDrafts();
  const draft = drafts?.find((item) => item.draftId === numericDraftId);

  if (isLoading) {
    return (
      <S.Container>
        <S.EmptyState>기록을 불러오고 있어요...</S.EmptyState>
      </S.Container>
    );
  }

  if (!draft) {
    return (
      <S.Container>
        <S.HeaderRow>
          <S.BackButton
            type="button"
            aria-label="기록 목록으로 돌아가기"
            onClick={() => navigate('/draft')}
          >
            <ChevronLeft size={22} />
          </S.BackButton>
          <S.Title>기록 확인</S.Title>
        </S.HeaderRow>
        <S.EmptyState>이미 처리됐거나 찾을 수 없는 기록이에요.</S.EmptyState>
      </S.Container>
    );
  }

  return <DraftEditor key={draft.draftId} draft={draft} />;
};

export default DraftDetail;
