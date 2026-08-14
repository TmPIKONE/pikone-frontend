import { beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import { API_BASE_URL } from '~/apis/config/apiConfig';
import { exchangeOAuthCode } from './auth.api';

vi.mock('axios', async () => {
  const actual = await vi.importActual<{ default: typeof axios }>('axios');
  return {
    ...actual,
    default: Object.assign(actual.default, { post: vi.fn() }),
  };
});

const mockedPost = vi.mocked(axios.post);

describe('OAuth code exchange', () => {
  beforeEach(() => {
    mockedPost.mockReset();
  });

  it('일회용 코드와 쿠키 자격 증명만 전송한다', async () => {
    mockedPost.mockResolvedValue({
      data: {
        data: {
          grantType: 'bearer',
          accessToken: 'access-token',
          accessTokenExpiresIn: 123,
          isNewUser: false,
          refreshToken: 'refresh-token',
        },
      },
    });

    const result = await exchangeOAuthCode('one-time-code', 'browser-binding');

    expect(mockedPost).toHaveBeenCalledWith(
      `${API_BASE_URL}/oauth2/exchange`,
      { code: 'one-time-code', binding: 'browser-binding' },
      { withCredentials: true },
    );
    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
  });

  it('동일한 일회용 코드 교환은 진행 중인 한 요청을 공유한다', async () => {
    let resolveExchange!: (value: { data: { data: OAuthResult } }) => void;
    type OAuthResult = Awaited<ReturnType<typeof exchangeOAuthCode>>;
    const response = new Promise<{ data: { data: OAuthResult } }>((resolve) => {
      resolveExchange = resolve;
    });
    mockedPost.mockReturnValue(response as ReturnType<typeof axios.post>);

    const first = exchangeOAuthCode('same-code', 'same-binding');
    const second = exchangeOAuthCode('same-code', 'same-binding');

    expect(first).toBe(second);
    expect(mockedPost).toHaveBeenCalledOnce();

    resolveExchange({
      data: {
        data: {
          grantType: 'bearer',
          accessToken: 'access-token',
          accessTokenExpiresIn: 123,
          isNewUser: false,
        },
      },
    });
    await expect(first).resolves.toMatchObject({ accessToken: 'access-token' });
  });
});
