import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.main`
  min-height: calc(100dvh - ${theme.app.bottomNavSpace});
  padding-bottom: 28px;
  overflow-x: clip;
  background: #f4f4f7;
`;

export const HighlightCard = styled.button`
  width: calc(100% - ${theme.app.pagePadding} * 2);
  min-height: 84px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin: 0 ${theme.app.pagePadding} 18px;
  padding: 18px 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.96);
  text-align: left;
  transition: transform ${theme.motion.fast} ${theme.motion.easing};

  &:active {
    transform: scale(0.993);
  }
`;

export const HighlightCopy = styled.span`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;

  strong {
    color: #1d1e22;
    font-size: 16px;
    font-weight: 850;
    letter-spacing: -0.045em;
  }

  span {
    color: #a0a2a8;
    font-size: 12px;
    font-weight: 650;
    letter-spacing: -0.035em;
  }
`;

export const HighlightPlus = styled.span`
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #f1f2f5;
  color: #a4a6ac;
  font-size: 26px;
  font-weight: 350;
  line-height: 1;
`;

export const HistoryCard = styled.button`
    width: calc(100% - ${theme.app.pagePadding} * 2);
    min-height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 0 ${theme.app.pagePadding} 20px;
    padding: 0 19px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.96);
    color: #438bda;
    font-size: 18px;
    font-weight: 850;
    letter-spacing: -0.05em;
    text-align: left;

    svg {
        color: #9da0a7;
    }

    &:active {
        transform: scale(0.993);
    }
`;
