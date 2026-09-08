import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Shell = styled.nav`
  position: sticky;
  top: 0;
  z-index: 40;
  padding: calc(env(safe-area-inset-top, 0px) + 26px) ${theme.app.pagePadding} 10px;
  background: rgba(247, 248, 250, 0.97);
  backdrop-filter: blur(14px);
`;

export const HeaderRow = styled.div`
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const ActiveModule = styled.h1`
  color: ${theme.colors.black};
  font-size: 27px;
  font-weight: 950;
  letter-spacing: -0.055em;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

export const IconButton = styled.button`
  position: relative;
  width: 42px;
  height: 44px;
  display: grid;
  place-items: center;
  color: ${theme.colors.gray400};

  &:first-of-type {
    color: #6aaec0;
  }

  @media (max-width: 340px) {
    width: 37px;
  }
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: 0;
  right: -1px;
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
