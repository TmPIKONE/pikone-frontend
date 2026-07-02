import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: ${theme.app.maxWidth};
  height: ${theme.nav.height};
  background: ${theme.colors.white};
  border-top: 1px solid ${theme.colors.gray200};
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
`;

export const NavItem = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px 20px;
  color: ${({ $active }) => ($active ? theme.colors.primary : theme.colors.gray400)};
  transition: color 0.15s ease;

  span {
    font-size: ${theme.fontSizes.xs};
    font-weight: ${({ $active }) =>
      $active ? theme.fontWeights.semibold : theme.fontWeights.regular};
  }
`;
