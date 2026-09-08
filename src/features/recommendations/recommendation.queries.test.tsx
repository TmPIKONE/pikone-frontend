// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { useEffect, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  RecommendationActionRequest,
  RecommendationImpressionCandidate,
} from '~/apis/recommendation/recommendation.types';
import { useRecommendationAction, useRecommendationImpressions } from './recommendation.queries';
import { beginRecommendationImpression } from './recommendationTracking';

const mocks = vi.hoisted(() => ({ apiClient: vi.fn() }));

vi.mock('~/apis/config/apiClient', () => ({ default: mocks.apiClient }));

const networkError = () => Object.assign(new Error('network'), { isAxiosError: true });
const successResponse = { data: { data: undefined } };

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithClient = (element: React.ReactNode) =>
  render(<QueryClientProvider client={createQueryClient()}>{element}</QueryClientProvider>);

const ActionHarness = ({ body }: { body: RecommendationActionRequest }) => {
  const [requestId, setRequestId] = useState('session-a');
  const { mutate } = useRecommendationAction();

  return (
    <button
      type="button"
      onClick={() => {
        mutate({ requestId, body });
        setRequestId('session-b');
      }}
    >
      {requestId}
    </button>
  );
};

const ImpressionHarness = ({ candidates }: { candidates: RecommendationImpressionCandidate[] }) => {
  const [requestId, setRequestId] = useState('impression-session-a');
  const { mutate } = useRecommendationImpressions();

  return (
    <button
      type="button"
      onClick={() => {
        const dedupeKey = beginRecommendationImpression(requestId, candidates);
        if (dedupeKey) {
          mutate({ requestId, body: { candidates }, dedupeKey });
        }
        setRequestId('impression-session-b');
      }}
    >
      {requestId}
    </button>
  );
};

const AutoImpressionHarness = ({
  requestId,
  candidates,
}: {
  requestId: string;
  candidates: RecommendationImpressionCandidate[];
}) => {
  const { mutate } = useRecommendationImpressions();

  useEffect(() => {
    const dedupeKey = beginRecommendationImpression(requestId, candidates);
    if (dedupeKey) {
      mutate({ requestId, body: { candidates }, dedupeKey });
    }
  }, [candidates, mutate, requestId]);

  return null;
};

beforeEach(() => {
  mocks.apiClient.mockReset();
  sessionStorage.clear();
});

afterEach(cleanup);

describe('recommendation tracking mutations', () => {
  it.each([
    {
      name: 'candidate action',
      body: {
        actionType: 'PLACE_OPEN' as const,
        candidateSnapshotId: 10,
        clientEventId: 'event-place-open',
      },
    },
    {
      name: 'candidate 없는 RERECOMMEND',
      body: {
        actionType: 'RERECOMMEND' as const,
        clientEventId: 'event-rerecommend',
      },
    },
  ])('$name retry는 최초 requestId와 clientEventId를 유지한다', async ({ body }) => {
    mocks.apiClient.mockRejectedValueOnce(networkError()).mockResolvedValueOnce(successResponse);
    const view = renderWithClient(<ActionHarness body={body} />);

    fireEvent.click(view.getByRole('button', { name: 'session-a' }));
    expect(view.getByRole('button', { name: 'session-b' })).toBeTruthy();

    await waitFor(() => expect(mocks.apiClient).toHaveBeenCalledTimes(2), { timeout: 4000 });
    expect(mocks.apiClient.mock.calls.map(([config]) => config.url)).toEqual([
      '/recommendations/session-a/actions',
      '/recommendations/session-a/actions',
    ]);
    expect(mocks.apiClient.mock.calls.map(([config]) => config.data.clientEventId)).toEqual([
      body.clientEventId,
      body.clientEventId,
    ]);
  });

  it('impression retry도 최초 requestId를 유지한다', async () => {
    const candidates = [{ candidateSnapshotId: 20, position: 1 }];
    mocks.apiClient.mockRejectedValueOnce(networkError()).mockResolvedValueOnce(successResponse);
    const view = renderWithClient(<ImpressionHarness candidates={candidates} />);

    fireEvent.click(view.getByRole('button', { name: 'impression-session-a' }));
    expect(view.getByRole('button', { name: 'impression-session-b' })).toBeTruthy();

    await waitFor(() => expect(mocks.apiClient).toHaveBeenCalledTimes(2), { timeout: 4000 });
    expect(mocks.apiClient.mock.calls.map(([config]) => config.url)).toEqual([
      '/recommendations/impression-session-a/impressions',
      '/recommendations/impression-session-a/impressions',
    ]);
    expect(mocks.apiClient.mock.calls[0]?.[0].data).toEqual({ candidates });
    expect(mocks.apiClient.mock.calls[1]?.[0].data).toEqual({ candidates });
  });

  it('impression final failure는 success로 저장하지 않고 remount에서 다시 시도한다', async () => {
    const requestId = 'impression-final-failure';
    const candidates = [{ candidateSnapshotId: 30, position: 1 }];
    mocks.apiClient.mockRejectedValueOnce(networkError()).mockRejectedValueOnce(networkError());
    const firstView = renderWithClient(
      <AutoImpressionHarness requestId={requestId} candidates={candidates} />,
    );

    await waitFor(() => expect(mocks.apiClient).toHaveBeenCalledTimes(2), { timeout: 4000 });
    await waitFor(() =>
      expect(sessionStorage.getItem('pikone:recommendation-impressions')).toBeNull(),
    );
    firstView.unmount();

    mocks.apiClient.mockResolvedValueOnce(successResponse);
    renderWithClient(<AutoImpressionHarness requestId={requestId} candidates={candidates} />);

    await waitFor(() => expect(mocks.apiClient).toHaveBeenCalledTimes(3));
    await waitFor(() =>
      expect(sessionStorage.getItem('pikone:recommendation-impressions')).toContain(requestId),
    );
  });
});
