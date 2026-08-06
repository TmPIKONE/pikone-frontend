import apiClient from '../apiClient';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { QueryKey, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type ApiParam = string | number | boolean | null | undefined;

type RequestConfig<T> = {
  params?: Record<string, ApiParam>;
  data?: T;
  headers?: Record<string, string>;
};

// 스웨거 모든 응답이 공통으로 감싸는 envelope
export interface ApiEnvelope<R> {
  status: number;
  message: string;
  code: string;
  timestamp: string;
  data: R;
}

class ApiBuilder<T = void, R = unknown> {
  private endpoint: string;
  private method: ApiMethod = 'GET';
  private config: RequestConfig<T> = {};

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  static create<T, R>(endpoint: string) {
    return new ApiBuilder<T, R>(endpoint);
  }

  setMethod(method: ApiMethod) {
    this.method = method;
    return this;
  }

  setParams(params: Record<string, ApiParam>) {
    this.config.params = params;
    return this;
  }

  setData(data: T) {
    this.config.data = data;
    return this;
  }

  setHeaders(headers: Record<string, string>) {
    this.config.headers = headers;
    return this;
  }

  private createRequestConfig(data?: T): AxiosRequestConfig {
    const requestConfig: AxiosRequestConfig = {
      method: this.method,
      url: this.endpoint,
      params: this.config.params,
      headers: this.config.headers,
    };

    if (data !== undefined) requestConfig.data = data;
    else if (this.config.data !== undefined) requestConfig.data = this.config.data;

    return requestConfig;
  }

  async execute(): Promise<AxiosResponse<ApiEnvelope<R>>> {
    return apiClient(this.createRequestConfig());
  }

  // envelope을 벗기고 실제 data만 반환
  getQueryFn() {
    return async () => {
      const response = await this.execute();
      return response.data.data;
    };
  }

  getMutationFn() {
    return async (data: T) => {
      const response = await apiClient<ApiEnvelope<R>>(this.createRequestConfig(data));
      return response.data.data;
    };
  }
}

export function useApiQuery<T, R, TData = R>(
  apiBuilder: ApiBuilder<T, R>,
  queryKey: QueryKey,
  options?: Omit<UseQueryOptions<R, unknown, TData>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<R, unknown, TData>({
    queryKey,
    queryFn: apiBuilder.getQueryFn(),
    ...options,
  });
}

export function useApiMutation<T, R>(
  apiBuilder: ApiBuilder<T, R>,
  options?: UseMutationOptions<R, unknown, T>,
) {
  return useMutation<R, unknown, T>({
    mutationFn: apiBuilder.getMutationFn(),
    ...options,
  });
}

export default ApiBuilder;
