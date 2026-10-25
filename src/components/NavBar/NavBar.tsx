import { BookOpenText, Compass, Sparkles, UsersRound, Utensils } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { NavItemType } from './NavBar.types';
import * as S from './NavBar.styles';

const NAV_ITEMS: NavItemType[] = [
  { path: '/home', label: '홈', icon: Utensils },
  { path: '/discover', label: '크리에이터', icon: Compass },
  { path: '/ai', label: '추천', icon: Sparkles },
  { path: '/calendar', label: '기록', icon: BookOpenText },
  { path: '/companion', label: '함께', icon: UsersRound },
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
