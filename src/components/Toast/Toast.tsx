import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Check, Info, X } from 'lucide-react';
import * as S from './Toast.styles';
import type { ToastContextValue, ToastMessage, ToastProviderProps, ToastType } from './Toast.types';

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

const TOAST_DURATION_MS = 2400;

const ToastIcon = ({ type }: { type: ToastType }) => {
  if (type === 'error') return <X size={15} strokeWidth={3} />;
  if (type === 'info') return <Info size={15} strokeWidth={2.6} />;
  return <Check size={15} strokeWidth={3} />;
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now() + Math.random();

    setToasts((prev) => [...prev, { id, type, message }].slice(-3));

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, TOAST_DURATION_MS);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <S.ToastViewport aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <S.ToastItem key={toast.id} $type={toast.type}>
            <S.IconCircle $type={toast.type}>
              <ToastIcon type={toast.type} />
            </S.IconCircle>
            <S.ToastText>{toast.message}</S.ToastText>
          </S.ToastItem>
        ))}
      </S.ToastViewport>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
