import { Outlet } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '~/styles/theme';
import NavBar from '~/components/NavBar/NavBar';

const Content = styled.main`
  padding-bottom: ${theme.nav.height};
  min-height: 100dvh;
`;

const MainLayout = () => {
  return (
    <>
      <Content>
        <Outlet />
      </Content>
      <NavBar />
    </>
  );
};

export default MainLayout;
