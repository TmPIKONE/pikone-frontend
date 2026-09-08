import { useEffect, useMemo, useState } from 'react';
import { AUTH_TOKENS_CHANGED_EVENT, hasAuthToken } from '~/utils/authTokens';
import { AuthContext } from './AuthContext.context';
import type { AuthProviderProps } from './AuthContext.types';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthToken);

  useEffect(() => {
    const synchronizeAuthentication = () => setIsAuthenticated(hasAuthToken());
    window.addEventListener(AUTH_TOKENS_CHANGED_EVENT, synchronizeAuthentication);
    window.addEventListener('storage', synchronizeAuthentication);
    synchronizeAuthentication();

    return () => {
      window.removeEventListener(AUTH_TOKENS_CHANGED_EVENT, synchronizeAuthentication);
      window.removeEventListener('storage', synchronizeAuthentication);
    };
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, isLoading: false, setIsAuthenticated }),
    [isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
