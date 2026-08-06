import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  min-height: 100dvh;
  padding: calc(env(safe-area-inset-top, 0px) + 12px) ${theme.app.pagePadding} 48px;
  background: ${theme.colors.white};
`;

export const TopBar = styled.div`
  min-height: 46px;
  display: flex;
  align-items: center;
`;

export const BackButton = styled.button`
  width: 42px;
  height: 42px;
  margin-left: -4px;
  display: grid;
  place-items: center;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray100};
  color: ${theme.colors.black};

  &:active {
    transform: scale(0.96);
  }
`;

export const PageHeader = styled.header`
  margin-top: 24px;
`;

export const Eyebrow = styled.span`
  display: block;
  margin-bottom: 6px;
  color: ${theme.colors.gray400};
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.1em;
`;

export const PageTitle = styled.h1`
  overflow: hidden;
  color: ${theme.colors.black};
  font-size: 30px;
  font-weight: 950;
  letter-spacing: -0.06em;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const PageDescription = styled.p`
  margin-top: 10px;
  color: ${theme.colors.gray500};
  font-size: 11px;
  font-weight: 650;
`;

export const SummaryCard = styled.section`
  min-height: 92px;
  margin-top: 34px;
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr) auto;
  align-items: center;
  gap: 13px;
  padding: 18px;
  border-radius: ${theme.radius.xl};
  background: ${theme.colors.gray100};
`;

export const ProfileBadge = styled.span`
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 18px;
  font-weight: 950;
`;

export const SummaryText = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;

  strong {
    overflow: hidden;
    color: ${theme.colors.black};
    font-size: 15px;
    font-weight: 900;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    color: ${theme.colors.gray500};
    font-size: 10px;
    font-weight: 650;
  }
`;

export const RecordCount = styled.div`
  min-width: 66px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;

  strong {
    color: ${theme.colors.black};
    font-size: 24px;
    font-weight: 950;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  span {
    color: ${theme.colors.gray500};
    font-size: 9px;
    font-weight: 750;
  }
`;

export const GridHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 38px;
  margin-bottom: 16px;
`;

export const GridTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 7px;
  color: ${theme.colors.black};
  font-size: 16px;
  font-weight: 900;
  letter-spacing: -0.035em;
`;

export const GridHint = styled.span`
  color: ${theme.colors.gray400};
  font-size: 9px;
  font-weight: 700;
`;

export const RecordGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 3px;
  margin: 0 calc(${theme.app.pagePadding} * -1);
  background: ${theme.colors.white};
`;

export const GridItem = styled.button`
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: ${theme.colors.gray100};

  &:focus-visible {
    z-index: 1;
    outline: 3px solid ${theme.colors.black};
    outline-offset: -3px;
  }

  @media (hover: hover) {
    &:hover img {
      transform: scale(1.035);
    }

    &:hover span {
      opacity: 1;
    }
  }
`;

export const RecordImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: ${theme.colors.gray200};
  transition: transform 180ms ease;
`;

export const ImageOverlay = styled.span`
  position: absolute;
  right: 7px;
  bottom: 7px;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: ${theme.radius.full};
  background: rgba(0, 0, 0, 0.64);
  color: ${theme.colors.white};
  opacity: 0;
  transition: opacity ${theme.motion.fast} ${theme.motion.easing};

  @media (hover: none) {
    display: none;
  }
`;

export const SkeletonGrid = styled(RecordGrid)``;

export const SkeletonTile = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  background: linear-gradient(
    100deg,
    ${theme.colors.gray100} 22%,
    ${theme.colors.gray50} 38%,
    ${theme.colors.gray100} 54%
  );
  background-size: 220% 100%;
  animation: record-grid-shimmer 1.25s linear infinite;

  @keyframes record-grid-shimmer {
    to {
      background-position-x: -220%;
    }
  }
`;

export const EmptyState = styled.div`
  min-height: 270px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 30px;
  border-radius: ${theme.radius.xl};
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray400};
  text-align: center;

  strong {
    margin-top: 5px;
    color: ${theme.colors.black};
    font-size: 14px;
    font-weight: 900;
  }

  span {
    max-width: 250px;
    color: ${theme.colors.gray500};
    font-size: 11px;
    font-weight: 650;
    line-height: 1.6;
  }
`;

export const EmptyIcon = styled.span`
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.white};
  color: ${theme.colors.black};
`;

export const RetryButton = styled.button`
  min-height: 40px;
  margin-top: 5px;
  padding: 0 14px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 11px;
  font-weight: 850;
`;
