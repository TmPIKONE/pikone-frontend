import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Layout = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  background-color: ${theme.colors.surfaceSubtle};
`;

export const Content = styled.main<{ $reserveNavSpace: boolean }>`
  min-height: 100vh;
  min-height: 100dvh;
  padding-bottom: ${({ $reserveNavSpace }) => ($reserveNavSpace ? theme.app.bottomNavSpace : '0')};
  background-color: ${theme.colors.white};
`;
