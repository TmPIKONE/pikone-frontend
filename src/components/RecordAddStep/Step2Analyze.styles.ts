import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const StatusBox = styled.div`
  padding: 60px 0;
  text-align: center;
  color: ${theme.colors.gray500};
  font-size: ${theme.fontSizes.sm};
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

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

export const TagRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

export const Tag = styled.span`
  padding: 4px 10px;
  border-radius: ${theme.radius.full};
  background-color: ${theme.colors.gray100};
  color: ${theme.colors.gray600};
  font-size: ${theme.fontSizes.xs};
`;

export const RestaurantList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const RestaurantCard = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 14px;
  border-radius: ${theme.radius.md};
  border: 1.5px solid
    ${({ $selected }) => ($selected ? theme.colors.primary : theme.colors.gray200)};
  background-color: ${({ $selected }) =>
    $selected ? theme.colors.primaryLight : theme.colors.white};
  text-align: left;
  cursor: pointer;
`;

export const RestaurantName = styled.span`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.semibold};
`;

export const RestaurantMeta = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray500};
`;

export const EmptyRestaurantBox = styled.div`
  padding: 20px;
  border-radius: ${theme.radius.md};
  background-color: ${theme.colors.gray100};
  color: ${theme.colors.gray600};
  font-size: ${theme.fontSizes.sm};
  text-align: center;
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
`;

export const NextButton = styled.button`
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
