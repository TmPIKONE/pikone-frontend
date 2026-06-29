import type {
    SignupRequest,
    SignupResponse,
    ReissueRequest,
    TokenResponse,
} from "./auth.types";
import ApiBuilder from "../config/ApiBuilder";

export const END_POINT = {
    KAKAO_LOGIN: "/oauth2/authorization/kakao",
    NAVER_LOGIN: "/oauth2/authorization/naver",
    SIGNUP: "/oauth2/signup",
    REISSUE: "/reissue",
    LOGOUT: "/logout",
    WITHDRAWAL: "/withdrawal",
    MY_INFO: "/my",
};

export const reissue = () => {
    return ApiBuilder.create<ReissueRequest, TokenResponse>(
        END_POINT.REISSUE
    ).setMethod("POST");
};

export const logout = () => {
    return ApiBuilder.create<void, void>(
        END_POINT.LOGOUT
    ).setMethod("POST");
};

export const withdrawal = () => {
    return ApiBuilder.create<void, void>(
        END_POINT.WITHDRAWAL
    ).setMethod("DELETE");
};

export const getMyInfo = () => {
    return ApiBuilder.create<void, any>(
        END_POINT.MY_INFO
    ).setMethod("GET");
};