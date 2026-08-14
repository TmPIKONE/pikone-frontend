import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Page = styled.main`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: ${theme.colors.surfaceSubtle};
`;

export const StatusCard = styled.section`
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

export const Spinner = styled.span`
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

export const Title = styled.h1`
  color: ${theme.colors.text};
  font-size: 20px;
  font-weight: ${theme.fontWeights.bold};
  line-height: 1.35;
  word-break: keep-all;
`;

export const Description = styled.p`
  color: ${theme.colors.textMuted};
  font-size: 14px;
  line-height: 1.55;
  word-break: keep-all;
`;

export const RetryButton = styled.button`
  width: 100%;
  min-height: 48px;
  margin-top: 8px;
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-weight: ${theme.fontWeights.bold};
`;
