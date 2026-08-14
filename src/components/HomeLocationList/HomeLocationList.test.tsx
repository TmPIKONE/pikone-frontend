// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, within } from '@testing-library/react';
import HomeLocationList from './HomeLocationList';

const apiMocks = vi.hoisted(() => ({
  deleteLocation: vi.fn(),
  hookId: vi.fn(),
  isPending: false,
}));

vi.mock('~/features/homeLocations/homeLocation.queries', () => ({
  useDeleteHomeLocation: (id: number) => {
    apiMocks.hookId(id);
    return { mutate: apiMocks.deleteLocation, isPending: apiMocks.isPending };
  },
}));

vi.mock('~/components/ConfirmDialog/ConfirmDialog', () => ({
  ConfirmDialog: ({
    isOpen,
    title,
    description,
    confirmLabel,
    cancelLabel = '취소',
    pendingLabel,
    isPending = false,
    onCancel,
    onConfirm,
  }: {
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    cancelLabel?: string;
    pendingLabel?: string;
    isPending?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
  }) =>
    isOpen ? (
      <div role="alertdialog" aria-label={title}>
        <p>{description}</p>
        <button type="button" disabled={isPending} onClick={onCancel}>
          {cancelLabel}
        </button>
        <button type="button" disabled={isPending} onClick={onConfirm}>
          {isPending ? pendingLabel : confirmLabel}
        </button>
      </div>
    ) : null,
}));

const location = {
  id: 11,
  type: 'HOME' as const,
  label: '우리 집',
  latitude: 37.5,
  longitude: 127,
  radiusMeters: 100,
};

beforeEach(() => {
  apiMocks.isPending = false;
  vi.clearAllMocks();
});

afterEach(cleanup);

describe('HomeLocationList delete confirmation', () => {
  it('선택한 장소를 고정하고 성공하기 전까지 확인창을 유지한다', () => {
    const onEdit = vi.fn();
    const view = render(<HomeLocationList homeLocations={[location]} onEdit={onEdit} />);

    fireEvent.click(view.getByRole('button', { name: '삭제' }));

    let dialog = view.getByRole('alertdialog', { name: '고정 장소 삭제' });
    expect(within(dialog).getByText("'우리 집'을 삭제할까요?")).toBeTruthy();
    expect(apiMocks.deleteLocation).not.toHaveBeenCalled();

    view.rerender(
      <HomeLocationList
        homeLocations={[{ ...location, label: '변경된 장소 이름' }]}
        onEdit={onEdit}
      />,
    );
    dialog = view.getByRole('alertdialog', { name: '고정 장소 삭제' });
    expect(within(dialog).getByText("'우리 집'을 삭제할까요?")).toBeTruthy();
    expect(apiMocks.hookId).toHaveBeenLastCalledWith(location.id);

    fireEvent.click(within(dialog).getByRole('button', { name: '취소' }));
    expect(view.queryByRole('alertdialog')).toBeNull();
    expect(apiMocks.deleteLocation).not.toHaveBeenCalled();

    fireEvent.click(view.getByRole('button', { name: '삭제' }));
    dialog = view.getByRole('alertdialog');
    fireEvent.click(within(dialog).getByRole('button', { name: '삭제' }));

    expect(apiMocks.deleteLocation).toHaveBeenCalledOnce();
    expect(apiMocks.deleteLocation.mock.calls[0]?.[0]).toBeUndefined();

    apiMocks.isPending = true;
    view.rerender(
      <HomeLocationList
        homeLocations={[{ ...location, label: '변경된 장소 이름' }]}
        onEdit={onEdit}
      />,
    );
    dialog = view.getByRole('alertdialog');
    expect(
      (within(dialog).getByRole('button', { name: '취소' }) as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(
      (within(dialog).getByRole('button', { name: '삭제 중...' }) as HTMLButtonElement).disabled,
    ).toBe(true);

    apiMocks.isPending = false;
    view.rerender(
      <HomeLocationList
        homeLocations={[{ ...location, label: '변경된 장소 이름' }]}
        onEdit={onEdit}
      />,
    );
    expect(view.getByRole('alertdialog')).toBeTruthy();

    const mutationOptions = apiMocks.deleteLocation.mock.calls[0]?.[1] as {
      onSuccess: () => void;
    };
    act(() => mutationOptions.onSuccess());
    expect(view.queryByRole('alertdialog')).toBeNull();
  });
});
