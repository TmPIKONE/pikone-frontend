export type SocialType = 'KAKAO' | 'NAVER';

export interface UserResponseDto {
  id: number;
  email: string;
  nickname: string;
  imageUrl: string;
  socialType: SocialType;
  createdTime: string;
  moreInfo1?: string;
  moreInfo2?: string;
  moreInfo3?: string;
}
