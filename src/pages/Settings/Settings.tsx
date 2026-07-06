import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '~/contexts/Auth/AuthContext';
import { useMyInfo } from '~/hooks/useMyInfo';
import { useHomeLocations } from '~/hooks/useHomeLocations';
import { useCreateHomeLocation } from '~/hooks/useCreateHomeLocation';
import { useUpdateHomeLocation } from '~/hooks/useUpdateHomeLocation';
import { useCurrentLocation } from '~/hooks/useCurrentLocation';
import { useLogout } from '~/hooks/useLogout';
import { useWithdrawal } from '~/hooks/useWithdrawal';
import HomeLocationList from '~/components/HomeLocationList/HomeLocationList';
import AllergenForm from '~/components/AllergenForm/AllergenForm';
import { resolveImageUrl } from '~/utils/image';
import type {
  HomeLocationResponse,
  HomeLocationType,
} from '~/apis/homeLocation/homeLocation.types';
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

const EMPTY_FORM: LocationFormState = { type: 'HOME', label: '', radiusMeters: '100' };

const Settings = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  const { data: user } = useMyInfo();

  const { data: homeLocations, isLoading: isLoadingLocations } = useHomeLocations();
  const { mutate: createHomeLocation, isPending: isCreating } = useCreateHomeLocation();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<LocationFormState>(EMPTY_FORM);

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
    if (!window.confirm('로그아웃할까요?')) return;
    logout(undefined, {
      onSuccess: () => {
        sessionStorage.clear();
        setIsAuthenticated(false);
        navigate('/login');
      },
      onError: () => {
        // 서버 로그아웃이 실패해도 클라이언트는 로그아웃 상태로 전환해요.
        sessionStorage.clear();
        setIsAuthenticated(false);
        navigate('/login');
      },
    });
  };

  const handleWithdrawal = () => {
    if (!window.confirm('정말 탈퇴하시겠어요? 모든 데이터가 삭제되고 되돌릴 수 없어요.')) return;
    withdraw(undefined, {
      onSuccess: () => {
        sessionStorage.clear();
        setIsAuthenticated(false);
        navigate('/login');
      },
    });
  };

  return (
    <S.Container>
      <S.HeaderRow>
        <S.BackButton onClick={() => navigate(-1)}>{'<'}</S.BackButton>
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
            <S.ProfileEmail>{user?.email}</S.ProfileEmail>
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
                <S.Label>유형</S.Label>
                <S.Select
                  value={form.type}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, type: e.target.value as HomeLocationType }))
                  }
                >
                  {HOME_LOCATION_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </S.Select>
              </S.Field>
            )}

            <S.Field>
              <S.Label>이름</S.Label>
              <S.Input
                value={form.label}
                onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
                placeholder="예: 우리집, 본사 사무실"
              />
            </S.Field>

            <S.Field>
              <S.Label>반경 (m)</S.Label>
              <S.Input
                type="number"
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
        <S.AccountButton type="button" onClick={handleLogout} disabled={isLoggingOut}>
          {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
        </S.AccountButton>
        <S.DangerButton type="button" onClick={handleWithdrawal} disabled={isWithdrawing}>
          {isWithdrawing ? '처리 중...' : '회원탈퇴'}
        </S.DangerButton>
      </S.Section>
    </S.Container>
  );
};

export default Settings;
