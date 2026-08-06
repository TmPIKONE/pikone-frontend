import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Section = styled.section`
  padding: 42px ${theme.app.pagePadding} 54px;
  background: ${theme.colors.peach};
  color: ${theme.colors.white};
  text-align: center;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  text-align: left;
`;

export const Title = styled.h2`
  color: ${theme.colors.white};
  font-size: 28px;
  font-weight: 950;
  letter-spacing: -0.055em;
`;

export const Tabs = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
  color: rgba(221, 93, 44, 0.72);
  font-size: 13px;
  font-weight: 850;

  strong {
    color: ${theme.colors.white};
  }
`;

export const Question = styled.p`
  margin-top: 54px;
  color: rgba(255, 255, 255, 0.88);
  font-size: 15px;
  font-weight: 800;
`;

export const MainMetric = styled.strong`
  display: inline-block;
  margin-top: 8px;
  color: ${theme.colors.white};
  font-size: 68px;
  font-weight: 850;
  line-height: 1;
  letter-spacing: -0.05em;
`;

export const Unit = styled.span`
  margin-left: 7px;
  color: ${theme.colors.white};
  font-size: 25px;
  font-weight: 850;
`;

export const Visual = styled.div`
  position: relative;
  width: min(64vw, 250px);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  margin: 38px auto 28px;
  border-radius: 32px;
  background: ${theme.colors.peachDark};

  span {
    position: relative;
    z-index: 1;
    font-size: 84px;
  }

  i {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -13px;
    height: 28px;
    border-radius: 0 0 32px 32px;
    background: #ee7546;
  }
`;

export const Favorite = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  font-weight: 750;

  strong {
    color: ${theme.colors.white};
    font-size: 21px;
    font-weight: 900;
    letter-spacing: -0.04em;
  }
`;

export const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 32px;
`;

export const Stat = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: ${theme.colors.white};

  span {
    color: rgba(255, 255, 255, 0.66);
    font-size: 10px;
    font-weight: 750;
  }

  strong {
    padding-top: 11px;
    border-top: 5px solid rgba(226, 111, 68, 0.48);
    font-size: 17px;
    font-weight: 900;
  }
`;

export const Action = styled.button`
  width: 72%;
  min-height: 58px;
  margin-top: 40px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.peachDark};
  color: ${theme.colors.white};
  font-size: 14px;
  font-weight: 850;
`;

export const RefreshLabel = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 18px;
  color: rgba(213, 82, 34, 0.6);
  font-size: 11px;
  font-weight: 750;
`;
