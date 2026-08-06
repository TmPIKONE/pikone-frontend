import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Section = styled.section`
  padding: 34px ${theme.app.pagePadding} 44px;
  background: ${theme.colors.navy};
  color: ${theme.colors.white};
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
`;

export const Eyebrow = styled.span`
  display: block;
  color: rgba(255, 255, 255, 0.56);
  font-size: 11px;
  font-weight: 750;
`;

export const Title = styled.h2`
  margin-top: 5px;
  color: ${theme.colors.white};
  font-size: 23px;
  font-weight: 900;
  letter-spacing: -0.05em;
`;

export const DateButton = styled.button`
  min-height: 38px;
  padding: 0 14px;
  border-radius: ${theme.radius.full};
  background: rgba(49, 81, 129, 0.92);
  color: ${theme.colors.white};
  font-size: 11px;
  font-weight: 800;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
`;

export const EmptySlot = styled.button`
  min-width: 0;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  border-radius: 22px;
  background: ${theme.colors.navyDark};
  color: ${theme.colors.white};
  text-align: left;

  &:active {
    transform: scale(0.985);
  }

  @media (max-width: 370px) {
    min-height: 195px;
    padding: 17px;
  }
`;

export const EmptyTop = styled.span`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  > span {
    font-size: 40px;
    line-height: 1;
  }
`;

export const EmptyCopy = styled.span`
  display: flex;
  flex-direction: column;
  gap: 13px;

  strong {
    font-size: 19px;
    font-weight: 900;
    letter-spacing: -0.04em;
  }

  > span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: rgba(143, 174, 220, 0.52);
    font-size: 13px;
    font-weight: 800;
  }
`;

export const AlbumButton = styled.button`
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
  margin-top: 28px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.navyDark};
  color: ${theme.colors.white};
  font-size: 13px;
  font-weight: 850;

  i {
    width: 2px;
    height: 20px;
    background: rgba(255, 255, 255, 0.72);
  }
`;

export const ErrorBox = styled.div`
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 22px;
  background: ${theme.colors.navyDark};
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;

  button {
    min-height: 40px;
    padding: 0 15px;
    border-radius: ${theme.radius.full};
    background: ${theme.colors.white};
    color: ${theme.colors.navyDark};
    font-weight: 800;
  }
`;
