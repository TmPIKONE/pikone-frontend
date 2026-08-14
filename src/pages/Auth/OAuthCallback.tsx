import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { exchangeOAuthCode } from '~/apis/auth/auth.api';
import { clearAuthTokens, writeAuthTokens } from '~/utils/authTokens';
import * as S from './OAuthCallback.styles';

type ProcessingState = 'loading' | 'error';

export default function OAuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const code = new URLSearchParams(location.search).get('code');
  const binding = new URLSearchParams(location.hash.replace(/^#/, '')).get('binding');
  const [state, setState] = useState<ProcessingState>(code ? 'loading' : 'error');

  useEffect(() => {
    let active = true;
    window.history.replaceState(window.history.state, '', location.pathname);

    if (!code) {
      clearAuthTokens();
      return () => {
        active = false;
      };
    }

    exchangeOAuthCode(code, binding ?? undefined)
      .then(({ accessToken, refreshToken }) => {
        if (!active) return;
        writeAuthTokens({ accessToken, refreshToken });
        navigate('/home', { replace: true });
      })
      .catch(() => {
        if (!active) return;
        clearAuthTokens();
        setState('error');
      });

    return () => {
      active = false;
    };
  }, [binding, code, location.pathname, navigate]);

  if (state === 'error') {
    return (
      <S.Page>
        <S.StatusCard role="alert">
          <S.Title>로그인을 완료하지 못했어요</S.Title>
          <S.Description>인증 시간이 지났거나 연결이 끊겼어요. 다시 로그인해 주세요.</S.Description>
          <S.RetryButton type="button" onClick={() => navigate('/login', { replace: true })}>
            다시 로그인하기
          </S.RetryButton>
        </S.StatusCard>
      </S.Page>
    );
  }

  return (
    <S.Page>
      <S.StatusCard role="status" aria-live="polite">
        <S.Spinner aria-hidden="true" />
        <S.Title>안전하게 로그인하고 있어요</S.Title>
        <S.Description>잠시만 기다려 주세요.</S.Description>
      </S.StatusCard>
    </S.Page>
  );
}
