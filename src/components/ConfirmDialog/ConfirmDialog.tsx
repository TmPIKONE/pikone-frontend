import { useEffect, useId, useRef } from 'react';
import type { MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import * as S from './ConfirmDialog.styles';
import type { ConfirmDialogProps } from './ConfirmDialog.types';

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

let bodyScrollLockCount = 0;
let bodyOverflowBeforeLock = '';

const lockBodyScroll = () => {
  if (bodyScrollLockCount === 0) {
    bodyOverflowBeforeLock = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  bodyScrollLockCount += 1;
};

const unlockBodyScroll = () => {
  bodyScrollLockCount = Math.max(0, bodyScrollLockCount - 1);

  if (bodyScrollLockCount === 0) {
    document.body.style.overflow = bodyOverflowBeforeLock;
  }
};

export const ConfirmDialog = ({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel = '취소',
  pendingLabel = `${confirmLabel} 중...`,
  isPending = false,
  onCancel,
  onConfirm,
  returnFocusRef,
  zIndex = 2000,
}: ConfirmDialogProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const onCancelRef = useRef(onCancel);
  const onConfirmRef = useRef(onConfirm);
  const isPendingRef = useRef(isPending);
  const confirmGuardRef = useRef(false);
  const sawPendingRef = useRef(false);

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    onConfirmRef.current = onConfirm;
  }, [onConfirm]);

  useEffect(() => {
    isPendingRef.current = isPending;

    if (isPending) {
      sawPendingRef.current = true;
    } else if (sawPendingRef.current) {
      sawPendingRef.current = false;
      confirmGuardRef.current = false;
    }
  }, [isPending]);

  useEffect(() => {
    if (!isOpen) {
      confirmGuardRef.current = false;
      sawPendingRef.current = false;
      return;
    }

    const previouslyFocused = returnFocusRef?.current ?? document.activeElement;
    lockBodyScroll();

    const focusFrame = window.requestAnimationFrame(() => {
      cancelButtonRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (!isPendingRef.current && !confirmGuardRef.current) onCancelRef.current();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      if (
        event.shiftKey &&
        (document.activeElement === first || !dialogRef.current.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || !dialogRef.current.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener('keydown', handleKeyDown);
      unlockBodyScroll();
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [isOpen, returnFocusRef]);

  if (!isOpen) return null;

  const requestCancel = () => {
    if (isPendingRef.current || confirmGuardRef.current) return;
    onCancelRef.current();
  };

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) requestCancel();
  };

  const handleConfirm = () => {
    if (isPendingRef.current || confirmGuardRef.current) return;

    confirmGuardRef.current = true;
    try {
      onConfirmRef.current();
    } catch (error) {
      confirmGuardRef.current = false;
      throw error;
    }
  };

  return createPortal(
    <S.Overlay $zIndex={zIndex} onClick={handleOverlayClick}>
      <S.Card
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-busy={isPending}
        tabIndex={-1}
      >
        <S.Title id={titleId}>{title}</S.Title>
        <S.Description id={descriptionId}>{description}</S.Description>
        <S.Actions>
          <S.CancelButton
            ref={cancelButtonRef}
            type="button"
            onClick={requestCancel}
            disabled={isPending}
          >
            {cancelLabel}
          </S.CancelButton>
          <S.ConfirmButton type="button" onClick={handleConfirm} disabled={isPending}>
            {isPending ? pendingLabel : confirmLabel}
          </S.ConfirmButton>
        </S.Actions>
      </S.Card>
    </S.Overlay>,
    document.body,
  );
};
