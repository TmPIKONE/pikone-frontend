import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Shell = styled.nav`
  position: sticky;
  top: 0;
  z-index: 40;
  padding: calc(env(safe-area-inset-top, 0px) + 26px) ${theme.app.pagePadding} 18px;
  background: rgba(247, 248, 250, 0.97);
  backdrop-filter: blur(14px);
  outline: none;
  touch-action: pan-y;
`;

export const HeaderRow = styled.div`
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const ModuleTabs = styled.div`
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 15px;

  @media (max-width: 370px) {
    gap: 10px;
  }
`;

export const ActiveModule = styled.h1`
  color: ${theme.colors.black};
  font-size: 27px;
  font-weight: 950;
  letter-spacing: -0.055em;
`;

export const ModuleButton = styled.button`
  color: ${theme.colors.gray300};
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -0.05em;

  @media (max-width: 370px) {
    font-size: 19px;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

export const IconButton = styled.button`
  position: relative;
  width: 38px;
  height: 42px;
  display: grid;
  place-items: center;
  color: ${theme.colors.gray400};

  &:first-of-type {
    color: #6aaec0;
  }

  @media (max-width: 370px) {
    width: 34px;
  }
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: 0;
  right: -3px;
  min-width: 19px;
  height: 19px;
  display: grid;
  place-items: center;
  padding: 0 4px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.accent};
  color: ${theme.colors.white};
  font-size: 9px;
  font-weight: 900;
`;

export const DateRail = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  margin: 28px -4px 0;
`;

export const SideDate = styled.button`
  overflow: hidden;
  color: ${theme.colors.gray200};
  font-size: 17px;
  font-weight: 850;
  letter-spacing: -0.04em;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:first-of-type {
    text-align: left;
  }

  &:last-of-type {
    text-align: right;
  }
`;

export const CurrentDate = styled.button`
  min-height: 46px;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  strong {
    color: ${theme.colors.black};
    font-size: 21px;
    font-weight: 950;
    letter-spacing: -0.045em;
  }

  span {
    min-height: 36px;
    display: inline-flex;
    align-items: center;
    padding: 0 13px;
    border-radius: ${theme.radius.full};
    background: ${theme.colors.black};
    color: ${theme.colors.white};
    font-size: 13px;
    font-weight: 850;
  }
`;
