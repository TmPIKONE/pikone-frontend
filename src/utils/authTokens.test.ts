import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearAuthTokens,
  hasAuthToken,
  readAuthTokens,
  readLegacyRefreshToken,
  writeAuthTokens,
} from './authTokens';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe('auth token storage', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'sessionStorage', {
      configurable: true,
      value: new MemoryStorage(),
    });
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: new MemoryStorage(),
    });
  });

  it('Access Token만 저장하고 기존 Refresh Token은 제거한다', () => {
    sessionStorage.setItem('refreshToken', 'legacy-refresh');
    expect(readLegacyRefreshToken()).toBe('legacy-refresh');

    writeAuthTokens({ accessToken: 'access' });

    expect(readAuthTokens()).toEqual({ accessToken: 'access' });
    expect(readLegacyRefreshToken()).toBeUndefined();
    expect(hasAuthToken()).toBe(true);
  });

  it('원격 HTTP 호환 모드의 Refresh Token을 현재 탭에만 보관한다', () => {
    writeAuthTokens({ accessToken: 'access', refreshToken: 'compat-refresh' });

    expect(readAuthTokens()).toEqual({ accessToken: 'access' });
    expect(readLegacyRefreshToken()).toBe('compat-refresh');
  });

  it('로그아웃 시 앱의 다른 세션 값은 보존한다', () => {
    sessionStorage.setItem('pendingRecord', '42');
    sessionStorage.setItem('refreshToken', 'legacy-refresh');
    writeAuthTokens({ accessToken: 'access' });

    clearAuthTokens();

    expect(readAuthTokens()).toEqual({ accessToken: undefined });
    expect(readLegacyRefreshToken()).toBeUndefined();
    expect(sessionStorage.getItem('pendingRecord')).toBe('42');
  });
  it('로그아웃 시 다른 계정에 추천·약속 연속 상태를 노출하지 않는다', () => {
    sessionStorage.setItem('pikone:recommendation-result', '{"x":1}');
    sessionStorage.setItem('pikone:recommendation-draft', '{"x":1}');
    localStorage.setItem('pikone:selected-recommendation', '{"x":1}');
    localStorage.setItem('pikone:decision-room:ABC:participant-token', 'token');
    localStorage.setItem('unrelated', 'keep');

    clearAuthTokens();

    expect(sessionStorage.getItem('pikone:recommendation-result')).toBeNull();
    expect(sessionStorage.getItem('pikone:recommendation-draft')).toBeNull();
    expect(localStorage.getItem('pikone:selected-recommendation')).toBeNull();
    expect(localStorage.getItem('pikone:decision-room:ABC:participant-token')).toBeNull();
    expect(localStorage.getItem('unrelated')).toBe('keep');
  });
});
