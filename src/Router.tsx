import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '~/contexts/Auth/useAuth';
import MainLayout from '~/layouts/MainLayout';
import AuthLayout from '~/layouts/AuthLayout';
import ProtectedRoute from '~/components/ProtectedRoute/ProtectedRoute';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';

const LoginPage = lazy(() => import('~/pages/Auth/LoginPage'));
const OAuthCallback = lazy(() => import('~/pages/Auth/OAuthCallback'));
const Home = lazy(() => import('~/pages/Home/Home'));
const Calendar = lazy(() => import('~/pages/Calendar/Calendar'));
const RecordAdd = lazy(() => import('~/pages/RecordAdd/RecordAdd'));
const RecordView = lazy(() => import('~/pages/RecordView/RecordView'));
const RecordEdit = lazy(() => import('~/pages/RecordEdit/RecordEdit'));
const Draft = lazy(() => import('~/pages/Draft/Draft'));
const DraftDetail = lazy(() => import('~/pages/DraftDetail/DraftDetail'));
const AI = lazy(() => import('~/pages/AI/AI'));
const AIResult = lazy(() => import('~/pages/AIResult/AIResult'));
const Settings = lazy(() => import('~/pages/Settings/Settings'));
const Companion = lazy(() => import('~/pages/Companion/Companion'));
const CompanionAdd = lazy(() => import('~/pages/CompanionAdd/CompanionAdd'));
const CompanionRecord = lazy(() => import('~/pages/CompanionRecord/CompanionRecord'));
const CompanionRecordFeed = lazy(() => import('~/pages/CompanionRecordFeed/CompanionRecordFeed'));
const NotFound = lazy(() => import('~/pages/NotFound/NotFound'));

const RootRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  return <Navigate to={isAuthenticated ? '/home' : '/login'} replace />;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner label="화면을 준비하고 있어요" fullScreen />}>
        <Routes>
          <Route path="/" element={<RootRedirect />} />

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/loginwait" element={<OAuthCallback />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/record/add" element={<RecordAdd />} />
              <Route path="/record/view" element={<RecordView />} />
              <Route path="/record/edit/:recordId" element={<RecordEdit />} />
              <Route path="/draft" element={<Draft />} />
              <Route path="/draft/:draftId" element={<DraftDetail />} />
              <Route path="/ai" element={<AI />} />
              <Route path="/ai/result" element={<AIResult />} />
              <Route path="/mypage/settings" element={<Settings />} />
              <Route path="/companion" element={<Companion />} />
              <Route path="/companion/add" element={<CompanionAdd />} />
              <Route path="/companion/:id/records" element={<CompanionRecord />} />
              <Route path="/companion/:id/records/:recordId" element={<CompanionRecordFeed />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
