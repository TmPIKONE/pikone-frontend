import type { ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

export interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

export interface ToastProviderProps {
  children: ReactNode;
}
