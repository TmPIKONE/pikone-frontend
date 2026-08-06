import styled from '@emotion/styled';
import { ChevronDown } from 'lucide-react';

export const Trigger = styled.button`
  width: 100%;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 14px;
  border: 1px solid #d8e0eb;
  border-radius: 12px;
  background: #ffffff;
  color: #152033;
  font: inherit;
  font-size: 16px;
  font-weight: 650;
  letter-spacing: -0.02em;
  text-align: left;
  cursor: pointer;

  &:focus-visible {
    outline: none;
    border-color: #6999cd;
    box-shadow: 0 0 0 3px rgba(105, 153, 205, 0.16);
  }
`;

export const TriggerIcon = styled(ChevronDown, {
  shouldForwardProp: (prop) => prop !== '$isOpen',
})<{ $isOpen: boolean }>`
  flex-shrink: 0;
  color: #708198;
  transform: rotate(${({ $isOpen }) => ($isOpen ? '180deg' : '0deg')});
  transition: transform 0.2s ease;
`;

export const WheelFrame = styled.div`
  position: relative;
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
  height: 48px;
  border: 1px solid #e0e8f3;
  border-radius: 14px;
  background: #f4f8fd;
  transform: translateY(-50%);
  pointer-events: none;
`;

export const Wheel = styled.div`
  position: relative;
  z-index: 1;
  height: 192px;
  overflow-y: auto;
  padding: 72px 0;
  scroll-snap-type: y mandatory;
  overscroll-behavior: contain;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const WheelItem = styled.button<{ $isSelected: boolean }>`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ $isSelected }) => ($isSelected ? '#152033' : '#a2adbc')};
  font-size: ${({ $isSelected }) => ($isSelected ? '18px' : '15px')};
  font-weight: ${({ $isSelected }) => ($isSelected ? 800 : 650)};
  letter-spacing: -0.025em;
  scroll-snap-align: center;
  cursor: pointer;
  transition:
    color 0.16s ease,
    font-size 0.16s ease;
`;
