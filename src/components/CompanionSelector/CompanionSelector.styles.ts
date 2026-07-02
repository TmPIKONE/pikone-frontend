import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.gray600};
`;

export const OptionList = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const OptionChip = styled.button<{ $active: boolean }>`
  flex: 0 0 auto;
  padding: 8px 14px;
  border-radius: ${theme.radius.full};
  border: 1px solid ${({ $active }) => ($active ? theme.colors.primary : theme.colors.gray300)};
  background-color: ${({ $active }) => ($active ? theme.colors.primaryLight : theme.colors.white)};
  color: ${({ $active }) => ($active ? theme.colors.primaryDark : theme.colors.gray700)};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${({ $active }) =>
    $active ? theme.fontWeights.semibold : theme.fontWeights.regular};
  cursor: pointer;
  white-space: nowrap;
`;

export const EmptyHint = styled.p`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray500};
`;
