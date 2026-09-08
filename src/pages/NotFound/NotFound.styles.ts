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
  gap: 10px;
  padding: 32px ${theme.app.pagePadding};
  background: ${theme.colors.surfaceSubtle};
  text-align: center;
`;

export const Code = styled.span`
  color: ${theme.colors.primary};
  font-size: 40px;
  font-weight: ${theme.fontWeights.bold};
  letter-spacing: -0.04em;
`;

export const Title = styled.h1`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.bold};
`;

export const Description = styled.p`
  color: ${theme.colors.textMuted};
  font-size: ${theme.fontSizes.sm};
  line-height: 1.5;
`;

export const ButtonRow = styled.div`
  width: min(100%, 320px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
`;

export const BackButton = styled.button`
  ${formPrimitives.secondaryAction}
`;

export const HomeButton = styled.button`
  ${formPrimitives.primaryAction}
`;
