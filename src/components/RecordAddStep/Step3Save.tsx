import CompanionSelector from '~/components/CompanionSelector/CompanionSelector';
import * as S from './Step3Save.styles';
import type { Step3SaveProps } from './Step3Save.types';
import type { LocationType } from '~/apis/record/record.types';

const LOCATION_TYPE_OPTIONS: { value: LocationType; label: string }[] = [
  { value: 'RESTAURANT', label: '식당' },
  { value: 'HOME', label: '집' },
  { value: 'OFFICE', label: '회사' },
  { value: 'DELIVERY', label: '배달' },
];

const Step3Save = ({
  foodName,
  restaurantName,
  companionId,
  onCompanionChange,
  visitDate,
  onVisitDateChange,
  willRevisit,
  onWillRevisitChange,
  isPublic,
  onIsPublicChange,
  locationType,
  onLocationTypeChange,
  isSaving,
  onSave,
  onBack,
}: Step3SaveProps) => {
  return (
    <S.Container>
      <S.SummaryCard>
        <S.SummaryFood>{foodName}</S.SummaryFood>
        <S.SummaryRestaurant>{restaurantName}</S.SummaryRestaurant>
      </S.SummaryCard>

      <CompanionSelector value={companionId} onChange={onCompanionChange} />

      <S.Field>
        <S.Label>방문 날짜</S.Label>
        <S.Input
          type="date"
          value={visitDate}
          onChange={(e) => onVisitDateChange(e.target.value)}
        />
      </S.Field>

      <S.Field>
        <S.Label>장소 유형</S.Label>
        <S.Select
          value={locationType}
          onChange={(e) => onLocationTypeChange(e.target.value as LocationType)}
        >
          {LOCATION_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </S.Select>
      </S.Field>

      <S.ToggleRow>
        <S.ToggleLabel>재방문 의사가 있어요</S.ToggleLabel>
        <S.Switch $on={willRevisit} onClick={() => onWillRevisitChange(!willRevisit)} />
      </S.ToggleRow>

      <S.ToggleRow>
        <S.ToggleLabel>다른 사람에게 공개할래요</S.ToggleLabel>
        <S.Switch $on={isPublic} onClick={() => onIsPublicChange(!isPublic)} />
      </S.ToggleRow>

      <S.ButtonRow>
        <S.BackButton type="button" onClick={onBack} disabled={isSaving}>
          이전
        </S.BackButton>
        <S.SaveButton type="button" onClick={onSave} disabled={isSaving}>
          {isSaving ? '저장 중...' : '기록하기'}
        </S.SaveButton>
      </S.ButtonRow>
    </S.Container>
  );
};

export default Step3Save;
