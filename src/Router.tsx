import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '~/contexts/Auth/AuthContext';
import MainLayout from '~/layouts/MainLayout';
import AuthLayout from '~/layouts/AuthLayout';
import ProtectedRoute from '~/components/ProtectedRoute/ProtectedRoute';
import TokenProcessor from '~/utils/Authorization/TokenProcessor';

const LoginPage = lazy(() => import('~/pages/Auth/LoginPage'));
const SignUpPage = lazy(() => import('~/pages/SignUp/SignUpPage'));
const Home = lazy(() => import('~/pages/Home/Home'));
const Calendar = lazy(() => import('~/pages/Calendar/Calendar'));
const RecordAdd = lazy(() => import('~/pages/RecordAdd/RecordAdd'));
const RecordDetail = lazy(() => import('~/pages/RecordDetail/RecordDetail'));
const Draft = lazy(() => import('~/pages/Draft/Draft'));
const AI = lazy(() => import('~/pages/AI/AI'));
const AIResult = lazy(() => import('~/pages/AIResult/AIResult'));
const MyPage = lazy(() => import('~/pages/MyPage/MyPage'));
const Settings = lazy(() => import('~/pages/Settings/Settings'));
const Companion = lazy(() => import('~/pages/Companion/Companion'));
const CompanionAdd = lazy(() => import('~/pages/CompanionAdd/CompanionAdd'));
const CompanionRecord = lazy(() => import('~/pages/CompanionRecord/CompanionRecord'));

const RootRedirect = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/home' : '/login'} replace />;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>로딩 중...</div>}>
        <Routes>
          <Route path="/" element={<RootRedirect />} />

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/loginwait" element={<TokenProcessor />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/record/add" element={<RecordAdd />} />
              <Route path="/record/:date" element={<RecordDetail />} />
              <Route path="/draft" element={<Draft />} />
              <Route path="/ai" element={<AI />} />
              <Route path="/ai/result" element={<AIResult />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/mypage/settings" element={<Settings />} />
              <Route path="/companion" element={<Companion />} />
              <Route path="/companion/add" element={<CompanionAdd />} />
              <Route path="/companion/:id/records" element={<CompanionRecord />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
