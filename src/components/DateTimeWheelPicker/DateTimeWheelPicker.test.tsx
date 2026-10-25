// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, within } from '@testing-library/react';
import { DateTimeWheelPicker } from './DateTimeWheelPicker';

beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', { configurable: true, value: vi.fn() });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it('reopening discards uncommitted wheel edits and restores the committed value', () => {
  const props = { value: '2027-05-12T12:20', onChange: vi.fn(), onClose: vi.fn() };
  const view = render(<DateTimeWheelPicker {...props} isOpen />);
  fireEvent.click(view.getByRole('button', { name: '2028년' }));
  view.rerender(<DateTimeWheelPicker {...props} isOpen={false} />);
  view.rerender(<DateTimeWheelPicker {...props} isOpen />);
  fireEvent.click(view.getByRole('button', { name: '이 시간으로 선택' }));
  expect(props.onChange).toHaveBeenCalledWith('2027-05-12T12:20');
});

it('a new committed value resets open wheel state and month edits clamp the day', () => {
  const props = { onChange: vi.fn(), onClose: vi.fn() };
  const view = render(<DateTimeWheelPicker {...props} value="2027-01-31T12:20" isOpen />);
  view.rerender(<DateTimeWheelPicker {...props} value="2028-01-31T13:30" isOpen />);
  fireEvent.click(within(view.getByLabelText('월 선택')).getByRole('button', { name: '2월' }));
  fireEvent.click(view.getByRole('button', { name: '이 시간으로 선택' }));
  expect(props.onChange).toHaveBeenCalledWith('2028-02-29T13:30');
});
