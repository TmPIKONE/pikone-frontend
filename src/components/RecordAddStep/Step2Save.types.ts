import type { AiFoodResponse, LocationType, RestaurantCandidate } from '~/apis/record/record.types';

export interface Step2SaveProps {
  // AI 분석 상태
  isAnalyzing: boolean;
  analysis: AiFoodResponse | null;
  onApplyAnalysis: () => void;
  onRetryAnalysis: () => void;

  // 음식 / 식당 (직접입력 + AI결과 공용 필드)
  foodName: string;
  onFoodNameChange: (value: string) => void;
  selectedRestaurant: RestaurantCandidate | null;
  onSelectRestaurant: (candidate: RestaurantCandidate) => void;

  // 저장 폼
  companionId: number | null;
  onCompanionChange: (companionId: number | null) => void;
  visitDate: string;
  onVisitDateChange: (value: string) => void;
  willRevisit: boolean;
  onWillRevisitChange: (value: boolean) => void;
  isPublic: boolean;
  onIsPublicChange: (value: boolean) => void;
  locationType: LocationType;
  onLocationTypeChange: (value: LocationType) => void;

  isSaving: boolean;
  onSave: () => void;
  onBack: () => void;
}
