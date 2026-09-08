export const AUTH_ENDPOINTS = {
  oauthLogin: {
    kakao: '/oauth2/authorization/kakao',
    naver: '/oauth2/authorization/naver',
  },
  oauthExchange: '/oauth2/exchange',
  reissue: '/reissue',
  logout: '/logout',
  withdrawal: '/withdrawal',
  myInfo: '/my',
  sessions: '/auth/sessions',
} as const;

export type OAuthProvider = keyof typeof AUTH_ENDPOINTS.oauthLogin;
