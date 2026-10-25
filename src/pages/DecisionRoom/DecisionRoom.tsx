import { useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  Heart,
  MapPin,
  MoreHorizontal,
  Pencil,
  Share2,
  ShoppingBag,
  Sparkles,
  Trash2,
  UsersRound,
  X,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import type { DecisionRoomVoteValue } from '~/apis/decisionRoom/decisionRoom.types';
import { BottomSheet } from '~/components/BottomSheet/BottomSheet';
import { ConfirmDialog } from '~/components/ConfirmDialog/ConfirmDialog';
import {
  useDecisionRoom,
  useDeleteDecisionRoom,
  useFinalizeDecisionRoom,
  useGenerateDecisionRoomCandidates,
  useJoinDecisionRoom,
  useUpdateDecisionRoomParticipant,
  useVoteDecisionRoomCandidate,
} from '~/features/decisionRooms/decisionRoom.queries';
import {
  readDecisionRoomParticipantToken,
  removeDecisionRoomParticipantToken,
  writeDecisionRoomParticipantToken,
} from '~/features/decisionRooms/decisionRoomStorage';
import { openNaverPlaceWithFallback } from '~/features/recommendations/naverNavigation';
import * as S from './DecisionRoom.styles';

const formatDistance = (meters?: number) => {
  if (meters == null) return null;
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(meters % 1000 === 0 ? 0 : 1)}km`;
};

const formatMealAt = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const splitKeywords = (value: string, max?: number) => {
  const values = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return max ? values.slice(0, max) : values;
};

const voteMeta: Record<DecisionRoomVoteValue, { label: string; Icon: typeof Heart }> = {
  LIKE: { label: '가고 싶어요', Icon: Heart },
  OKAY: { label: '괜찮아요', Icon: Check },
  HARD: { label: '어려워요', Icon: X },
};

const DecisionRoom = () => {
  const navigate = useNavigate();
  const { inviteCode: rawInviteCode = '' } = useParams();
  const inviteCode = rawInviteCode.toUpperCase();
  const [participantToken, setParticipantToken] = useState<string | null>(() =>
    readDecisionRoomParticipantToken(inviteCode),
  );
  const [displayName, setDisplayName] = useState('');
  const [avoidText, setAvoidText] = useState('');
  const [preferredText, setPreferredText] = useState('');
  const [editingMyInfo, setEditingMyInfo] = useState(false);
  const [showJoinPreferences, setShowJoinPreferences] = useState(false);
  const [inviteCodeCopied, setInviteCodeCopied] = useState(false);
  const [showRoomMenu, setShowRoomMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [optimisticVotes, setOptimisticVotes] = useState<Record<number, DecisionRoomVoteValue>>({});
  const [voteError, setVoteError] = useState('');
  const [showShortlist, setShowShortlist] = useState(false);
  const [selectedFinalizeCandidateId, setSelectedFinalizeCandidateId] = useState<number | null>(
    null,
  );

  const roomQuery = useDecisionRoom(inviteCode, participantToken);
  const room = roomQuery.data;
  const joinRoom = useJoinDecisionRoom(inviteCode);
  const updateMe = useUpdateDecisionRoomParticipant(inviteCode, participantToken);
  const generateCandidates = useGenerateDecisionRoomCandidates(
    inviteCode,
    room?.roomId,
    participantToken,
  );
  const vote = useVoteDecisionRoomCandidate(inviteCode, participantToken);
  const finalize = useFinalizeDecisionRoom(inviteCode, room?.roomId, participantToken);
  const deleteRoom = useDeleteDecisionRoom(inviteCode, room?.roomId);

  const currentParticipant = room?.participants.find(
    (participant) => participant.participantId === room.viewerParticipantId,
  );
  const finalizedCandidate = room?.candidates.find(
    (candidate) => candidate.candidateId === room.finalizedCandidateId,
  );

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/companion');
  };

  const handleJoin = () => {
    if (!displayName.trim() || joinRoom.isPending) return;
    joinRoom.mutate(
      {
        displayName: displayName.trim(),
        avoidKeywords: splitKeywords(avoidText),
        preferredFoods: splitKeywords(preferredText, 4),
      },
      {
        onSuccess: (response) => {
          writeDecisionRoomParticipantToken(inviteCode, response.participantToken);
          setParticipantToken(response.participantToken);
          setShowJoinPreferences(false);
        },
      },
    );
  };

  const startEditing = () => {
    if (!currentParticipant) return;
    setDisplayName(currentParticipant.displayName);
    setAvoidText(currentParticipant.avoidKeywords.join(', '));
    setPreferredText((currentParticipant.preferredFoods ?? []).join(', '));
    setEditingMyInfo(true);
  };

  const handleUpdate = () => {
    if (!displayName.trim() || updateMe.isPending) return;
    updateMe.mutate(
      {
        displayName: displayName.trim(),
        avoidKeywords: splitKeywords(avoidText),
        preferredFoods: splitKeywords(preferredText, 4),
      },
      { onSuccess: () => setEditingMyInfo(false) },
    );
  };

  const handleVote = (candidateId: number, value: DecisionRoomVoteValue) => {
    setVoteError('');
    setOptimisticVotes((previous) => ({ ...previous, [candidateId]: value }));
    if (value === 'LIKE') setSelectedFinalizeCandidateId((current) => current ?? candidateId);

    vote.mutate(
      { candidateId, value },
      {
        onSuccess: () => {
          setOptimisticVotes((previous) => {
            const next = { ...previous };
            delete next[candidateId];
            return next;
          });
        },
        onError: () => {
          setOptimisticVotes((previous) => {
            const next = { ...previous };
            delete next[candidateId];
            return next;
          });
          setVoteError('선택을 저장하지 못했어요. 다시 눌러주세요.');
        },
      },
    );
  };

  const copyInviteCode = async () => {
    if (!room || !navigator.clipboard) return;
    await navigator.clipboard.writeText(room.inviteCode);
    setInviteCodeCopied(true);
    window.setTimeout(() => setInviteCodeCopied(false), 1600);
  };

  const shareInvite = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: room?.title ?? 'PIKONE 약속',
          text: '같이 먹을 곳 골라보자',
          url,
        });
        return;
      } catch {
        // User cancellation falls back to clipboard.
      }
    }
    await navigator.clipboard?.writeText(url);
  };

  const shareFinal = async () => {
    if (!room || !finalizedCandidate) return;
    const when = formatMealAt(room.mealAt);
    const text = [room.title, when, finalizedCandidate.placeName, finalizedCandidate.address]
      .filter(Boolean)
      .join(' · ');

    if (navigator.share) {
      try {
        await navigator.share({ title: '식사 약속 확정', text, url: window.location.href });
        return;
      } catch {
        // Fallback below.
      }
    }
    await navigator.clipboard?.writeText(`${text}\n${window.location.href}`);
  };

  const handleDeleteRoom = () => {
    if (!room || deleteRoom.isPending) return;
    deleteRoom.mutate(undefined, {
      onSuccess: () => {
        removeDecisionRoomParticipantToken(inviteCode);
        navigate('/companion', { replace: true });
      },
    });
  };

  if (roomQuery.isLoading) {
    return <S.Loading>약속을 불러오고 있어요...</S.Loading>;
  }

  if (roomQuery.isError || !room) {
    return (
      <S.Loading>
        <div>
          <strong>약속을 찾지 못했어요.</strong>
          <button type="button" onClick={() => navigate('/companion')}>
            함께 화면으로
          </button>
        </div>
      </S.Loading>
    );
  }

  const mealAtLabel = formatMealAt(room.mealAt);
  const meetingRadiusLabel = formatDistance(room.meetingRadiusMeters);
  const canJoin = !room.viewerParticipantId && room.status === 'OPEN';
  const statusCopy =
    room.status === 'FINALIZED'
      ? {
          label: '약속 완료',
          title: '장소가 정해졌어요',
          description: '이제 시간과 식당만 확인하고 만나면 돼요.',
        }
      : room.status === 'CANDIDATES_READY'
        ? {
            label: '장소 고르는 중',
            title: '마음 가는 곳을 골라주세요',
            description: '각자 반응을 남기면 모두가 괜찮은 곳을 고르기 쉬워요.',
          }
        : {
            label: '친구 기다리는 중',
            title: room.allParticipantsReady
              ? '식당 후보를 찾아볼까요?'
              : '친구가 들어오길 기다리고 있어요',
            description: room.allParticipantsReady
              ? `${room.meetingLocationLabel} 주변에서 같이 갈 곳을 찾아요.`
              : '초대 링크를 보내고, 들어온 친구와 취향만 가볍게 맞춰보세요.',
          };

  const effectiveVote = (candidateId: number, fallback?: DecisionRoomVoteValue | null) =>
    optimisticVotes[candidateId] ?? fallback ?? null;
  const likedCandidates = room.candidates.filter(
    (candidate) => effectiveVote(candidate.candidateId, candidate.myVote) === 'LIKE',
  );
  const selectedFinalizeCandidate =
    likedCandidates.find((candidate) => candidate.candidateId === selectedFinalizeCandidateId) ??
    null;
  const canFinalizeSelected = selectedFinalizeCandidate?.consensusState === 'CONSENSUS';

  const openShortlist = () => {
    const selectedStillLiked = likedCandidates.some(
      (candidate) => candidate.candidateId === selectedFinalizeCandidateId,
    );
    if (!selectedStillLiked)
      setSelectedFinalizeCandidateId(likedCandidates[0]?.candidateId ?? null);
    setShowShortlist(true);
  };

  const handleFinalizeSelected = () => {
    if (
      !room.viewerHost ||
      !selectedFinalizeCandidate ||
      !canFinalizeSelected ||
      finalize.isPending
    )
      return;
    finalize.mutate(selectedFinalizeCandidate.candidateId, {
      onSuccess: () => setShowShortlist(false),
    });
  };

  return (
    <S.Page>
      <S.TopBar>
        <S.IconButton type="button" aria-label="뒤로 가기" onClick={handleBack}>
          <ArrowLeft size={22} strokeWidth={2.2} />
        </S.IconButton>
        <S.TopBarTitle>약속</S.TopBarTitle>
        <S.TopBarActions>
          <S.IconButton type="button" aria-label="약속 공유하기" onClick={() => void shareInvite()}>
            <Share2 size={19} strokeWidth={2.2} />
          </S.IconButton>
          {room.viewerHost && (
            <S.MenuWrap>
              <S.IconButton
                type="button"
                aria-label="약속 메뉴"
                aria-expanded={showRoomMenu}
                onClick={() => setShowRoomMenu((value) => !value)}
              >
                <MoreHorizontal size={21} strokeWidth={2.2} />
              </S.IconButton>
              {showRoomMenu && (
                <S.RoomMenu>
                  <S.DeleteMenuButton
                    type="button"
                    onClick={() => {
                      setShowRoomMenu(false);
                      setShowDeleteConfirm(true);
                    }}
                  >
                    <Trash2 size={16} />
                    약속 삭제
                  </S.DeleteMenuButton>
                </S.RoomMenu>
              )}
            </S.MenuWrap>
          )}
        </S.TopBarActions>
      </S.TopBar>

      <S.Hero>
        <S.StatusPill $finalized={room.status === 'FINALIZED'}>{statusCopy.label}</S.StatusPill>
        <S.Title>{room.title}</S.Title>
        <S.HeroMeta>
          {mealAtLabel && (
            <span>
              <CheckCircle2 size={14} /> {mealAtLabel}
            </span>
          )}
          <span>
            <UsersRound size={14} /> {room.participants.length}명 참여
          </span>
        </S.HeroMeta>
      </S.Hero>

      <S.MeetingCard>
        <S.MeetingIcon aria-hidden="true">
          <MapPin size={19} />
        </S.MeetingIcon>
        <S.MeetingText>
          <span>만날 위치</span>
          <strong>{room.meetingLocationLabel}</strong>
          {meetingRadiusLabel && <small>주변 {meetingRadiusLabel} 안에서 식당을 찾아요</small>}
        </S.MeetingText>
      </S.MeetingCard>

      {room.status !== 'FINALIZED' && (
        <S.ProgressCard>
          <S.ProgressIcon aria-hidden="true">
            <Sparkles size={18} />
          </S.ProgressIcon>
          <div>
            <strong>{statusCopy.title}</strong>
            <span>{statusCopy.description}</span>
          </div>
        </S.ProgressCard>
      )}

      {room.status === 'OPEN' && room.viewerParticipantId && (
        <S.InviteCard>
          <div>
            <span>친구 초대</span>
            <strong>링크 하나만 보내면 돼요</strong>
            <small>초대 코드 {room.inviteCode}</small>
          </div>
          <S.InviteActions>
            <S.CompactButton type="button" onClick={() => void copyInviteCode()}>
              <Copy size={15} /> {inviteCodeCopied ? '복사됨' : '코드 복사'}
            </S.CompactButton>
            <S.PrimaryCompactButton type="button" onClick={() => void shareInvite()}>
              <Share2 size={15} /> 공유
            </S.PrimaryCompactButton>
          </S.InviteActions>
        </S.InviteCard>
      )}

      {canJoin && (
        <S.Card>
          <S.SectionHeader>
            <div>
              <S.SectionTitle>이 약속에 참여하기</S.SectionTitle>
              <S.SectionDescription>
                만날 곳은 {room.meetingLocationLabel}로 정해졌어요. 이름만 입력하면 참여할 수
                있어요.
              </S.SectionDescription>
            </div>
          </S.SectionHeader>

          <S.Form>
            <S.Field>
              <S.Label htmlFor="join-name">이름</S.Label>
              <S.Input
                id="join-name"
                value={displayName}
                maxLength={40}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="친구들에게 보일 이름"
              />
            </S.Field>

            <S.PreferenceToggle
              type="button"
              aria-expanded={showJoinPreferences}
              onClick={() => setShowJoinPreferences((value) => !value)}
            >
              <span>메뉴 취향 더하기</span>
              <small>{showJoinPreferences ? '접기' : '선택'}</small>
            </S.PreferenceToggle>

            {showJoinPreferences && (
              <S.PreferenceFields>
                <S.Field>
                  <S.Label htmlFor="preferred-food">먹고 싶은 메뉴</S.Label>
                  <S.Input
                    id="preferred-food"
                    value={preferredText}
                    maxLength={120}
                    onChange={(event) => setPreferredText(event.target.value)}
                    placeholder="예: 초밥, 파스타"
                  />
                </S.Field>
                <S.Field>
                  <S.Label htmlFor="avoid-food">오늘 피하고 싶은 것</S.Label>
                  <S.Input
                    id="avoid-food"
                    value={avoidText}
                    maxLength={120}
                    onChange={(event) => setAvoidText(event.target.value)}
                    placeholder="예: 마라, 고기"
                  />
                </S.Field>
              </S.PreferenceFields>
            )}

            <S.PrimaryButton
              type="button"
              disabled={!displayName.trim() || joinRoom.isPending}
              onClick={handleJoin}
            >
              {joinRoom.isPending ? '참여 중...' : '참여하기'}
            </S.PrimaryButton>
            {joinRoom.isError && (
              <S.ErrorText role="alert">
                참여하지 못했어요. 이름을 확인하고 다시 시도해주세요.
              </S.ErrorText>
            )}
          </S.Form>
        </S.Card>
      )}

      {!room.viewerParticipantId && room.status !== 'OPEN' && (
        <S.Card>
          <S.EmptyMessage>
            <strong>이미 장소를 고르는 단계예요.</strong>
            <span>이 약속은 새 참여를 마감했어요.</span>
          </S.EmptyMessage>
        </S.Card>
      )}

      {editingMyInfo && currentParticipant && (
        <S.Card>
          <S.SectionHeader>
            <div>
              <S.SectionTitle>내 정보 수정</S.SectionTitle>
              <S.SectionDescription>이름이나 메뉴 취향만 바꿀 수 있어요.</S.SectionDescription>
            </div>
          </S.SectionHeader>
          <S.Form>
            <S.Field>
              <S.Label htmlFor="edit-name">이름</S.Label>
              <S.Input
                id="edit-name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
              />
            </S.Field>
            <S.Field>
              <S.Label htmlFor="edit-preferred">먹고 싶은 메뉴</S.Label>
              <S.Input
                id="edit-preferred"
                value={preferredText}
                onChange={(event) => setPreferredText(event.target.value)}
                placeholder="예: 초밥, 파스타"
              />
            </S.Field>
            <S.Field>
              <S.Label htmlFor="edit-avoid">피하고 싶은 것</S.Label>
              <S.Input
                id="edit-avoid"
                value={avoidText}
                onChange={(event) => setAvoidText(event.target.value)}
                placeholder="예: 마라, 고기"
              />
            </S.Field>
            <S.FormActions>
              <S.SecondaryButton type="button" onClick={() => setEditingMyInfo(false)}>
                취소
              </S.SecondaryButton>
              <S.PrimaryButton
                type="button"
                disabled={!displayName.trim() || updateMe.isPending}
                onClick={handleUpdate}
              >
                {updateMe.isPending ? '저장 중...' : '저장'}
              </S.PrimaryButton>
            </S.FormActions>
          </S.Form>
        </S.Card>
      )}

      {room.status === 'OPEN' && room.viewerParticipantId && (
        <S.Card>
          <S.SectionHeader>
            <div>
              <S.SectionTitle>함께하는 사람</S.SectionTitle>
              <S.SectionDescription>누가 들어왔는지와 메뉴 취향만 확인해요.</S.SectionDescription>
            </div>
            <S.Count>{room.participants.length}명</S.Count>
          </S.SectionHeader>

          <S.ParticipantList>
            {room.participants.map((participant) => (
              <S.Participant key={participant.participantId}>
                <S.Avatar aria-hidden="true">
                  {participant.displayName.trim().charAt(0) || '친'}
                </S.Avatar>
                <S.ParticipantMain>
                  <strong>{participant.displayName}</strong>
                  <span>
                    {participant.preferredFoods?.length || participant.avoidKeywords.length
                      ? '취향 입력 완료'
                      : '참여 완료'}
                  </span>
                  {participant.preferredFoods?.length || participant.avoidKeywords.length ? (
                    <S.Tags>
                      {participant.preferredFoods?.slice(0, 2).map((food) => (
                        <S.Tag key={`like-${food}`}>{food}</S.Tag>
                      ))}
                      {participant.avoidKeywords.slice(0, 2).map((keyword) => (
                        <S.Tag key={`avoid-${keyword}`} $muted>
                          피함 {keyword}
                        </S.Tag>
                      ))}
                    </S.Tags>
                  ) : null}
                </S.ParticipantMain>
                <S.ReadyDot
                  $ready={participant.constraintsSubmitted}
                  aria-label={participant.constraintsSubmitted ? '참여 완료' : '입력 중'}
                />
              </S.Participant>
            ))}
          </S.ParticipantList>

          {currentParticipant && (
            <S.TextButton type="button" onClick={startEditing}>
              <Pencil size={14} /> 내 정보 수정
            </S.TextButton>
          )}

          {room.viewerHost && (
            <>
              <S.PrimaryButton
                type="button"
                disabled={!room.canGenerateCandidates || generateCandidates.isPending}
                onClick={() => generateCandidates.mutate()}
              >
                {generateCandidates.isPending
                  ? '후보 찾는 중...'
                  : `${room.meetingLocationLabel} 주변 식당 찾기`}
              </S.PrimaryButton>
              {!room.canGenerateCandidates && (
                <S.HelperText>친구가 한 명 이상 참여하면 식당 후보를 만들 수 있어요.</S.HelperText>
              )}
            </>
          )}

          {generateCandidates.isError && (
            <S.ErrorText role="alert">
              식당 후보를 찾지 못했어요. 만날 위치나 검색 범위를 확인해주세요.
            </S.ErrorText>
          )}
        </S.Card>
      )}

      {room.status === 'CANDIDATES_READY' && !!room.candidates.length && (
        <S.Card>
          <S.SectionHeader>
            <div>
              <S.SectionTitle>어디가 좋을까요?</S.SectionTitle>
              <S.SectionDescription>
                {room.meetingLocationLabel} 주변 후보예요. 각자 마음을 남겨주세요.
              </S.SectionDescription>
            </div>
          </S.SectionHeader>

          <S.CandidateList>
            {room.candidates.map((candidate) => {
              const isConsensus = candidate.consensusState === 'CONSENSUS';
              const isConflict =
                !candidate.allConstraintsSatisfied ||
                candidate.consensusState === 'CONSTRAINT_CONFLICT';
              const distance = formatDistance(candidate.distanceFromMeetingMeters);

              return (
                <S.Candidate key={candidate.candidateId}>
                  <S.CandidateTop>
                    <S.CandidateText>
                      <strong>{candidate.placeName}</strong>
                      <span>{candidate.category || candidate.address || '식당'}</span>
                    </S.CandidateText>
                    <S.ConsensusBadge $positive={isConsensus} $warning={isConflict}>
                      {isConsensus
                        ? '모두 괜찮아요'
                        : isConflict
                          ? '조건 확인'
                          : candidate.pendingVoteCount > 0
                            ? `${candidate.pendingVoteCount}명 선택 전`
                            : '의견 갈림'}
                    </S.ConsensusBadge>
                  </S.CandidateTop>

                  {candidate.recommendationReason && (
                    <S.Reason>{candidate.recommendationReason}</S.Reason>
                  )}
                  {distance && (
                    <S.SimpleMetrics>
                      <span>만날 위치에서 {distance}</span>
                    </S.SimpleMetrics>
                  )}
                  {isConflict && (
                    <S.Conflict>
                      만날 위치의 검색 범위나 누군가의 메뉴 조건과 맞지 않을 수 있어요.
                    </S.Conflict>
                  )}

                  {room.viewerParticipantId && (
                    <S.VoteRow>
                      {(['LIKE', 'OKAY', 'HARD'] as DecisionRoomVoteValue[]).map((value) => {
                        const { label, Icon } = voteMeta[value];
                        return (
                          <S.VoteButton
                            key={value}
                            type="button"
                            $selected={
                              effectiveVote(candidate.candidateId, candidate.myVote) === value
                            }
                            aria-pressed={
                              effectiveVote(candidate.candidateId, candidate.myVote) === value
                            }
                            disabled={
                              vote.isPending &&
                              vote.variables?.candidateId === candidate.candidateId
                            }
                            onClick={() => handleVote(candidate.candidateId, value)}
                          >
                            <Icon size={15} />
                            {label}
                          </S.VoteButton>
                        );
                      })}
                    </S.VoteRow>
                  )}

                  <S.CandidateActions>
                    <S.SecondaryButton
                      type="button"
                      onClick={() => openNaverPlaceWithFallback(candidate)}
                    >
                      <MapPin size={15} /> 지도 보기
                    </S.SecondaryButton>
                  </S.CandidateActions>
                </S.Candidate>
              );
            })}
          </S.CandidateList>

          {voteError && <S.ErrorText role="alert">{voteError}</S.ErrorText>}

          {currentParticipant && (
            <S.TextButton type="button" onClick={startEditing}>
              <Pencil size={14} /> 내 정보 수정
            </S.TextButton>
          )}
          {room.viewerHost && (
            <S.TextButton
              type="button"
              disabled={!room.canGenerateCandidates || generateCandidates.isPending}
              onClick={() => generateCandidates.mutate()}
            >
              후보 다시 찾기
            </S.TextButton>
          )}
          {finalize.isError && (
            <S.ErrorText role="alert">모두의 선택을 확인한 뒤 다시 확정해주세요.</S.ErrorText>
          )}
          {generateCandidates.isError && (
            <S.ErrorText role="alert">후보를 다시 찾지 못했어요. 잠시 후 시도해주세요.</S.ErrorText>
          )}
        </S.Card>
      )}

      {room.status === 'FINALIZED' && finalizedCandidate && (
        <S.FinalCard>
          <S.FinalIcon aria-hidden="true">
            <CheckCircle2 size={28} />
          </S.FinalIcon>
          <S.FinalEyebrow>약속 완료</S.FinalEyebrow>
          <S.FinalTitle>{finalizedCandidate.placeName}</S.FinalTitle>
          <S.FinalMeta>
            {mealAtLabel && <span>{mealAtLabel}</span>}
            {finalizedCandidate.address && <span>{finalizedCandidate.address}</span>}
          </S.FinalMeta>
          <S.FinalActions>
            <S.SecondaryButton
              type="button"
              onClick={() => openNaverPlaceWithFallback(finalizedCandidate)}
            >
              <MapPin size={15} /> 지도 보기
            </S.SecondaryButton>
            <S.PrimaryButton type="button" onClick={() => void shareFinal()}>
              <Share2 size={15} /> 약속 공유
            </S.PrimaryButton>
          </S.FinalActions>
        </S.FinalCard>
      )}

      {room.status === 'CANDIDATES_READY' && room.viewerParticipantId && (
        <S.ShortlistDock>
          <S.ShortlistDockButton type="button" onClick={openShortlist}>
            <S.ShortlistIcon aria-hidden="true">
              <ShoppingBag size={18} strokeWidth={2.2} />
            </S.ShortlistIcon>
            <S.ShortlistDockText>
              <strong>
                {likedCandidates.length
                  ? `가고 싶은 곳 ${likedCandidates.length}곳`
                  : '가고 싶은 곳 담기'}
              </strong>
              <span>
                {likedCandidates.length
                  ? '담아둔 후보를 보고 약속을 확정해요'
                  : '후보에서 ‘가고 싶어요’를 누르면 여기에 담겨요'}
              </span>
            </S.ShortlistDockText>
            <S.ShortlistCount>{likedCandidates.length}</S.ShortlistCount>
          </S.ShortlistDockButton>
        </S.ShortlistDock>
      )}

      <BottomSheet
        isOpen={showShortlist}
        title="가고 싶은 곳"
        ariaLabel="가고 싶은 식당 후보"
        closeLabel="가고 싶은 곳 닫기"
        onClose={() => setShowShortlist(false)}
        actionLabel={
          room.viewerHost ? (finalize.isPending ? '확정 중...' : '약속 확정') : undefined
        }
        actionDisabled={!selectedFinalizeCandidate || !canFinalizeSelected || finalize.isPending}
        onAction={room.viewerHost ? handleFinalizeSelected : undefined}
        blurBackdrop
      >
        {likedCandidates.length ? (
          <>
            <S.ShortlistIntro>
              <strong>
                {room.viewerHost
                  ? '마지막으로 한 곳을 골라주세요'
                  : '내가 가고 싶다고 고른 곳이에요'}
              </strong>
              <span>
                {room.viewerHost
                  ? '모두가 괜찮다고 한 후보를 선택하면 약속을 확정할 수 있어요.'
                  : '호스트가 최종 장소를 정하면 이 화면에 반영돼요.'}
              </span>
            </S.ShortlistIntro>
            <S.ShortlistList>
              {likedCandidates.map((candidate) => {
                const selected = candidate.candidateId === selectedFinalizeCandidateId;
                const consensus = candidate.consensusState === 'CONSENSUS';
                return (
                  <S.ShortlistItem
                    key={candidate.candidateId}
                    type="button"
                    $selected={selected}
                    onClick={() => setSelectedFinalizeCandidateId(candidate.candidateId)}
                    aria-pressed={selected}
                  >
                    <span>
                      <strong>{candidate.placeName}</strong>
                      <small>{candidate.category || candidate.address || '식당'}</small>
                    </span>
                    <S.ShortlistStatus $ready={consensus}>
                      {consensus ? '확정 가능' : '의견 확인 중'}
                    </S.ShortlistStatus>
                  </S.ShortlistItem>
                );
              })}
            </S.ShortlistList>
            {room.viewerHost && selectedFinalizeCandidate && !canFinalizeSelected && (
              <S.ShortlistHint>
                모든 참여자가 이 후보에 ‘괜찮아요’ 이상을 남기면 약속 확정 버튼이 활성화돼요.
              </S.ShortlistHint>
            )}
            {finalize.isError && (
              <S.ErrorText role="alert">
                약속을 확정하지 못했어요. 참여자 선택을 다시 확인해주세요.
              </S.ErrorText>
            )}
          </>
        ) : (
          <S.ShortlistEmpty>
            <ShoppingBag size={28} strokeWidth={1.8} aria-hidden="true" />
            <strong>아직 담아둔 곳이 없어요</strong>
            <span>식당 후보에서 ‘가고 싶어요’를 누르면 이곳에 모여요.</span>
          </S.ShortlistEmpty>
        )}
      </BottomSheet>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="이 약속을 삭제할까요?"
        description="참여자와 후보, 선택 기록이 모두 삭제돼요. 삭제한 약속은 복구할 수 없어요."
        confirmLabel="약속 삭제"
        pendingLabel="삭제 중"
        isPending={deleteRoom.isPending}
        onCancel={() => {
          if (!deleteRoom.isPending) setShowDeleteConfirm(false);
        }}
        onConfirm={handleDeleteRoom}
      />
    </S.Page>
  );
};

export default DecisionRoom;
