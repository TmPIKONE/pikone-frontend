import type { HomeLocationResponse } from '~/apis/homeLocation/homeLocation.types';

export interface HomeLocationListProps {
  homeLocations: HomeLocationResponse[];
  onEdit: (location: HomeLocationResponse) => void;
}
