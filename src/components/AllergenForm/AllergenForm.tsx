import { useEffect, useState } from 'react';
import { useAllergens } from '~/hooks/useAllergens';
import { useUpdateAllergens } from '~/hooks/useUpdateAllergens';
import { ALLERGEN_OPTIONS } from '~/apis/allergen/allergen.types';
import * as S from './AllergenForm.styles';

const toggleInArray = (arr: string[], value: string) =>
  arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

const AllergenForm = () => {
  const { data, isLoading } = useAllergens();
  const { mutate: updateAllergens, isPending } = useUpdateAllergens();

  const [selected, setSelected] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (data) setSelected(data.allergens);
  }, [data]);

  const handleToggle = (allergen: string) => {
    setSelected((prev) => toggleInArray(prev, allergen));
    setIsDirty(true);
  };

  const handleSave = () => {
    updateAllergens({ allergens: selected }, { onSuccess: () => setIsDirty(false) });
  };

  if (isLoading) {
    return <S.LoadingText>불러오는 중...</S.LoadingText>;
  }

  return (
    <S.Wrapper>
      <S.ChipGrid>
        {ALLERGEN_OPTIONS.map((allergen) => (
          <S.Chip
            key={allergen}
            type="button"
            $selected={selected.includes(allergen)}
            onClick={() => handleToggle(allergen)}
          >
            {allergen}
          </S.Chip>
        ))}
      </S.ChipGrid>

      <S.SaveButton type="button" onClick={handleSave} disabled={!isDirty || isPending}>
        {isPending ? '저장 중...' : '저장하기'}
      </S.SaveButton>
    </S.Wrapper>
  );
};

export default AllergenForm;
