import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";


export default function TokenProcessor(){
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(()=>{
        const params =
            new URLSearchParams(location.search);

        const accessToken =
            params.get("accessToken");

        const refreshToken =
            params.get("refreshToken");

        if(accessToken && refreshToken){
            sessionStorage.setItem(
                "accessToken",
                accessToken
            );
            sessionStorage.setItem(
                "refreshToken",
                refreshToken
            );
        }
        navigate("/home", {
            replace:true
        });
    },[location, navigate]);

    return <>로그인 처리중...</>;

}