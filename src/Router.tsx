import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from '~/pages/Home/Home';
import Login from '~/pages/Auth/LoginPage';
import TokenProcessor from '~/utils/Authorization/TokenProcessor';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/loginwait" element={<TokenProcessor />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
