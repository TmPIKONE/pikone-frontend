import ApiBuilder from '../config/ApiBuilder';
import type {
  HomeLocationCreateRequest,
  HomeLocationUpdateRequest,
  HomeLocationResponse,
} from './homeLocation.types';

const HOME_LOCATIONS = '/home-locations';

export const getHomeLocationsBuilder = () =>
  ApiBuilder.create<void, HomeLocationResponse[]>(HOME_LOCATIONS).setMethod('GET');

export const createHomeLocationBuilder = () =>
  ApiBuilder.create<HomeLocationCreateRequest, HomeLocationResponse>(HOME_LOCATIONS).setMethod(
    'POST',
  );

export const updateHomeLocationBuilder = (id: number) =>
  ApiBuilder.create<HomeLocationUpdateRequest, HomeLocationResponse>(
    `${HOME_LOCATIONS}/${id}`,
  ).setMethod('PUT');

export const deleteHomeLocationBuilder = (id: number) =>
  ApiBuilder.create<void, void>(`${HOME_LOCATIONS}/${id}`).setMethod('DELETE');
