import type { RestaurantCandidate } from '~/apis/record/record.types';

export interface RestaurantPickerProps {
  value: RestaurantCandidate | null;
  options: RestaurantCandidate[];
  recommendedRestaurant?: RestaurantCandidate;
  latitude?: number;
  longitude?: number;
  onChange: (value: RestaurantCandidate) => void;
}
