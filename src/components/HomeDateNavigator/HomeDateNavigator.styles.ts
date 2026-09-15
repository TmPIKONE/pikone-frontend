import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Shell = styled.nav`
  position: relative;
  z-index: 40;
  padding: calc(env(safe-area-inset-top, 0px) + 20px) ${theme.app.pagePadding} 8px;
  background: transparent;
`;

export const HeaderRow = styled.div`
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Brand = styled.button`
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #9ea0a6;
`;

export const BrandName = styled.h1`
  margin: 0;
  margin-left: 4px;
  color: #9ea0a6;
  font-size: clamp(28px, 8vw, 36px);
  font-weight: 900;
  letter-spacing: -0.055em;
  line-height: 1;
`;

export const HeaderActions = styled.div`
  min-height: 56px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 4px 8px;
  border: 1px solid rgba(20, 23, 29, 0.025);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 1px 1px rgba(15, 18, 24, 0.02);
`;

export const IconButton = styled.button`
  position: relative;
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: #090a0c;
  transition:
    transform ${theme.motion.fast} ${theme.motion.easing},
    background ${theme.motion.fast} ${theme.motion.easing};

  &:active {
    background: #f1f1f3;
    transform: scale(0.95);
  }
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: 5px;
  right: 4px;
  min-width: 17px;
  height: 17px;
  display: grid;
  place-items: center;
  padding: 0 4px;
  border: 2px solid #fff;
  border-radius: ${theme.radius.full};
  background: #4b9df5;
  color: ${theme.colors.white};
  font-size: 8px;
  font-weight: 900;
  line-height: 1;
`;
