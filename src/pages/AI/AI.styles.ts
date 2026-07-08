import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  padding: 20px 16px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: ${theme.fontWeights.bold};
  line-height: 1.4;
`;

export const Description = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray600};
  margin-top: -12px;
`;

export const ProgressBarTrack = styled.div`
  width: 100%;
  height: 6px;
  border-radius: ${theme.radius.full};
  background-color: ${theme.colors.gray200};
  overflow: hidden;
`;

export const ProgressBarFill = styled.div<{ $percent: number }>`
  height: 100%;
  border-radius: ${theme.radius.full};
  background-color: ${theme.colors.primary};
  width: ${({ $percent }) => $percent}%;
  transition: width 0.2s ease;
`;

export const ProgressLabel = styled.span`
  align-self: flex-end;
  margin-top: -12px;
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.primary};
`;

export const LocationWarning = styled.div`
  padding: 10px 12px;
  border-radius: ${theme.radius.md};
  background-color: #fef3c7;
  color: #b45309;
  font-size: ${theme.fontSizes.xs};
`;

export const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.gray600};
`;

export const ChipRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Chip = styled.button<{ $selected: boolean }>`
  padding: 8px 14px;
  border-radius: ${theme.radius.full};
  border: 1px solid ${({ $selected }) => ($selected ? theme.colors.primary : theme.colors.gray300)};
  background-color: ${({ $selected }) =>
    $selected ? theme.colors.primaryLight : theme.colors.white};
  color: ${({ $selected }) => ($selected ? theme.colors.primaryDark : theme.colors.gray700)};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${({ $selected }) =>
    $selected ? theme.fontWeights.semibold : theme.fontWeights.regular};
  cursor: pointer;
`;

export const ConfirmButton = styled.button`
  align-self: flex-start;
  padding: 10px 16px;
  border: none;
  border-radius: ${theme.radius.md};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;

  &:disabled {
    background-color: ${theme.colors.gray300};
    cursor: not-allowed;
  }
`;

export const SubmitButton = styled.button`
  margin-top: 8px;
  padding: 14px 0;
  border: none;
  border-radius: ${theme.radius.md};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;

  &:disabled {
    background-color: ${theme.colors.gray300};
    cursor: not-allowed;
  }
`;

export const ErrorText = styled.p`
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.xs};
`;
