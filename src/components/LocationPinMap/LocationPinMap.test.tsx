// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, render, waitFor } from '@testing-library/react';
import { LocationPinMap } from './LocationPinMap';

const created = vi.fn();
const pan = vi.fn();
interface MapPoint {
  getLat(): number;
  getLng(): number;
}
class Point {
  constructor(
    private latitude: number,
    private longitude: number,
  ) {}
  getLat() {
    return this.latitude;
  }
  getLng() {
    return this.longitude;
  }
}
class MapInstance {
  constructor(
    _element: HTMLElement,
    private options: { center: MapPoint; level: number },
  ) {
    created(options.center);
  }
  getCenter() {
    return this.options.center;
  }
  panTo(point: MapPoint) {
    this.options.center = point;
    pan(point);
  }
  relayout() {}
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('VITE_KAKAO_MAP_JAVASCRIPT_KEY', 'test-key');
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    },
  );
  window.kakao = {
    maps: {
      LatLng: Point,
      Map: MapInstance,
      load: (callback) => callback(),
      event: { addListener: vi.fn() },
    },
  };
});
afterEach(() => {
  cleanup();
  delete window.kakao;
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

it('pending SDK initialization uses the latest committed center', async () => {
  const view = render(
    <LocationPinMap center={{ latitude: 1, longitude: 2 }} onCenterChange={vi.fn()} />,
  );
  view.rerender(<LocationPinMap center={{ latitude: 3, longitude: 4 }} onCenterChange={vi.fn()} />);
  await waitFor(() => expect(created).toHaveBeenCalledOnce());
  expect(created.mock.calls[0][0].getLat()).toBe(3);
  expect(created.mock.calls[0][0].getLng()).toBe(4);
});

it('center updates pan the existing map without reinitializing the SDK instance', async () => {
  const onCenterChange = vi.fn();
  const view = render(
    <LocationPinMap center={{ latitude: 1, longitude: 2 }} onCenterChange={onCenterChange} />,
  );
  await waitFor(() => expect(created).toHaveBeenCalledOnce());
  view.rerender(
    <LocationPinMap center={{ latitude: 5, longitude: 6 }} onCenterChange={onCenterChange} />,
  );
  await waitFor(() => expect(pan).toHaveBeenCalledOnce());
  expect(pan.mock.calls[0][0].getLat()).toBe(5);
  expect(created).toHaveBeenCalledOnce();
});
