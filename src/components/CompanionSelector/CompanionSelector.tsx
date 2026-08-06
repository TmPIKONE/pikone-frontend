import { useCompanions } from '~/features/companions/companion.queries';
import * as S from './CompanionSelector.styles';
import type { CompanionSelectorProps } from './CompanionSelector.types';

const CompanionSelector = ({ value, onChange, className }: CompanionSelectorProps) => {
  const { data: companions, isLoading } = useCompanions();

  return (
    <S.Wrapper className={className}>
      <S.Heading>
        <S.Label>누구와 함께 먹었나요?</S.Label>
        <S.Description>한 명만 선택할 수 있어요.</S.Description>
      </S.Heading>

      <S.OptionList aria-label="식사 동반자">
        <S.OptionChip type="button" $active={value === null} onClick={() => onChange(null)}>
          <i className="alone" />
          혼자
        </S.OptionChip>

        {companions?.map((companion) => (
          <S.OptionChip
            key={companion.companionId}
            type="button"
            $active={value === companion.companionId}
            onClick={() => onChange(companion.companionId)}
          >
            <i className={companion.isAppUser ? 'linked' : 'local'} />
            {companion.displayName}
          </S.OptionChip>
        ))}
      </S.OptionList>

        {isLoading ? (
          <S.EmptyHint>동반자를 불러오고 있어요.</S.EmptyHint>
        ) : companions?.length === 0 ? (
          <S.EmptyHint>아직 등록된 동반자가 없어 이번 기록은 ‘혼자’로 저장돼요.</S.EmptyHint>
        ) : (
          <S.SelectionHint>
            {value == null
              ? '혼자 먹은 기록으로 저장해요.'
              : `${companions?.find((companion) => companion.companionId === value)?.displayName ?? '선택한 동반자'}님과 함께한 기록으로 저장해요.`}
          </S.SelectionHint>
        )}
    </S.Wrapper>
  );
};

export default CompanionSelector;
