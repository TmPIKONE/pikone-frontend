import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Banner = styled.button`
  position: relative;
  width: 100%;
  min-height: 520px;
  display: block;
  overflow: hidden;
  padding: 36px ${theme.app.pagePadding} 42px;
  background: ${theme.colors.powderBlue};
  color: ${theme.colors.white};
  text-align: left;
`;

export const TopRow = styled.span`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(50, 94, 148, 0.66);
  font-size: 16px;
  font-weight: 900;
`;

export const Theme = styled.strong`
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  padding: 0 15px;
  border-radius: ${theme.radius.full};
  background: #5e8fc5;
  color: ${theme.colors.white};
  font-size: 12px;
`;

export const Score = styled.span`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;

  strong {
    color: ${theme.colors.white};
    font-size: 40px;
    font-weight: 950;
    letter-spacing: -0.055em;
  }

  span {
    margin-top: 7px;
    color: rgba(50, 94, 148, 0.72);
    font-size: 13px;
    font-weight: 850;
  }
`;

export const Mascot = styled.span`
  position: relative;
  width: 250px;
  height: 220px;
  display: grid;
  place-items: center;
  margin: 28px auto 0;
  border-radius: 50% 50% 42% 42%;
  background: rgba(100, 146, 199, 0.42);

  &::before {
    content: '';
    position: absolute;
    width: 176px;
    height: 176px;
    border-radius: 48% 48% 44% 44%;
    background: #ffe0af;
  }

  span {
    position: relative;
    z-index: 1;
    font-size: 74px;
  }
`;

export const Action = styled.span`
  position: absolute;
  left: ${theme.app.pagePadding};
  right: ${theme.app.pagePadding};
  bottom: 34px;
  z-index: 1;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-radius: 20px;
  background: #5e8fc5;
  color: ${theme.colors.white};
  font-size: 14px;
  font-weight: 900;
`;
