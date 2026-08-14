import axios from 'axios';
import { API_BASE_URL } from '~/apis/config/apiConfig';
import ApiBuilder from '~/apis/config/builder/ApiBuilder';
import { AUTH_ENDPOINTS } from './auth.endpoints';
import type { OAuthProvider } from './auth.endpoints';
import type { OAuthExchangeResponse } from './auth.types';

let pendingExchange: {
  code: string;
  binding?: string;
  promise: Promise<OAuthExchangeResponse>;
} | null = null;

export const createOAuthLoginUrl = (provider: OAuthProvider) =>
  `${API_BASE_URL}${AUTH_ENDPOINTS.oauthLogin[provider]}`;

export const exchangeOAuthCode = (code: string, binding?: string) => {
  if (pendingExchange?.code === code && pendingExchange.binding === binding) {
    return pendingExchange.promise;
  }

  const promise = axios
    .post(
      `${API_BASE_URL}${AUTH_ENDPOINTS.oauthExchange}`,
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

export const logoutBuilder = () =>
  ApiBuilder.create<void, void>(AUTH_ENDPOINTS.logout).setMethod('POST');

export const withdrawalBuilder = () =>
  ApiBuilder.create<void, void>(AUTH_ENDPOINTS.withdrawal).setMethod('DELETE');
