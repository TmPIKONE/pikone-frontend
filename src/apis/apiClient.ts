import axios from 'axios';
import { REISSUE } from '../constants/endPoint';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:8080',
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

    if (
      error.response &&
      error.response.data &&
      error.response.status === 401 &&
      error.response.data.message === '유효하지 않은 토큰입니다.' &&
      !originalConfig._retry
    ) {
      originalConfig._retry = true;

      try {
        const reissueRequestDto = {
          accessToken: sessionStorage.getItem('accessToken'),
          refreshToken: sessionStorage.getItem('refreshToken'),
        };

        const reissueUrl = (import.meta.env.VITE_BASE_URL || 'http://localhost:8080') + REISSUE;

        const { data } = await axios.post(reissueUrl, reissueRequestDto);
        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;

        sessionStorage.setItem('accessToken', newAccessToken);
        sessionStorage.setItem('refreshToken', newRefreshToken);

        originalConfig.headers['Authorization'] = `Bearer ${newAccessToken}`;

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
  window.location.href = '/login';
}

export default apiClient;
