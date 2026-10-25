import { Outlet, useLocation, matchPath } from 'react-router-dom';
import NavBar from '~/components/NavBar/NavBar';
import * as S from './MainLayout.styles';

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
    pathname === '/ai/trip' ||
    pathname === '/decision-rooms/new' ||
    !!matchPath('/discover/:restaurantId', pathname) ||
    !!matchPath('/record/edit/:recordId', pathname);

  const reserveNavSpace = !hideNav && pathname !== '/companion' && pathname !== '/discover';

  return (
    <S.Layout>
      <S.Content $reserveNavSpace={reserveNavSpace}>
        <Outlet />
      </S.Content>

      {!hideNav && <NavBar />}
    </S.Layout>
  );
};

export default MainLayout;
