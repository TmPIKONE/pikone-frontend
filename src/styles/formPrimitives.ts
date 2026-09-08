import { css } from '@emotion/react';
import { theme } from './theme';

const disabled = css`
  &:disabled {
    opacity: 0.56;
    cursor: not-allowed;
  }
`;

const actionBase = css`
  min-height: 48px;
  padding: 0 18px;
  border-radius: ${theme.radius.md};
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.semibold};
  line-height: 1.2;
  cursor: pointer;
  transition:
    transform ${theme.motion.fast} ${theme.motion.easing},
    background-color ${theme.motion.fast} ease,
    border-color ${theme.motion.fast} ease;

  &:active:not(:disabled) {
    transform: scale(0.99);
  }

  ${disabled}
`;

export const formPrimitives = {
  field: css`
    display: flex;
    flex-direction: column;
    gap: 7px;
  `,
  label: css`
    color: ${theme.colors.textMuted};
    font-size: ${theme.fontSizes.sm};
    font-weight: ${theme.fontWeights.medium};
    line-height: 1.35;
  `,
  control: css`
    width: 100%;
    min-height: 48px;
    padding: 0 14px;
    border: 0;
    border-radius: 20px;
    background: ${theme.colors.gray100};
    color: ${theme.colors.text};
    font: inherit;
    font-size: 16px;
    transition:
      border-color ${theme.motion.fast} ease,
      box-shadow ${theme.motion.fast} ease;

    &::placeholder {
      color: ${theme.colors.gray400};
    }

    &:focus-visible {
      outline: none;
      outline: 2px solid ${theme.colors.black};
      box-shadow: none;
    }

    ${disabled}
  `,
  primaryAction: css`
    ${actionBase}
    border: 1px solid ${theme.colors.primary};
    background: ${theme.colors.primary};
    color: ${theme.colors.white};

    &:disabled {
      border-color: ${theme.colors.gray300};
      background: ${theme.colors.gray300};
    }
  `,
  secondaryAction: css`
    ${actionBase}
    border: 1px solid ${theme.colors.gray300};
    background: ${theme.colors.surface};
    color: ${theme.colors.gray700};
  `,
  dangerAction: css`
    ${actionBase}
    border: 1px solid ${theme.colors.error};
    background: ${theme.colors.surface};
    color: ${theme.colors.error};
  `,
} as const;
