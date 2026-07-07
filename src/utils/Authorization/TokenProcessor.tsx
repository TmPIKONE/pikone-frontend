import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '~/contexts/Auth/AuthContext';

export default function TokenProcessor() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    if (accessToken && refreshToken) {
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
      setIsAuthenticated(true);
      navigate('/home', { replace: true });
      return;
    }

    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  }, [location, navigate, setIsAuthenticated]);

  return <>로그인 처리중...</>;
}
