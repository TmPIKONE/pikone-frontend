interface TokenResponse {
  grantType: string;
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken?: string;
}

export interface OAuthExchangeResponse extends TokenResponse {
  isNewUser: boolean;
}
