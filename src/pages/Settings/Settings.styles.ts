import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  padding: 20px 16px 40px;
  display: flex;
  flex-direction: column;
  gap: 32px;
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

export const ProfileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ProfileAvatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: ${theme.radius.full};
  object-fit: cover;
  background-color: ${theme.colors.gray200};
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const ProfileNickname = styled.span`
  font-size: 17px;
  font-weight: ${theme.fontWeights.semibold};
`;

export const ProfileEmail = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray500};
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SectionTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: ${theme.fontWeights.semibold};
`;

export const AddButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: ${theme.radius.full};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border-radius: ${theme.radius.md};
  background-color: ${theme.colors.gray100};
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
  padding: 10px 12px;
  border: 1px solid ${theme.colors.gray300};
  border-radius: ${theme.radius.sm};
  font-size: ${theme.fontSizes.sm};
`;

export const LocationButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const UseLocationButton = styled.button`
  padding: 8px 12px;
  border: 1px solid ${theme.colors.gray300};
  border-radius: ${theme.radius.sm};
  background-color: ${theme.colors.white};
  font-size: ${theme.fontSizes.xs};
  cursor: pointer;
`;

export const LocationStatusText = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray500};
`;

export const FormButtonRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
`;

export const CancelButton = styled.button`
  flex: 1;
  padding: 10px 0;
  border: 1px solid ${theme.colors.gray300};
  border-radius: ${theme.radius.sm};
  background-color: ${theme.colors.white};
  color: ${theme.colors.gray700};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
`;

export const SubmitButton = styled.button`
  flex: 2;
  padding: 10px 0;
  border: none;
  border-radius: ${theme.radius.sm};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;

  &:disabled {
    background-color: ${theme.colors.gray300};
    cursor: not-allowed;
  }
`;

export const AccountButton = styled.button`
  padding: 12px 0 12px 14px;
  border: 1px solid ${theme.colors.gray300};
  border-radius: ${theme.radius.md};
  background-color: ${theme.colors.white};
  color: ${theme.colors.gray700};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  text-align: left;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DangerButton = styled.button`
  padding: 12px 0 12px 14px;
  border: 1px solid ${theme.colors.error};
  border-radius: ${theme.radius.md};
  background-color: ${theme.colors.white};
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  text-align: left;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
