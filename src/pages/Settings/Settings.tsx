import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout, useWithdrawal } from '~/features/auth/auth.queries';
import {
  useCreateHomeLocation,
  useHomeLocations,
  useUpdateHomeLocation,
} from '~/features/homeLocations/homeLocation.queries';
import { useMyInfo } from '~/features/user/user.queries';
import { useCurrentLocation } from '~/hooks/useCurrentLocation';
import { useToast } from '~/components/Toast/useToast';
import { ConfirmDialog } from '~/components/ConfirmDialog/ConfirmDialog';
import HomeLocationList from '~/components/HomeLocationList/HomeLocationList';
import AllergenForm from '~/components/AllergenForm/AllergenForm';
import PlaceTypeWheelPicker from '~/components/PlaceTypeWheelPicker/PlaceTypeWheelPicker';
import { resolveImageUrl } from '~/utils/image';
import type {
  HomeLocationResponse,
  HomeLocationType,
} from '~/apis/homeLocation/homeLocation.types';
import { clearAuthTokens } from '~/utils/authTokens';
import SessionManager from '~/features/auth/SessionManager/SessionManager';
import * as S from './Settings.styles';

const DEFAULT_AVATAR = '/default-avatar.png';

const HOME_LOCATION_TYPE_OPTIONS: { value: HomeLocationType; label: string }[] = [
  { value: 'HOME', label: '집' },
  { value: 'OFFICE', label: '회사' },
  { value: 'CUSTOM', label: '기타' },
];

interface LocationFormState {
  type: HomeLocationType;
  label: string;
  radiusMeters: string;
  latitude?: number;
  longitude?: number;
}

type AccountConfirmation = 'logout' | 'withdrawal' | null;

const EMPTY_FORM: LocationFormState = { type: 'HOME', label: '', radiusMeters: '100' };

const Settings = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { data: user } = useMyInfo();

  const { data: homeLocations, isLoading: isLoadingLocations } = useHomeLocations();
  const { mutate: createHomeLocation, isPending: isCreating } = useCreateHomeLocation();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<LocationFormState>(EMPTY_FORM);
  const [accountConfirmation, setAccountConfirmation] = useState<AccountConfirmation>(null);

  const { mutate: updateHomeLocation, isPending: isUpdating } = useUpdateHomeLocation(
    editingId ?? -1,
  );

  const currentLocation = useCurrentLocation();

  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdrawal();

  const handleOpenAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (location: HomeLocationResponse) => {
    setEditingId(location.id);
    setForm({
      type: location.type,
      label: location.label,
      radiusMeters: location.radiusMeters != null ? String(location.radiusMeters) : '',
      latitude: location.latitude,
      longitude: location.longitude,
    });
    setIsFormOpen(true);
  };

  const handleUseCurrentLocation = () => {
    if (currentLocation.latitude == null || currentLocation.longitude == null) return;
    setForm((prev) => ({
      ...prev,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
    }));
  };

  const handleSubmitLocation = (e: FormEvent) => {
    e.preventDefault();
    if (!form.label.trim() || form.latitude == null || form.longitude == null) return;

    const radiusMeters = form.radiusMeters ? Number(form.radiusMeters) : undefined;

    if (editingId != null) {
      updateHomeLocation(
        {
          label: form.label.trim(),
          latitude: form.latitude,
          longitude: form.longitude,
          radiusMeters,
        },
        { onSuccess: () => setIsFormOpen(false) },
      );
    } else {
      createHomeLocation(
        {
          type: form.type,
          label: form.label.trim(),
          latitude: form.latitude,
          longitude: form.longitude,
          radiusMeters,
        },
        { onSuccess: () => setIsFormOpen(false) },
      );
    }
  };

  const handleLogout = () => {
    if (isLoggingOut || isWithdrawing) return;
    setAccountConfirmation('logout');
  };

  const confirmLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        setAccountConfirmation(null);
        clearAuthTokens();
        showToast('이 기기에서 로그아웃했어요.');
        navigate('/login');
      },
      onError: () => {
        setAccountConfirmation(null);
        clearAuthTokens();
        showToast('기기에서 로그아웃했어요.', 'info');
        navigate('/login');
      },
    });
  };

  const handleWithdrawal = () => {
    if (isLoggingOut || isWithdrawing) return;
    setAccountConfirmation('withdrawal');
  };

  const confirmWithdrawal = () => {
    withdraw(undefined, {
      onSuccess: () => {
        setAccountConfirmation(null);
        clearAuthTokens();
        showToast('회원탈퇴가 완료됐어요.');
        navigate('/login');
      },
      onError: () => {
        showToast('회원탈퇴에 실패했어요.', 'error');
      },
    });
  };

  return (
    <S.Container>
      <S.HeaderRow>
        <S.Title>마이페이지</S.Title>
      </S.HeaderRow>

      <S.Section>
        <S.ProfileRow>
          <S.ProfileAvatar
            src={resolveImageUrl(user?.imageUrl) || DEFAULT_AVATAR}
            alt="프로필 이미지"
          />
          <S.ProfileInfo>
            <S.ProfileNickname>{user?.nickname}</S.ProfileNickname>
          </S.ProfileInfo>
        </S.ProfileRow>
      </S.Section>

      <S.Section>
        <S.SectionTitleRow>
          <S.SectionTitle>고정 장소</S.SectionTitle>
          {!isFormOpen && <S.AddButton onClick={handleOpenAddForm}>+ 추가</S.AddButton>}
        </S.SectionTitleRow>

        {isFormOpen && (
          <S.Form onSubmit={handleSubmitLocation}>
            {editingId == null && (
              <S.Field>
                <S.Label htmlFor="location-type">유형</S.Label>
                <PlaceTypeWheelPicker
                  id="location-type"
                  value={form.type}
                  options={HOME_LOCATION_TYPE_OPTIONS}
                  title="고정 장소 유형 선택"
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, type: value as HomeLocationType }))
                  }
                />
              </S.Field>
            )}

            <S.Field>
              <S.Label htmlFor="location-label">이름</S.Label>
              <S.Input
                id="location-label"
                value={form.label}
                onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
                placeholder="예: 우리집, 본사 사무실"
              />
            </S.Field>

            <S.Field>
              <S.Label htmlFor="location-radius">반경 (m)</S.Label>
              <S.Input
                id="location-radius"
                type="number"
                inputMode="numeric"
                min="20"
                max="2000"
                value={form.radiusMeters}
                onChange={(e) => setForm((prev) => ({ ...prev, radiusMeters: e.target.value }))}
              />
            </S.Field>

            <S.LocationButtonRow>
              <S.UseLocationButton type="button" onClick={handleUseCurrentLocation}>
                현재 위치 사용
              </S.UseLocationButton>
              <S.LocationStatusText>
                {form.latitude != null
                  ? `좌표 설정됨 (${form.latitude.toFixed(4)}, ${form.longitude?.toFixed(4)})`
                  : '좌표 없음 — 현재 위치를 눌러주세요'}
              </S.LocationStatusText>
            </S.LocationButtonRow>

            <S.FormButtonRow>
              <S.CancelButton type="button" onClick={() => setIsFormOpen(false)}>
                취소
              </S.CancelButton>
              <S.SubmitButton
                type="submit"
                disabled={!form.label.trim() || form.latitude == null || isCreating || isUpdating}
              >
                {isCreating || isUpdating ? '저장 중...' : '저장'}
              </S.SubmitButton>
            </S.FormButtonRow>
          </S.Form>
        )}

        {isLoadingLocations ? (
          <S.LocationStatusText>불러오는 중...</S.LocationStatusText>
        ) : (
          <HomeLocationList homeLocations={homeLocations ?? []} onEdit={handleOpenEditForm} />
        )}
      </S.Section>

      <S.Section>
        <S.SectionTitle>알레르기 정보</S.SectionTitle>
        <AllergenForm />
      </S.Section>

      <S.Section>
        <S.SectionTitle>계정</S.SectionTitle>
        <S.AccountHint>로그아웃해도 다른 휴대폰이나 PC의 로그인은 유지돼요.</S.AccountHint>
        <S.AccountButton type="button" onClick={handleLogout} disabled={isLoggingOut}>
          {isLoggingOut ? '로그아웃 중...' : '이 기기에서 로그아웃'}
        </S.AccountButton>
        <S.DangerButton type="button" onClick={handleWithdrawal} disabled={isWithdrawing}>
          {isWithdrawing ? '처리 중...' : '회원탈퇴'}
        </S.DangerButton>
      </S.Section>

      <S.SessionSection>
        <SessionManager />
      </S.SessionSection>

      <ConfirmDialog
        isOpen={accountConfirmation != null}
        title={accountConfirmation === 'withdrawal' ? '회원 탈퇴' : '로그아웃'}
        description={
          accountConfirmation === 'withdrawal'
            ? '정말 탈퇴하시겠어요? 모든 데이터가 삭제되고 되돌릴 수 없어요.'
            : '이 기기에서 로그아웃할까요? 다른 기기의 로그인은 유지돼요.'
        }
        confirmLabel={accountConfirmation === 'withdrawal' ? '탈퇴' : '로그아웃'}
        pendingLabel={accountConfirmation === 'withdrawal' ? '탈퇴 중...' : '로그아웃 중...'}
        isPending={accountConfirmation === 'withdrawal' ? isWithdrawing : isLoggingOut}
        onCancel={() => setAccountConfirmation(null)}
        onConfirm={accountConfirmation === 'withdrawal' ? confirmWithdrawal : confirmLogout}
      />
    </S.Container>
  );
};

export default Settings;
