import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import queryClient from "./apis/config/QueryClient";

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>
);