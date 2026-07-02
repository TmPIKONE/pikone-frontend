export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
