import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
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
