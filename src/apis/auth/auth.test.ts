import { beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import { BASE_URL } from '~/constants/endPoint';
import { exchangeOAuthCode } from './auth';

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
      `${BASE_URL}/oauth2/exchange`,
      { code: 'one-time-code', binding: 'browser-binding' },
      { withCredentials: true },
    );
    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
  });
});
