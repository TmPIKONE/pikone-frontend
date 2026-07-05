import { useEffect, useState } from 'react';

interface LocationState {
  latitude?: number;
  longitude?: number;
  isResolved: boolean;
  permissionDenied: boolean;
}

const isGeolocationSupported = () => typeof navigator !== 'undefined' && !!navigator.geolocation;

export const useCurrentLocation = () => {
  const [state, setState] = useState<LocationState>(() => ({
    isResolved: !isGeolocationSupported(),
    permissionDenied: !isGeolocationSupported(),
  }));

  useEffect(() => {
    if (!isGeolocationSupported()) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          isResolved: true,
          permissionDenied: false,
        });
      },
      () => {
        setState({ isResolved: true, permissionDenied: true });
      },
    );
  }, []);

  return state;
};
