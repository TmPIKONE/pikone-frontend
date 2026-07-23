import styled from '@emotion/styled';

export const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-top: env(safe-area-inset-top, 0px);
  background: rgba(15, 23, 42, 0.34);
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition:
    opacity 0.22s ease,
    visibility 0.22s ease;
`;

export const Sheet = styled.section<{ $isOpen: boolean }>`
  width: min(100%, 480px);
  padding: 10px 18px calc(env(safe-area-inset-bottom, 0px) + 18px);
  border-radius: 28px 28px 0 0;
  background: #ffffff;
  box-shadow: 0 -18px 50px rgba(15, 23, 42, 0.18);
  transform: translateY(${({ $isOpen }) => ($isOpen ? '0' : '24px')});
  transition: transform 0.22s ease;
`;

export const Handle = styled.div`
  width: 42px;
  height: 5px;
  margin: 0 auto 12px;
  border-radius: 999px;
  background: #d8e0eb;
`;

export const Header = styled.div`
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const Title = styled.h2`
  margin: 0;
  color: #111827;
  font-size: 18px;
  font-weight: 820;
  letter-spacing: -0.035em;
`;

export const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #f3f6fa;
  color: #53647a;
  cursor: pointer;

  &:active {
    transform: scale(0.95);
  }
`;

export const Wheels = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1.15fr 0.9fr 0.9fr;
  gap: 6px;
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

export const ApplyButton = styled.button`
  width: 100%;
  min-height: 52px;
  border: 0;
  border-radius: 17px;
  background: #111827;
  color: #ffffff;
  font-size: 15px;
  font-weight: 780;
  letter-spacing: -0.02em;
  cursor: pointer;

  &:active {
    transform: scale(0.99);
  }
`;
