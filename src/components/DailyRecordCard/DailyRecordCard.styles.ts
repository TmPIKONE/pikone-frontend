import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Card = styled.button`
  position: relative;
  min-width: 0;
  min-height: 220px;
  overflow: hidden;
  padding: 18px;
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

export const Image = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Overlay = styled.span<{ $hasImage: boolean }>`
  position: absolute;
  inset: 0;
  background: ${({ $hasImage }) =>
    $hasImage
      ? 'linear-gradient(180deg, rgba(18, 34, 58, 0.08), rgba(18, 34, 58, 0.86))'
      : 'transparent'};
`;

export const TopRow = styled.span`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const Emoji = styled.span`
  font-size: 38px;
  line-height: 1;
`;

export const Check = styled.span`
  color: rgba(255, 255, 255, 0.92);
`;

export const Copy = styled.span`
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 18px;
  z-index: 1;
  display: flex;
  flex-direction: column;
`;

export const SlotLabel = styled.span`
  color: rgba(255, 255, 255, 0.72);
  font-size: 11px;
  font-weight: 750;
`;

export const FoodName = styled.strong`
  overflow: hidden;
  margin-top: 4px;
  color: ${theme.colors.white};
  font-size: 19px;
  font-weight: 900;
  letter-spacing: -0.045em;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Restaurant = styled.span`
  overflow: hidden;
  margin-top: 5px;
  color: rgba(255, 255, 255, 0.64);
  font-size: 10px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
