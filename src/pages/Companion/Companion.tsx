import { useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  CalendarDays,
  KeyRound,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  UserPlus,
  UsersRound,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPublicDecisionRoom } from '~/apis/decisionRoom/decisionRoom.api';
import type { DecisionRoomStatus } from '~/apis/decisionRoom/decisionRoom.types';
import { useMyDecisionRooms } from '~/features/decisionRooms/decisionRoom.queries';
import {
  useCompanions,
  useDeleteCompanion,
  useMyCompanionCode,
  usePendingCompanionRequests,
  useRespondCompanionRequest,
  useUpdateCompanionName,
} from '~/features/companions/companion.queries';
import { ConfirmDialog } from '~/components/ConfirmDialog/ConfirmDialog';
import { useToast } from '~/components/Toast/useToast';
import { resolveImageUrl } from '~/utils/image';
import type { CompanionResponse, CompanionType } from '~/apis/companion/companion.types';
import * as S from './Companion.styles';

const DECISION_ROOM_INVITE_CODE_LENGTH = 10;

const normalizeInviteCode = (value: string) => {
  const upper = value.trim().toUpperCase();
  const fromUrl = upper.match(/\/DECISION-ROOM\/([A-Z0-9]+)/)?.[1] ?? upper;
  return fromUrl.replace(/[^A-HJ-NP-Z2-9]/g, '').slice(0, DECISION_ROOM_INVITE_CODE_LENGTH);
};

const decisionRoomStatusLabel = (status: DecisionRoomStatus) => {
  if (status === 'CANDIDATES_READY') return '장소 고르는 중';
  if (status === 'FINALIZED') return '약속 완료';
  return '친구 기다리는 중';
};

const formatDecisionRoomMealAt = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
const COMPANION_TYPE_LABEL: Record<CompanionType, string> = {
  ALONE: '혼자',
  LOVER: '연인',
  FRIEND: '친구',
  FAMILY: '가족',
  CUSTOM: '기타',
};

const getInitial = (value?: string | null) => value?.trim().charAt(0) || '함';

const CompanionListItem = ({ companion }: { companion: CompanionResponse }) => {
  const navigate = useNavigate();
  const [isManaging, setIsManaging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    companionId: number;
    displayName: string;
  } | null>(null);
  const [name, setName] = useState(companion.displayName);

  const { mutate: updateName, isPending: isUpdating } = useUpdateCompanionName(
    companion.companionId,
  );
  const { mutate: deleteCompanion, isPending: isDeleting } = useDeleteCompanion(
    deleteTarget?.companionId ?? companion.companionId,
  );

  const closeManagement = () => {
    if (isDeleting) return;

    setName(companion.displayName);
    setIsEditing(false);
    setDeleteTarget(null);
    setIsManaging(false);
  };

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === companion.displayName) {
      closeManagement();
      return;
    }

    updateName(
      { displayName: trimmed },
      {
        onSuccess: () => {
          setIsEditing(false);
          setIsManaging(false);
        },
      },
    );
  };

  const handleDelete = () => {
    if (!deleteTarget || isDeleting) return;

    deleteCompanion(undefined, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <S.CompanionCard>
      <S.CompanionHeader>
        <S.CompanionAvatar aria-hidden="true" $linked={companion.isAppUser}>
          {getInitial(companion.displayName)}
        </S.CompanionAvatar>

        <S.CompanionInfo>
          <S.CompanionName>{companion.displayName}</S.CompanionName>
          <S.CompanionMeta>
            <S.RelationshipLabel>
              {COMPANION_TYPE_LABEL[companion.companionType]}
            </S.RelationshipLabel>
          </S.CompanionMeta>
        </S.CompanionInfo>

        <S.MoreButton
          type="button"
          aria-label={`${companion.displayName} 관리`}
          aria-expanded={isManaging}
          onClick={() => {
            if (isManaging) closeManagement();
            else setIsManaging(true);
          }}
        >
          {isManaging ? <X size={18} /> : <MoreHorizontal size={20} />}
        </S.MoreButton>
      </S.CompanionHeader>

      {companion.isAppUser && (
        <S.RecordButton
          type="button"
          onClick={() => navigate(`/companion/${companion.companionId}/records`)}
        >
          <span>
            <strong>공개 기록 보기</strong>
            함께 공유한 식사 기록을 모아봐요
          </span>
          <ChevronRight size={19} strokeWidth={2.3} aria-hidden="true" />
        </S.RecordButton>
      )}

      <S.PlanButton
        type="button"
        onClick={() =>
          navigate(`/decision-rooms/new?companionName=${encodeURIComponent(companion.displayName)}`)
        }
      >
        <span>
          <strong>이 친구와 식당 정하기</strong>
          약속을 만들고 초대해요
        </span>
        <ChevronRight size={19} strokeWidth={2.3} aria-hidden="true" />
      </S.PlanButton>

      {isManaging && (
        <S.ManagementPanel>
          {isEditing ? (
            <S.NameEditForm
              onSubmit={(event) => {
                event.preventDefault();
                handleSave();
              }}
            >
              <S.NameEditLabel htmlFor={`companion-name-${companion.companionId}`}>
                내 화면에 보일 이름
              </S.NameEditLabel>
              <S.NameEditRow>
                <S.NameEditInput
                  id={`companion-name-${companion.companionId}`}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={20}
                  autoFocus
                />
                <S.SaveButton type="submit" disabled={isUpdating || !name.trim()}>
                  <Check size={16} aria-hidden="true" />
                  저장
                </S.SaveButton>
              </S.NameEditRow>
            </S.NameEditForm>
          ) : (
            <S.ManagementActions>
              <S.ManagementButton type="button" onClick={() => setIsEditing(true)}>
                <Pencil size={16} aria-hidden="true" />
                이름 수정
              </S.ManagementButton>
              <S.DeleteButton
                type="button"
                onClick={() =>
                  setDeleteTarget({
                    companionId: companion.companionId,
                    displayName: companion.displayName,
                  })
                }
              >
                <Trash2 size={16} aria-hidden="true" />
                {companion.isAppUser ? '연결 해제' : '목록에서 삭제'}
              </S.DeleteButton>
            </S.ManagementActions>
          )}
        </S.ManagementPanel>
      )}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title={`${deleteTarget?.displayName ?? ''}님을 삭제할까요?`}
        description="기존 식사 기록은 삭제되지 않아요."
        confirmLabel="삭제"
        pendingLabel="삭제 중"
        isPending={isDeleting}
        onCancel={() => {
          if (!isDeleting) setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
      />
    </S.CompanionCard>
  );
};

const Companion = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    data: companions,
    isLoading: isCompanionsLoading,
    isError: isCompanionsError,
    refetch: refetchCompanions,
  } = useCompanions();
  const { data: pendingRequests } = usePendingCompanionRequests();
  const { data: myCode } = useMyCompanionCode();
  const { mutate: respondRequest, isPending: isResponding } = useRespondCompanionRequest();
  const myDecisionRooms = useMyDecisionRooms();
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [activeSection, setActiveSection] = useState<'appointments' | 'people'>('appointments');
  const [decisionRoomCode, setDecisionRoomCode] = useState('');
  const [decisionRoomCodeError, setDecisionRoomCodeError] = useState('');
  const [isCheckingDecisionRoom, setIsCheckingDecisionRoom] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<{
    requestId: number;
    fromUserNickname: string;
  } | null>(null);

  const activeRooms = (myDecisionRooms.data ?? []).filter((room) => room.status !== 'FINALIZED');
  const finalizedRooms = (myDecisionRooms.data ?? []).filter((room) => room.status === 'FINALIZED');

  const handleCopyCode = async () => {
    if (!myCode?.myCode) {
      showToast('코드를 불러온 뒤 다시 시도해주세요.', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(myCode.myCode);
      showToast('내 코드를 복사했어요. 친구에게 보내보세요.');
    } catch {
      showToast('코드 복사에 실패했어요.', 'error');
    }
  };

  const handleReject = () => {
    if (!rejectTarget || isResponding) return;

    respondRequest(
      { requestId: rejectTarget.requestId, accept: false },
      { onSuccess: () => setRejectTarget(null) },
    );
  };

  const handleDecisionRoomCodeChange = (value: string) => {
    setDecisionRoomCode(normalizeInviteCode(value));
    if (decisionRoomCodeError) setDecisionRoomCodeError('');
  };

  const handleJoinDecisionRoomByCode = async () => {
    const inviteCode = normalizeInviteCode(decisionRoomCode);
    setDecisionRoomCode(inviteCode);

    if (inviteCode.length !== DECISION_ROOM_INVITE_CODE_LENGTH) {
      setDecisionRoomCodeError('초대 코드 10자리를 확인해주세요.');
      return;
    }

    setIsCheckingDecisionRoom(true);
    setDecisionRoomCodeError('');
    try {
      await getPublicDecisionRoom(inviteCode);
      navigate(`/decision-room/${inviteCode}`);
    } catch {
      setDecisionRoomCodeError('방을 찾지 못했어요. 초대 코드를 다시 확인해주세요.');
    } finally {
      setIsCheckingDecisionRoom(false);
    }
  };

  return (
    <S.Container>
      <S.PageHeader>
        <div>
          <S.Eyebrow>TOGETHER</S.Eyebrow>
          <S.PageTitle>함께</S.PageTitle>
        </div>
      </S.PageHeader>

      <S.SectionTabs aria-label="함께 화면 구분">
        <S.SectionTab
          type="button"
          $active={activeSection === 'appointments'}
          onClick={() => setActiveSection('appointments')}
        >
          <CalendarDays size={17} strokeWidth={2.2} aria-hidden="true" /> <span>약속</span>
        </S.SectionTab>
        <S.SectionTab
          type="button"
          $active={activeSection === 'people'}
          onClick={() => setActiveSection('people')}
        >
          <UsersRound size={17} strokeWidth={2.2} aria-hidden="true" />{' '}
          <span>사람{pendingRequests?.length ? ` · ${pendingRequests.length}` : ''}</span>
        </S.SectionTab>
      </S.SectionTabs>

      {activeSection === 'appointments' && (
        <>
          <S.DecisionSection>
            <S.DecisionSectionHeader>
              <div>
                <S.SectionTitle>진행 중인 약속</S.SectionTitle>
                <S.SectionDescription>
                  함께 정하던 식사는 여기서 이어갈 수 있어요.
                </S.SectionDescription>
              </div>
              {!!activeRooms.length && <S.CountText>{activeRooms.length}개</S.CountText>}
            </S.DecisionSectionHeader>

            {myDecisionRooms.isLoading ? (
              <S.DecisionEmpty>약속을 불러오고 있어요.</S.DecisionEmpty>
            ) : myDecisionRooms.isError ? (
              <S.EmptyState>
                <strong>약속을 불러오지 못했어요.</strong>
                <span>조회 실패를 약속 없음으로 표시하지 않았어요.</span>
                <S.RetryButton type="button" onClick={() => void myDecisionRooms.refetch()}>
                  다시 불러오기
                </S.RetryButton>
              </S.EmptyState>
            ) : activeRooms.length ? (
              <S.DecisionRoomList>
                {activeRooms.map((room) => {
                  const mealAt = formatDecisionRoomMealAt(room.mealAt);
                  return (
                    <S.DecisionRoomButton
                      key={room.roomId}
                      type="button"
                      onClick={() => navigate(`/decision-room/${room.inviteCode}`)}
                    >
                      <S.DecisionRoomIcon aria-hidden="true">
                        <MapPin className="decision-room-pin" size={18} strokeWidth={2.2} />
                      </S.DecisionRoomIcon>
                      <span>
                        <strong>{room.title}</strong>
                        <small>
                          {decisionRoomStatusLabel(room.status)} · {room.participantCount}명
                          {room.meetingLocationLabel ? ` · ${room.meetingLocationLabel}` : ''}
                          {mealAt ? ` · ${mealAt}` : ''}
                        </small>
                      </span>
                      <ChevronRight size={18} aria-hidden="true" />
                    </S.DecisionRoomButton>
                  );
                })}
              </S.DecisionRoomList>
            ) : (
              <S.DecisionEmpty>진행 중인 약속이 없어요.</S.DecisionEmpty>
            )}
          </S.DecisionSection>

          <S.DecisionSection>
            <S.DecisionSectionHeader>
              <div>
                <S.SectionTitle>확정한 약속</S.SectionTitle>
                <S.SectionDescription>
                  확정한 식당과 시간을 다시 확인할 수 있어요.
                </S.SectionDescription>
              </div>
              {!!finalizedRooms.length && <S.CountText>{finalizedRooms.length}개</S.CountText>}
            </S.DecisionSectionHeader>
            {myDecisionRooms.isLoading ? (
              <S.DecisionEmpty>확정한 약속을 불러오고 있어요.</S.DecisionEmpty>
            ) : myDecisionRooms.isError ? null : finalizedRooms.length ? (
              <S.DecisionRoomList>
                {finalizedRooms.map((room) => {
                  const mealAt = formatDecisionRoomMealAt(room.mealAt);
                  return (
                    <S.DecisionRoomButton
                      key={room.roomId}
                      type="button"
                      onClick={() => navigate(`/decision-room/${room.inviteCode}`)}
                    >
                      <S.DecisionRoomIcon aria-hidden="true">
                        <CheckCircle2 size={18} strokeWidth={2.2} />
                      </S.DecisionRoomIcon>
                      <span>
                        <strong>{room.title}</strong>
                        <small>
                          확정 · {room.participantCount}명
                          {room.meetingLocationLabel ? ` · ${room.meetingLocationLabel}` : ''}
                          {mealAt ? ` · ${mealAt}` : ''}
                        </small>
                      </span>
                      <ChevronRight size={18} aria-hidden="true" />
                    </S.DecisionRoomButton>
                  );
                })}
              </S.DecisionRoomList>
            ) : (
              <S.DecisionEmpty>아직 확정한 약속이 없어요.</S.DecisionEmpty>
            )}
          </S.DecisionSection>
        </>
      )}

      {activeSection === 'appointments' && (
        <S.AppointmentDock>
          {showJoinRoom && (
            <S.JoinRoomDockForm
              onSubmit={(event) => {
                event.preventDefault();
                void handleJoinDecisionRoomByCode();
              }}
            >
              <S.JoinRoomInput
                value={decisionRoomCode}
                onChange={(event) => handleDecisionRoomCodeChange(event.target.value)}
                placeholder="10자리 초대 코드"
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                aria-invalid={Boolean(decisionRoomCodeError)}
              />
              <S.JoinRoomButton
                type="submit"
                disabled={
                  decisionRoomCode.length !== DECISION_ROOM_INVITE_CODE_LENGTH ||
                  isCheckingDecisionRoom
                }
              >
                {isCheckingDecisionRoom ? '확인 중' : '참여하기'}
              </S.JoinRoomButton>
              {decisionRoomCodeError && (
                <S.JoinRoomError role="alert">{decisionRoomCodeError}</S.JoinRoomError>
              )}
            </S.JoinRoomDockForm>
          )}
          <S.AppointmentActionBar>
            <S.AppointmentCreateButton
              type="button"
              onClick={() => navigate('/decision-rooms/new')}
            >
              <S.ActionIcon aria-hidden="true">
                <Plus size={18} strokeWidth={2.5} />
              </S.ActionIcon>
              약속 만들기
            </S.AppointmentCreateButton>
            <S.AppointmentJoinButton
              type="button"
              $active={showJoinRoom}
              aria-label="초대 코드로 약속 참여"
              aria-expanded={showJoinRoom}
              onClick={() => {
                setShowJoinRoom((value) => !value);
                setDecisionRoomCodeError('');
              }}
            >
              <KeyRound size={18} strokeWidth={2.3} aria-hidden="true" />
              <span>초대 코드</span>
            </S.AppointmentJoinButton>
          </S.AppointmentActionBar>
        </S.AppointmentDock>
      )}

      {activeSection === 'people' && (
        <>
          <S.CodeCard>
            <S.CodeCopy>
              <S.CodeLabel>내 연결 코드</S.CodeLabel>
              <S.CodeValue>{myCode?.myCode ?? '------'}</S.CodeValue>
            </S.CodeCopy>
            <S.CopyButton type="button" onClick={handleCopyCode} disabled={!myCode?.myCode}>
              <Copy size={17} strokeWidth={2.3} aria-hidden="true" /> 복사
            </S.CopyButton>
            <S.CodeDescription>
              코드를 공유하면 연결된 친구끼리 공개한 식사 기록을 볼 수 있어요.
            </S.CodeDescription>
          </S.CodeCard>

          <S.Section aria-labelledby="my-companion-title">
            <S.SectionHeader>
              <div>
                <S.SectionTitle id="my-companion-title">함께 먹는 사람</S.SectionTitle>
                <S.SectionDescription>
                  사람을 선택해 공개한 식사 기록을 보거나 약속을 시작할 수 있어요.
                </S.SectionDescription>
              </div>
              {!!companions?.length && <S.CountText>{companions.length}명</S.CountText>}
            </S.SectionHeader>
            {isCompanionsLoading ? (
              <S.SkeletonList aria-label="함께 먹는 사람 목록을 불러오는 중">
                <S.SkeletonCard />
                <S.SkeletonCard />
              </S.SkeletonList>
            ) : isCompanionsError ? (
              <S.EmptyState>
                <UsersRound size={30} strokeWidth={1.8} aria-hidden="true" />
                <strong>함께 먹는 사람을 불러오지 못했어요.</strong>
                <span>잠시 후 다시 시도해주세요.</span>
                <S.RetryButton type="button" onClick={() => void refetchCompanions()}>
                  다시 불러오기
                </S.RetryButton>
              </S.EmptyState>
            ) : companions && companions.length > 0 ? (
              <S.CompanionList>
                {companions.map((companion) => (
                  <CompanionListItem key={companion.companionId} companion={companion} />
                ))}
              </S.CompanionList>
            ) : (
              <S.EmptyState>
                <S.EmptyIcon aria-hidden="true">
                  <UsersRound size={30} strokeWidth={1.8} />
                </S.EmptyIcon>
                <strong>아직 등록된 사람이 없어요.</strong>
                <span>앱 친구는 연결 코드로, 그 외 사람은 직접 추가할 수 있어요.</span>
              </S.EmptyState>
            )}
          </S.Section>

          <S.BottomActions>
            <S.AddButton type="button" onClick={() => navigate('/companion/add')}>
              <UserPlus size={18} strokeWidth={2.4} aria-hidden="true" /> 사람 추가
            </S.AddButton>
          </S.BottomActions>

          {!!pendingRequests?.length && (
            <S.Section aria-labelledby="pending-request-title">
              <S.SectionHeader>
                <S.SectionTitle id="pending-request-title">받은 신청</S.SectionTitle>
                <S.CountBadge>{pendingRequests.length}</S.CountBadge>
              </S.SectionHeader>
              <S.RequestList>
                {pendingRequests.map((request) => {
                  const imageUrl = resolveImageUrl(request.fromUserImageUrl);
                  return (
                    <S.RequestCard key={request.requestId}>
                      {imageUrl ? (
                        <S.RequestAvatar src={imageUrl} alt="" />
                      ) : (
                        <S.RequestInitial aria-hidden="true">
                          {getInitial(request.fromUserNickname)}
                        </S.RequestInitial>
                      )}
                      <S.RequestText>
                        <strong>{request.fromUserNickname}</strong>
                        <span>함께 기록을 보고 싶어 해요</span>
                      </S.RequestText>
                      <S.RequestActions>
                        <S.RejectButton
                          type="button"
                          disabled={isResponding}
                          onClick={() =>
                            setRejectTarget({
                              requestId: request.requestId,
                              fromUserNickname: request.fromUserNickname,
                            })
                          }
                        >
                          거절
                        </S.RejectButton>
                        <S.AcceptButton
                          type="button"
                          disabled={isResponding}
                          onClick={() =>
                            respondRequest({ requestId: request.requestId, accept: true })
                          }
                        >
                          수락
                        </S.AcceptButton>
                      </S.RequestActions>
                    </S.RequestCard>
                  );
                })}
              </S.RequestList>
            </S.Section>
          )}
        </>
      )}
      <ConfirmDialog
        isOpen={rejectTarget !== null}
        title="연결 신청을 거절할까요?"
        description={`${rejectTarget?.fromUserNickname ?? ''}님의 신청을 거절하면 목록에서 사라져요.`}
        confirmLabel="거절"
        pendingLabel="거절 중"
        isPending={isResponding}
        onCancel={() => {
          if (!isResponding) setRejectTarget(null);
        }}
        onConfirm={handleReject}
      />
    </S.Container>
  );
};

export default Companion;
