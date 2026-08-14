import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowLeft, Link2, UserRoundPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  useCreateLocalCompanion,
  useSendCompanionRequest,
} from '~/features/companions/companion.queries';
import type { CompanionType } from '~/apis/companion/companion.types';
import * as S from './CompanionAdd.styles';

type CompanionAddTab = 'code' | 'local';

const COMPANION_TYPE_OPTIONS: {
  value: CompanionType;
  label: string;
  description: string;
  color: string;
}[] = [
  { value: 'LOVER', label: '연인', description: '데이트 기록', color: '#EF6675' },
  { value: 'FRIEND', label: '친구', description: '친구 모임', color: '#55D887' },
  { value: 'FAMILY', label: '가족', description: '가족 외식', color: '#F6A17D' },
  { value: 'CUSTOM', label: '기타', description: '직장·모임', color: '#B1B6C0' },
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

  const handleCodeChange = (value: string) => {
    setCode(
      value
        .replace(/[^a-zA-Z0-9]/g, '')
        .toUpperCase()
        .slice(0, 6),
    );
  };

  const handleSendRequest = (event: FormEvent) => {
    event.preventDefault();
    if (code.length !== 6) return;
    sendRequest({ targetCode: code }, { onSuccess: () => navigate('/companion') });
  };

  const handleCreateLocal = (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = displayName.trim();
    if (!trimmedName) return;
    createLocal(
      { displayName: trimmedName, companionType },
      { onSuccess: () => navigate('/companion') },
    );
  };

  const isCodeTab = tab === 'code';
  const isSubmitting = isCodeTab ? isSending : isCreating;
  const isSubmitDisabled = isSubmitting || (isCodeTab ? code.length !== 6 : !displayName.trim());

  return (
    <S.Container>
      <S.TopBar>
        <S.BackButton
          type="button"
          aria-label="동반자 화면으로 돌아가기"
          onClick={() => navigate('/companion')}
        >
          <ArrowLeft size={21} strokeWidth={2.3} />
        </S.BackButton>
      </S.TopBar>

      <S.PageHeader>
        <S.PageTitle>동반자 추가</S.PageTitle>
        <S.PageDescription>
          함께 피코원을 쓰는 사람은 코드로 연결하고, 그 외 사람은 내 목록에 바로 등록하세요.
        </S.PageDescription>
      </S.PageHeader>

      <S.MethodTabs aria-label="동반자 추가 방법">
        <S.MethodButton
          type="button"
          $active={isCodeTab}
          aria-pressed={isCodeTab}
          onClick={() => setTab('code')}
        >
          <i className="code" /> 코드로 연결
        </S.MethodButton>
        <S.MethodButton
          type="button"
          $active={!isCodeTab}
          aria-pressed={!isCodeTab}
          onClick={() => setTab('local')}
        >
          <i className="local" /> 직접 등록
        </S.MethodButton>
      </S.MethodTabs>

      {isCodeTab ? (
        <S.Form id="companion-add-form" onSubmit={handleSendRequest}>
          <S.MethodIntro>
            <S.MethodIcon aria-hidden="true">
              <Link2 size={23} strokeWidth={2.1} />
            </S.MethodIcon>
            <div>
              <strong>상대방과 연결할게요</strong>
              <span>수락되면 서로 공개한 기록만 볼 수 있어요.</span>
            </div>
          </S.MethodIntro>

          <S.Field>
            <S.LabelRow>
              <S.Label htmlFor="companion-code">상대방 연결 코드</S.Label>
              <S.InputCount $complete={code.length === 6}>{code.length}/6</S.InputCount>
            </S.LabelRow>
            <S.CodeInput
              id="companion-code"
              value={code}
              onChange={(event) => handleCodeChange(event.target.value)}
              placeholder="A1B2C3"
              maxLength={6}
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
              aria-describedby="companion-code-hint"
              autoFocus
            />
            <S.FieldHint id="companion-code-hint">
              상대방의 동반자 화면에 있는 6자리 코드를 입력해주세요.
            </S.FieldHint>
          </S.Field>

          {!!sendError && (
            <S.ErrorText role="alert">
              코드가 맞는지 확인해주세요. 이미 보낸 신청일 수도 있어요.
            </S.ErrorText>
          )}
        </S.Form>
      ) : (
        <S.Form id="companion-add-form" onSubmit={handleCreateLocal}>
          <S.MethodIntro>
            <S.MethodIcon aria-hidden="true">
              <UserRoundPlus size={23} strokeWidth={2.1} />
            </S.MethodIcon>
            <div>
              <strong>내 목록에 바로 등록할게요</strong>
              <span>상대방 계정과 연결되지 않고 내 기록에만 표시돼요.</span>
            </div>
          </S.MethodIntro>

          <S.Field>
            <S.LabelRow>
              <S.Label htmlFor="companion-name">화면에 보일 이름</S.Label>
              <S.InputCount $complete={Boolean(displayName.trim())}>
                {displayName.length}/20
              </S.InputCount>
            </S.LabelRow>
            <S.Input
              id="companion-name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value.slice(0, 20))}
              placeholder="예: 민지, 회사 동료"
              maxLength={20}
              autoComplete="off"
              autoFocus
            />
          </S.Field>

          <S.Field>
            <S.Label as="span">어떤 사이인가요?</S.Label>
            <S.RelationshipGrid role="radiogroup" aria-label="동반자 관계">
              {COMPANION_TYPE_OPTIONS.map((option) => (
                <S.RelationshipButton
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={companionType === option.value}
                  $active={companionType === option.value}
                  onClick={() => setCompanionType(option.value)}
                >
                  <i style={{ backgroundColor: option.color }} />
                  <span>
                    <strong>{option.label}</strong>
                    {option.description}
                  </span>
                </S.RelationshipButton>
              ))}
            </S.RelationshipGrid>
          </S.Field>

          {!!createError && (
            <S.ErrorText role="alert">추가하지 못했어요. 잠시 후 다시 시도해주세요.</S.ErrorText>
          )}
        </S.Form>
      )}

      <S.BottomAction>
        <S.SubmitButton type="submit" form="companion-add-form" disabled={isSubmitDisabled}>
          {isSubmitting
            ? isCodeTab
              ? '신청 보내는 중'
              : '등록하는 중'
            : isCodeTab
              ? '연결 신청 보내기'
              : '동반자 등록하기'}
        </S.SubmitButton>
      </S.BottomAction>
    </S.Container>
  );
};

export default CompanionAdd;
