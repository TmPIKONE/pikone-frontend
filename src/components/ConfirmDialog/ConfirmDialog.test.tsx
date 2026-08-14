// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/react';
import { ConfirmDialog } from './ConfirmDialog';

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
  document.body.replaceChildren();
});

describe('ConfirmDialog', () => {
  it('portal과 ARIA를 구성하고 취소 버튼에 포커스한 뒤 닫을 때 원래 상태를 복원한다', async () => {
    document.body.style.overflow = 'auto';
    const trigger = document.createElement('button');
    trigger.textContent = '로그아웃 열기';
    document.body.append(trigger);
    trigger.focus();

    const root = document.createElement('div');
    root.id = 'root';
    document.body.append(root);

    const onCancel = vi.fn();
    const { rerender } = render(
      <ConfirmDialog
        isOpen
        title="로그아웃"
        description="로그아웃 하시겠어요?"
        confirmLabel="로그아웃"
        onCancel={onCancel}
        onConfirm={() => undefined}
      />,
      { container: root },
    );

    const body = within(document.body);
    const dialog = body.getByRole('alertdialog', { name: '로그아웃' });
    const description = body.getByText('로그아웃 하시겠어요?');
    expect(root.contains(dialog)).toBe(false);
    expect(document.body.contains(dialog)).toBe(true);
    expect(dialog.getAttribute('aria-describedby')).toBe(description.id);
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(document.body.style.overflow).toBe('hidden');

    const cancelButton = body.getByRole('button', { name: '취소' });
    const confirmButton = body.getByRole('button', { name: '로그아웃' });
    await waitFor(() => expect(document.activeElement).toBe(cancelButton));

    confirmButton.focus();
    fireEvent.keyDown(window, { key: 'Tab' });
    expect(document.activeElement).toBe(cancelButton);

    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(confirmButton);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledOnce();

    rerender(
      <ConfirmDialog
        isOpen={false}
        title="로그아웃"
        description="로그아웃 하시겠어요?"
        confirmLabel="로그아웃"
        onCancel={onCancel}
        onConfirm={() => undefined}
      />,
    );

    expect(document.body.style.overflow).toBe('auto');
    expect(document.activeElement).toBe(trigger);
  });

  it('카드 내부 클릭은 무시하고 취소 버튼과 backdrop 클릭으로 닫기를 요청한다', () => {
    const onCancel = vi.fn();
    const { getByRole } = render(
      <ConfirmDialog
        isOpen
        title="기록 삭제"
        description="이 기록을 삭제하시겠어요?"
        confirmLabel="삭제"
        onCancel={onCancel}
        onConfirm={() => undefined}
      />,
    );

    const dialog = getByRole('alertdialog', { name: '기록 삭제' });
    fireEvent.click(dialog);
    expect(onCancel).not.toHaveBeenCalled();

    fireEvent.click(getByRole('button', { name: '취소' }));
    expect(onCancel).toHaveBeenCalledOnce();

    fireEvent.click(dialog.parentElement!);
    expect(onCancel).toHaveBeenCalledTimes(2);
  });

  it('pending 중 모든 액션을 막고 진행 중 문구를 표시한다', () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    const { getByRole } = render(
      <ConfirmDialog
        isOpen
        title="회원 탈퇴"
        description="모든 데이터가 삭제돼요."
        confirmLabel="탈퇴"
        pendingLabel="탈퇴 처리 중..."
        isPending
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    );

    const dialog = getByRole('alertdialog', { name: '회원 탈퇴' });
    const cancelButton = getByRole('button', { name: '취소' }) as HTMLButtonElement;
    const confirmButton = getByRole('button', { name: '탈퇴 처리 중...' }) as HTMLButtonElement;

    expect(dialog.getAttribute('aria-busy')).toBe('true');
    expect(cancelButton.disabled).toBe(true);
    expect(confirmButton.disabled).toBe(true);

    fireEvent.keyDown(window, { key: 'Escape' });
    fireEvent.click(dialog.parentElement!);
    fireEvent.click(cancelButton);
    fireEvent.click(confirmButton);

    expect(onCancel).not.toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('빠른 중복 확인을 한 번만 실행하고 pending 완료 뒤에는 재시도를 허용한다', () => {
    const onConfirm = vi.fn();
    const props = {
      isOpen: true,
      title: '고정 장소 삭제',
      description: '회사를 삭제하시겠어요?',
      confirmLabel: '삭제',
      onCancel: () => undefined,
      onConfirm,
    };
    const { getByRole, rerender } = render(<ConfirmDialog {...props} />);

    const confirmButton = getByRole('button', { name: '삭제' });
    fireEvent.click(confirmButton);
    fireEvent.click(confirmButton);
    expect(onConfirm).toHaveBeenCalledOnce();

    rerender(<ConfirmDialog {...props} isPending />);
    rerender(<ConfirmDialog {...props} isPending={false} />);

    fireEvent.click(getByRole('button', { name: '삭제' }));
    expect(onConfirm).toHaveBeenCalledTimes(2);
  });
});
