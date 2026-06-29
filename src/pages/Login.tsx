import {BASE_URL, KAKAO_LOGIN, NAVER_LOGIN} from "../constants/endPoint";

export default function Login() {

    const login = (url: string) => {
        window.location.href = BASE_URL + url;
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <h1>Pikone</h1>

            <button
                onClick={() => login(KAKAO_LOGIN)}
                style={{
                    width: 300,
                    height: 55,
                    background: "#FEE500",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 18,
                    cursor: "pointer",
                }}
            >
                카카오 로그인
            </button>

            <button
                onClick={() => login(NAVER_LOGIN)}
                style={{
                    width: 300,
                    height: 55,
                    background: "#03C75A",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 18,
                    cursor: "pointer",
                }}
            >
                네이버 로그인
            </button>
        </div>
    );
}