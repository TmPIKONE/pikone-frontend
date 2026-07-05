export type HomeLocationType = 'HOME' | 'OFFICE' | 'CUSTOM';

export interface HomeLocationCreateRequest {
  type: HomeLocationType;
  label: string;
  latitude: number;
  longitude: number;
  radiusMeters?: number;
}

export interface HomeLocationUpdateRequest {
  label: string;
  latitude: number;
  longitude: number;
  radiusMeters?: number;
}

export interface HomeLocationResponse {
  id: number;
  type: HomeLocationType;
  label: string;
  latitude: number;
  longitude: number;
  radiusMeters?: number;
}
