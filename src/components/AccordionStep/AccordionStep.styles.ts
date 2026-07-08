import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.colors.gray200};
  background-color: ${theme.colors.white};
`;

export const SummaryLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const CheckBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${theme.colors.primaryLight};
  color: ${theme.colors.primary};
  flex-shrink: 0;
`;

export const SummaryText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const SummaryLabel = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray500};
`;

export const SummaryValue = styled.span`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.gray900};
`;

export const EditButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: ${theme.colors.gray400};
  cursor: pointer;

  &:hover {
    color: ${theme.colors.gray600};
  }
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px 16px;
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.colors.primary};
  background-color: ${theme.colors.white};
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StepBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.bold};
  flex-shrink: 0;
`;

export const StepTitle = styled.h2`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.gray900};
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CardFooter = styled.div`
  display: flex;
`;
