import { CalendarDays, Sparkles, UserRound, UsersRound, Utensils } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { NavItemType } from './NavBar.types';
import * as S from './NavBar.styles';

const NAV_ITEMS: NavItemType[] = [
  { path: '/home', label: '기록', icon: Utensils },
  { path: '/ai', label: 'PIKONE AI', icon: Sparkles },
  { path: '/calendar', label: '달력', icon: CalendarDays },
  { path: '/companion', label: '동반자', icon: UsersRound },
  { path: '/mypage/settings', label: 'MY', icon: UserRound },
];

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <S.Nav aria-label="주요 메뉴">
      {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
        const isActive = location.pathname.startsWith(path);

        return (
          <S.NavItem
            key={path}
            type="button"
            $active={isActive}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => navigate(path)}
          >
            <Icon fill={isActive ? 'currentColor' : 'none'} strokeWidth={isActive ? 2.4 : 2} />
            <span>{label}</span>
          </S.NavItem>
        );
      })}
    </S.Nav>
  );
};

export default NavBar;
