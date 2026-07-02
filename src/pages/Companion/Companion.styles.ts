import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  padding: 20px 16px 32px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: ${theme.fontWeights.bold};
`;

export const AddButton = styled.button`
  padding: 8px 14px;
  border: none;
  border-radius: ${theme.radius.full};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;
`;

export const CodeCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: ${theme.radius.md};
  background-color: ${theme.colors.gray100};
`;

export const CodeLabel = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray600};
`;

export const CodeValue = styled.span`
  display: block;
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.bold};
  letter-spacing: 2px;
`;

export const CopyButton = styled.button`
  padding: 6px 12px;
  border: 1px solid ${theme.colors.gray300};
  border-radius: ${theme.radius.sm};
  background-color: ${theme.colors.white};
  font-size: ${theme.fontSizes.xs};
  cursor: pointer;
`;

export const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: ${theme.fontWeights.semibold};
  margin-bottom: 12px;
`;

export const RequestRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid ${theme.colors.gray200};
`;

export const RequestProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const RequestAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: ${theme.radius.full};
  object-fit: cover;
  background-color: ${theme.colors.gray200};
`;

export const RequestActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const AcceptButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: ${theme.radius.sm};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;
`;

export const RejectButton = styled.button`
  padding: 6px 12px;
  border: 1px solid ${theme.colors.gray300};
  border-radius: ${theme.radius.sm};
  background-color: ${theme.colors.white};
  color: ${theme.colors.gray600};
  font-size: ${theme.fontSizes.xs};
  cursor: pointer;
`;

export const CompanionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid ${theme.colors.gray200};
`;

export const CompanionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const CompanionName = styled.span`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.medium};
`;

export const CompanionMeta = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray500};
`;

export const NameEditInput = styled.input`
  padding: 6px 10px;
  border: 1px solid ${theme.colors.gray300};
  border-radius: ${theme.radius.sm};
  font-size: ${theme.fontSizes.sm};
`;

export const RowActions = styled.div`
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
`;

export const EmptyState = styled.div`
  padding: 24px 0;
  text-align: center;
  color: ${theme.colors.gray500};
  font-size: ${theme.fontSizes.xs};
`;
