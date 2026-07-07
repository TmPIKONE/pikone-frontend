import styled from '@emotion/styled';
import { theme } from '~/styles/theme';
import type { ToastType } from './Toast.types';

const TYPE_COLOR: Record<ToastType, string> = {
  success: '#A8B2C1',
  error: theme.colors.error,
  info: theme.colors.primary,
};

export const ToastViewport = styled.div`
  position: fixed;
  bottom: calc(${theme.nav.height} + 42px + env(safe-area-inset-bottom));
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  width: min(calc(100% - 32px), 250px);
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
`;

export const ToastItem = styled.div<{ $type: ToastType }>`
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 52px;
  padding: 13px 16px;
  border-radius: 14px;
  background: rgba(63, 70, 82, 0.94);
  color: ${theme.colors.white};
  box-shadow: 0 12px 28px rgba(17, 24, 39, 0.22);
  backdrop-filter: blur(12px);
  animation: toast-in 180ms ease-out;

  svg {
    flex: 0 0 auto;
    color: ${({ $type }) => TYPE_COLOR[$type]};
  }

  @keyframes toast-in {
    from {
      opacity: 0;
      transform: translateY(8px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const IconCircle = styled.span<{ $type: ToastType }>`
  width: 24px;
  height: 24px;
  border-radius: ${theme.radius.full};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.12);

  svg {
    color: ${({ $type }) => TYPE_COLOR[$type]};
  }
`;

export const ToastText = styled.p`
  min-width: 0;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};
  line-height: 1.35;
  word-break: keep-all;
`;
