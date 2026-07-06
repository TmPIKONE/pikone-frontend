import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePendingDrafts } from '~/hooks/usePendingDrafts';
import { useApproveDraft } from '~/hooks/useApproveDraft';
import { useRejectDraft } from '~/hooks/useRejectDraft';
import { useUpdateDraftLocationType } from '~/hooks/useUpdateDraftLocationType';
import CompanionSelector from '~/components/CompanionSelector/CompanionSelector';
import { resolveImageUrl } from '~/utils/image';
import type { LocationType, RestaurantCandidate } from '~/apis/record/record.types';
import * as S from './DraftDetail.styles';

const LOCATION_TYPE_OPTIONS: { value: LocationType; label: string }[] = [
  { value: 'RESTAURANT', label: '식당' },
  { value: 'HOME', label: '집' },
  { value: 'OFFICE', label: '회사' },
  { value: 'DELIVERY', label: '배달' },
  { value: 'UNKNOWN', label: '미정' },
];

const DraftDetail = () => {
  const navigate = useNavigate();
  const { draftId } = useParams<{ draftId: string }>();
  const numericDraftId = Number(draftId);

  const { data: drafts, isLoading } = usePendingDrafts();
  const draft = drafts?.find((d) => d.draftId === numericDraftId);

  const [foodName, setFoodName] = useState('');
  const [locationType, setLocationType] = useState<LocationType>('UNKNOWN');
  const [selectedCandidate, setSelectedCandidate] = useState<RestaurantCandidate | null>(null);
  const [companionId, setCompanionId] = useState<number | null>(null);
  const [willRevisit, setWillRevisit] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  // draft 데이터가 (비동기로) 도착하면 그때 폼 초기값을 채워요.
  useEffect(() => {
    if (!draft) return;
    setFoodName(draft.foodName);
    setLocationType(draft.locationType);
    setSelectedCandidate(draft.restaurantCandidates[0] ?? null);
  }, [draft]);

  const { mutate: approveDraft, isPending: isApproving } = useApproveDraft(numericDraftId);
  const { mutate: rejectDraft, isPending: isRejecting } = useRejectDraft(numericDraftId);
  const { mutate: saveLocationType, isPending: isSavingLocation } =
    useUpdateDraftLocationType(numericDraftId);

  if (isLoading) {
    return (
      <S.Container>
        <S.EmptyState>불러오는 중...</S.EmptyState>
      </S.Container>
    );
  }

  if (!draft) {
    return (
      <S.Container>
        <S.HeaderRow>
          <S.BackButton onClick={() => navigate('/draft')}>{'<'}</S.BackButton>
          <S.Title>기록 확인</S.Title>
        </S.HeaderRow>
        <S.EmptyState>이미 처리됐거나 찾을 수 없는 기록이에요.</S.EmptyState>
      </S.Container>
    );
  }

  const handleSaveLocationOnly = () => {
    saveLocationType({ locationType });
  };

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

  const canApprove = !!foodName.trim() && (locationType !== 'RESTAURANT' || !!selectedCandidate);

  return (
    <S.Container>
      <S.HeaderRow>
        <S.BackButton onClick={() => navigate('/draft')}>{'<'}</S.BackButton>
        <S.Title>{draft.shared ? '공유받은 기록 확인' : '자동 기록 확인'}</S.Title>
      </S.HeaderRow>

      <S.Image src={resolveImageUrl(draft.imageUrl)} alt={draft.foodName} />

      {draft.shared && draft.sourceUserNickname && (
        <S.SharedNotice>
          {draft.sourceUserNickname}님이 같이 먹은 기록을 보냈어요. 내 기록에도 추가할지
          선택해주세요.
        </S.SharedNotice>
      )}

      {!draft.shared && !draft.hasExifGps && (
        <S.GpsWarning>
          사진 EXIF 위치 정보가 없어 현재 위치 기준으로 후보를 찾았어요. 맞는 식당인지 확인해주세요.
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
        <S.Label>음식 이름</S.Label>
        <S.Input value={foodName} onChange={(e) => setFoodName(e.target.value)} />
      </S.Field>

      <S.Field>
        <S.Label>장소 유형</S.Label>
        <S.Select
          value={locationType}
          onChange={(e) => setLocationType(e.target.value as LocationType)}
        >
          {LOCATION_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </S.Select>
        <S.SaveLocationButton
          type="button"
          onClick={handleSaveLocationOnly}
          disabled={isSavingLocation}
        >
          {isSavingLocation ? '저장 중...' : '위치만 저장하기'}
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
        <S.ToggleLabel>재방문 의사가 있어요</S.ToggleLabel>
        <S.Switch $on={willRevisit} onClick={() => setWillRevisit(!willRevisit)} />
      </S.ToggleRow>

      <S.ToggleRow>
        <S.ToggleLabel>다른 사람에게 공개할래요</S.ToggleLabel>
        <S.Switch $on={isPublic} onClick={() => setIsPublic(!isPublic)} />
      </S.ToggleRow>

      <S.ButtonRow>
        <S.RejectButton type="button" onClick={handleReject} disabled={isRejecting}>
          거절
        </S.RejectButton>
        <S.ApproveButton
          type="button"
          onClick={handleApprove}
          disabled={!canApprove || isApproving}
        >
          {isApproving ? '승인 중...' : '내 기록에 추가'}
        </S.ApproveButton>
      </S.ButtonRow>
    </S.Container>
  );
};

export default DraftDetail;
