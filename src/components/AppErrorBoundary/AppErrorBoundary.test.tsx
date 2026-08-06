// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { reportFrontendError } from '~/utils/telemetry';
import { AppErrorBoundary } from './AppErrorBoundary';

vi.mock('~/utils/telemetry', () => ({
  reportFrontendError: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe('AppErrorBoundary', () => {
  it('렌더링 오류를 보고하고 사용자용 복구 화면을 보여준다', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const BrokenScreen = () => {
      throw new Error('render failed');
    };

    const { getByRole } = render(
      <AppErrorBoundary>
        <BrokenScreen />
      </AppErrorBoundary>,
    );

    expect(getByRole('heading', { name: '화면을 불러오지 못했어요' })).toBeTruthy();
    expect(reportFrontendError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'render failed' }),
      expect.objectContaining({ source: 'react_error_boundary' }),
    );
  });

  it('오류 원인이 사라지면 다시 시도로 화면을 복구한다', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    let shouldThrow = true;
    const RecoverableScreen = () => {
      if (shouldThrow) throw new Error('temporary error');
      return <div>화면 복구 완료</div>;
    };

    const { getByRole, getByText } = render(
      <AppErrorBoundary>
        <RecoverableScreen />
      </AppErrorBoundary>,
    );

    shouldThrow = false;
    fireEvent.click(getByRole('button', { name: '다시 시도' }));

    expect(getByText('화면 복구 완료')).toBeTruthy();
  });
});
