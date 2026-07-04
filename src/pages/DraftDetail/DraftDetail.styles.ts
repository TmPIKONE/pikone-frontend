import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  padding: 20px 16px 40px;
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

export const Title = styled.h1`
  font-size: 18px;
  font-weight: ${theme.fontWeights.semibold};
`;

export const Image = styled.img`
  width: 100%;
  aspect-ratio: 1;
  border-radius: ${theme.radius.md};
  object-fit: cover;
  background-color: ${theme.colors.gray200};
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

export const GpsWarning = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: ${theme.radius.md};
  background-color: #fef3c7;
  color: #b45309;
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

export const SaveLocationButton = styled.button`
  align-self: flex-start;
  padding: 6px 12px;
  border: 1px solid ${theme.colors.gray300};
  border-radius: ${theme.radius.sm};
  background-color: ${theme.colors.white};
  color: ${theme.colors.gray700};
  font-size: ${theme.fontSizes.xs};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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

export const RejectButton = styled.button`
  flex: 1;
  padding: 14px 0;
  border: 1px solid ${theme.colors.error};
  border-radius: ${theme.radius.md};
  background-color: ${theme.colors.white};
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ApproveButton = styled.button`
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

export const EmptyState = styled.div`
  padding: 60px 0;
  text-align: center;
  color: ${theme.colors.gray500};
  font-size: ${theme.fontSizes.sm};
`;
