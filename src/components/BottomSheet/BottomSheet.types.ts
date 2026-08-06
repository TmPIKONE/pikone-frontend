import type { ReactNode } from 'react';

export interface BottomSheetProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  ariaLabel?: string;
  closeLabel?: string;
  actionLabel?: string;
  actionDisabled?: boolean;
  onAction?: () => void;
  zIndex?: number;
}
