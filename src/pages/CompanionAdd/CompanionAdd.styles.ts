import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  padding: 20px 16px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: ${theme.fontWeights.bold};
`;

export const TabRow = styled.div`
  display: flex;
  border-radius: ${theme.radius.md};
  background-color: ${theme.colors.gray100};
  padding: 4px;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px 0;
  border: none;
  border-radius: ${theme.radius.sm};
  background-color: ${({ $active }) => ($active ? theme.colors.white : 'transparent')};
  color: ${({ $active }) => ($active ? theme.colors.black : theme.colors.gray500)};
  font-weight: ${({ $active }) =>
    $active ? theme.fontWeights.semibold : theme.fontWeights.regular};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
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

export const Select = styled.select`
  padding: 12px 14px;
  border: 1px solid ${theme.colors.gray300};
  border-radius: ${theme.radius.md};
  font-size: ${theme.fontSizes.md};
  background-color: ${theme.colors.white};
`;

export const SubmitButton = styled.button`
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

export const ErrorText = styled.p`
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.xs};
`;
