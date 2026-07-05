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

export const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ResultCard = styled.div`
  padding: 14px;
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.colors.gray200};
  background-color: ${theme.colors.white};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const NameRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const PlaceName = styled.span`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.semibold};
`;

export const DistanceTag = styled.span`
  flex-shrink: 0;
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray500};
`;

export const MetaRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

export const MetaTag = styled.span`
  padding: 3px 8px;
  border-radius: ${theme.radius.full};
  background-color: ${theme.colors.gray100};
  color: ${theme.colors.gray600};
  font-size: ${theme.fontSizes.xs};
`;

export const RecommendReason = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray700};
  margin-top: 2px;
`;

export const RetryButton = styled.button`
  margin-top: 8px;
  padding: 14px 0;
  border: 1px solid ${theme.colors.gray300};
  border-radius: ${theme.radius.md};
  background-color: ${theme.colors.white};
  color: ${theme.colors.gray700};
  font-size: ${theme.fontSizes.md};
  cursor: pointer;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 0;
  text-align: center;
  color: ${theme.colors.gray500};
  font-size: ${theme.fontSizes.sm};
`;
