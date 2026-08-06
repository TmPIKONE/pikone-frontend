import { Outlet, useLocation, matchPath } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '~/styles/theme';
import NavBar from '~/components/NavBar/NavBar';

const Layout = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  background-color: ${theme.colors.surfaceSubtle};
`;

const Content = styled.main<{ $reserveNavSpace: boolean }>`
  min-height: 100vh;
  min-height: 100dvh;
  padding-bottom: ${({ $reserveNavSpace }) => ($reserveNavSpace ? theme.app.bottomNavSpace : '0')};
  background-color: ${theme.colors.white};
`;

const MainLayout = () => {
  const { pathname } = useLocation();

  const hideNav =
    pathname === '/draft' ||
    !!matchPath('/draft/:draftId', pathname) ||
    pathname === '/companion/add' ||
    !!matchPath('/companion/:companionId/records', pathname) ||
    !!matchPath('/companion/:companionId/records/:recordId', pathname) ||
    pathname === '/record/add' ||
    pathname === '/record/view' ||
    !!matchPath('/record/edit/:recordId', pathname);

  const reserveNavSpace = !hideNav && pathname !== '/companion';

  return (
    <Layout>
      <Content $reserveNavSpace={reserveNavSpace}>
        <Outlet />
      </Content>

      {!hideNav && <NavBar />}
    </Layout>
  );
};

export default MainLayout;
