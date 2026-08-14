import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.main`
  min-height: calc(100dvh - ${theme.app.bottomNavSpace});
  overflow-x: clip;
  background: ${theme.colors.surfaceSubtle};
`;
