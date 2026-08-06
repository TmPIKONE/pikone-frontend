// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { exchangeOAuthCode } from '~/apis/auth/auth';
import { AuthContext } from '~/contexts/Auth/AuthContext.context';
import { readAuthTokens } from '~/utils/authTokens';
import TokenProcessor from './TokenProcessor';

vi.mock('~/apis/auth/auth', () => ({
  exchangeOAuthCode: vi.fn(),
}));

const mockedExchangeOAuthCode = vi.mocked(exchangeOAuthCode);

beforeEach(() => {
  sessionStorage.clear();
  window.history.replaceState({}, '', '/');
  mockedExchangeOAuthCode.mockReset();
});

afterEach(() => {
  cleanup();
  sessionStorage.clear();
});

describe('TokenProcessor', () => {
  it('일회용 코드를 교환하고 Access Token만 저장한 뒤 홈으로 이동한다', async () => {
    mockedExchangeOAuthCode.mockResolvedValue({
      grantType: 'bearer',
      accessToken: 'access-token',
      accessTokenExpiresIn: 123,
      isNewUser: false,
      refreshToken: 'refresh-token',
    });
    const setIsAuthenticated = vi.fn();
    const { getByText } = render(
      <AuthContext.Provider
        value={{ isAuthenticated: false, isLoading: false, setIsAuthenticated }}
      >
        <MemoryRouter initialEntries={['/loginwait?code=one-time-code#binding=browser-binding']}>
          <Routes>
            <Route path="/loginwait" element={<TokenProcessor />} />
            <Route path="/home" element={<div>로그인 완료 홈</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    await waitFor(() => expect(getByText('로그인 완료 홈')).toBeTruthy());
    expect(mockedExchangeOAuthCode).toHaveBeenCalledWith('one-time-code', 'browser-binding');
    expect(readAuthTokens()).toEqual({ accessToken: 'access-token' });
    expect(sessionStorage.getItem('refreshToken')).toBe('refresh-token');
    expect(setIsAuthenticated).toHaveBeenCalledWith(true);
    expect(window.location.search).toBe('');
  });

  it('만료된 코드면 한국어 오류와 다시 로그인 동작을 제공한다', async () => {
    mockedExchangeOAuthCode.mockRejectedValue(new Error('expired'));
    const setIsAuthenticated = vi.fn();
    const { getByRole, getByText } = render(
      <AuthContext.Provider
        value={{ isAuthenticated: false, isLoading: false, setIsAuthenticated }}
      >
        <MemoryRouter initialEntries={['/loginwait?code=expired-code']}>
          <Routes>
            <Route path="/loginwait" element={<TokenProcessor />} />
            <Route path="/login" element={<div>로그인 선택</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    await waitFor(() => expect(getByRole('alert')).toBeTruthy());
    fireEvent.click(getByText('다시 로그인하기'));
    expect(getByText('로그인 선택')).toBeTruthy();
    expect(setIsAuthenticated).toHaveBeenCalledWith(false);
  });
});
