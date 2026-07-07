import { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/Auth/AuthContext';
import { ToastProvider } from './components/Toast/Toast';
import SplashScreen from './components/SplashScreen/SplashScreen';
import { GlobalStyle } from './styles/GlobalStyle';
import Router from './Router';
import queryClient from './QueryClient';

const SPLASH_DURATION_MS = 1400;

const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsSplashVisible(false);
    }, SPLASH_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <GlobalStyle />
          {isSplashVisible ? <SplashScreen /> : <Router />}
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
