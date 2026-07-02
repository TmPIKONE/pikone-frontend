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

  return (
    <Nav>
      {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
        const isActive = location.pathname.startsWith(path);
        return (
          <NavItem key={path} $active={isActive} onClick={() => navigate(path)}>
            <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
            <span>{label}</span>
          </NavItem>
        );
      })}
    </Nav>
  );
};

export default NavBar;
