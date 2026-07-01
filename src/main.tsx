import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./QueryClient";
import { AuthProvider } from "./contexts/Auth/AuthContext";
import Router from "./Router";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Router />
    </AuthProvider>
  </QueryClientProvider>,
);
