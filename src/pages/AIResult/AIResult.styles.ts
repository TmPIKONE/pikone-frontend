import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

// NOTE: theme.ts에 아래 토큰이 없다면 실제 값으로 바꿔주세요.
// gray50, gray900 / primary 계열 색상 등

export const Container = styled.div`
  padding: 20px 16px 40px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: ${theme.colors.gray700};
  cursor: pointer;
  padding: 0;
`;

export const Title = styled.h1`
  font-size: 18px;
  font-weight: ${theme.fontWeights.bold};
`;

export const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const ResultCard = styled.div<{ $isTopPick?: boolean }>`
  position: relative;
  padding: 18px 16px 16px;
  border-radius: 16px;
  border: 1px solid
    ${({ $isTopPick }) => ($isTopPick ? theme.colors.primary : theme.colors.gray200)};
  background-color: ${theme.colors.white};
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: ${({ $isTopPick }) =>
    $isTopPick ? `0 4px 14px rgba(59, 92, 255, 0.12)` : `0 1px 3px rgba(0, 0, 0, 0.05)`};
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:active {
    transform: scale(0.99);
  }
`;

export const TopPickRibbon = styled.span`
  position: absolute;
  top: -10px;
  left: 14px;
  padding: 3px 10px;
  border-radius: ${theme.radius.full};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-size: 11px;
  font-weight: ${theme.fontWeights.bold};
  display: flex;
  align-items: center;
  gap: 3px;
`;

export const NameRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

export const PlaceName = styled.span`
  font-size: 17px;
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.gray900};
  line-height: 1.3;
`;

export const DistanceTag = styled.span`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray500};
  white-space: nowrap;
  padding-top: 2px;
`;

export const MetaRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

export const TypeBadge = styled.span<{ $variant: 'taste' | 'new' | 'default' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 9px;
  border-radius: ${theme.radius.full};
  font-size: 11px;
  font-weight: ${theme.fontWeights.semibold};

  ${({ $variant }) => {
    if ($variant === 'taste') {
      return `
        background-color: #F0EBFF;
        color: #6D4FE0;
      `;
    }
    if ($variant === 'new') {
      return `
        background-color: #E6F7EE;
        color: #1FA971;
      `;
    }
    return `
      background-color: ${theme.colors.gray100};
      color: ${theme.colors.gray600};
    `;
  }}
`;

export const MetaTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 9px;
  border-radius: ${theme.radius.full};
  background-color: ${theme.colors.gray100};
  color: ${theme.colors.gray600};
  font-size: 11px;
`;

export const ReasonBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 4px;
  padding: 10px 12px;
  border-radius: 10px;
  background-color: ${theme.colors.gray50};
`;

export const ReasonIcon = styled.span`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding-top: 1px;
  color: ${theme.colors.primary};
`;

export const RecommendReason = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray700};
  line-height: 1.5;
`;

export const RetryButton = styled.button`
  margin-top: 8px;
  padding: 14px 0;
  border: 1px solid ${theme.colors.gray300};
  border-radius: ${theme.radius.md};
  background-color: ${theme.colors.white};
  color: ${theme.colors.gray700};
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.medium};
  cursor: pointer;

  &:active {
    background-color: ${theme.colors.gray50};
  }
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
