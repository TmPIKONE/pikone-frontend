import apiClient from '../apiClient';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type RequestConfig<T> = {
  params?: Record<string, any>;
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

class ApiBuilder<T = any, R = any> {
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

  setParams(params: Record<string, any>) {
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

  async execute(): Promise<AxiosResponse<ApiEnvelope<R>>> {
    const requestConfig: AxiosRequestConfig = {
      method: this.method,
      url: this.endpoint,
      ...this.config,
    };
    return apiClient(requestConfig);
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
      this.setData(data);
      const response = await this.execute();
      return response.data.data;
    };
  }
}

export function useApiQuery<T, R, TData = R>(
  apiBuilder: ApiBuilder<T, R>,
  queryKey: any,
  options?: Omit<UseQueryOptions<R, unknown, TData>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<R, unknown, TData>({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
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
