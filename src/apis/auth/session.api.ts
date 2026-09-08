import ApiBuilder from '~/apis/config/builder/ApiBuilder';
import { AUTH_ENDPOINTS } from './auth.endpoints';
import type { AuthSessionResponse, SessionRevocationResponse } from './session.types';

export const getAuthSessionsBuilder = () =>
  ApiBuilder.create<void, AuthSessionResponse[]>(AUTH_ENDPOINTS.sessions).setMethod('GET');

export const revokeAuthSessionBuilder = (sessionId: number) =>
  ApiBuilder.create<void, SessionRevocationResponse>(
    `${AUTH_ENDPOINTS.sessions}/${sessionId}`,
  ).setMethod('DELETE');
