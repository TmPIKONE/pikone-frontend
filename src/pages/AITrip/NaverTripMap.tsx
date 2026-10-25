import { useEffect, useRef, useState } from 'react';
import * as S from './AITrip.styles';

declare global {
  interface Window {
    naver?: {
      maps: {
        LatLng: new (latitude: number, longitude: number) => object;
        LatLngBounds: new () => { extend(position: object): void };
        Map: new (
          element: HTMLElement,
          options: {
            center: object;
            zoom: number;
            zoomControl: boolean;
            scaleControl: boolean;
            mapDataControl: boolean;
          },
        ) => { fitBounds(bounds: { extend(position: object): void }): void };
        Marker: new (options: { position: object; map: object; title: string }) => object;
      };
    };
  }
}

let naverScriptPromise: Promise<void> | null = null;

const loadNaverMapScript = (keyId: string) => {
  if (typeof window === 'undefined') return Promise.reject(new Error('window unavailable'));
  if (window.naver?.maps) return Promise.resolve();
  if (naverScriptPromise) return naverScriptPromise;

  naverScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById('pikone-naver-map-sdk') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('NAVER Maps SDK load failed')), {
        once: true,
      });
      return;
    }

    const script = document.createElement('script');
    script.id = 'pikone-naver-map-sdk';
    script.async = true;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(keyId)}`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('NAVER Maps SDK load failed'));
    document.head.appendChild(script);
  });

  return naverScriptPromise;
};

interface Props {
  startLatitude?: number;
  startLongitude?: number;
  goalLatitude: number;
  goalLongitude: number;
  goalName: string;
}

const NaverTripMap = ({
  startLatitude,
  startLongitude,
  goalLatitude,
  goalLongitude,
  goalName,
}: Props) => {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);
  const keyId = import.meta.env.VITE_NAVER_MAP_NCP_KEY_ID?.trim();

  useEffect(() => {
    if (!keyId || !mapElementRef.current) return;
    let cancelled = false;

    loadNaverMapScript(keyId)
      .then(() => {
        if (cancelled || !mapElementRef.current || !window.naver?.maps) return;
        const maps = window.naver.maps;
        mapElementRef.current.innerHTML = '';

        const destination = new maps.LatLng(goalLatitude, goalLongitude);
        const map = new maps.Map(mapElementRef.current, {
          center: destination,
          zoom: 15,
          zoomControl: false,
          scaleControl: false,
          mapDataControl: false,
        });

        new maps.Marker({ position: destination, map, title: goalName });
        const bounds = new maps.LatLngBounds();
        bounds.extend(destination);

        if (startLatitude != null && startLongitude != null) {
          const start = new maps.LatLng(startLatitude, startLongitude);
          new maps.Marker({ position: start, map, title: '현재 위치' });
          bounds.extend(start);
          map.fitBounds(bounds);
        }

        setFailed(false);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [keyId, startLatitude, startLongitude, goalLatitude, goalLongitude, goalName]);

  if (!keyId || failed) {
    return (
      <S.MapFallback>
        <S.MapFallbackLine>
          <span>현재 위치</span>
          <i />
          <span>{goalName}</span>
        </S.MapFallbackLine>
        <small>
          {keyId
            ? '지도를 불러오지 못했어요.'
            : 'VITE_NAVER_MAP_NCP_KEY_ID를 설정하면 앱 안에 NAVER 지도가 표시돼요.'}
        </small>
      </S.MapFallback>
    );
  }

  return <S.MapCanvas ref={mapElementRef} aria-label={`${goalName} 위치 지도`} />;
};

export default NaverTripMap;
