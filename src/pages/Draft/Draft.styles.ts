import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  padding: 20px 16px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
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

export const CountBadge = styled.span`
  padding: 2px 8px;
  border-radius: ${theme.radius.full};
  background-color: ${theme.colors.primaryLight};
  color: ${theme.colors.primaryDark};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
`;

export const DraftList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const EmptyState = styled.div`
  padding: 60px 0;
  text-align: center;
  color: ${theme.colors.gray500};
  font-size: ${theme.fontSizes.sm};
`;
