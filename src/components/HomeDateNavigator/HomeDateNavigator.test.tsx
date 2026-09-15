// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomeDateNavigator } from './HomeDateNavigator';

vi.mock('~/features/drafts/draft.queries', () => ({
  usePendingDraftCount: () => ({ data: 2 }),
}));

afterEach(cleanup);

describe('HomeDateNavigator compact header', () => {
  it('홈에서는 하단 내비와 중복되는 AI/달력을 제거하고 알림만 유지한다', () => {
    const view = render(
      <MemoryRouter>
        <HomeDateNavigator />
      </MemoryRouter>,
    );

    expect(view.getByRole('heading', { name: '기록' })).toBeTruthy();
    expect(view.getByRole('button', { name: '대기 기록' })).toBeTruthy();
    expect(view.queryByRole('button', { name: 'AI 추천' })).toBeNull();
    expect(view.queryByRole('button', { name: '날짜 선택' })).toBeNull();
  });
});
