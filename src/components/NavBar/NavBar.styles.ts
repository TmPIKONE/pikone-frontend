import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 50%;
  z-index: 100;
  width: min(100%, ${theme.app.maxWidth});
  min-height: calc(86px + env(safe-area-inset-bottom));
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  align-items: start;
  padding: 13px 8px env(safe-area-inset-bottom);
  border-top: 1px solid ${theme.colors.gray100};
  background: ${theme.colors.white};
  transform: translateX(-50%);
`;

export const NavItem = styled.button<{ $active: boolean }>`
  min-width: 0;
  min-height: 58px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  color: ${({ $active }) => ($active ? theme.colors.black : '#C9CDD3')};

  svg {
    width: 25px;
    height: 25px;
  }

  span {
    max-width: 100%;
    overflow: hidden;
    font-size: 10px;
    font-weight: ${({ $active }) => ($active ? 850 : 700)};
    letter-spacing: -0.035em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:active {
    transform: scale(0.96);
  }
`;
