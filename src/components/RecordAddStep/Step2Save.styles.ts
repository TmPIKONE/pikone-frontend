import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const AnalysisBanner = styled.div<{ $state: 'analyzing' | 'ready' | 'error' }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: ${theme.radius.md};
  background-color: ${({ $state }) =>
    $state === 'ready' ? theme.colors.primaryLight : theme.colors.gray100};
`;

export const Spinner = styled.div`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 2px solid ${theme.colors.gray300};
  border-top-color: ${theme.colors.primary};
  animation: ${spin} 0.7s linear infinite;
`;

export const AnalysisText = styled.span`
  flex: 1;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray700};
`;

export const UseAnalysisButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: ${theme.radius.md};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
  white-space: nowrap;
  cursor: pointer;
`;

export const RetryButton = styled.button`
  padding: 8px 12px;
  border: 1px solid ${theme.colors.gray300};
  border-radius: ${theme.radius.md};
  background-color: ${theme.colors.white};
  color: ${theme.colors.gray700};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  white-space: nowrap;
  cursor: pointer;
`;

export const StatusBox = styled.div`
  padding: 20px 0;
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

/* ── 태그 ── */

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
