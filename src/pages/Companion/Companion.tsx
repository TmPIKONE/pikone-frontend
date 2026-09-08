import { useState } from 'react';
import {
  Check,
  ChevronRight,
  Copy,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserPlus,
  UsersRound,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const [rejectTarget, setRejectTarget] = useState<{
    requestId: number;
    fromUserNickname: string;
  } | null>(null);

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

  return (
    <S.Container>
      <S.PageHeader>
        <div>
          <S.Eyebrow>TOGETHER</S.Eyebrow>
          <S.PageTitle>동반자</S.PageTitle>
        </div>
      </S.PageHeader>

      <S.CodeCard>
        <S.CodeCopy>
          <S.CodeLabel>내 연결 코드</S.CodeLabel>
          <S.CodeValue>{myCode?.myCode ?? '------'}</S.CodeValue>
        </S.CodeCopy>
        <S.CopyButton type="button" onClick={handleCopyCode} disabled={!myCode?.myCode}>
          <Copy size={17} strokeWidth={2.3} aria-hidden="true" />
          복사
        </S.CopyButton>
        <S.CodeDescription>코드를 공유하면 서로 공개한 식사 기록을 볼 수 있어요.</S.CodeDescription>
      </S.CodeCard>

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
                      onClick={() => respondRequest({ requestId: request.requestId, accept: true })}
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

      <S.Section aria-labelledby="my-companion-title">
        <S.SectionHeader>
          <div>
            <S.SectionTitle id="my-companion-title">내 동반자</S.SectionTitle>
            <S.SectionDescription>자주 함께 먹는 사람을 관리해요.</S.SectionDescription>
          </div>
          {!!companions?.length && <S.CountText>{companions.length}명</S.CountText>}
        </S.SectionHeader>

        {isCompanionsLoading ? (
          <S.SkeletonList aria-label="동반자 목록을 불러오는 중">
            <S.SkeletonCard />
            <S.SkeletonCard />
          </S.SkeletonList>
        ) : isCompanionsError ? (
          <S.EmptyState>
            <UsersRound size={30} strokeWidth={1.8} aria-hidden="true" />
            <strong>동반자를 불러오지 못했어요.</strong>
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
            <strong>아직 동반자가 없어요.</strong>
            <span>앱 친구는 코드로 연결하고, 그 외 사람은 직접 등록할 수 있어요.</span>
          </S.EmptyState>
        )}
      </S.Section>

      <S.BottomActions>
        <S.AddButton type="button" onClick={() => navigate('/companion/add')}>
          <UserPlus size={18} strokeWidth={2.4} aria-hidden="true" />
          동반자 추가
        </S.AddButton>
      </S.BottomActions>
      <ConfirmDialog
        isOpen={rejectTarget !== null}
        title="동반자 신청을 거절할까요?"
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
