// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Settings from './Settings';

const mocks = vi.hoisted(() => ({
  logout: vi.fn(),
  withdraw: vi.fn(),
  clearAuthTokens: vi.fn(),
  clearSelectedRecommendation: vi.fn(),
  showToast: vi.fn(),
  isLoggingOut: false,
  isWithdrawing: false,
}));

vi.mock('~/features/auth/auth.queries', () => ({
  useLogout: () => ({ mutate: mocks.logout, isPending: mocks.isLoggingOut }),
  useWithdrawal: () => ({ mutate: mocks.withdraw, isPending: mocks.isWithdrawing }),
}));

vi.mock('~/features/homeLocations/homeLocation.queries', () => ({
  useCreateHomeLocation: () => ({ mutate: vi.fn(), isPending: false }),
  useHomeLocations: () => ({ data: [], isLoading: false }),
  useUpdateHomeLocation: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('~/features/user/user.queries', () => ({
  useMyInfo: () => ({ data: { nickname: '피코원', imageUrl: null } }),
}));

vi.mock('~/hooks/useCurrentLocation', () => ({
  useCurrentLocation: () => ({ latitude: null, longitude: null }),
}));

vi.mock('~/components/Toast/useToast', () => ({
  useToast: () => ({ showToast: mocks.showToast }),
}));

vi.mock('~/components/HomeLocationList/HomeLocationList', () => ({
  default: () => <div>고정 장소 목록</div>,
}));

vi.mock('~/components/AllergenForm/AllergenForm', () => ({
  default: () => <div>알레르기 정보</div>,
}));

vi.mock('~/components/PlaceTypeWheelPicker/PlaceTypeWheelPicker', () => ({
  default: () => null,
}));

vi.mock('~/features/auth/SessionManager/SessionManager', () => ({
  default: () => <div>로그인 기기</div>,
}));

vi.mock('~/utils/authTokens', () => ({ clearAuthTokens: mocks.clearAuthTokens }));
vi.mock('~/features/recommendations/recommendationStorage', () => ({
  clearSelectedRecommendation: mocks.clearSelectedRecommendation,
}));

const settingsTree = () => (
  <MemoryRouter initialEntries={['/mypage/settings']}>
    <Routes>
      <Route path="/mypage/settings" element={<Settings />} />
      <Route path="/login" element={<div>로그인 화면</div>} />
    </Routes>
  </MemoryRouter>
);

const renderSettings = () => render(settingsTree());

beforeEach(() => {
  mocks.isLoggingOut = false;
  mocks.isWithdrawing = false;
  vi.clearAllMocks();
});

afterEach(cleanup);

describe('Settings account confirmations', () => {
  it('로그아웃을 취소하거나 한 번만 확인하고 pending 뒤 성공하면 로컬 로그아웃한다', () => {
    const view = renderSettings();

    fireEvent.click(view.getByRole('button', { name: '이 기기에서 로그아웃' }));
    expect(view.getByRole('alertdialog')).toBeTruthy();
    expect(mocks.logout).not.toHaveBeenCalled();

    fireEvent.click(view.getByRole('button', { name: '취소' }));
    expect(view.queryByRole('alertdialog')).toBeNull();

    fireEvent.click(view.getByRole('button', { name: '이 기기에서 로그아웃' }));
    let dialog = view.getByRole('alertdialog');
    const confirmButton = within(dialog).getByRole('button', { name: '로그아웃' });
    fireEvent.click(confirmButton);
    fireEvent.click(confirmButton);

    expect(mocks.logout).toHaveBeenCalledTimes(1);
    expect(mocks.logout).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
    );

    mocks.isLoggingOut = true;
    view.rerender(settingsTree());
    dialog = view.getByRole('alertdialog');
    expect(within(dialog).getByRole('button', { name: '취소' })).toHaveProperty('disabled', true);
    expect(within(dialog).getByRole('button', { name: '로그아웃 중...' })).toHaveProperty(
      'disabled',
      true,
    );
    fireEvent.click(within(dialog).getByRole('button', { name: '로그아웃 중...' }));
    expect(mocks.logout).toHaveBeenCalledTimes(1);

    mocks.isLoggingOut = false;
    view.rerender(settingsTree());
    expect(view.getByRole('alertdialog')).toBeTruthy();

    const options = mocks.logout.mock.calls[0][1] as { onSuccess: () => void };
    act(() => options.onSuccess());

    expect(mocks.clearAuthTokens).toHaveBeenCalledOnce();
    expect(mocks.clearSelectedRecommendation).toHaveBeenCalledOnce();
    expect(mocks.showToast).toHaveBeenCalledWith('이 기기에서 로그아웃했어요.');
    expect(view.getByText('로그인 화면')).toBeTruthy();
    expect(view.queryByRole('alertdialog')).toBeNull();
  });

  it('로그아웃 API 실패 시에도 기존처럼 인증 정보를 지우고 로그인 화면으로 이동한다', () => {
    const view = renderSettings();

    fireEvent.click(view.getByRole('button', { name: '이 기기에서 로그아웃' }));
    fireEvent.click(view.getByRole('button', { name: '로그아웃' }));

    const options = mocks.logout.mock.calls[0][1] as { onError: () => void };
    act(() => options.onError());

    expect(mocks.clearAuthTokens).toHaveBeenCalledOnce();
    expect(mocks.clearSelectedRecommendation).toHaveBeenCalledOnce();
    expect(mocks.showToast).toHaveBeenCalledWith('기기에서 로그아웃했어요.', 'info');
    expect(view.getByText('로그인 화면')).toBeTruthy();
    expect(view.queryByRole('alertdialog')).toBeNull();
  });

  it('회원 탈퇴 실패 시 확인창을 유지하고 pending 해제 뒤 재시도 성공한다', () => {
    const view = renderSettings();

    fireEvent.click(view.getByRole('button', { name: '회원탈퇴' }));
    fireEvent.click(view.getByRole('button', { name: '취소' }));
    expect(mocks.withdraw).not.toHaveBeenCalled();

    fireEvent.click(view.getByRole('button', { name: '회원탈퇴' }));
    let dialog = view.getByRole('alertdialog');
    const confirmButton = within(dialog).getByRole('button', { name: '탈퇴' });
    fireEvent.click(confirmButton);
    fireEvent.click(confirmButton);

    expect(mocks.withdraw).toHaveBeenCalledTimes(1);
    expect(mocks.withdraw).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
    );

    mocks.isWithdrawing = true;
    view.rerender(settingsTree());
    dialog = view.getByRole('alertdialog');
    expect(within(dialog).getByRole('button', { name: '취소' })).toHaveProperty('disabled', true);
    expect(within(dialog).getByRole('button', { name: '탈퇴 중...' })).toHaveProperty(
      'disabled',
      true,
    );
    fireEvent.click(within(dialog).getByRole('button', { name: '탈퇴 중...' }));
    expect(mocks.withdraw).toHaveBeenCalledTimes(1);

    const failedOptions = mocks.withdraw.mock.calls[0][1] as { onError: () => void };
    act(() => failedOptions.onError());
    expect(mocks.clearAuthTokens).not.toHaveBeenCalled();
    expect(view.getByRole('alertdialog')).toBeTruthy();
    expect(mocks.showToast).toHaveBeenCalledWith('회원탈퇴에 실패했어요.', 'error');

    mocks.isWithdrawing = false;
    view.rerender(settingsTree());
    dialog = view.getByRole('alertdialog');
    fireEvent.click(within(dialog).getByRole('button', { name: '탈퇴' }));
    fireEvent.click(within(dialog).getByRole('button', { name: '탈퇴' }));
    expect(mocks.withdraw).toHaveBeenCalledTimes(2);

    const successfulOptions = mocks.withdraw.mock.calls[1][1] as { onSuccess: () => void };
    act(() => successfulOptions.onSuccess());
    expect(mocks.clearAuthTokens).toHaveBeenCalledOnce();
    expect(mocks.clearSelectedRecommendation).toHaveBeenCalledOnce();
    expect(mocks.showToast).toHaveBeenCalledWith('회원탈퇴가 완료됐어요.');
    expect(view.getByText('로그인 화면')).toBeTruthy();
    expect(view.queryByRole('alertdialog')).toBeNull();
  });
});
