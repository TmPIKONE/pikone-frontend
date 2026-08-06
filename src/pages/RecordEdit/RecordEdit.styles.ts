import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  min-height: 100dvh;
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 96px);
  background: ${theme.colors.white};
`;

export const HeaderRow = styled.header`
  position: sticky;
  top: 0;
  z-index: 40;
  min-height: calc(env(safe-area-inset-top, 0px) + 66px);
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 44px;
  align-items: center;
  padding: calc(env(safe-area-inset-top, 0px) + 8px) ${theme.app.pagePadding} 8px;
  border-bottom: 1px solid rgba(233, 235, 239, 0.8);
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
`;

export const BackButton = styled.button`
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  margin-left: -10px;
  color: ${theme.colors.black};
`;

export const PageTitle = styled.h1`
  color: ${theme.colors.black};
  font-size: 17px;
  font-weight: 850;
  text-align: center;
`;

export const HeaderSpacer = styled.span`
  width: 44px;
  height: 44px;
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px ${theme.app.pagePadding} 26px;
`;

export const PhotoSection = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  background: ${theme.colors.gray100};
`;

export const Photo = styled.img`
  width: 100%;
  aspect-ratio: 4 / 3;
  display: block;
  object-fit: cover;
`;

export const PhotoChangeButton = styled.label`
  position: absolute;
  right: 12px;
  bottom: 12px;
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  border-radius: ${theme.radius.full};
  background: rgba(17, 19, 24, 0.8);
  color: ${theme.colors.white};
  font-size: 10px;
  font-weight: 800;
  cursor: pointer;

  input {
    display: none;
  }
`;

export const ErrorText = styled.p`
  margin-top: -14px;
  color: ${theme.colors.error};
  font-size: 10px;
  font-weight: 700;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

export const Label = styled.label`
  color: ${theme.colors.black};
  font-size: 12px;
  font-weight: 850;
`;

export const Input = styled.input`
  width: 100%;
  min-height: 56px;
  padding: 0 16px;
  border-radius: 18px;
  background: ${theme.colors.gray100};
  color: ${theme.colors.black};
  font-size: 15px;
  font-weight: 750;
`;

export const DateButton = styled.button`
  min-height: 56px;
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) 20px;
  align-items: center;
  gap: 9px;
  padding: 0 15px;
  border-radius: 18px;
  background: ${theme.colors.gray100};
  color: ${theme.colors.black};
  font-size: 13px;
  font-weight: 750;
  text-align: left;
`;

export const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 7px;
`;

export const TypeButton = styled.button<{ $active: boolean }>`
  min-height: 46px;
  border: 1px solid ${({ $active }) => ($active ? theme.colors.black : theme.colors.gray200)};
  border-radius: 14px;
  background: ${({ $active }) => ($active ? theme.colors.black : theme.colors.white)};
  color: ${({ $active }) => ($active ? theme.colors.white : theme.colors.gray700)};
  font-size: 11px;
  font-weight: 800;
`;

export const ToggleGroup = styled.div`
  overflow: hidden;
  padding: 0 15px;
  border-radius: 20px;
  background: ${theme.colors.gray100};
`;

export const ToggleRow = styled.div`
  min-height: 62px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${theme.colors.white};

  &:last-child {
    border-bottom: 0;
  }

  > span {
    color: ${theme.colors.black};
    font-size: 12px;
    font-weight: 750;
  }
`;

export const BottomAction = styled.div`
  position: fixed;
  right: max(0px, calc((100vw - ${theme.app.maxWidth}) / 2));
  bottom: 0;
  left: max(0px, calc((100vw - ${theme.app.maxWidth}) / 2));
  z-index: 45;
  padding: 12px ${theme.app.pagePadding} calc(env(safe-area-inset-bottom, 0px) + 14px);
  border-top: 1px solid rgba(233, 235, 239, 0.85);
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
`;

export const SaveButton = styled.button`
  width: 100%;
  min-height: 54px;
  border-radius: 18px;
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 13px;
  font-weight: 850;

  &:disabled {
    background: ${theme.colors.gray200};
    color: ${theme.colors.gray400};
  }
`;

export const State = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 32px;
  color: ${theme.colors.gray500};
  font-size: 12px;
  text-align: center;

  strong {
    color: ${theme.colors.black};
    font-size: 18px;
    font-weight: 850;
  }
`;

export const StateButton = styled.button`
  min-height: 48px;
  margin-top: 8px;
  padding: 0 18px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 12px;
  font-weight: 800;
`;
