// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import ImageUploader from './ImageUploader';

beforeEach(() => {
  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    value: vi.fn(() => 'blob:preview'),
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    configurable: true,
    value: vi.fn(),
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('ImageUploader', () => {
  it('지원하지 않는 사진 형식을 즉시 안내하고 전달하지 않는다', () => {
    const onChange = vi.fn();
    const { container, getByRole } = render(<ImageUploader file={null} onChange={onChange} />);
    const input = container.querySelector<HTMLInputElement>('input[type="file"]');

    expect(input).not.toBeNull();
    fireEvent.change(input!, {
      target: { files: [new File(['gif'], 'food.gif', { type: 'image/gif' })] },
    });

    expect(getByRole('alert').textContent).toBe('JPG 또는 PNG 사진만 올릴 수 있어요.');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('검증을 통과한 사진만 상위 기록 흐름에 전달한다', () => {
    const onChange = vi.fn();
    const { container } = render(<ImageUploader file={null} onChange={onChange} />);
    const input = container.querySelector<HTMLInputElement>('input[type="file"]');
    const image = new File(['jpeg'], 'food.jpg', { type: 'image/jpeg' });

    fireEvent.change(input!, { target: { files: [image] } });

    expect(onChange).toHaveBeenCalledWith(image);
  });
});
