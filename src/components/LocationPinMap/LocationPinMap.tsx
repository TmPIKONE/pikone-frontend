import { useEffect, useRef, useState } from 'react';
import { LocateFixed, MapPin } from 'lucide-react';
import * as S from './LocationPinMap.styles';

type Coordinates = {
  latitude: number;
  longitude: number;
};

type LocationPinMapProps = {
  center: Coordinates;
  currentLocation?: Coordinates | null;
  onCenterChange: (coordinates: Coordinates) => void;
};

interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}
interface KakaoMap {
  getCenter(): KakaoLatLng;
  panTo(position: KakaoLatLng): void;
  relayout(): void;
  setMinLevel?(level: number): void;
  setMaxLevel?(level: number): void;
}
interface KakaoMaps {
  load(callback: () => void): void;
  LatLng: new (latitude: number, longitude: number) => KakaoLatLng;
  Map: new (element: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMap;
  event: {
    addListener(map: KakaoMap, name: 'dragend', callback: () => void): void;
    addListener(
      map: KakaoMap,
      name: 'click',
      callback: (event: { latLng?: KakaoLatLng }) => void,
    ): void;
  };
}

declare global {
  interface Window {
    kakao?: { maps?: KakaoMaps };
  }
}

let kakaoMapScriptPromise: Promise<void> | null = null;

const loadKakaoMapScript = (appKey: string) => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('window unavailable'));
  }

  if (window.kakao?.maps?.Map) {
    return Promise.resolve();
  }

  if (kakaoMapScriptPromise) {
    return kakaoMapScriptPromise;
  }

  kakaoMapScriptPromise = new Promise<void>((resolve, reject) => {
    const finishLoad = () => {
      if (!window.kakao?.maps?.load) {
        reject(new Error('Kakao Maps SDK unavailable'));
        return;
      }

      window.kakao.maps.load(() => resolve());
    };

    const existing = document.getElementById('pikone-kakao-map-sdk') as HTMLScriptElement | null;
    if (existing) {
      if (window.kakao?.maps?.load) {
        finishLoad();
        return;
      }

      existing.addEventListener('load', finishLoad, { once: true });
      existing.addEventListener('error', () => reject(new Error('Kakao Maps SDK load failed')), {
        once: true,
      });
      return;
    }

    const script = document.createElement('script');
    script.id = 'pikone-kakao-map-sdk';
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(appKey)}&autoload=false`;
    script.onload = finishLoad;
    script.onerror = () => reject(new Error('Kakao Maps SDK load failed'));
    document.head.appendChild(script);
  });

  return kakaoMapScriptPromise;
};

const toCoordinates = (latLng: KakaoLatLng): Coordinates => ({
  latitude: latLng.getLat(),
  longitude: latLng.getLng(),
});

export const LocationPinMap = ({
  center,
  currentLocation,
  onCenterChange,
}: LocationPinMapProps) => {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const onCenterChangeRef = useRef(onCenterChange);
  const centerRef = useRef(center);
  const [isReady, setIsReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const appKey = import.meta.env.VITE_KAKAO_MAP_JAVASCRIPT_KEY?.trim();

  useEffect(() => {
    onCenterChangeRef.current = onCenterChange;
    centerRef.current = center;
  }, [onCenterChange, center]);

  useEffect(() => {
    if (!appKey || !mapElementRef.current) return;

    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;

    loadKakaoMapScript(appKey)
      .then(() => {
        if (cancelled || !mapElementRef.current || !window.kakao?.maps) return;

        const maps = window.kakao.maps;
        const initialCenter = new maps.LatLng(
          centerRef.current.latitude,
          centerRef.current.longitude,
        );
        const map = new maps.Map(mapElementRef.current, {
          center: initialCenter,
          level: 3,
        });

        map.setMinLevel?.(1);
        map.setMaxLevel?.(8);
        mapRef.current = map;

        const emitCenter = () => {
          const next = map.getCenter();
          if (next) onCenterChangeRef.current(toCoordinates(next));
        };

        maps.event.addListener(map, 'dragend', emitCenter);
        maps.event.addListener(map, 'click', (mouseEvent) => {
          const next = mouseEvent.latLng;
          if (!next) return;
          map.panTo(next);
          onCenterChangeRef.current(toCoordinates(next));
        });

        resizeObserver = new ResizeObserver(() => {
          map.relayout();
        });
        resizeObserver.observe(mapElementRef.current);

        setFailed(false);
        setIsReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
          setIsReady(false);
        }
      });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      mapRef.current = null;
    };
  }, [appKey]);

  useEffect(() => {
    const map = mapRef.current;
    const maps = window.kakao?.maps;
    if (!map || !maps || !isReady) return;

    const current = map.getCenter();
    const latitudeGap = Math.abs(current.getLat() - center.latitude);
    const longitudeGap = Math.abs(current.getLng() - center.longitude);
    if (latitudeGap < 0.000001 && longitudeGap < 0.000001) return;

    map.panTo(new maps.LatLng(center.latitude, center.longitude));
  }, [center.latitude, center.longitude, isReady]);

  const moveToCurrentLocation = () => {
    if (!currentLocation || !mapRef.current || !window.kakao?.maps) return;

    const next = new window.kakao.maps.LatLng(currentLocation.latitude, currentLocation.longitude);
    mapRef.current.panTo(next);
    onCenterChangeRef.current(currentLocation);
  };

  if (!appKey || failed) {
    return (
      <S.MapFallback role="status">
        <MapPin size={23} />
        <strong>카카오 지도를 불러올 수 없어요.</strong>
        <span>
          {!appKey
            ? 'VITE_KAKAO_MAP_JAVASCRIPT_KEY를 설정해주세요.'
            : '카카오 지도 설정과 등록된 웹 도메인을 확인해주세요.'}
        </span>
      </S.MapFallback>
    );
  }

  return (
    <S.MapViewport>
      <S.MapCanvas ref={mapElementRef} aria-label="추천 기준 위치 카카오 지도" />

      <S.Pin aria-hidden="true">
        <MapPin size={35} fill="currentColor" strokeWidth={2.1} />
      </S.Pin>

      <S.MapHint>지도를 움직여 위치를 맞춰주세요</S.MapHint>

      <S.CurrentLocationButton
        type="button"
        aria-label="현재 위치로 이동"
        title="현재 위치"
        disabled={!currentLocation}
        onClick={moveToCurrentLocation}
      >
        <LocateFixed size={19} />
      </S.CurrentLocationButton>
    </S.MapViewport>
  );
};
