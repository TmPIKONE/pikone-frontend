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
    #eceef2 20%,
    #f7f7f9 38%,
    #eceef2 56%
  )
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 ${theme.app.pagePadding} 26px;
  background: transparent;
`;

export const TodayCard = styled.article`
  width: 100%;
  padding: 20px 18px 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.97);
`;

export const CardHeader = styled.header`
  min-height: 56px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

export const CardTitleGroup = styled.div`
  min-width: 0;
`;

export const CardTitle = styled.h2`
  margin: 0;
  color: #090a0c;
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -0.055em;
  line-height: 1.1;
`;

export const CardDate = styled.p`
  margin: 5px 0 0;
  color: #9b9da3;
  font-size: 13px;
  font-weight: 720;
  letter-spacing: -0.035em;
`;

export const CardDecorations = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 3px;
  color: #b4b5ba;
`;

export const TodayPhotoButton = styled.button`
  width: 100%;
  display: block;
  margin-top: 12px;
  text-align: left;
`;

export const TodayPhotoViewport = styled.span`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  display: block;
  overflow: hidden;
  border-radius: 11px;
  background: #eef0f4;
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
  background: #eef0f4;
  color: #b4b7bd;
`;

export const PhotoScrim = styled.span`
  position: absolute;
  inset: auto 0 0;
  height: 48%;
  background: linear-gradient(to top, rgba(9, 10, 12, 0.58), rgba(9, 10, 12, 0));
  pointer-events: none;
`;

export const PhotoCopy = styled.span`
  position: absolute;
  left: 15px;
  right: 15px;
  bottom: 13px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: #fff;

  strong {
    overflow: hidden;
    font-size: 16px;
    font-weight: 850;
    letter-spacing: -0.04em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    overflow: hidden;
    color: rgba(255, 255, 255, 0.84);
    font-size: 11px;
    font-weight: 620;
    letter-spacing: -0.03em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const AddRecordButton = styled.button`
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 12px;
  padding: 0 16px;
  border-radius: 10px;
  background: #f0f1f5;
  color: #83858c;
  font-size: 15px;
  font-weight: 780;
  letter-spacing: -0.04em;
  text-align: left;

  &:active {
    background: #e9eaee;
  }
`;

export const SecondaryCard = styled.article`
  width: 100%;
  padding: 20px 18px 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.97);
`;

export const SecondaryHeader = styled.header`
  min-height: 34px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const SecondaryTitle = styled.h2`
  margin: 0;
  color: #090a0c;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: -0.055em;
  line-height: 1.1;
`;

export const SmallListIcon = styled.span`
  display: grid;
  place-items: center;
  color: #b4b5ba;
`;

export const PastRecordButton = styled.button`
  width: 100%;
  min-height: 78px;
  display: grid;
  grid-template-columns: 86px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  padding: 8px 10px 8px 8px;
  border-radius: 11px;
  background: #f0f1f5;
  color: #9a9ca2;
  text-align: left;
`;

export const PastImage = styled.span`
  width: 86px;
  height: 62px;
  display: block;
  overflow: hidden;
  border-radius: 8px;
  background: #e5e7eb;
`;

export const PastCopy = styled.span`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;

  strong {
    overflow: hidden;
    color: #686b72;
    font-size: 14px;
    font-weight: 820;
    letter-spacing: -0.04em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    color: #a3a5ab;
    font-size: 11px;
    font-weight: 650;
  }
`;

export const AiButton = styled.button`
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 12px;
  padding: 0 16px;
  border-radius: 10px;
  background: #f0f1f5;
  color: #83858c;
  font-size: 15px;
  font-weight: 780;
  letter-spacing: -0.04em;
  text-align: left;

  &:active {
    background: #e9eaee;
  }
`;

export const StatusButton = styled.button`
  width: 100%;
  min-height: 120px;
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.97);
  color: #999ba1;
  text-align: left;

  > span:last-child {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 11px;
    font-weight: 600;
  }

  strong {
    color: #5f6269;
    font-size: 14px;
    font-weight: 800;
  }
`;

export const StatusIcon = styled.span`
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #f0f1f5;
  color: #9da0a6;
`;

export const CardSkeleton = styled.div<{ $short?: boolean }>`
  width: 100%;
  height: ${({ $short }) => ($short ? '126px' : '188px')};
  border-radius: 22px;
  background: ${skeletonBackground};
  background-size: 220% 100%;
  animation: ${shimmer} 1.25s linear infinite;
`;
