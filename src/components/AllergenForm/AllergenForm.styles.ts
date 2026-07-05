import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ChipGrid = styled.div`
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
  cursor: pointer;
`;

export const SaveButton = styled.button`
  align-self: flex-start;
  margin-top: 4px;
  padding: 8px 16px;
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

export const LoadingText = styled.p`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray500};
`;
