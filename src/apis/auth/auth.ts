import axios from 'axios';
import { BASE_URL, OAUTH_EXCHANGE } from '~/constants/endPoint';
import type { OAuthExchangeResponse, ReissueRequest, TokenResponse } from './auth.types';
import ApiBuilder from '../config/ApiBuilder';

export const END_POINT = {
  KAKAO_LOGIN: '/oauth2/authorization/kakao',
  NAVER_LOGIN: '/oauth2/authorization/naver',
  OAUTH_EXCHANGE,
  REISSUE: '/reissue',
  LOGOUT: '/logout',
  WITHDRAWAL: '/withdrawal',
  MY_INFO: '/my',
};

let pendingExchange: {
  code: string;
  binding?: string;
  promise: Promise<OAuthExchangeResponse>;
} | null = null;

export const exchangeOAuthCode = (code: string, binding?: string) => {
  if (pendingExchange?.code === code && pendingExchange.binding === binding) {
    return pendingExchange.promise;
  }

  const promise = axios
    .post(
      `${BASE_URL}${END_POINT.OAUTH_EXCHANGE}`,
      { code, ...(binding && { binding }) },
      { withCredentials: true },
    )
    .then(({ data }) => data.data as OAuthExchangeResponse)
    .finally(() => {
      if (pendingExchange?.code === code && pendingExchange.binding === binding) {
        pendingExchange = null;
      }
    });

  pendingExchange = { code, binding, promise };
  return promise;
};

export const reissue = () => {
  return ApiBuilder.create<ReissueRequest, TokenResponse>(END_POINT.REISSUE).setMethod('POST');
};

export const logout = () => {
  return ApiBuilder.create<void, void>(END_POINT.LOGOUT).setMethod('POST');
};

export const withdrawal = () => {
  return ApiBuilder.create<void, void>(END_POINT.WITHDRAWAL).setMethod('DELETE');
};
