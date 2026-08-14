import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Wrapper = styled.div<{ $fullScreen: boolean }>`
  min-height: ${({ $fullScreen }) => ($fullScreen ? '100dvh' : '160px')};
  display: grid;
  place-items: center;
  padding: 32px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: ${theme.colors.textMuted};
  font-size: ${theme.fontSizes.sm};
`;

export const Indicator = styled.span`
  width: 28px;
  height: 28px;
  border: 3px solid ${theme.colors.primaryLight};
  border-top-color: ${theme.colors.primary};
  border-radius: 50%;
  animation: loading-spin 0.75s linear infinite;

  @keyframes loading-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
