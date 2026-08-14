import type { RefObject } from 'react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  pendingLabel?: string;
  isPending?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
  zIndex?: number;
}
