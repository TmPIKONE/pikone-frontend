import { MessageCircle } from 'lucide-react';

import foodTopLeft from '~/assets/branding/foodTopLeft.png';
import foodTopRight from '~/assets/branding/foodTopRight.png';
import foodBottomLeft from '~/assets/branding/foodBottomLeft.png';
import foodBottomRight from '~/assets/branding/foodBottomRight.png';

import { BASE_URL, KAKAO_LOGIN, NAVER_LOGIN } from '~/constants/endPoint';
import * as S from './LoginPage.styles';
import type { SocialLoginButton } from './LoginPage.types';

const SOCIAL_LOGIN_BUTTONS: SocialLoginButton[] = [
  { provider: 'kakao', label: '카카오 로그인', url: KAKAO_LOGIN },
  { provider: 'naver', label: '네이버 로그인', url: NAVER_LOGIN },
];

export default function Login() {
  const login = (url: string) => {
    window.location.assign(`${BASE_URL}${url}`);
  };

  return (
    <S.Container>
      <S.StatusSpacer />

      <S.Hero>
        <S.FoodIcon src={foodTopLeft} $position="topLeft" alt="" aria-hidden="true" />
        <S.FoodIcon src={foodTopRight} $position="topRight" alt="" aria-hidden="true" />
        <S.FoodIcon src={foodBottomLeft} $position="bottomLeft" alt="" aria-hidden="true" />
        <S.FoodIcon src={foodBottomRight} $position="bottomRight" alt="" aria-hidden="true" />

        <S.CopyBox>
          <S.Brand>PIKONE</S.Brand>
          <S.MainCopy>
            내 음식 사진이 나만의 맛집 지도
            <S.Highlight>AI 푸드 로그</S.Highlight>
          </S.MainCopy>
        </S.CopyBox>
      </S.Hero>
      <S.LoginPanel>
        {SOCIAL_LOGIN_BUTTONS.map((button) => (
          <S.LoginButton
            key={button.provider}
            type="button"
            $provider={button.provider}
            onClick={() => login(button.url)}
          >
            <S.LoginIcon $provider={button.provider}>
              {button.provider === 'kakao' ? <MessageCircle size={25} fill="currentColor" /> : 'N'}
            </S.LoginIcon>

            <S.LoginText>{button.label}</S.LoginText>

            <span />
          </S.LoginButton>
        ))}
      </S.LoginPanel>
    </S.Container>
  );
}
