// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SaveRequest } from '~/apis/record/record.types';
import { useSaveRecord } from './record.queries';

const mocks = vi.hoisted(() => ({
  execute: vi.fn(),
  showToast: vi.fn(),
  clearSelectedRecommendation: vi.fn(),
}));

vi.mock('~/apis/record/record.api', () => {
  const unusedBuilder = () => ({ execute: vi.fn() });
  return {
    analyzeImageBuilder: unusedBuilder,
    deleteRecordBuilder: unusedBuilder,
    getCalendarBuilder: unusedBuilder,
    getRecordsByDateBuilder: unusedBuilder,
    saveRecordBuilder: () => ({ execute: mocks.execute }),
    searchRestaurantsBuilder: unusedBuilder,
    updateRecordBuilder: unusedBuilder,
    updateVisibilityBuilder: unusedBuilder,
  };
});

vi.mock('~/components/Toast/useToast', () => ({
  useToast: () => ({ showToast: mocks.showToast }),
}));

vi.mock('~/features/recommendations/recommendationStorage', () => ({
  clearSelectedRecommendation: mocks.clearSelectedRecommendation,
}));

const request: SaveRequest = {
  kakaoPlaceId: 'place-1',
  restaurant: { kakaoPlaceId: 'place-1', placeName: '정우식당' },
  foodName: '김치찌개',
  visitDate: '2026-09-07',
  sourceRecommendationCandidateId: 701,
};

const axiosError = (code: string) =>
  Object.assign(new Error(code), {
    isAxiosError: true,
    response: { data: { code } },
  });

const SaveHarness = ({ saveRequest }: { saveRequest: SaveRequest }) => {
  const { mutateAsync } = useSaveRecord();
  return (
    <button type="button" onClick={() => void mutateAsync(saveRequest).catch(() => undefined)}>
      저장
    </button>
  );
};

const renderHarness = (saveRequest: SaveRequest) => {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
  const view = render(
    <QueryClientProvider client={queryClient}>
      <SaveHarness saveRequest={saveRequest} />
    </QueryClientProvider>,
  );
  return { ...view, invalidateQueries };
};

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

describe('useSaveRecord attribution degradation', () => {
  it('식별 가능한 attribution 오류만 context를 지우고 attribution 없이 한 번 재시도한다', async () => {
    mocks.execute
      .mockRejectedValueOnce(axiosError('INVALID_RECOMMENDATION_TRACKING'))
      .mockResolvedValueOnce({ recordId: 1 });
    const view = renderHarness(request);

    fireEvent.click(view.getByRole('button', { name: '저장' }));

    await waitFor(() => expect(mocks.execute).toHaveBeenCalledTimes(2));
    expect(mocks.execute.mock.calls[0]?.[0]).toEqual(request);
    expect(mocks.execute.mock.calls[1]?.[0]).not.toHaveProperty('sourceRecommendationCandidateId');
    expect(mocks.clearSelectedRecommendation).toHaveBeenCalledOnce();
    expect(mocks.showToast).toHaveBeenCalledWith('식사 기록을 저장했어요.');
    expect(mocks.showToast).not.toHaveBeenCalledWith('식사 기록 저장에 실패했어요.', 'error');
    expect(view.invalidateQueries).toHaveBeenCalled();
  });

  it('일반 validation 오류는 숨기거나 재시도하지 않는다', async () => {
    mocks.execute.mockRejectedValueOnce(axiosError('INVALID_REQUEST'));
    const view = renderHarness(request);

    fireEvent.click(view.getByRole('button', { name: '저장' }));

    await waitFor(() =>
      expect(mocks.showToast).toHaveBeenCalledWith('식사 기록 저장에 실패했어요.', 'error'),
    );
    expect(mocks.execute).toHaveBeenCalledOnce();
    expect(mocks.clearSelectedRecommendation).not.toHaveBeenCalled();
    expect(view.invalidateQueries).not.toHaveBeenCalled();
  });
});
