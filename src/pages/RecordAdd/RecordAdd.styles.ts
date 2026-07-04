import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  padding: 20px 16px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const BackButton = styled.button`
  border: none;
  background: none;
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.gray600};
  cursor: pointer;
  padding: 4px 8px;
`;

export const ProgressTrack = styled.div`
  flex: 1;
  height: 4px;
  border-radius: ${theme.radius.full};
  background-color: ${theme.colors.gray200};
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ $step: number }>`
  height: 100%;
  border-radius: ${theme.radius.full};
  background-color: ${theme.colors.primary};
  width: ${({ $step }) => `${($step / 3) * 100}%`};
  transition: width 0.2s ease;
`;
