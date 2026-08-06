import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Overlay = styled.div<{ $isOpen: boolean; $zIndex: number }>`
  position: fixed;
  inset: 0;
  z-index: ${({ $zIndex }) => $zIndex};
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-top: env(safe-area-inset-top, 0px);
  background: rgba(15, 23, 42, 0.36);
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  transition:
    opacity ${theme.motion.normal} ${theme.motion.easing},
    visibility ${theme.motion.normal} ${theme.motion.easing};
`;

export const Sheet = styled.section<{ $isOpen: boolean }>`
  width: min(100%, 480px);
  max-height: calc(100dvh - env(safe-area-inset-top, 0px) - 12px);
  overflow-y: auto;
  padding: 10px 18px calc(env(safe-area-inset-bottom, 0px) + 18px);
  border-radius: 28px 28px 0 0;
  background: ${theme.colors.surface};
  box-shadow: ${theme.shadows.floating};
  transform: translateY(${({ $isOpen }) => ($isOpen ? '0' : '24px')});
  transition: transform ${theme.motion.normal} ${theme.motion.easing};
`;

export const Handle = styled.div`
  width: 42px;
  height: 5px;
  margin: 0 auto 12px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray300};
`;

export const Header = styled.header`
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const Title = styled.h2`
  margin: 0;
  color: ${theme.colors.text};
  font-size: 18px;
  font-weight: ${theme.fontWeights.bold};
  letter-spacing: -0.035em;
`;

export const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.gray100};
  color: ${theme.colors.textMuted};
  cursor: pointer;

  &:active {
    transform: scale(0.95);
  }
`;

export const Content = styled.div`
  min-width: 0;
`;

export const ActionButton = styled.button`
  width: 100%;
  min-height: 52px;
  margin-top: 16px;
  border: 0;
  border-radius: 17px;
  background: ${theme.colors.text};
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.bold};
  letter-spacing: -0.02em;
  cursor: pointer;

  &:active:not(:disabled) {
    transform: scale(0.99);
  }

  &:disabled {
    background: ${theme.colors.gray300};
    cursor: not-allowed;
  }
`;
