import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentLocation } from '~/hooks/useCurrentLocation';
import { useRecommendations } from '~/hooks/useRecommendations';
import CompanionSelector from '~/components/CompanionSelector/CompanionSelector';
import {
  PURPOSE_OPTIONS,
  FOOD_PREFERENCE_OPTIONS,
} from '~/apis/recommendation/recommendation.types';
import * as S from './AI.styles';

const toggleInArray = (arr: string[], value: string) =>
  arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

const AI = () => {
  const navigate = useNavigate();
  const location = useCurrentLocation();

  const [companionId, setCompanionId] = useState<number | null>(null);
  const [purposes, setPurposes] = useState<string[]>([]);
  const [foodPreferences, setFoodPreferences] = useState<string[]>([]);

  const { mutate: getRecommendations, isPending, error } = useRecommendations();

  const handleSubmit = () => {
    getRecommendations(
      {
        latitude: location.latitude,
        longitude: location.longitude,
        purposes: purposes.length > 0 ? purposes : undefined,
        foodPreferences: foodPreferences.length > 0 ? foodPreferences : undefined,
        companionId: companionId ?? undefined,
      },
      {
        onSuccess: (recommendations) => {
          navigate('/ai/result', { state: { recommendations } });
        },
      },
    );
  };

  return (
    <S.Container>
      <S.Title>어떤 식당을 찾아드릴까요?</S.Title>
      <S.Description>몇 가지만 알려주시면 AI가 근처 식당을 추천해드려요.</S.Description>

      {location.isResolved && location.permissionDenied && (
        <S.LocationWarning>
          위치 권한이 없어서 추천 정확도가 떨어질 수 있어요. 브라우저 설정에서 위치 권한을
          허용해보세요.
        </S.LocationWarning>
      )}

      <CompanionSelector value={companionId} onChange={setCompanionId} />

      <S.Field>
        <S.Label>어떤 자리인가요? (복수 선택 가능)</S.Label>
        <S.ChipRow>
          {PURPOSE_OPTIONS.map((purpose) => (
            <S.Chip
              key={purpose}
              type="button"
              $selected={purposes.includes(purpose)}
              onClick={() => setPurposes((prev) => toggleInArray(prev, purpose))}
            >
              {purpose}
            </S.Chip>
          ))}
        </S.ChipRow>
      </S.Field>

      <S.Field>
        <S.Label>선호하는 음식 종류 (복수 선택 가능)</S.Label>
        <S.ChipRow>
          {FOOD_PREFERENCE_OPTIONS.map((food) => (
            <S.Chip
              key={food}
              type="button"
              $selected={foodPreferences.includes(food)}
              onClick={() => setFoodPreferences((prev) => toggleInArray(prev, food))}
            >
              {food}
            </S.Chip>
          ))}
        </S.ChipRow>
      </S.Field>

      {!!error && <S.ErrorText>추천을 받아오지 못했어요. 다시 시도해주세요.</S.ErrorText>}

      <S.SubmitButton type="button" onClick={handleSubmit} disabled={isPending}>
        {isPending ? '추천받는 중...' : '추천받기'}
      </S.SubmitButton>
    </S.Container>
  );
};

export default AI;
