// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MainLayout from './MainLayout';

afterEach(cleanup);

const renderLayoutAt = (pathname: string) =>
  render(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="*" element={<div>Current screen</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

describe('MainLayout', () => {
  it('renders the current screen inside main and shows navigation on primary routes', () => {
    const { getByRole, getByText } = renderLayoutAt('/home');

    expect(getByRole('main').contains(getByText('Current screen'))).toBe(true);
    expect(getByRole('navigation')).toBeTruthy();
  });

  it('hides navigation on focused record flows', () => {
    const { queryByRole } = renderLayoutAt('/record/add');

    expect(queryByRole('navigation')).toBeNull();
  });

  it('keeps the companion route without reserved bottom space', () => {
    const homeLayout = renderLayoutAt('/home');
    const homeMainClassName = homeLayout.getByRole('main').className;
    homeLayout.unmount();

    const companionLayout = renderLayoutAt('/companion');
    expect(companionLayout.getByRole('main').className).not.toBe(homeMainClassName);
  });
});
