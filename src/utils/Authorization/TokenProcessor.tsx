import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { exchangeOAuthCode } from '~/apis/auth/auth';
import { useAuth } from '~/contexts/Auth/useAuth';
import { theme } from '~/styles/theme';
import { clearAuthTokens, writeAuthTokens } from '~/utils/authTokens';

type ProcessingState = 'loading' | 'error';

export default function TokenProcessor() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const code = new URLSearchParams(location.search).get('code');
  const binding = new URLSearchParams(location.hash.replace(/^#/, '')).get('binding');
  const [state, setState] = useState<ProcessingState>(code ? 'loading' : 'error');

  useEffect(() => {
    let active = true;
    // 일회용 코드도 브라우저 기록·리퍼러·오류 수집에 남기지 않는다.
    window.history.replaceState(window.history.state, '', location.pathname);

    if (!code) {
      clearAuthTokens();
      setIsAuthenticated(false);
      return () => {
        active = false;
      };
    }

    exchangeOAuthCode(code, binding ?? undefined)
      .then(({ accessToken, refreshToken }) => {
        if (!active) return;
        writeAuthTokens({ accessToken, refreshToken });
        setIsAuthenticated(true);
        navigate('/home', { replace: true });
      })
      .catch(() => {
        if (!active) return;
        clearAuthTokens();
        setIsAuthenticated(false);
        setState('error');
      });

    return () => {
      active = false;
    };
  }, [binding, code, location.pathname, navigate, setIsAuthenticated]);

  if (state === 'error') {
    return (
      <Page>
        <StatusCard role="alert">
          <Title>로그인을 완료하지 못했어요</Title>
          <Description>인증 시간이 지났거나 연결이 끊겼어요. 다시 로그인해 주세요.</Description>
          <RetryButton type="button" onClick={() => navigate('/login', { replace: true })}>
            다시 로그인하기
          </RetryButton>
        </StatusCard>
      </Page>
    );
  }

  return (
    <Page>
      <StatusCard role="status" aria-live="polite">
        <Spinner aria-hidden="true" />
        <Title>안전하게 로그인하고 있어요</Title>
        <Description>잠시만 기다려 주세요.</Description>
      </StatusCard>
    </Page>
  );
}

const Page = styled.main`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: ${theme.colors.surfaceSubtle};
`;

const StatusCard = styled.section`
  width: min(100%, 360px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px 24px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.xl};
  background: ${theme.colors.white};
  text-align: center;
  box-shadow: ${theme.shadows.card};
`;

const Spinner = styled.span`
  width: 32px;
  height: 32px;
  margin-bottom: 4px;
  border: 3px solid ${theme.colors.border};
  border-top-color: ${theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    border-top-color: ${theme.colors.primary};
  }
`;

const Title = styled.h1`
  color: ${theme.colors.text};
  font-size: 20px;
  font-weight: ${theme.fontWeights.bold};
  line-height: 1.35;
  word-break: keep-all;
`;

const Description = styled.p`
  color: ${theme.colors.textMuted};
  font-size: 14px;
  line-height: 1.55;
  word-break: keep-all;
`;

const RetryButton = styled.button`
  width: 100%;
  min-height: 48px;
  margin-top: 8px;
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-weight: ${theme.fontWeights.bold};
`;
