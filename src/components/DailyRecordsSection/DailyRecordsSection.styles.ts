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

export const Section = styled.section`
  min-height: calc(100dvh - ${theme.app.bottomNavSpace} - 66px);
  padding: 0 ${theme.app.pagePadding} 40px;
  background: #fdfdfd;
`;

export const Hero = styled.div`
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  padding-top: 18px;
`;

export const EmptyTodayHero = styled.div`
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  padding-top: 18px;
`;

export const HeroIntro = styled.header<{ $compact?: boolean }>`
  padding: 2px 2px ${({ $compact }) => ($compact ? '14px' : '18px')};
  text-align: left;
`;

export const HeroEyebrow = styled.span`
  display: block;
  margin-bottom: 6px;
  color: #6aaec0;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: -0.025em;
`;

export const HeroLead = styled.h2`
  margin: 0;
  color: ${theme.colors.gray900};
  font-size: clamp(21px, 5.5vw, 25px);
  font-weight: 820;
  letter-spacing: -0.05em;
  line-height: 1.28;
`;

export const HeroDescription = styled.p`
  margin: 7px 0 0;
  color: ${theme.colors.gray500};
  font-size: 12px;
  font-weight: 550;
  letter-spacing: -0.02em;
  line-height: 1.5;
`;

export const PrimaryAddRecordButton = styled.button`
  width: 100%;
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.sky};
  color: ${theme.colors.white};
  box-shadow: 0 8px 20px rgba(97, 161, 174, 0.2);
  font-size: 14px;
  font-weight: 780;
  letter-spacing: -0.03em;
  transition:
    transform ${theme.motion.fast} ${theme.motion.easing},
    filter ${theme.motion.fast} ${theme.motion.easing};

  &:active {
    transform: scale(0.992);
    filter: brightness(0.97);
  }
`;

export const MemorySection = styled.section`
  margin-top: 30px;
`;

export const MemoryHeading = styled.h3`
  margin: 0 2px 12px;
  color: ${theme.colors.gray700};
  font-size: 14px;
  font-weight: 760;
  letter-spacing: -0.035em;
  line-height: 1.45;
`;

export const PhotoButton = styled.button`
  width: 100%;
  display: block;
  padding: 6px;
  border: 1px solid rgba(17, 19, 24, 0.06);
  border-radius: 24px;
  background: ${theme.colors.white};
  box-shadow: 0 9px 24px rgba(33, 38, 47, 0.1);
  text-align: left;
  transition:
    transform ${theme.motion.fast} ${theme.motion.easing},
    box-shadow ${theme.motion.fast} ${theme.motion.easing};

  &:active {
    transform: scale(0.994);
    box-shadow: 0 6px 17px rgba(33, 38, 47, 0.09);
  }
`;

export const PhotoViewport = styled.span`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  display: block;
  overflow: hidden;
  border-radius: 19px;
  background: ${theme.colors.gray100};
`;

export const PhotoDateBadge = styled.span`
  position: absolute;
  left: 12px;
  bottom: 11px;
  display: inline-flex;
  align-items: center;
  min-height: 27px;
  padding: 0 10px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: ${theme.radius.full};
  background: rgba(20, 23, 29, 0.5);
  backdrop-filter: blur(7px);
  color: ${theme.colors.white};
  font-size: 10px;
  font-weight: 760;
  letter-spacing: -0.02em;
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
    radial-gradient(circle at 72% 18%, rgba(145, 200, 210, 0.23), transparent 36%),
    ${theme.colors.gray100};
  color: ${theme.colors.gray400};
`;

export const RecordSummary = styled.div`
  padding: 15px 3px 0;
  text-align: left;
`;

export const RecordTitle = styled.h3`
  margin: 0;
  color: ${theme.colors.gray900};
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1.35;
`;

export const RecordMeta = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin: 6px 0 0;
  color: ${theme.colors.gray500};
  font-size: 11px;
  font-weight: 560;
  line-height: 1.45;

  i {
    color: ${theme.colors.gray300};
    font-style: normal;
  }
`;

export const EmptyState = styled.div`
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  padding-top: 30px;
  text-align: left;
`;

export const EmptyCopy = styled.div`
  padding: 0 2px 18px;
`;

export const FirstRecordHint = styled.p`
  max-width: 310px;
  margin: 18px auto 0;
  color: ${theme.colors.gray400};
  font-size: 11px;
  font-weight: 550;
  letter-spacing: -0.02em;
  line-height: 1.55;
  text-align: center;
`;

export const StatusButton = styled.button`
  width: 100%;
  min-height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: ${theme.colors.gray500};
  text-align: center;

  strong {
    margin-top: 5px;
    color: ${theme.colors.gray700};
    font-size: 15px;
    font-weight: 760;
  }

  span:last-of-type {
    font-size: 11px;
    font-weight: 550;
  }
`;

export const StatusIcon = styled.span`
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray400};
`;

export const HeroSkeleton = styled.div`
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  padding-top: 26px;
`;

export const SkeletonPhoto = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  margin: 14px 0 17px;
  border-radius: 24px;
  background: ${skeletonBackground};
  background-size: 220% 100%;
  animation: ${shimmer} 1.25s linear infinite;
`;

export const SkeletonButton = styled.div`
  width: 100%;
  height: 52px;
  margin: 18px 0 30px;
  border-radius: ${theme.radius.lg};
  background: ${skeletonBackground};
  background-size: 220% 100%;
  animation: ${shimmer} 1.25s linear infinite;
`;

export const SkeletonLine = styled.span<{ $width: string; $large?: boolean }>`
  width: ${({ $width }) => $width};
  height: ${({ $large }) => ($large ? '21px' : '11px')};
  display: block;
  margin-top: ${({ $large }) => ($large ? '10px' : '7px')};
  border-radius: ${theme.radius.full};
  background: ${skeletonBackground};
  background-size: 220% 100%;
  animation: ${shimmer} 1.25s linear infinite;
`;
