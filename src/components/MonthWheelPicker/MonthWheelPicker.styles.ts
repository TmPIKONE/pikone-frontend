import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Description = styled.p`
  margin: 2px 0 8px;
  color: ${theme.colors.gray500};
  font-size: 12px;
  font-weight: 650;
`;

export const Wheels = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 8px;
  margin: 8px 0 16px;
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    z-index: 3;
    left: 0;
    width: 100%;
    height: 62px;
    pointer-events: none;
  }

  &::before {
    top: 0;
    background: linear-gradient(to bottom, #ffffff 18%, rgba(255, 255, 255, 0));
  }

  &::after {
    bottom: 0;
    background: linear-gradient(to top, #ffffff 18%, rgba(255, 255, 255, 0));
  }
`;

export const SelectionHighlight = styled.div`
  position: absolute;
  z-index: 0;
  top: 50%;
  left: 0;
  width: 100%;
  height: 44px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: 14px;
  background: ${theme.colors.gray100};
  transform: translateY(-50%);
  pointer-events: none;
`;

export const Wheel = styled.div`
  position: relative;
  z-index: 1;
  height: 176px;
  overflow-y: auto;
  padding: 66px 0;
  scroll-snap-type: y mandatory;
  overscroll-behavior: contain;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const WheelItem = styled.button<{ $isSelected: boolean }>`
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: ${({ $isSelected }) => ($isSelected ? theme.colors.black : theme.colors.gray400)};
  font-size: ${({ $isSelected }) => ($isSelected ? '18px' : '15px')};
  font-weight: ${({ $isSelected }) => ($isSelected ? 850 : 650)};
  letter-spacing: -0.025em;
  scroll-snap-align: center;
`;
