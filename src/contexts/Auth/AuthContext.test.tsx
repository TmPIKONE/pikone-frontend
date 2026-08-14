// @vitest-environment jsdom

import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { clearAuthTokens, writeAuthTokens } from '~/utils/authTokens';
import { AuthProvider } from './AuthContext';
import { useAuth } from './useAuth';

const AuthState = () => {
  const { isAuthenticated } = useAuth();
  return <span>{isAuthenticated ? 'authenticated' : 'anonymous'}</span>;
};

describe('AuthProvider token synchronization', () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(cleanup);

  it('tracks token writes and clears from the shared authentication source', () => {
    const view = render(
      <AuthProvider>
        <AuthState />
      </AuthProvider>,
    );

    expect(view.getByText('anonymous')).toBeTruthy();

    act(() => writeAuthTokens({ accessToken: 'access-token' }));
    expect(view.getByText('authenticated')).toBeTruthy();

    act(clearAuthTokens);
    expect(view.getByText('anonymous')).toBeTruthy();
  });
});
