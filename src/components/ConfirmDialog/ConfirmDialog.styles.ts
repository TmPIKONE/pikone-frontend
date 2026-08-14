import styled from '@emotion/styled';
import { theme } from '~/styles/theme';

export const Overlay = styled.div<{ $zIndex: number }>`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 50%;
  z-index: ${({ $zIndex }) => $zIndex};
  width: min(100%, ${theme.app.maxWidth});
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(env(safe-area-inset-top, 0px) + 24px) calc(env(safe-area-inset-right, 0px) + 32px)
    calc(env(safe-area-inset-bottom, 0px) + 24px) calc(env(safe-area-inset-left, 0px) + 32px);
  overflow-y: auto;
  overscroll-behavior: contain;
  background: rgba(17, 19, 24, 0.5);
  transform: translateX(-50%);
  animation: confirm-dialog-fade-in ${theme.motion.fast} ease-out;

  @keyframes confirm-dialog-fade-in {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
`;

export const Card = styled.div`
  width: 100%;
  max-width: 400px;
  max-height: calc(
    100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 48px
  );
  box-sizing: border-box;
  overflow-y: auto;
  padding: 28px 24px 24px;
  border-radius: ${theme.radius.xl};
  background: ${theme.colors.surface};
  color: ${theme.colors.text};
  box-shadow: ${theme.shadows.floating};
  animation: confirm-dialog-card-in ${theme.motion.normal} ${theme.motion.easing};

  @keyframes confirm-dialog-card-in {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.98);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

export const Title = styled.h2`
  margin: 0;
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.bold};
  line-height: 1.35;
  letter-spacing: -0.035em;
  overflow-wrap: anywhere;
`;

export const Description = styled.p`
  margin: 8px 0 0;
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.regular};
  line-height: 1.55;
  letter-spacing: -0.02em;
  overflow-wrap: anywhere;
`;

export const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 34px;
`;

const ActionButton = styled.button`
  min-width: 0;
  min-height: 52px;
  padding: 0 12px;
  border: 0;
  border-radius: ${theme.radius.lg};
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.bold};
  line-height: 1.2;
  letter-spacing: -0.02em;
  transition:
    transform ${theme.motion.fast} ${theme.motion.easing},
    opacity ${theme.motion.fast} ease;

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.56;
  }
`;

export const CancelButton = styled(ActionButton)`
  background: ${theme.colors.gray100};
  color: ${theme.colors.text};
`;

export const ConfirmButton = styled(ActionButton)`
  background: ${theme.colors.gray900};
  color: ${theme.colors.white};
`;
