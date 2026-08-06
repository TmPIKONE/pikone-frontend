// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '~/contexts/Auth/AuthContext.context';
import ProtectedRoute from './ProtectedRoute';

afterEach(cleanup);

const renderProtectedRoute = (isAuthenticated: boolean) =>
  render(
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading: false, setIsAuthenticated: vi.fn() }}
    >
      <MemoryRouter initialEntries={['/home']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<div>보호된 홈</div>} />
          </Route>
          <Route path="/login" element={<div>로그인 화면</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );

describe('ProtectedRoute', () => {
  it('인증되지 않은 사용자를 로그인 화면으로 보낸다', () => {
    const { getByText } = renderProtectedRoute(false);
    expect(getByText('로그인 화면')).toBeTruthy();
  });

  it('인증된 사용자에게 보호 화면을 표시한다', () => {
    const { getByText } = renderProtectedRoute(true);
    expect(getByText('보호된 홈')).toBeTruthy();
  });
});
