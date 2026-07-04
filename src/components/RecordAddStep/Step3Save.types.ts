import type { LocationType } from '~/apis/record/record.types';

export interface Step3SaveProps {
  foodName: string;
  restaurantName: string;
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
