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
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 10px ${theme.app.pagePadding} 28px;
  background: ${theme.colors.surfaceSubtle};
`;

export const Card = styled.article`
  padding: 17px;
  border: 1px solid rgba(17, 19, 24, 0.035);
  border-radius: 18px;
  background: ${theme.colors.white};
`;

export const CardHeader = styled.header`
  min-height: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

export const TitleGroup = styled.div`
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 7px;
`;

export const CardTitle = styled.h2`
  overflow: hidden;
  color: ${theme.colors.gray700};
  font-size: 15px;
  font-weight: 750;
  letter-spacing: -0.035em;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Count = styled.span`
  flex: 0 0 auto;
  color: ${theme.colors.gray400};
  font-size: 12px;
  font-weight: 650;
`;

export const ViewAllButton = styled.button`
  flex: 0 0 auto;
  min-height: 28px;
  display: inline-flex;
  align-items: center;
  gap: 1px;
  color: ${theme.colors.gray400};
  font-size: 11px;
  font-weight: 600;

  &:active {
    color: ${theme.colors.gray700};
  }
`;

export const FeaturedPhotoButton = styled.button`
  position: relative;
  width: 100%;
  height: 128px;
  display: block;
  overflow: hidden;
  border-radius: 13px;
  background: ${theme.colors.gray100};
  text-align: left;

  &:active img {
    transform: scale(1.018);
  }
`;

export const RecordImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform ${theme.motion.normal} ${theme.motion.easing};
`;

export const ImageFallback = styled.span`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 75% 16%, rgba(145, 200, 210, 0.26), transparent 34%),
    ${theme.colors.gray100};
  color: ${theme.colors.gray400};
`;

export const FeaturedOverlay = styled.span`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 44%, rgba(17, 19, 24, 0.55) 100%);
  pointer-events: none;
`;

export const PhotoDate = styled.span`
  position: absolute;
  left: 14px;
  bottom: 11px;
  z-index: 1;
  color: rgba(255, 255, 255, 0.9);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: -0.01em;
`;

export const GalleryButton = styled.button<{ $count: number }>`
  width: 100%;
  height: 206px;
  display: grid;
  grid-template-columns: ${({ $count }) => ($count === 1 ? '1fr' : 'minmax(0, 2fr) minmax(0, 1fr)')};
  grid-template-rows: ${({ $count }) => ($count <= 2 ? '1fr' : 'repeat(2, minmax(0, 1fr))')};
  gap: 4px;
  overflow: hidden;
  border-radius: 13px;
  background: ${theme.colors.gray100};

  &:active img {
    transform: scale(1.015);
  }
`;

export const GalleryCell = styled.span<{ $index: number; $count: number }>`
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: ${theme.colors.gray100};

  ${({ $count, $index }) => {
    if ($count === 1) {
      return `grid-column: 1; grid-row: 1;`;
    }

    if ($count === 2) {
      return $index === 0 ? `grid-column: 1; grid-row: 1;` : `grid-column: 2; grid-row: 1;`;
    }

    return $index === 0
      ? `grid-column: 1; grid-row: 1 / span 2;`
      : `grid-column: 2; grid-row: ${$index};`;
  }}
`;

export const EmptyPhotoButton = styled.button`
  position: relative;
  width: 100%;
  min-height: 184px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 18px;
  overflow: hidden;
  border: 1px dashed ${theme.colors.gray300};
  border-radius: 13px;
  background:
    radial-gradient(circle at 88% 8%, rgba(145, 200, 210, 0.23), transparent 32%),
    ${theme.colors.gray50};
  text-align: left;

  &:active {
    background-color: ${theme.colors.gray100};
  }
`;

export const EmptyIcon = styled.span`
  position: absolute;
  top: 17px;
  right: 17px;
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 15px;
  background: ${theme.colors.white};
  color: ${theme.colors.gray600};
`;

export const EmptyText = styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  strong {
    color: ${theme.colors.gray900};
    font-size: 19px;
    font-weight: 820;
    letter-spacing: -0.05em;
    line-height: 1.3;
  }

  span {
    margin-top: 7px;
    color: ${theme.colors.gray500};
    font-size: 11px;
    font-weight: 550;
    line-height: 1.45;
  }
`;

export const AddLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 1px;
  margin-top: 13px;
  color: ${theme.colors.gray700};
  font-size: 12px;
  font-weight: 750;
`;

export const StatusCard = styled.button`
  width: 100%;
  min-height: 92px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 13px;
  padding: 17px;
  border: 1px solid rgba(17, 19, 24, 0.035);
  border-radius: 18px;
  background: ${theme.colors.white};
  color: ${theme.colors.gray400};
  text-align: left;
`;

export const StatusIcon = styled.span`
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray600};
`;

export const StatusCopy = styled.span`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    color: ${theme.colors.gray700};
    font-size: 14px;
    font-weight: 750;
  }

  span {
    color: ${theme.colors.gray500};
    font-size: 11px;
    font-weight: 500;
  }
`;

export const SkeletonLine = styled.span<{ $width: string }>`
  width: ${({ $width }) => $width};
  height: 12px;
  border-radius: ${theme.radius.full};
  background: ${skeletonBackground};
  background-size: 220% 100%;
  animation: ${shimmer} 1.35s linear infinite;
`;

export const SkeletonPhoto = styled.span<{ $height: string }>`
  width: 100%;
  height: ${({ $height }) => $height};
  display: block;
  border-radius: 13px;
  background: ${skeletonBackground};
  background-size: 220% 100%;
  animation: ${shimmer} 1.35s linear infinite;
`;
