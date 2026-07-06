import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanions } from '~/hooks/useCompanions';
import { usePendingCompanionRequests } from '~/hooks/usePendingCompanionRequests';
import { useMyCompanionCode } from '~/hooks/useMyCompanionCode';
import { useRespondCompanionRequest } from '~/hooks/useRespondCompanionRequest';
import { useUpdateCompanionName } from '~/hooks/useUpdateCompanionName';
import { useDeleteCompanion } from '~/hooks/useDeleteCompanion';
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

const CompanionListItem = ({ companion }: { companion: CompanionResponse }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(companion.displayName);

  const { mutate: updateName, isPending: isUpdating } = useUpdateCompanionName(
    companion.companionId,
  );
  const { mutate: deleteCompanion, isPending: isDeleting } = useDeleteCompanion(
    companion.companionId,
  );

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === companion.displayName) {
      setIsEditing(false);
      return;
    }
    updateName({ displayName: trimmed }, { onSuccess: () => setIsEditing(false) });
  };

  const handleDelete = () => {
    if (!window.confirm(`${companion.displayName}님을 동반자 목록에서 삭제할까요?`)) return;
    deleteCompanion();
  };

  return (
    <S.CompanionRow>
      <S.CompanionInfo>
        {isEditing ? (
          <S.NameEditInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
          />
        ) : (
          <S.CompanionName>{companion.displayName}</S.CompanionName>
        )}
        <S.CompanionMeta>
          {COMPANION_TYPE_LABEL[companion.companionType]}
          {companion.isAppUser && companion.linkedUserNickname
            ? ` · ${companion.linkedUserNickname}`
            : ''}
        </S.CompanionMeta>
      </S.CompanionInfo>

      <S.RowActions>
        {isEditing ? (
          <S.EditButton onClick={handleSave} disabled={isUpdating}>
            저장
          </S.EditButton>
        ) : (
          <S.EditButton onClick={() => setIsEditing(true)}>이름수정</S.EditButton>
        )}
        <S.DeleteButton onClick={handleDelete} disabled={isDeleting}>
          삭제
        </S.DeleteButton>
      </S.RowActions>
    </S.CompanionRow>
  );
};

const Companion = () => {
  const navigate = useNavigate();
  const { data: companions, isLoading: isCompanionsLoading } = useCompanions();
  const { data: pendingRequests } = usePendingCompanionRequests();
  const { data: myCode } = useMyCompanionCode();
  const { mutate: respondRequest } = useRespondCompanionRequest();

  const handleCopyCode = () => {
    if (!myCode?.myCode) return;
    navigator.clipboard.writeText(myCode.myCode);
  };

  return (
    <S.Container>
      <S.HeaderRow>
        <S.Title>동반자</S.Title>
        <S.AddButton onClick={() => navigate('/companion/add')}>+ 추가</S.AddButton>
      </S.HeaderRow>

      <S.CodeCard>
        <div>
          <S.CodeLabel>내 코드</S.CodeLabel>
          <S.CodeValue>{myCode?.myCode ?? '------'}</S.CodeValue>
        </div>
        <S.CopyButton onClick={handleCopyCode}>복사</S.CopyButton>
      </S.CodeCard>

      {!!pendingRequests?.length && (
        <section>
          <S.SectionTitle>받은 신청</S.SectionTitle>
          {pendingRequests.map((request) => (
            <S.RequestRow key={request.requestId}>
              <S.RequestProfile>
                <S.RequestAvatar
                  src={resolveImageUrl(request.fromUserImageUrl)}
                  alt={request.fromUserNickname}
                />
                <span>{request.fromUserNickname}</span>
              </S.RequestProfile>
              <S.RequestActions>
                <S.AcceptButton
                  onClick={() => respondRequest({ requestId: request.requestId, accept: true })}
                >
                  수락
                </S.AcceptButton>
                <S.RejectButton
                  onClick={() => respondRequest({ requestId: request.requestId, accept: false })}
                >
                  거절
                </S.RejectButton>
              </S.RequestActions>
            </S.RequestRow>
          ))}
        </section>
      )}

      <section>
        <S.SectionTitle>내 동반자</S.SectionTitle>

        {isCompanionsLoading ? (
          <S.EmptyState>불러오는 중...</S.EmptyState>
        ) : companions && companions.length > 0 ? (
          companions.map((companion) => (
            <CompanionListItem key={companion.companionId} companion={companion} />
          ))
        ) : (
          <S.EmptyState>
            아직 등록된 동반자가 없어요. 코드로 신청하거나 직접 추가해보세요.
          </S.EmptyState>
        )}
      </section>
    </S.Container>
  );
};

export default Companion;
