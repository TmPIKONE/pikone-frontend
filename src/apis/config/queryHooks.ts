import { useMutation, useQuery } from '@tanstack/react-query';
import type { QueryKey, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import type ApiBuilder from './builder/ApiBuilder';

export function useApiQuery<Request, Response, Data = Response>(
  request: ApiBuilder<Request, Response>,
  queryKey: QueryKey,
  options?: Omit<UseQueryOptions<Response, unknown, Data>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<Response, unknown, Data>({
    queryKey,
    queryFn: () => request.execute(),
    ...options,
  });
}

export function useApiMutation<Request, Response>(
  request: ApiBuilder<Request, Response>,
  options?: UseMutationOptions<Response, unknown, Request>,
) {
  return useMutation<Response, unknown, Request>({
    mutationFn: (data) => request.execute(data),
    ...options,
  });
}
