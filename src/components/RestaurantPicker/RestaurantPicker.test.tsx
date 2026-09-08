// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { RestaurantPicker } from './RestaurantPicker';

const searchMock = vi.hoisted(() => vi.fn());

vi.mock('~/features/records/record.queries', () => ({
  useRestaurantSearch: (query: string) => searchMock(query),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.useRealTimers();
  document.body.style.overflow = '';
});

describe('RestaurantPicker', () => {
  it('검색어를 이어서 입력해도 입력창 포커스를 유지한다', async () => {
    searchMock.mockReturnValue({
      data: [],
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    });

    const { getByRole } = render(<RestaurantPicker value={null} options={[]} onChange={vi.fn()} />);

    fireEvent.click(getByRole('button', { name: /식당을 선택해주세요/ }));
    const input = getByRole('textbox', { name: '식당 후보 검색' }) as HTMLInputElement;
    await waitFor(() => expect(document.activeElement).not.toBeNull());
    input.focus();

    fireEvent.change(input, { target: { value: '신' } });
    expect(input.value).toBe('신');
    expect(document.activeElement).toBe(input);

    fireEvent.change(input, { target: { value: '신사우물갈비' } });
    expect(input.value).toBe('신사우물갈비');
    expect(document.activeElement).toBe(input);
  });

  it('지도 결과가 없으면 입력한 상호명으로 직접 선택할 수 있다', async () => {
    vi.useFakeTimers();
    searchMock.mockReturnValue({
      data: [],
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    });
    const onChange = vi.fn();

    const { getByRole } = render(
      <RestaurantPicker value={null} options={[]} onChange={onChange} />,
    );

    fireEvent.click(getByRole('button', { name: /식당을 선택해주세요/ }));
    fireEvent.change(getByRole('textbox', { name: '식당 후보 검색' }), {
      target: { value: '신사우물갈비' },
    });
    await act(() => vi.advanceTimersByTimeAsync(300));

    fireEvent.click(getByRole('button', { name: /신사우물갈비.*직접 기록/ }));
    fireEvent.click(getByRole('button', { name: '이 식당으로 선택' }));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        kakaoPlaceId: expect.stringMatching(/^manual-/),
        placeName: '신사우물갈비',
      }),
    );
  });
});
