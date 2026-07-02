import { useCompanions } from '~/hooks/useCompanions';
import * as S from './CompanionSelector.styles';
import type { CompanionSelectorProps } from './CompanionSelector.types';

const CompanionSelector = ({ value, onChange, className }: CompanionSelectorProps) => {
  const { data: companions, isLoading } = useCompanions();

  return (
    <S.Wrapper className={className}>
      <S.Label>누구와 함께?</S.Label>

      <S.OptionList>
        <S.OptionChip type="button" $active={value === null} onClick={() => onChange(null)}>
          혼자
        </S.OptionChip>

        {companions?.map((companion) => (
          <S.OptionChip
            key={companion.companionId}
            type="button"
            $active={value === companion.companionId}
            onClick={() => onChange(companion.companionId)}
          >
            {companion.displayName}
          </S.OptionChip>
        ))}
      </S.OptionList>

      {!isLoading && companions?.length === 0 && (
        <S.EmptyHint>등록된 동반자가 없어요. 동반자를 먼저 추가해보세요.</S.EmptyHint>
      )}
    </S.Wrapper>
  );
};

export default CompanionSelector;
