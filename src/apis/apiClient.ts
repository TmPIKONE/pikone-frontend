import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { REISSUE } from '../constants/endPoint';
import {
  clearAuthTokens,
  readAuthTokens,
  readLegacyRefreshToken,
  writeAuthTokens,
  type AuthTokens,
} from '~/utils/authTokens';

const API_BASE_URL = (import.meta.env.VITE_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

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
    .post(
      `${API_BASE_URL}${REISSUE}`,
      { accessToken, ...(legacyRefreshToken && { refreshToken: legacyRefreshToken }) },
      { withCredentials: true },
    )
    .then(({ data }) => {
      const tokens: AuthTokens = {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      };
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

    const isTokenExpired =
      error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED';

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
    } else if (error.response && error.response.status === 401) {
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
