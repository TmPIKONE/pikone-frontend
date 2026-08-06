// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { BottomSheet } from './BottomSheet';

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
});

describe('BottomSheet', () => {
  it('열릴 때 배경 스크롤과 포커스를 관리하고 ESC로 닫는다', async () => {
    const trigger = document.createElement('button');
    document.body.append(trigger);
    trigger.focus();
    const onClose = vi.fn();

    const { getByRole, rerender } = render(
      <BottomSheet isOpen title="날짜 선택" onClose={onClose}>
        <button type="button">날짜 항목</button>
      </BottomSheet>,
    );

    expect(document.body.style.overflow).toBe('hidden');
    await waitFor(() =>
      expect(document.activeElement).toBe(getByRole('button', { name: '선택 창 닫기' })),
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();

    rerender(
      <BottomSheet isOpen={false} title="날짜 선택" onClose={onClose}>
        <button type="button">날짜 항목</button>
      </BottomSheet>,
    );

    expect(document.body.style.overflow).toBe('');
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it('공용 확인 액션을 실행한다', () => {
    const onAction = vi.fn();

    const { getByRole } = render(
      <BottomSheet
        isOpen
        title="장소 유형 선택"
        onClose={() => undefined}
        actionLabel="이 유형으로 선택"
        onAction={onAction}
      >
        <div>선택 내용</div>
      </BottomSheet>,
    );

    fireEvent.click(getByRole('button', { name: '이 유형으로 선택' }));
    expect(onAction).toHaveBeenCalledOnce();
  });
});
