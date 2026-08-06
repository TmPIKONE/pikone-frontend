import { QueryClientProvider } from '@tanstack/react-query';
import { AppErrorBoundary } from './components/AppErrorBoundary/AppErrorBoundary';
import { AuthProvider } from './contexts/Auth/AuthContext';
import { ToastProvider } from './components/Toast/Toast';
import { GlobalStyle } from './styles/GlobalStyle';
import Router from './Router';
import queryClient from './QueryClient';

const App = () => {
  return (
    <>
      <GlobalStyle />
      <AppErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <AuthProvider>
              <Router />
            </AuthProvider>
          </ToastProvider>
        </QueryClientProvider>
      </AppErrorBoundary>
    </>
  );
};

export default App;
