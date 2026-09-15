import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Shell = styled.nav`
  position: sticky;
  top: 0;
  z-index: 40;
  padding: calc(env(safe-area-inset-top, 0px) + 16px) ${theme.app.pagePadding} 2px;
  background: #fdfdfd;
  backdrop-filter: blur(14px);
`;

export const HeaderRow = styled.div`
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const ActiveModule = styled.h1`
  margin: 0;
  color: ${theme.colors.black};
  font-size: 27px;
  font-weight: 950;
  letter-spacing: -0.055em;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
`;

export const IconButton = styled.button`
  position: relative;
  width: 42px;
  height: 44px;
  display: grid;
  place-items: center;
  color: ${theme.colors.gray400};

  &:active {
    color: ${theme.colors.gray700};
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
