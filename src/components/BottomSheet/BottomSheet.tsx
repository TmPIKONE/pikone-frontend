import { useEffect, useId, useRef } from 'react';
import type { MouseEvent } from 'react';
import { X } from 'lucide-react';
import type { BottomSheetProps } from './BottomSheet.types';
import * as S from './BottomSheet.styles';

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export const BottomSheet = ({
  isOpen,
  title,
  onClose,
  children,
  ariaLabel,
  closeLabel = '선택 창 닫기',
  actionLabel,
  actionDisabled = false,
  onAction,
  zIndex = 1000,
}: BottomSheetProps) => {
  const titleId = useId();
  const sheetRef = useRef<HTMLElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusFrame = window.requestAnimationFrame(() => {
      const focusable = sheetRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      focusable?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab' || !sheetRef.current) return;

      const focusable = Array.from(
        sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) {
        event.preventDefault();
        return;
      }

      if (
        event.shiftKey &&
        (document.activeElement === first || !sheetRef.current.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [isOpen]);

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <S.Overlay $isOpen={isOpen} $zIndex={zIndex} onClick={handleOverlayClick} aria-hidden={!isOpen}>
      <S.Sheet
        ref={sheetRef}
        $isOpen={isOpen}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : titleId}
      >
        <S.Handle aria-hidden="true" />
        <S.Header>
          <S.Title id={titleId}>{title}</S.Title>
          <S.CloseButton type="button" onClick={onClose} aria-label={closeLabel}>
            <X size={19} strokeWidth={2.2} aria-hidden="true" />
          </S.CloseButton>
        </S.Header>
        <S.Content>{children}</S.Content>
        {actionLabel && onAction && (
          <S.ActionButton type="button" onClick={onAction} disabled={actionDisabled}>
            {actionLabel}
          </S.ActionButton>
        )}
      </S.Sheet>
    </S.Overlay>
  );
};
