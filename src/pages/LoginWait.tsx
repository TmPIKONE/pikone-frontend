import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function LoginWait() {

    const navigate = useNavigate();
    const [params] = useSearchParams();

    useEffect(() => {

        const accessToken = params.get("accessToken");
        const refreshToken = params.get("refreshToken");
        const isNewUser = params.get("isNewUser");

        if (!accessToken || !refreshToken) {
            navigate("/login");
            return;
        }

        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);

        if (isNewUser === "true") {
            navigate("/home");
        }
    }, []);

    return <div>로그인 중...</div>;
}