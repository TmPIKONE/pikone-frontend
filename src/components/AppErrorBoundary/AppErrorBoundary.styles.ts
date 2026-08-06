import styled from '@emotion/styled';
import { formPrimitives } from '~/styles/formPrimitives';
import { theme } from '~/styles/theme';

export const Container = styled.main`
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px ${theme.app.pagePadding};
  background: ${theme.colors.surfaceSubtle};
  text-align: center;
`;

export const Badge = styled.span`
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.accentLight};
  color: ${theme.colors.accent};
  font-size: 22px;
  font-weight: ${theme.fontWeights.bold};
`;

export const Title = styled.h1`
  margin-top: 4px;
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.bold};
`;

export const Description = styled.p`
  max-width: 320px;
  color: ${theme.colors.textMuted};
  font-size: ${theme.fontSizes.sm};
  line-height: 1.55;
`;

export const ButtonRow = styled.div`
  width: min(100%, 320px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
`;

export const RetryButton = styled.button`
  ${formPrimitives.primaryAction}
`;

export const HomeButton = styled.button`
  ${formPrimitives.secondaryAction}
`;
