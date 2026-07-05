import { useApiQuery } from '~/apis/config/ApiBuilder';
import { getHomeLocationsBuilder } from '~/apis/homeLocation/homeLocation.api';
import type { HomeLocationResponse } from '~/apis/homeLocation/homeLocation.types';

export const useHomeLocations = () => {
  return useApiQuery<void, HomeLocationResponse[]>(getHomeLocationsBuilder(), ['homeLocations']);
};
