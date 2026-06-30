import { logout, withdrawal } from "../../apis/auth/auth";
import { useNavigate } from "react-router-dom";
import {useApiMutation} from "../../apis/config/ApiBuilder";

export default function Home() {

    const navigate = useNavigate();

    const logoutMutation = useApiMutation(
        logout(),
        {
            onSuccess: () => {
                sessionStorage.clear();
                navigate("/login");
            }
        }
    );

    const withdrawalMutation = useApiMutation(
        withdrawal(),
        {
            onSuccess: () => {
                sessionStorage.clear();
                navigate("/login");
            }
        }
    );

    return (
        <div
            style={{
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                gap:20,
                height:"100vh",
                fontSize:30,
            }}
        >
            로그인 성공 🎉
            <button
                onClick={() => logoutMutation.mutate()}
            >
                로그아웃
            </button>

            <button
                onClick={() => withdrawalMutation.mutate()}
            >
                회원탈퇴
            </button>
        </div>
    );
}