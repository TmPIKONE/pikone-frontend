import type { ReactNode } from "react";

export interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface AuthProviderProps {
    children: ReactNode;
}