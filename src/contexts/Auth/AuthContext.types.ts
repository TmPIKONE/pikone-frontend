import type { ReactNode } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}
