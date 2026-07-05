import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  padding: 20px 16px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: ${theme.fontWeights.bold};
`;

export const Description = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray600};
  margin-top: -12px;
`;

export const LocationWarning = styled.div`
  padding: 10px 12px;
  border-radius: ${theme.radius.md};
  background-color: #fef3c7;
  color: #b45309;
  font-size: ${theme.fontSizes.xs};
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
