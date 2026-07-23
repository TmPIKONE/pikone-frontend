import styled from '@emotion/styled';
import { theme } from '~/styles/theme';
import type { SocialLoginProvider } from './LoginPage.types';

const BUTTON_COLOR: Record<SocialLoginProvider, string> = {
  kakao: '#FEEA2E',
  naver: '#03C75A',
};

const BUTTON_TEXT_COLOR: Record<SocialLoginProvider, string> = {
  kakao: '#2F1B16',
  naver: theme.colors.white,
};

const FOOD_ICON_POSITION = {
  topLeft: `
    top: 50px;
    left: 24px;
  `,
  topRight: `
    top: 60px;
    right: 16px;
  `,
  bottomLeft: `
    bottom: 168px;
    left: 30px;
  `,
  bottomRight: `
    bottom: 168px;
    right: 30px;
  `,
};

const FOOD_ICON_POSITION_MOBILE = {
  topLeft: `
    top: 60px;
    left: 20px;
  `,
  topRight: `
    top: 80px;
    right: 16px;
  `,
  bottomLeft: `
    bottom: 168px;
    left: 20px;
  `,
  bottomRight: `
    bottom: 168px;
    right: 20px;
  `,
};

export const Container = styled.div`
    position: relative;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;

    background:
            linear-gradient(180deg, transparent 0%, transparent 70%, ${theme.colors.white} 90%),
            linear-gradient(180deg, #3476ff 0%, #5d8bff 62%, #eef4ff 100%);

    overflow: hidden;
`;

export const StatusSpacer = styled.div`
    flex: 0 0 auto;
    background-color: ${theme.colors.white};
`;

export const Hero = styled.section`
    position: relative;
    flex: 1;
    min-height: 0;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    padding: 0px 0px 128px;
`;

export const FoodIcon = styled.img<{
  $position: keyof typeof FOOD_ICON_POSITION;
}>`
    position: absolute;
    width: clamp(82px, 24vw, 128px);
    height: auto;
    pointer-events: none;
    user-select: none;
    z-index: 0;

    ${({ $position }) => FOOD_ICON_POSITION[$position]};

    @media (max-width: 450px) {
        width: clamp(130px, 50vw, 150px);
        
        ${({ $position }) => FOOD_ICON_POSITION_MOBILE[$position]};
    }
`;

export const CopyBox = styled.div`
    position: relative;
    z-index: 1;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;

    text-align: center;
    color: ${theme.colors.white};
`;

export const Brand = styled.p`
    font-size: 25px;
    line-height: 1;
    font-weight: ${theme.fontWeights.bold};
    letter-spacing: 0;
`;

export const MainCopy = styled.h1`
    font-size: clamp(24px, 7vw, 34px);
    line-height: 1.28;
    font-weight: ${theme.fontWeights.bold};
    letter-spacing: 0;
    word-break: keep-all;
`;

export const Highlight = styled.span`
    display: block;
    margin-top: 6px;
    color: #ffe352;
`;

export const LoginPanel = styled.section`
    position: relative;
    z-index: 2;

    display: flex;
    flex-direction: column;
    gap: 24px;

    padding: 0 30px calc(32px + env(safe-area-inset-bottom));
    transform: translateY(-110px); 
`;

export const LoginButton = styled.button<{ $provider: SocialLoginProvider }>`
    width: 100%;
    height: 62px;

    border-radius: ${theme.radius.full};
    border: 2px solid
    ${({ $provider }) =>
            $provider === 'kakao' ? '#E3C500' : '#3fb876'}; /* 추가 */

    display: grid;
    grid-template-columns: 42px 1fr 42px;
    align-items: center;

    padding: 0 20px;
    background-color: ${({ $provider }) => BUTTON_COLOR[$provider]};
    color: ${({ $provider }) => BUTTON_TEXT_COLOR[$provider]};

    font-size: 17px;
    font-weight: ${theme.fontWeights.bold};
    box-shadow: 0 10px 22px rgba(24, 48, 96, 0.1);
`;

export const LoginIcon = styled.span<{ $provider: SocialLoginProvider }>`
    justify-self: start;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: 28px;
    height: 28px;

    color: ${({ $provider }) => ($provider === 'kakao' ? '#341b18' : theme.colors.white)};
    font-size: 25px;
    font-weight: ${theme.fontWeights.bold};

    svg {
        stroke-width: 0;
    }
`;

export const LoginText = styled.span`
  justify-self: center;
`;


