import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

const shimmer = keyframes`
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
`;

const skeletonBackground = `
  linear-gradient(
    105deg,
    ${theme.colors.gray100} 20%,
    ${theme.colors.gray50} 38%,
    ${theme.colors.gray100} 56%
  )
`;

const pileLayouts = [
  { x: '0px', y: '0px', rotation: '3deg' },
  { x: '-78px', y: '-10px', rotation: '-11deg' },
  { x: '75px', y: '-17px', rotation: '9deg' },
  { x: '-91px', y: '67px', rotation: '-7deg' },
  { x: '83px', y: '65px', rotation: '8deg' },
  { x: '-42px', y: '86px', rotation: '5deg' },
  { x: '39px', y: '89px', rotation: '-5deg' },
  { x: '-43px', y: '-70px', rotation: '-4deg' },
  { x: '45px', y: '-67px', rotation: '7deg' },
] as const;

const dayPhotoRotations = ['-2deg', '1.5deg', '-1deg'] as const;

export const Section = styled.section`
  padding: 4px ${theme.app.pagePadding} 24px;
  background: ${theme.colors.surfaceSubtle};
`;

export const CoverButton = styled.button`
  width: 100%;
  min-height: clamp(440px, calc(100dvh - 198px), 570px);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  padding: 0 0 18px;
  border-radius: ${theme.radius.lg};
  background: rgba(255, 255, 255, 0.74);
  text-align: center;

  &:active {
    background: ${theme.colors.white};
  }
`;

export const PileStage = styled.span`
  position: relative;
  width: 100%;
  min-height: 340px;
  flex: 1 1 auto;
  display: block;
`;

export const PilePhoto = styled.span<{ $index: number; $total: number }>`
  ${({ $index }) => {
    const layout = pileLayouts[$index % pileLayouts.length];
    return `
      transform:
        translate(-50%, -50%)
        translate(${layout.x}, ${layout.y})
        rotate(${layout.rotation});
    `;
  }}
  position: absolute;
  top: 47%;
  left: 50%;
  z-index: ${({ $index, $total }) => $total - $index};
  width: clamp(82px, 26vw, 104px);
  padding: 6px 6px 19px;
  border: 1px solid rgba(17, 19, 24, 0.08);
    background: ${theme.colors.gray200};
  box-shadow: 0 7px 18px rgba(33, 38, 47, 0.1);
  transform-origin: center;
`;

export const PhotoViewport = styled.span`
  width: 100%;
  aspect-ratio: 4 / 5;
  display: block;
  overflow: hidden;
  background: ${theme.colors.gray100};
`;

export const RecordImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
`;

export const ImageFallback = styled.span`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 70% 20%, rgba(145, 200, 210, 0.22), transparent 38%),
    ${theme.colors.gray100};
  color: ${theme.colors.gray400};
`;

export const EmptyPile = styled.span`
  position: absolute;
  top: 47%;
  left: 50%;
  width: 230px;
  height: 190px;
  display: block;
  transform: translate(-50%, -50%);

  > span {
    position: absolute;
    top: 16px;
    left: 68px;
    width: 94px;
    height: 122px;
    display: grid;
    place-items: center;
    padding-bottom: 20px;
    border: 1px dashed ${theme.colors.gray300};
    background: rgba(255, 255, 255, 0.82);
    color: ${theme.colors.gray500};
  }

  > span:first-of-type {
    transform: translate(-55px, 31px) rotate(-10deg);
  }

  > span:nth-of-type(2) {
    transform: translate(55px, 27px) rotate(9deg);
  }

  > span:last-of-type {
    z-index: 1;
    box-shadow: 0 7px 18px rgba(33, 38, 47, 0.07);
    transform: rotate(2deg);
  }
`;

export const CoverCopy = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;

  strong {
    color: ${theme.colors.gray900};
    font-size: 20px;
    font-weight: 780;
    letter-spacing: -0.045em;
    line-height: 1.35;
  }

  span {
    min-height: 36px;
    display: inline-flex;
    align-items: center;
    gap: 2px;
    margin-top: 5px;
    color: ${theme.colors.gray500};
    font-size: 11px;
    font-weight: 550;
  }
`;

export const ExpandedSection = styled.section`
  min-height: calc(100dvh - ${theme.app.bottomNavSpace});
  padding: 8px ${theme.app.pagePadding} 32px;
  background: ${theme.colors.surfaceSubtle};
`;

export const MonthToolbar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 29px;
`;

export const CollapseButton = styled.button`
  min-width: 88px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${theme.colors.gray500};
  font-size: 11px;
  font-weight: 650;
`;

export const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const MonthArrow = styled.button`
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  color: ${theme.colors.gray400};
`;

export const MonthTitle = styled.h2`
  min-width: 92px;
  color: ${theme.colors.gray900};
  font-size: 14px;
  font-weight: 780;
  letter-spacing: -0.035em;
  text-align: center;
`;

export const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 34px;
`;

export const DayGroup = styled.article`
  min-width: 0;
`;

export const DayHeading = styled.h3`
  min-height: 26px;
  display: flex;
  align-items: baseline;
  gap: 7px;
  margin-bottom: 9px;
  color: ${theme.colors.gray400};
  font-size: 12px;
  font-weight: 550;

  strong {
    color: ${theme.colors.gray900};
    font-size: 15px;
    font-weight: 780;
    letter-spacing: -0.03em;
  }
`;

export const DayPhotos = styled.div`
  min-height: 134px;
  display: flex;
  align-items: flex-start;
  padding: 4px 2px 8px;
`;

export const DayPhotoButton = styled.button<{
  $index: number;
  $count: number;
}>`
  position: relative;
  z-index: ${({ $index }) => 5 - $index};
  width: ${({ $count }) => {
    if ($count === 1) return 'min(34%, 116px)';
    if ($count === 2) return 'min(42%, 116px)';
    return 'min(calc((100% + 18px) / 3), 116px)';
  }};
  flex: 0 0 auto;
  padding: 6px 6px 8px;
  border: 1px solid rgba(17, 19, 24, 0.08);
  background: ${theme.colors.white};
  box-shadow: 0 5px 13px rgba(33, 38, 47, 0.08);
  text-align: left;
  transform: rotate(${({ $index }) => dayPhotoRotations[$index % dayPhotoRotations.length]});

  & + & {
    margin-left: -9px;
  }

  &:active {
    z-index: 10;
    transform: rotate(0) translateY(-2px);
  }
`;

export const DayPhotoViewport = styled.span`
  width: 100%;
  aspect-ratio: 4 / 5;
  display: block;
  overflow: hidden;
  background: ${theme.colors.gray100};
`;

export const PhotoNote = styled.span`
  max-width: 100%;
  height: 22px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  padding: 0 2px;
  color: ${theme.colors.gray500};
  font-size: 9px;
  font-weight: 550;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const EmptyMonth = styled.div`
  min-height: 390px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: ${theme.colors.gray500};
  text-align: center;

  strong {
    margin-top: 17px;
    color: ${theme.colors.gray900};
    font-size: 17px;
    font-weight: 780;
    letter-spacing: -0.04em;
  }

  > span:not(:first-of-type) {
    margin-top: 6px;
    font-size: 11px;
  }
`;

export const EmptyMonthIcon = styled.span`
  width: 62px;
  height: 62px;
  display: grid;
  place-items: center;
  border-radius: 21px;
  background: ${theme.colors.white};
  color: ${theme.colors.gray400};
`;

export const AddButton = styled.button`
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 16px;
  padding: 0 17px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray900};
  color: ${theme.colors.white};
  font-size: 12px;
  font-weight: 700;
`;

export const StatusButton = styled.button`
  width: 100%;
  min-height: clamp(440px, calc(100dvh - 198px), 570px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.white};
  color: ${theme.colors.gray500};

  strong {
    margin-top: 15px;
    color: ${theme.colors.gray900};
    font-size: 15px;
    font-weight: 750;
  }

  > span:last-of-type {
    margin-top: 5px;
    font-size: 11px;
  }
`;

export const StatusIcon = styled.span`
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray600};
`;

export const CoverSkeleton = styled.div`
  min-height: clamp(440px, calc(100dvh - 198px), 570px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 0 0 30px;
  border-radius: ${theme.radius.lg};
  background: rgba(255, 255, 255, 0.7);
`;

export const SkeletonPile = styled.span`
  position: relative;
  width: 230px;
  min-height: 320px;
  display: block;

  span {
    position: absolute;
    top: 84px;
    left: 68px;
    width: 94px;
    height: 126px;
    border: 6px solid ${theme.colors.white};
    background: ${skeletonBackground};
    background-size: 220% 100%;
    animation: ${shimmer} 1.35s linear infinite;
  }

  span:first-of-type {
    transform: translate(-55px, 31px) rotate(-10deg);
  }

  span:nth-of-type(2) {
    transform: translate(55px, 27px) rotate(9deg);
  }

  span:last-of-type {
    z-index: 1;
    transform: rotate(2deg);
  }
`;

export const SkeletonLine = styled.span<{ $width: string; $large?: boolean }>`
  width: ${({ $width }) => $width};
  height: ${({ $large }) => ($large ? '18px' : '11px')};
  display: block;
  border-radius: ${theme.radius.full};
  background: ${skeletonBackground};
  background-size: 220% 100%;
  animation: ${shimmer} 1.35s linear infinite;
`;
