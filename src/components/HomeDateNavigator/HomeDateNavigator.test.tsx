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
  it('날짜 레일 없이 기존 홈 액션만 유지한다', () => {
    const view = render(
      <MemoryRouter>
        <HomeDateNavigator selectedDate="2020-08-18" onDateChange={vi.fn()} />
      </MemoryRouter>,
    );

    expect(view.getByRole('heading', { name: '기록' })).toBeTruthy();
    expect(view.getByRole('button', { name: 'AI 추천' })).toBeTruthy();
    expect(view.getByRole('button', { name: '날짜 선택' })).toBeTruthy();
    expect(view.getByRole('button', { name: '대기 기록' })).toBeTruthy();
    expect(view.queryByText(/8\.17|8\.18|8\.19/)).toBeNull();
  });
});
