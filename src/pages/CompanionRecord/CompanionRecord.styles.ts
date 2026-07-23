import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Container = styled.div`
  padding: 20px 16px 40px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const BackButton = styled.button`
  border: none;
  background: none;
  color: ${theme.colors.gray600};
  font-size: ${theme.fontSizes.lg};
  cursor: pointer;
  padding: 4px 8px;
`;

export const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: ${theme.fontWeights.bold};
`;

export const Subtitle = styled.p`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray500};
`;

export const RecordList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const RecordCard = styled.article`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ImageButton = styled.button`
  display: block;
  width: 100%;
  border-radius: ${theme.radius.lg};
  overflow: hidden;
  background-color: ${theme.colors.gray100};
`;

export const RecordImage = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  background-color: ${theme.colors.gray200};
`;

export const RecordInfo = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

export const FoodNameRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const FoodName = styled.h2`
  min-width: 0;
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.bold};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DateChip = styled.span`
  flex: 0 0 auto;
  padding: 5px 9px;
  border-radius: ${theme.radius.full};
  background-color: ${theme.colors.gray100};
  color: ${theme.colors.gray600};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
`;

export const RestaurantName = styled.p`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.gray700};
`;

export const MetaText = styled.p`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray500};
  line-height: 1.45;
`;

export const EmptyState = styled.div`
  padding: 52px 8px;
  text-align: center;
  color: ${theme.colors.gray500};
  font-size: ${theme.fontSizes.sm};
`;

export const ImageViewer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 22px;
  background: rgba(0, 0, 0, 0.78);
`;

export const ViewerCloseButton = styled.button`
  position: fixed;
  top: calc(18px + env(safe-area-inset-top));
  right: max(18px, calc((100vw - ${theme.app.maxWidth}) / 2 + 18px));
  width: 42px;
  height: 42px;
  border-radius: ${theme.radius.full};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.16);
  color: ${theme.colors.white};
`;

export const ViewerContent = styled.div`
  width: min(100%, ${theme.app.maxWidth});
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const ViewerImage = styled.img`
  width: 100%;
  max-height: 72dvh;
  border-radius: ${theme.radius.lg};
  object-fit: contain;
  background-color: ${theme.colors.black};
`;

export const ViewerCaption = styled.div`
  color: ${theme.colors.white};
`;

export const ViewerFoodName = styled.h2`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.bold};
`;

export const ViewerMeta = styled.p`
  margin-top: 4px;
  font-size: ${theme.fontSizes.sm};
  color: rgba(255, 255, 255, 0.76);
`;
