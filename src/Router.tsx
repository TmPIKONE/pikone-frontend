import {BrowserRouter, Routes, Route, Navigate,} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import LoginWait from "./pages/LoginWait";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/loginwait"
                    element={<LoginWait />}
                />

                <Route
                    path="/home"
                    element={<Home />}
                />

            </Routes>
        </BrowserRouter>
    );
}