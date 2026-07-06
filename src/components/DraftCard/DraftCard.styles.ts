import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Card = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.radius.md};
  background-color: ${theme.colors.white};
  text-align: left;
  cursor: pointer;
`;

export const Thumbnail = styled.img`
  width: 64px;
  height: 64px;
  border-radius: ${theme.radius.sm};
  object-fit: cover;
  background-color: ${theme.colors.gray200};
  flex-shrink: 0;
`;

export const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const FoodName = styled.span`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.semibold};
`;

export const SharedText = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.primaryDark};
`;

export const CapturedAt = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray500};
`;

export const WarningBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
  padding: 3px 8px;
  border-radius: ${theme.radius.full};
  background-color: #fef3c7;
  color: #b45309;
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  width: fit-content;
`;

export const ChevronWrapper = styled.span`
  color: ${theme.colors.gray400};
  flex-shrink: 0;
`;
