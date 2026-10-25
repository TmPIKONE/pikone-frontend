import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Section = styled.section`
  & + & {
    margin-top: 12px;
    padding-top: 14px;
    border-top: 1px solid ${theme.colors.gray100};
  }
`;

export const SectionLabel = styled.span`
  display: block;
  margin-bottom: 5px;
  color: ${theme.colors.gray500};
  font-size: 10px;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

export const Wheels = styled.div<{ $columns: number }>`
  position: relative;
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, minmax(0, 1fr));
  gap: 5px;
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    z-index: 3;
    left: 0;
    width: 100%;
    height: 56px;
    pointer-events: none;
  }

  &::before {
    top: 0;
    background: linear-gradient(to bottom, ${theme.colors.white} 18%, rgba(255, 255, 255, 0));
  }

  &::after {
    bottom: 0;
    background: linear-gradient(to top, ${theme.colors.white} 18%, rgba(255, 255, 255, 0));
  }
`;

export const SelectionHighlight = styled.div`
  position: absolute;
  z-index: 0;
  top: 50%;
  left: 0;
  width: 100%;
  height: 44px;
  border: 1px solid #e0e8f3;
  border-radius: 14px;
  background: #f4f8fd;
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
  padding: 0 2px;
  border: 0;
  background: transparent;
  color: ${({ $isSelected }) => ($isSelected ? '#152033' : '#a2adbc')};
  font-size: ${({ $isSelected }) => ($isSelected ? '17px' : '14px')};
  font-weight: ${({ $isSelected }) => ($isSelected ? 800 : 650)};
  letter-spacing: -0.025em;
  scroll-snap-align: center;
  white-space: nowrap;
  cursor: pointer;
  transition:
    color 0.16s ease,
    font-size 0.16s ease;
`;

export const ClearButton = styled.button`
  width: 100%;
  min-height: 42px;
  margin-top: 2px;
  border: 0;
  border-radius: 13px;
  background: ${theme.colors.gray50};
  color: ${theme.colors.gray500};
  font-size: 11px;
  font-weight: 800;
`;
