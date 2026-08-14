// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, waitFor } from '@testing-library/react';
import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { API_BASE_URL } from '~/apis/config/apiConfig';
import ProtectedRoute from '~/components/ProtectedRoute/ProtectedRoute';
import { AuthProvider } from '~/contexts/Auth/AuthContext';
import { readAuthTokens, readLegacyRefreshToken, writeAuthTokens } from '~/utils/authTokens';
import apiClient from './apiClient';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const ok = (config: InternalAxiosRequestConfig): AxiosResponse => ({
  data: { data: { ok: true } },
  status: 200,
  statusText: 'OK',
  headers: {},
  config,
});

const expired = (config: InternalAxiosRequestConfig) =>
  Promise.reject({
    config,
    response: {
      status: 401,
      data: { code: 'TOKEN_EXPIRED' },
      config,
      headers: {},
      statusText: 'Unauthorized',
    },
  });

describe('apiClient authentication contract', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(cleanup);

  it('sends credentials and the current access token on protected requests', async () => {
    writeAuthTokens({ accessToken: 'current-access' });
    const adapter = vi.fn(async (config: InternalAxiosRequestConfig) => ok(config));

    await apiClient.get('/protected', { adapter });

    const [request] = adapter.mock.calls[0];
    expect(request.baseURL).toBe(API_BASE_URL);
    expect(request.withCredentials).toBe(true);
    expect(request.headers.Authorization).toBe('Bearer current-access');
  });

  it('shares one reissue request across concurrent expired-token responses and retries both', async () => {
    writeAuthTokens({ accessToken: 'expired-access', refreshToken: 'legacy-refresh' });

    let completeReissue!: (response: AxiosResponse) => void;
    const reissueResponse = new Promise<AxiosResponse>((resolve) => {
      completeReissue = resolve;
    });
    const post = vi.spyOn(axios, 'post').mockReturnValue(reissueResponse);
    const observedRequests: Array<{ retry: boolean; authorization: unknown }> = [];
    const adapter = vi.fn((config: InternalAxiosRequestConfig) => {
      const retry = Boolean((config as RetryableRequestConfig)._retry);
      observedRequests.push({ retry, authorization: config.headers.Authorization });
      if (!retry) return expired(config);
      return Promise.resolve(ok(config));
    });

    const requests = [
      apiClient.get('/protected/one', { adapter }),
      apiClient.get('/protected/two', { adapter }),
    ];

    await vi.waitFor(() => expect(post).toHaveBeenCalledOnce());
    completeReissue({
      data: {
        data: {
          accessToken: 'renewed-access',
          refreshToken: 'renewed-refresh',
        },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    });

    await Promise.all(requests);

    expect(post).toHaveBeenCalledWith(
      `${API_BASE_URL}/reissue`,
      { accessToken: 'expired-access', refreshToken: 'legacy-refresh' },
      { withCredentials: true },
    );
    expect(readAuthTokens()).toEqual({ accessToken: 'renewed-access' });
    expect(readLegacyRefreshToken()).toBe('renewed-refresh');

    const retriedRequests = observedRequests.filter((request) => request.retry);
    expect(retriedRequests).toHaveLength(2);
    expect(
      retriedRequests.every(({ authorization }) => authorization === 'Bearer renewed-access'),
    ).toBe(true);
  });

  it('clears auth state on an unauthorized response so ProtectedRoute returns to login', async () => {
    writeAuthTokens({ accessToken: 'invalid-access' });
    const view = render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/home']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<div>protected home</div>} />
            </Route>
            <Route path="/login" element={<div>login page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );
    expect(view.getByText('protected home')).toBeTruthy();

    const adapter = (config: InternalAxiosRequestConfig) =>
      Promise.reject({
        config,
        response: { status: 401, data: { code: 'UNAUTHORIZED' } },
      });
    await apiClient.get('/protected', { adapter }).catch(() => undefined);

    await waitFor(() => expect(view.getByText('login page')).toBeTruthy());
  });
});
