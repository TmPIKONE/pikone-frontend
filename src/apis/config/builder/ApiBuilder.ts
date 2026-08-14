import apiClient from '../apiClient';
import type { ApiEnvelope, ApiMethod, ApiParam, ApiRequestConfig } from '../api.types';

class ApiBuilder<Request = void, Response = unknown> {
  private readonly endpoint: string;
  private method: ApiMethod = 'GET';
  private params?: Record<string, ApiParam>;

  private constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  static create<Request, Response>(endpoint: string) {
    return new ApiBuilder<Request, Response>(endpoint);
  }

  setMethod(method: ApiMethod) {
    this.method = method;
    return this;
  }

  setParams(params: Record<string, ApiParam>) {
    this.params = params;
    return this;
  }

  private createRequestConfig(data?: Request): ApiRequestConfig<Request> {
    return {
      method: this.method,
      url: this.endpoint,
      params: this.params,
      ...(data === undefined ? {} : { data }),
    };
  }

  async execute(data?: Request): Promise<Response> {
    const response = await apiClient<ApiEnvelope<Response>>(this.createRequestConfig(data));
    return response.data.data;
  }
}

export default ApiBuilder;
