import axios from 'axios';
import { REISSUE } from '../constants/endPoint';

const API_BASE_URL = (import.meta.env.VITE_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = sessionStorage.getItem('accessToken');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    const isTokenExpired =
      error.response?.status === 401 &&
      error.response?.data?.code === 'TOKEN_EXPIRED';

    if (isTokenExpired && originalConfig && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        const accessToken = sessionStorage.getItem('accessToken');
        const refreshToken = sessionStorage.getItem('refreshToken');

        if (!accessToken || !refreshToken) {
          throw new Error('토큰이 없습니다.');
        }

        const reissueRequestDto = {
          accessToken,
          refreshToken,
        };

        const reissueUrl = `${API_BASE_URL}${REISSUE}`;

        const { data } = await axios.post(reissueUrl, reissueRequestDto);
        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;

        sessionStorage.setItem('accessToken', newAccessToken);
        sessionStorage.setItem('refreshToken', newRefreshToken);

        originalConfig.headers = {
          ...originalConfig.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        return apiClient.request(originalConfig);
      } catch (reissueError) {
        console.error('토큰 재발급 실패:', reissueError);
        sessionStorage.clear();
        redirectToLogin();
        return Promise.reject(reissueError);
      }
    } else if (error.response && error.response.status === 401) {
      sessionStorage.clear();
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
