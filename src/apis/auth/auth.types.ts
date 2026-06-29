export interface SignupRequest {
    moreInfo1: string;
    moreInfo2: string;
    moreInfo3: string;
}

export interface ReissueRequest {
    accessToken: string;
    refreshToken: string;
}

export interface TokenResponse {
    grantType: string;
    accessToken: string;
    accessTokenExpiresIn: number;
    refreshToken: string;
}

export interface SignupResponse {
    userResponseDto: {
        userId: number;
        nickname: string;
        imageUrl: string;
        authority: string;
        moreInfo1: string;
        moreInfo2: string;
        moreInfo3: string;
    };

    tokenResponse: TokenResponse;
}