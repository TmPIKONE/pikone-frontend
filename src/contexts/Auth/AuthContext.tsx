import { useMemo, useState } from 'react';
import { hasAuthToken } from '~/utils/authTokens';
import { AuthContext } from './AuthContext.context';
import type { AuthProviderProps } from './AuthContext.types';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthToken);
  const value = useMemo(
    () => ({ isAuthenticated, isLoading: false, setIsAuthenticated }),
    [isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
