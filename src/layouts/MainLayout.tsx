import { Outlet, useLocation, matchPath } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '~/styles/theme';
import NavBar from '~/components/NavBar/NavBar';

const Layout = styled.div`
    min-height: 100vh;
    min-height: 100dvh;
    background-color: ${theme.colors.white};
`;

const Content = styled.main`
    min-height: 100vh;
    min-height: 100dvh;
    background-color: ${theme.colors.white};
`;

const MainLayout = () => {
  const { pathname } = useLocation();

  const hideNav =
    pathname === '/draft' ||
    pathname === '/mypage/settings' ||
    !!matchPath('/draft/:draftId', pathname) ||
    !!matchPath('/companion/:companionId/records', pathname) ||
    !!matchPath('/record/:date', pathname) ||
    pathname === '/record/add';

  return (
    <Layout>
      <Content>
        <Outlet />
      </Content>

      {!hideNav && <NavBar />}
    </Layout>
  );
};

export default MainLayout;