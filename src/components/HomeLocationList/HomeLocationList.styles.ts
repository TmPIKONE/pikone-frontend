import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.radius.md};
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const Label = styled.span`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.medium};
`;

export const TypeTag = styled.span`
  padding: 2px 8px;
  border-radius: ${theme.radius.full};
  background-color: ${theme.colors.gray100};
  color: ${theme.colors.gray600};
  font-size: ${theme.fontSizes.xs};
`;

export const RadiusText = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray500};
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 4px;
`;

export const EditButton = styled.button`
  padding: 6px 10px;
  border: none;
  background: none;
  color: ${theme.colors.gray600};
  font-size: ${theme.fontSizes.xs};
  cursor: pointer;
`;

export const DeleteButton = styled.button`
  padding: 6px 10px;
  border: none;
  background: none;
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.xs};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const EmptyText = styled.p`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray500};
`;
