import { Check, UserRound, UsersRound } from 'lucide-react';
import { useCompanions } from '~/features/companions/companion.queries';
import type { MultiCompanionSelectorProps } from './MultiCompanionSelector.types';
import * as S from './MultiCompanionSelector.styles';

const MultiCompanionSelector = ({
  value,
  onChange,
  compact = false,
  className,
}: MultiCompanionSelectorProps) => {
  const { data: companions = [] } = useCompanions();

  const toggleCompanion = (companionId: number) => {
    onChange(
      value.includes(companionId)
        ? value.filter((selectedId) => selectedId !== companionId)
        : [...value, companionId],
    );
  };

  return (
    <S.Wrapper className={className} $compact={compact}>
      <S.Heading>
        <div>
          <S.Label>누구와 함께 먹었나요?</S.Label>
          <S.Description>여러 명을 고를 수 있어요</S.Description>
        </div>
        <S.Count>{value.length === 0 ? '혼자' : `${value.length}명`}</S.Count>
      </S.Heading>

      <S.OptionList aria-label="식사 동행자 복수 선택">
        <S.OptionChip
          type="button"
          $active={value.length === 0}
          onClick={() => onChange([])}
          aria-pressed={value.length === 0}
        >
          <S.Avatar $linked={false}>
            <UserRound size={14} aria-hidden="true" />
          </S.Avatar>
          혼자
          {value.length === 0 && <Check size={14} strokeWidth={3} aria-hidden="true" />}
        </S.OptionChip>

        {companions.map((companion) => {
          const isSelected = value.includes(companion.companionId);

          return (
            <S.OptionChip
              key={companion.companionId}
              type="button"
              $active={isSelected}
              onClick={() => toggleCompanion(companion.companionId)}
              aria-pressed={isSelected}
            >
              <S.Avatar $linked={companion.isAppUser}>
                <UsersRound size={14} aria-hidden="true" />
              </S.Avatar>
              {companion.displayName}
              {isSelected && <Check size={14} strokeWidth={3} aria-hidden="true" />}
            </S.OptionChip>
          );
        })}
      </S.OptionList>
    </S.Wrapper>
  );
};

export default MultiCompanionSelector;
