// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import Switch from './Switch';

afterEach(cleanup);

describe('Switch', () => {
  it('현재 상태를 접근성 속성으로 알리고 반대 상태를 요청한다', () => {
    const onChange = vi.fn();
    const { getByRole } = render(
      <Switch checked={false} onChange={onChange} ariaLabel="기록 공개 여부" />,
    );
    const toggle = getByRole('switch', { name: '기록 공개 여부' });

    expect(toggle.getAttribute('aria-checked')).toBe('false');
    fireEvent.click(toggle);
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
