import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  padding: 20px 16px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
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

export const DateTitle = styled.h1`
  font-size: 18px;
  font-weight: ${theme.fontWeights.semibold};
`;

export const RecordList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const RecordCard = styled.div<{ $highlighted?: boolean }>`
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: ${theme.radius.md};
  border: 1px solid
    ${({ $highlighted }) => ($highlighted ? theme.colors.primary : theme.colors.gray200)};
  background-color: ${({ $highlighted }) =>
    $highlighted ? theme.colors.primaryLight : theme.colors.white};
`;

export const RecordImage = styled.img`
  width: 88px;
  height: 88px;
  border-radius: ${theme.radius.sm};
  object-fit: cover;
  background-color: ${theme.colors.gray200};
  flex-shrink: 0;
`;

export const RecordInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
`;

export const FoodName = styled.span`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.semibold};
`;

export const RestaurantName = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray600};
`;

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
`;

export const MetaTag = styled.span`
  padding: 3px 8px;
  border-radius: ${theme.radius.full};
  background-color: ${theme.colors.gray100};
  color: ${theme.colors.gray600};
  font-size: ${theme.fontSizes.xs};
`;

export const EmptyState = styled.div`
  padding: 40px 0;
  text-align: center;
  color: ${theme.colors.gray500};
  font-size: ${theme.fontSizes.xs};
`;
