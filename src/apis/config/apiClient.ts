import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { AUTH_ENDPOINTS } from '~/apis/auth/auth.endpoints';
import {
  clearAuthTokens,
  readAuthTokens,
  readLegacyRefreshToken,
  writeAuthTokens,
  type AuthTokens,
} from '~/utils/authTokens';
import { API_BASE_URL } from './apiConfig';
import type { ApiEnvelope } from './api.types';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<AuthTokens> | null = null;

const refreshAuthTokens = () => {
  if (refreshPromise) return refreshPromise;

  const { accessToken } = readAuthTokens();
  if (!accessToken) {
    return Promise.reject(new Error('인증 토큰이 없습니다.'));
  }

  const legacyRefreshToken = readLegacyRefreshToken();
  refreshPromise = axios
    .post<ApiEnvelope<AuthTokens>>(
      `${API_BASE_URL}${AUTH_ENDPOINTS.reissue}`,
      { accessToken, ...(legacyRefreshToken && { refreshToken: legacyRefreshToken }) },
      { withCredentials: true },
    )
    .then(({ data }) => {
      const tokens = data.data;
      writeAuthTokens(tokens);
      return tokens;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

apiClient.interceptors.request.use((config) => {
  const { accessToken } = readAuthTokens();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config as RetryableRequestConfig | undefined;
    const isUnauthorized = error.response?.status === 401;
    const isTokenExpired = isUnauthorized && error.response?.data?.code === 'TOKEN_EXPIRED';

    if (isTokenExpired && originalConfig && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        const { accessToken } = await refreshAuthTokens();
        originalConfig.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient.request(originalConfig);
      } catch (reissueError) {
        clearAuthTokens();
        redirectToLogin();
        return Promise.reject(reissueError);
      }
    }

    if (isUnauthorized) {
      clearAuthTokens();
      redirectToLogin();
    }

    return Promise.reject(error);
  },
);

function redirectToLogin() {
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

export default apiClient;
