// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { exchangeOAuthCode } from '~/apis/auth/auth.api';
import { AuthProvider } from '~/contexts/Auth/AuthContext';
import { useAuth } from '~/contexts/Auth/useAuth';
import { readAuthTokens, writeAuthTokens } from '~/utils/authTokens';
import OAuthCallback from './OAuthCallback';

vi.mock('~/apis/auth/auth.api', () => ({
  exchangeOAuthCode: vi.fn(),
}));

const mockedExchangeOAuthCode = vi.mocked(exchangeOAuthCode);

const AuthenticationState = () => {
  const { isAuthenticated } = useAuth();
  return <span>{isAuthenticated ? 'authenticated' : 'anonymous'}</span>;
};

beforeEach(() => {
  sessionStorage.clear();
  window.history.replaceState({}, '', '/');
  mockedExchangeOAuthCode.mockReset();
});

afterEach(() => {
  cleanup();
  sessionStorage.clear();
});

describe('OAuthCallback', () => {
  it('일회용 코드를 교환하고 Access Token만 저장한 뒤 홈으로 이동한다', async () => {
    mockedExchangeOAuthCode.mockResolvedValue({
      grantType: 'bearer',
      accessToken: 'access-token',
      accessTokenExpiresIn: 123,
      isNewUser: false,
      refreshToken: 'refresh-token',
    });
    const { getByText } = render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/loginwait?code=one-time-code#binding=browser-binding']}>
          <Routes>
            <Route path="/loginwait" element={<OAuthCallback />} />
            <Route path="/home" element={<div>로그인 완료 홈</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    await waitFor(() => expect(getByText('로그인 완료 홈')).toBeTruthy());
    expect(mockedExchangeOAuthCode).toHaveBeenCalledWith('one-time-code', 'browser-binding');
    expect(readAuthTokens()).toEqual({ accessToken: 'access-token' });
    expect(sessionStorage.getItem('refreshToken')).toBe('refresh-token');
    expect(window.location.search).toBe('');
  });

  it('만료된 코드면 한국어 오류와 다시 로그인 동작을 제공한다', async () => {
    mockedExchangeOAuthCode.mockRejectedValue(new Error('expired'));
    const { getByRole, getByText } = render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/loginwait?code=expired-code']}>
          <Routes>
            <Route path="/loginwait" element={<OAuthCallback />} />
            <Route path="/login" element={<div>로그인 선택</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    await waitFor(() => expect(getByRole('alert')).toBeTruthy());
    fireEvent.click(getByText('다시 로그인하기'));
    expect(getByText('로그인 선택')).toBeTruthy();
  });

  it('코드 없이 진입하면 기존 토큰과 인증 상태를 함께 지운다', async () => {
    writeAuthTokens({ accessToken: 'stale-access-token' });

    const { getByText } = render(
      <AuthProvider>
        <AuthenticationState />
        <MemoryRouter initialEntries={['/loginwait']}>
          <Routes>
            <Route path="/loginwait" element={<OAuthCallback />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    await waitFor(() => expect(getByText('anonymous')).toBeTruthy());
    expect(readAuthTokens()).toEqual({ accessToken: undefined });
    expect(mockedExchangeOAuthCode).not.toHaveBeenCalled();
  });
});
