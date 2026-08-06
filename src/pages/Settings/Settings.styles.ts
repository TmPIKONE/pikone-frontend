import styled from '@emotion/styled';
import { formPrimitives } from '~/styles/formPrimitives';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  min-height: 100dvh;
  padding: calc(env(safe-area-inset-top, 0px) + 22px) ${theme.app.pagePadding} 40px;
  display: flex;
  flex-direction: column;
  gap: 0;
  background: ${theme.colors.white};
`;

export const HeaderRow = styled.div`
  min-height: 48px;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
`;

export const Title = styled.h1`
  text-align: center;
  font-size: 22px;
  font-weight: 900;
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


export const Section = styled.section`
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 26px 0;
    border-bottom: 2px solid ${theme.colors.gray100};
    background: ${theme.colors.white};
`;

export const SectionTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 900;
`;

export const AddButton = styled.button`
    min-height: 38px;
    padding: 0 18px;
    border: none;
    border-radius: ${theme.radius.full};
    background-color: ${theme.colors.black};
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
  border-radius: 22px;
  background-color: ${theme.colors.surfaceSubtle};
`;

export const Field = styled.div`
  ${formPrimitives.field}
`;

export const Label = styled.label`
  ${formPrimitives.label}
`;

export const Input = styled.input`
  ${formPrimitives.control}
`;

export const LocationButtonRow = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 8px;
`;

export const UseLocationButton = styled.button`
  min-height: 42px;
  padding: 0 13px;
  border: 0;
  border-radius: ${theme.radius.full};
  background-color: ${theme.colors.gray100};
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
  ${formPrimitives.secondaryAction}
  flex: 1;
`;

export const SubmitButton = styled.button`
  ${formPrimitives.primaryAction}
  flex: 2;
`;

export const AccountHint = styled.p`
  margin: -2px 0 2px;
  color: ${theme.colors.gray500};
  font-size: ${theme.fontSizes.xs};
  line-height: 1.5;
  word-break: keep-all;
`;

export const AccountButton = styled.button`
  ${formPrimitives.secondaryAction}
  min-height: 48px;
  text-align: left;
`;

export const DangerButton = styled.button`
  ${formPrimitives.dangerAction}
  min-height: 48px;
  text-align: left;
`;

export const SessionSection = styled.div`
  margin-top: 24px;
`;