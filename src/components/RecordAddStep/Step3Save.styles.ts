import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SummaryCard = styled.div`
  padding: 14px;
  border-radius: ${theme.radius.md};
  background-color: ${theme.colors.gray100};
`;

export const SummaryFood = styled.p`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.semibold};
`;

export const SummaryRestaurant = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray600};
  margin-top: 2px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.gray600};
`;

export const Input = styled.input`
  padding: 12px 14px;
  border: 1px solid ${theme.colors.gray300};
  border-radius: ${theme.radius.md};
  font-size: ${theme.fontSizes.md};
`;

export const Select = styled.select`
  padding: 12px 14px;
  border: 1px solid ${theme.colors.gray300};
  border-radius: ${theme.radius.md};
  font-size: ${theme.fontSizes.md};
  background-color: ${theme.colors.white};
`;

export const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
`;

export const ToggleLabel = styled.span`
  font-size: ${theme.fontSizes.sm};
`;

export const Switch = styled.button<{ $on: boolean }>`
  width: 44px;
  height: 26px;
  border-radius: ${theme.radius.full};
  border: none;
  background-color: ${({ $on }) => ($on ? theme.colors.primary : theme.colors.gray300)};
  position: relative;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ $on }) => ($on ? '21px' : '3px')};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${theme.colors.white};
    transition: left 0.15s ease;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

export const BackButton = styled.button`
  flex: 1;
  padding: 14px 0;
  border: 1px solid ${theme.colors.gray300};
  border-radius: ${theme.radius.md};
  background-color: ${theme.colors.white};
  color: ${theme.colors.gray700};
  font-size: ${theme.fontSizes.md};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SaveButton = styled.button`
  flex: 2;
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
