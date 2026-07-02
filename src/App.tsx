import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/Auth/AuthContext';
import { GlobalStyle } from './styles/GlobalStyle';
import Router from './Router';
import queryClient from './QueryClient';

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GlobalStyle />
      <Router />
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
