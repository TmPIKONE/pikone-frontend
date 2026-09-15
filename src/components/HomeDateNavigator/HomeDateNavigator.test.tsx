// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomeDateNavigator } from './HomeDateNavigator';

vi.mock('~/features/drafts/draft.queries', () => ({
  usePendingDraftCount: () => ({ data: 2 }),
}));

afterEach(cleanup);

describe('HomeDateNavigator planit-style header', () => {
  it('앱 이름과 소식/설정 액션을 보여준다', () => {
    const view = render(
      <MemoryRouter>
        <HomeDateNavigator />
      </MemoryRouter>,
    );

    expect(view.getByRole('heading', { name: 'PIKONE' })).toBeTruthy();
    expect(view.getByRole('button', { name: '소식' })).toBeTruthy();
    expect(view.getByRole('button', { name: '설정' })).toBeTruthy();
    expect(view.getByText('2')).toBeTruthy();
  });
});
