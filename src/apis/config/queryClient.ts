import { QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

const shouldRetryQuery = (failureCount: number, error: unknown) => {
  if (failureCount >= 1) return false;
  if (!isAxiosError(error)) return true;

  const status = error.response?.status;
  return status == null || status >= 500;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetryQuery,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 10,
    },
    mutations: {
      retry: false,
    },
  },
});

export default queryClient;
