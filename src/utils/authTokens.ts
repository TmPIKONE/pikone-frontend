const ACCESS_TOKEN_KEY = 'accessToken';
const LEGACY_REFRESH_TOKEN_KEY = 'refreshToken';
export const AUTH_TOKENS_CHANGED_EVENT = 'pikone:auth-tokens-changed';

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

const notifyAuthTokensChanged = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_TOKENS_CHANGED_EVENT));
  }
};

export const hasAuthToken = () => Boolean(sessionStorage.getItem(ACCESS_TOKEN_KEY));

export const readAuthTokens = (): Partial<AuthTokens> => ({
  accessToken: sessionStorage.getItem(ACCESS_TOKEN_KEY) ?? undefined,
});

// 기존 배포본의 세션을 HttpOnly 쿠키 방식으로 한 번만 이전하기 위한 값이다.
export const readLegacyRefreshToken = () =>
  sessionStorage.getItem(LEGACY_REFRESH_TOKEN_KEY) ?? undefined;

export const writeAuthTokens = ({ accessToken, refreshToken }: AuthTokens) => {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    // 원격 HTTP API 개발 호환 모드에서만 응답된다. HTTPS 배포에서는 HttpOnly 쿠키를 쓴다.
    sessionStorage.setItem(LEGACY_REFRESH_TOKEN_KEY, refreshToken);
  } else {
    sessionStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
  }
  notifyAuthTokensChanged();
};

export const clearAuthTokens = () => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
  notifyAuthTokensChanged();
};
