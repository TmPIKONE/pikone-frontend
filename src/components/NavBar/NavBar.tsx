import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Sparkles, CalendarDays, Users } from 'lucide-react';
import { Nav, NavItem } from './NavBar.styles';
import type { NavItemType } from './NavBar.types';

const NAV_ITEMS: NavItemType[] = [
  { path: '/home', label: '홈', icon: Home },
  { path: '/ai', label: 'AI', icon: Sparkles },
  { path: '/calendar', label: '달력', icon: CalendarDays },
  { path: '/companion', label: '동반자', icon: Users },
];

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeIndex = Math.max(
    NAV_ITEMS.findIndex(({ path }) => location.pathname.startsWith(path)),
    0,
  );

  return (
    <Nav $activeIndex={activeIndex}>
      {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
        const isActive = location.pathname.startsWith(path);
        return (
          <NavItem
            key={path}
            $active={isActive}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => navigate(path)}
          >
            <Icon
              fill={isActive ? '#000' : 'none'}
              stroke="#000"
              strokeWidth={isActive ? 1.9 : 1.8}
            />
            <span>{label}</span>
          </NavItem>
        );
      })}
    </Nav>
  );
};

export default NavBar;
