export type SocialLoginProvider = 'kakao' | 'naver';

export interface SocialLoginButton {
  provider: SocialLoginProvider;
  label: string;
  url: string;
}
