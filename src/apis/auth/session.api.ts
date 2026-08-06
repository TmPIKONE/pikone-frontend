import apiClient from '~/apis/apiClient';
import ApiBuilder from '~/apis/config/ApiBuilder';
import type { ApiEnvelope } from '~/apis/config/ApiBuilder';
import type { AuthSessionResponse, SessionRevocationResponse } from './session.types';

const AUTH_SESSIONS = '/auth/sessions';

export const getAuthSessionsBuilder = () =>
  ApiBuilder.create<void, AuthSessionResponse[]>(AUTH_SESSIONS).setMethod('GET');

export const revokeAuthSession = async (sessionId: number) => {
  const response = await apiClient.delete<ApiEnvelope<SessionRevocationResponse>>(
    `${AUTH_SESSIONS}/${sessionId}`,
  );
  return response.data.data;
};
