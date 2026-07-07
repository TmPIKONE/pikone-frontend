export const BASE_URL = (
    import.meta.env.VITE_BASE_URL || 'http://localhost:8080'
).replace(/\/$/, '');

export const KAKAO_LOGIN =
    "/oauth2/authorization/kakao";

export const NAVER_LOGIN =
    "/oauth2/authorization/naver";

export const REISSUE =
    "/reissue";

export const LOGOUT =
    "/logout";

export const WITHDRAWAL =
    "/withdrawal";
