import type { AiFoodResponse, RestaurantCandidate } from '~/apis/record/record.types';

export interface Step2AnalyzeProps {
  isAnalyzing: boolean;
  analysis: AiFoodResponse | null;
  foodName: string;
  onFoodNameChange: (value: string) => void;
  selectedRestaurant: RestaurantCandidate | null;
  onSelectRestaurant: (candidate: RestaurantCandidate) => void;
  onNext: () => void;
  onBack: () => void;
}
