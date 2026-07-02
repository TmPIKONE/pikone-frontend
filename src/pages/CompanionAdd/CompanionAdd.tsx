import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSendCompanionRequest } from '~/hooks/useSendCompanionRequest';
import { useCreateLocalCompanion } from '~/hooks/useCreateLocalCompanion';
import type { CompanionType } from '~/apis/companion/companion.types';
import * as S from './CompanionAdd.styles';
import type { CompanionAddTab } from './CompanionAdd.types';

const COMPANION_TYPE_OPTIONS: { value: CompanionType; label: string }[] = [
  { value: 'LOVER', label: '연인' },
  { value: 'FRIEND', label: '친구' },
  { value: 'FAMILY', label: '가족' },
  { value: 'CUSTOM', label: '기타' },
];

const CompanionAdd = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<CompanionAddTab>('code');

  const [code, setCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [companionType, setCompanionType] = useState<CompanionType>('FRIEND');

  const { mutate: sendRequest, isPending: isSending, error: sendError } = useSendCompanionRequest();
  const {
    mutate: createLocal,
    isPending: isCreating,
    error: createError,
  } = useCreateLocalCompanion();

  const handleSendRequest = (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    sendRequest({ targetCode: code.trim() }, { onSuccess: () => navigate('/companion') });
  };

  const handleCreateLocal = (e: FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    createLocal(
      { displayName: displayName.trim(), companionType },
      { onSuccess: () => navigate('/companion') },
    );
  };

  return (
    <S.Container>
      <S.Title>동반자 추가</S.Title>

      <S.TabRow>
        <S.TabButton type="button" $active={tab === 'code'} onClick={() => setTab('code')}>
          코드로 신청
        </S.TabButton>
        <S.TabButton type="button" $active={tab === 'local'} onClick={() => setTab('local')}>
          직접 추가
        </S.TabButton>
      </S.TabRow>

      {tab === 'code' ? (
        <S.Form onSubmit={handleSendRequest}>
          <S.Field>
            <S.Label>상대방 6자리 코드</S.Label>
            <S.Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="예: A1B2C3"
              maxLength={6}
            />
          </S.Field>
          {!!sendError && <S.ErrorText>코드를 다시 확인해주세요.</S.ErrorText>}
          <S.SubmitButton type="submit" disabled={isSending || !code.trim()}>
            신청 보내기
          </S.SubmitButton>
        </S.Form>
      ) : (
        <S.Form onSubmit={handleCreateLocal}>
          <S.Field>
            <S.Label>동반자 이름</S.Label>
            <S.Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="예: 직장 동료"
            />
          </S.Field>
          <S.Field>
            <S.Label>관계</S.Label>
            <S.Select
              value={companionType}
              onChange={(e) => setCompanionType(e.target.value as CompanionType)}
            >
              {COMPANION_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </S.Select>
          </S.Field>
          {!!createError && <S.ErrorText>추가에 실패했어요. 다시 시도해주세요.</S.ErrorText>}
          <S.SubmitButton type="submit" disabled={isCreating || !displayName.trim()}>
            추가하기
          </S.SubmitButton>
        </S.Form>
      )}
    </S.Container>
  );
};

export default CompanionAdd;
