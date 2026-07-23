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

export const RecordCard = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.colors.gray200};
  background-color: ${theme.colors.white};
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
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
  min-width: 0;
`;

export const FoodNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const FoodName = styled.span`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.semibold};
`;

export const FoodNameInput = styled.input`
  flex: 1;
  padding: 4px 8px;
  border: 1px solid ${theme.colors.gray300};
  border-radius: ${theme.radius.sm};
  font-size: ${theme.fontSizes.sm};
`;

export const RestaurantName = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray600};
`;

export const CompanionTag = styled.span`
  align-self: flex-start;
  padding: 3px 8px;
  border-radius: ${theme.radius.full};
  background-color: ${theme.colors.gray100};
  color: ${theme.colors.gray600};
  font-size: ${theme.fontSizes.xs};
`;

export const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
`;

export const ToggleLabel = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray600};
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 4px;
`;

export const EditButton = styled.button`
  padding: 4px 10px;
  border: none;
  background: none;
  color: ${theme.colors.gray600};
  font-size: ${theme.fontSizes.xs};
  cursor: pointer;
`;

export const DeleteButton = styled.button`
  padding: 4px 10px;
  border: none;
  background: none;
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.xs};
  cursor: pointer;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 0;
  text-align: center;
  color: ${theme.colors.gray500};
  font-size: ${theme.fontSizes.xs};
`;

export const AddRecordButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: ${theme.radius.full};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;
`;
