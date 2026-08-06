// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { AiFoodResponse, SaveRequest, SaveResponse } from '~/apis/record/record.types';
import RecordAdd from './RecordAdd';

type AnalyzeOptions = {
  onSuccess: (data: AiFoodResponse) => void;
  onError: () => void;
};

const apiMocks = vi.hoisted(() => ({
  analyze: vi.fn<(formData: FormData, options: AnalyzeOptions) => void>(),
  save: vi.fn<(request: SaveRequest) => Promise<SaveResponse>>(),
}));

vi.mock('~/features/records/record.queries', () => ({
  useAnalyzeImage: () => ({ mutate: apiMocks.analyze, isPending: false }),
  useSaveRecord: () => ({ mutateAsync: apiMocks.save }),
  useRecordsByDate: () => ({ data: [], isLoading: false }),
  useRestaurantSearch: () => ({ data: [], isFetching: false }),
}));

vi.mock('~/features/companions/companion.queries', () => ({
  useCompanions: () => ({ data: [], isLoading: false }),
}));

const analysisResponse: AiFoodResponse = {
  foodName: '김치찌개',
  foodTags: ['한식'],
  sceneTags: [],
  confidence: 0.93,
  imageUrl: 'https://images.example.com/record.jpg',
  restaurants: [
    {
      kakaoPlaceId: 'place-1',
      placeName: '정우식당',
      category: '한식',
      address: '서울시 중구',
      latitude: 37.56,
      longitude: 126.97,
    },
  ],
};

beforeEach(() => {
  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    value: vi.fn(() => 'blob:preview'),
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    configurable: true,
    value: vi.fn(),
  });
  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: {
      getCurrentPosition: vi.fn((onSuccess: PositionCallback) =>
        onSuccess({ coords: { latitude: 37.56, longitude: 126.97 } } as GeolocationPosition),
      ),
    },
  });

  apiMocks.analyze.mockImplementation((_formData, options) => options.onSuccess(analysisResponse));
  apiMocks.save.mockResolvedValue({ recordId: 101 });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe('RecordAdd', () => {
  it('사진 분석 결과를 적용하고 기록 저장 후 해당 날짜로 이동한다', async () => {
    const { container, getByRole, getByText } = render(
      <MemoryRouter initialEntries={['/record/add?date=2026-07-31']}>
        <Routes>
          <Route path="/record/add" element={<RecordAdd />} />
          <Route path="/record/view" element={<div>저장 후 기록 페이지</div>} />
        </Routes>
      </MemoryRouter>,
    );
    const input = container.querySelector<HTMLInputElement>('input[type="file"]');
    const photo = new File(['jpeg'], 'meal.jpg', { type: 'image/jpeg' });

    fireEvent.change(input!, { target: { files: [photo] } });
    fireEvent.click(getByRole('button', { name: '다음' }));

    expect(apiMocks.analyze).toHaveBeenCalledOnce();
    expect(apiMocks.analyze.mock.calls[0]?.[0].get('image')).toBe(photo);

    expect((getByRole('textbox', { name: '메뉴' }) as HTMLInputElement).value).toBe('김치찌개');

    fireEvent.click(getByRole('button', { name: '기록하기' }));

    await waitFor(() => expect(getByText('저장 후 기록 페이지')).toBeTruthy());
    expect(apiMocks.save).toHaveBeenCalledWith(
      expect.objectContaining({
        foodName: '김치찌개',
        kakaoPlaceId: 'place-1',
        imageUrl: analysisResponse.imageUrl,
        visitDate: '2026-07-31',
      }),
    );
  });
});
