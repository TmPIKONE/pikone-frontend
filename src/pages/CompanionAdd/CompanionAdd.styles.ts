import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  min-height: 100dvh;
  padding: calc(env(safe-area-inset-top, 0px) + 12px) ${theme.app.pagePadding} 130px;
  background: ${theme.colors.white};
`;

export const TopBar = styled.div`
  min-height: 46px;
  display: flex;
  align-items: center;
`;

export const BackButton = styled.button`
  width: 42px;
  height: 42px;
  margin-left: -4px;
  display: grid;
  place-items: center;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray100};
  color: ${theme.colors.black};

  &:active {
    transform: scale(0.96);
  }
`;

export const PageHeader = styled.header`
  margin-top: 24px;
`;

export const Eyebrow = styled.span`
  display: block;
  margin-bottom: 6px;
  color: ${theme.colors.gray400};
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.1em;
`;

export const PageTitle = styled.h1`
  color: ${theme.colors.black};
  font-size: 30px;
  font-weight: 950;
  letter-spacing: -0.06em;
`;

export const PageDescription = styled.p`
  max-width: 360px;
  margin-top: 12px;
  color: ${theme.colors.gray500};
  font-size: 12px;
  font-weight: 650;
  line-height: 1.65;
`;

export const MethodTabs = styled.div`
  display: flex;
  gap: 8px;
  margin: 34px calc(${theme.app.pagePadding} * -1) 0;
  padding: 0 ${theme.app.pagePadding};
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const MethodButton = styled.button<{ $active: boolean }>`
  min-height: 47px;
  flex: 1 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 17px;
  border-radius: ${theme.radius.full};
  background: ${({ $active }) => ($active ? theme.colors.black : theme.colors.gray100)};
  color: ${({ $active }) => ($active ? theme.colors.white : theme.colors.black)};
  font-size: 12px;
  font-weight: 850;

  i {
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #55d887;
  }

  i.local {
    background: ${theme.colors.peach};
  }
`;

export const Form = styled.form`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const MethodIntro = styled.div`
  min-height: 88px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 17px;
  border-radius: ${theme.radius.xl};
  background: ${theme.colors.gray100};

  > div:last-of-type {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  strong {
    color: ${theme.colors.black};
    font-size: 14px;
    font-weight: 900;
    letter-spacing: -0.03em;
  }

  span {
    color: ${theme.colors.gray500};
    font-size: 10px;
    font-weight: 650;
    line-height: 1.5;
  }
`;

export const MethodIcon = styled.span`
  flex: 0 0 auto;
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.white};
  color: ${theme.colors.black};
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const LabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const Label = styled.label`
  color: ${theme.colors.black};
  font-size: 13px;
  font-weight: 900;
  letter-spacing: -0.025em;
`;

export const InputCount = styled.span<{ $complete: boolean }>`
  color: ${({ $complete }) => ($complete ? theme.colors.black : theme.colors.gray400)};
  font-size: 10px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
`;

const inputStyle = `
  width: 100%;
  min-height: 60px;
  padding: 0 18px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.gray50};
  color: ${theme.colors.black};
  font-size: 15px;
  font-weight: 750;
  transition:
    border-color ${theme.motion.fast} ${theme.motion.easing},
    background ${theme.motion.fast} ${theme.motion.easing};

  &::placeholder {
    color: ${theme.colors.gray400};
  }

  &:focus {
    border-color: ${theme.colors.black};
    background: ${theme.colors.white};
  }
`;

export const Input = styled.input`
  ${inputStyle}
`;

export const CodeInput = styled.input`
  ${inputStyle}
  height: 74px;
  padding-left: calc(18px + 0.16em);
  font-size: 25px;
  font-weight: 950;
  letter-spacing: 0.16em;
  text-align: center;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
`;

export const FieldHint = styled.p`
  color: ${theme.colors.gray500};
  font-size: 10px;
  font-weight: 650;
  line-height: 1.55;
`;

export const RelationshipGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
`;

export const RelationshipButton = styled.button<{ $active: boolean }>`
  min-width: 0;
  min-height: 68px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid ${({ $active }) => ($active ? theme.colors.black : theme.colors.gray200)};
  border-radius: ${theme.radius.lg};
  background: ${({ $active }) => ($active ? theme.colors.black : theme.colors.white)};
  color: ${({ $active }) => ($active ? theme.colors.white : theme.colors.gray500)};
  text-align: left;

  i {
    flex: 0 0 auto;
    width: 13px;
    height: 13px;
    border: 3px solid ${({ $active }) => ($active ? theme.colors.white : 'transparent')};
    border-radius: ${theme.radius.full};
  }

  span {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
    overflow: hidden;
    font-size: 9px;
    font-weight: 650;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    color: inherit;
    font-size: 12px;
    font-weight: 900;
  }
`;

export const ErrorText = styled.p`
  padding: 13px 15px;
  border-radius: ${theme.radius.lg};
  background: #fff2f2;
  color: ${theme.colors.error};
  font-size: 11px;
  font-weight: 750;
  line-height: 1.5;
`;

export const BottomAction = styled.div`
  position: fixed;
  left: 50%;
  bottom: 0;
  z-index: 60;
  width: min(100%, ${theme.app.maxWidth});
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.94);
  transform: translateX(-50%);
`;

export const SubmitButton = styled.button`
  width: 100%;
  min-height: 62px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 14px;
  font-weight: 900;

  &:disabled {
    background: ${theme.colors.gray200};
    color: ${theme.colors.gray400};
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.99);
  }
`;
