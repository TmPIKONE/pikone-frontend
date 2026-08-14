// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

afterEach(cleanup);

describe('LoadingSpinner', () => {
  it('keeps its status semantics and visible label', () => {
    const { getByRole, getByText } = render(<LoadingSpinner label="Loading records" />);

    const status = getByRole('status');
    expect(status.tagName).toBe('DIV');
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.firstElementChild?.children).toHaveLength(2);
    expect(status.firstElementChild?.firstElementChild?.tagName).toBe('SPAN');
    expect(status.firstElementChild?.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
    expect(getByText('Loading records').tagName).toBe('SPAN');
  });

  it('keeps distinct compact and full-screen presentation variants', () => {
    const { getByRole, rerender } = render(<LoadingSpinner label="Loading records" />);
    const compactClassName = getByRole('status').className;

    rerender(<LoadingSpinner label="Loading records" fullScreen />);

    expect(getByRole('status').className).not.toBe(compactClassName);
  });
});
