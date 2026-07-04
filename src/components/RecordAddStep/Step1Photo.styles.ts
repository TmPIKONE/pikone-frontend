import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: ${theme.fontWeights.bold};
`;

export const Description = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray600};
  margin-top: -8px;
`;

export const NextButton = styled.button`
  margin-top: 8px;
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
