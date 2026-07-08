import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentLocation } from '~/hooks/useCurrentLocation';
import { useRecommendations } from '~/hooks/useRecommendations';
import CompanionSelector from '~/components/CompanionSelector/CompanionSelector';
import AccordionStep from '~/components/AccordionStep/AccordionStep';
import {
  PURPOSE_OPTIONS,
  FOOD_PREFERENCE_OPTIONS,
} from '~/apis/recommendation/recommendation.types';
import * as S from './AI.styles';

const toggleInArray = (arr: string[], value: string) =>
  arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

const TOTAL_STEPS = 3;

const AI = () => {
  const navigate = useNavigate();
  const location = useCurrentLocation();

  const [companionId, setCompanionId] = useState<number | null>(null);
  const [purposes, setPurposes] = useState<string[]>([]);
  const [foodPreferences, setFoodPreferences] = useState<string[]>([]);

  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [editingStep, setEditingStep] = useState<1 | 2 | null>(null);

  const { mutate: getRecommendations, isPending, error } = useRecommendations();

  const completedCount =
    (step1Done ? 1 : 0) + (step2Done ? 1 : 0) + (step2Done && foodPreferences.length > 0 ? 1 : 0);

  const handleSelectCompanion = (id: number | null) => {
    setCompanionId(id);
    setStep1Done(true);
    setEditingStep(null);
  };

  const handleConfirmStep2 = () => {
    setStep2Done(true);
    setEditingStep(null);
  };

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

  // TODO: CompanionSelector가 선택된 동반자 이름을 알려주면 그 값으로 교체
  const companionSummary = companionId === null ? '혼자' : '동반자 선택됨';
  const purposeSummary = purposes.length > 0 ? purposes.join(', ') : '선택 안 함';

  return (
    <S.Container>
      <S.Title>PikOne이</S.Title>
      <S.Description>당신의 취향과 상황에 딱 맞는 음식점을 추천해드릴게요.</S.Description>

      <S.ProgressBarTrack>
        <S.ProgressBarFill $percent={(completedCount / TOTAL_STEPS) * 100} />
      </S.ProgressBarTrack>
      <S.ProgressLabel>
        {completedCount}/{TOTAL_STEPS}
      </S.ProgressLabel>

      {location.isResolved && location.permissionDenied && (
        <S.LocationWarning>
          위치 권한이 없어서 추천 정확도가 떨어질 수 있어요. 브라우저 설정에서 위치 권한을
          허용해보세요.
        </S.LocationWarning>
      )}

      <S.StepList>
        <AccordionStep
          stepNumber={1}
          title="누구와 함께 드시나요?"
          isCompleted={step1Done}
          isEditing={editingStep === 1}
          summaryLabel="누구와 함께"
          summaryValue={companionSummary}
          onEditClick={() => setEditingStep(1)}
        >
          <CompanionSelector value={companionId} onChange={handleSelectCompanion} />
        </AccordionStep>

        {step1Done && (
          <AccordionStep
            stepNumber={2}
            title="어떤 자리인가요?"
            isCompleted={step2Done}
            isEditing={editingStep === 2}
            summaryLabel="어떤 자리"
            summaryValue={purposeSummary}
            onEditClick={() => setEditingStep(2)}
            footer={
              (!step2Done || editingStep === 2) && (
                <S.ConfirmButton
                  type="button"
                  disabled={purposes.length === 0}
                  onClick={handleConfirmStep2}
                >
                  선택 완료
                </S.ConfirmButton>
              )
            }
          >
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
          </AccordionStep>
        )}

        {step2Done && (
          <AccordionStep
            stepNumber={3}
            title="어떤 음식이 당겨요?"
            isCompleted={false}
            isEditing={false}
            summaryLabel=""
            summaryValue=""
            onEditClick={() => {}}
          >
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
          </AccordionStep>
        )}
      </S.StepList>

      {!!error && <S.ErrorText>추천을 받아오지 못했어요. 다시 시도해주세요.</S.ErrorText>}

      {step2Done && (
        <S.SubmitButton type="button" onClick={handleSubmit} disabled={isPending}>
          {isPending ? '추천받는 중...' : '추천받기'}
        </S.SubmitButton>
      )}
    </S.Container>
  );
};

export default AI;
