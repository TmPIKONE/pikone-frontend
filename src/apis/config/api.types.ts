import type { AxiosRequestConfig } from 'axios';

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type ApiParam = string | number | boolean | null | undefined;

export interface ApiEnvelope<Data> {
  status: number;
  message: string;
  code: string;
  timestamp: string;
  data: Data;
}

export type ApiRequestConfig<Request> = Pick<AxiosRequestConfig<Request>, 'method' | 'url'> & {
  params?: Record<string, ApiParam>;
  data?: Request;
};
