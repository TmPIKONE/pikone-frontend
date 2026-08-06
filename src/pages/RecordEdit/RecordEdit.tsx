import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Camera, ChevronDown, ChevronLeft, ImagePlus } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { HomeDatePicker } from '~/components/HomeDatePicker/HomeDatePicker';
import MultiCompanionSelector from '~/components/MultiCompanionSelector/MultiCompanionSelector';
import { RestaurantPicker } from '~/components/RestaurantPicker/RestaurantPicker';
import Switch from '~/components/Switch/Switch';
import { useAnalyzeImage, useRecordsByDate, useUpdateRecord } from '~/features/records/record.queries';
import {
  createRecordViewState,
  RECORD_VIEW_PATH,
} from '~/features/records/recordViewNavigation';
import type { LocationType, RestaurantCandidate } from '~/apis/record/record.types';
import { parseLocalDate } from '~/utils/date';
import { resolveOptimizedImageUrl } from '~/utils/image';
import { SUPPORTED_IMAGE_TYPES, validateImageFile } from '~/utils/imageValidation';
import type { RecordEditFormProps } from './RecordEdit.types';
import * as S from './RecordEdit.styles';

const LOCATION_TYPES: { value: LocationType; label: string }[] = [
  { value: 'RESTAURANT', label: '식당' },
  { value: 'HOME', label: '집' },
  { value: 'OFFICE', label: '회사' },
  { value: 'DELIVERY', label: '배달' },
];

const toRestaurantCandidate = (record: RecordEditFormProps['record']): RestaurantCandidate => ({
  kakaoPlaceId: record.kakaoPlaceId ?? `saved-${record.recordId}`,
  placeName: record.restaurantName,
  address: record.restaurantAddress,
  latitude: record.latitude,
  longitude: record.longitude,
});

const RecordEditForm = ({ record, fallbackDate }: RecordEditFormProps) => {
  const navigate = useNavigate();
  const [foodName, setFoodName] = useState(record.foodName);
  const [visitDate, setVisitDate] = useState(record.visitDate ?? fallbackDate);
  const [companionIds, setCompanionIds] = useState(record.companionIds ?? []);
  const [restaurant, setRestaurant] = useState<RestaurantCandidate>(() =>
    toRestaurantCandidate(record),
  );
  const [restaurantOptions, setRestaurantOptions] = useState<RestaurantCandidate[]>(() => [
    toRestaurantCandidate(record),
  ]);
  const [locationType, setLocationType] = useState<LocationType>(
    record.locationType ?? 'RESTAURANT',
  );
  const [willRevisit, setWillRevisit] = useState(record.willRevisit);
  const [isPublic, setIsPublic] = useState(record.isPublic);
  const [imageUrl, setImageUrl] = useState(record.imageUrl);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const { mutate: analyzeImage, isPending: isPhotoUploading } = useAnalyzeImage(
    record.latitude,
    record.longitude,
  );
  const { mutate: updateRecord, isPending: isSaving } = useUpdateRecord(record.recordId);

  useEffect(
    () => () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    },
    [localPreviewUrl],
  );

  const visitDateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      }).format(parseLocalDate(visitDate)),
    [visitDate],
  );

  const handlePhotoChange = (file?: File) => {
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      setPhotoError(validationError);
      return;
    }

    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    setLocalPreviewUrl(URL.createObjectURL(file));
    setPhotoError(null);

    const formData = new FormData();
    formData.append('image', file);
    analyzeImage(formData, {
      onSuccess: (analysis) => {
        setImageUrl(analysis.imageUrl);
        setRestaurantOptions((current) => {
          const merged = new Map(current.map((candidate) => [candidate.kakaoPlaceId, candidate]));
          analysis.restaurants.forEach((candidate) =>
            merged.set(candidate.kakaoPlaceId, candidate),
          );
          return [...merged.values()];
        });
      },
      onError: () => setPhotoError('사진을 올리지 못했어요. 다시 선택해 주세요.'),
    });
  };

  const handleSave = () => {
    if (!foodName.trim() || !restaurant || isPhotoUploading || isSaving) return;
    const canUpdateRestaurant = !restaurant.kakaoPlaceId.startsWith('saved-');

    updateRecord(
      {
        foodName: foodName.trim(),
        visitDate,
        imageUrl,
        companionIds,
        locationType,
        willRevisit,
        isPublic,
        ...(canUpdateRestaurant && {
          restaurant: {
            kakaoPlaceId: restaurant.kakaoPlaceId,
            placeName: restaurant.placeName,
            category: restaurant.category,
            address: restaurant.address,
            latitude: restaurant.latitude,
            longitude: restaurant.longitude,
          },
        }),
      },
      {
        onSuccess: () => {
          navigate(RECORD_VIEW_PATH, {
            replace: true,
            state: createRecordViewState(visitDate),
          });
        },
      },
    );
  };

  return (
    <S.Container>
      <S.HeaderRow>
        <S.BackButton
          type="button"
          aria-label="기록 상세로 돌아가기"
          onClick={() =>
            navigate(RECORD_VIEW_PATH, {
              replace: true,
              state: createRecordViewState(fallbackDate),
            })
          }
        >
          <ChevronLeft size={25} aria-hidden="true" />
        </S.BackButton>
        <S.PageTitle>기록 수정</S.PageTitle>
        <S.HeaderSpacer />
      </S.HeaderRow>

      <S.Form>
        <S.PhotoSection>
          <S.Photo
            src={localPreviewUrl ?? resolveOptimizedImageUrl(imageUrl)}
            alt="수정할 음식"
          />
          <S.PhotoChangeButton>
            {isPhotoUploading ? <Camera size={16} /> : <ImagePlus size={16} />}
            {isPhotoUploading ? '사진 올리는 중' : '사진 바꾸기'}
            <input
              type="file"
              accept={SUPPORTED_IMAGE_TYPES.join(',')}
              onChange={(event) => handlePhotoChange(event.target.files?.[0])}
              disabled={isPhotoUploading}
            />
          </S.PhotoChangeButton>
        </S.PhotoSection>
        {photoError && <S.ErrorText role="alert">{photoError}</S.ErrorText>}

        <S.Field>
          <S.Label htmlFor={`edit-food-${record.recordId}`}>메뉴</S.Label>
          <S.Input
            id={`edit-food-${record.recordId}`}
            value={foodName}
            onChange={(event) => setFoodName(event.target.value)}
          />
        </S.Field>

        <S.Field>
          <S.Label>식당</S.Label>
          <RestaurantPicker
            value={restaurant}
            options={restaurantOptions}
            latitude={record.latitude}
            longitude={record.longitude}
            onChange={setRestaurant}
          />
        </S.Field>

        <S.Field>
          <S.Label>방문 날짜</S.Label>
          <S.DateButton type="button" onClick={() => setIsDatePickerOpen(true)}>
            <CalendarDays size={18} aria-hidden="true" />
            <span>{visitDateLabel}</span>
            <ChevronDown size={18} aria-hidden="true" />
          </S.DateButton>
        </S.Field>

        <MultiCompanionSelector value={companionIds} onChange={setCompanionIds} compact />

        <S.Field>
          <S.Label>식사 유형</S.Label>
          <S.TypeGrid>
            {LOCATION_TYPES.map((option) => (
              <S.TypeButton
                key={option.value}
                type="button"
                $active={locationType === option.value}
                onClick={() => setLocationType(option.value)}
              >
                {option.label}
              </S.TypeButton>
            ))}
          </S.TypeGrid>
        </S.Field>

        <S.ToggleGroup>
          <S.ToggleRow>
            <span>또 가고 싶어요</span>
            <Switch checked={willRevisit} onChange={setWillRevisit} ariaLabel="재방문 의사" />
          </S.ToggleRow>
          <S.ToggleRow>
            <span>동행자에게 공개</span>
            <Switch checked={isPublic} onChange={setIsPublic} ariaLabel="기록 공개 여부" />
          </S.ToggleRow>
        </S.ToggleGroup>
      </S.Form>

      <S.BottomAction>
        <S.SaveButton
          type="button"
          disabled={!foodName.trim() || isPhotoUploading || isSaving}
          onClick={handleSave}
        >
          {isSaving ? '저장 중...' : '수정 완료'}
        </S.SaveButton>
      </S.BottomAction>

      {isDatePickerOpen && (
        <HomeDatePicker
          isOpen
          selectedDate={visitDate}
          title="방문 날짜 변경"
          ariaLabel="수정할 방문 날짜 선택"
          actionLabel="이 날짜로 변경"
          onClose={() => setIsDatePickerOpen(false)}
          onDateChange={setVisitDate}
        />
      )}
    </S.Container>
  );
};

const RecordEdit = () => {
  const navigate = useNavigate();
  const { recordId: recordIdParam } = useParams();
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date') ?? '';
  const recordId = Number(recordIdParam);
  const isValidRecordId = Number.isInteger(recordId) && recordId > 0;
  const isValidDate =
    /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(parseLocalDate(date).getTime());
  const { data: records, isLoading, isError, refetch } = useRecordsByDate(isValidDate ? date : '');
  const record = records?.find((item) => item.recordId === recordId);

  if (!isValidDate || !isValidRecordId) {
    return (
      <S.Container>
        <S.State>
          <strong>수정할 기록 정보가 없어요</strong>
          <span>기록 상세에서 다시 수정해 주세요.</span>
          <S.StateButton type="button" onClick={() => navigate('/calendar', { replace: true })}>
            달력으로 이동
          </S.StateButton>
        </S.State>
      </S.Container>
    );
  }

  if (isLoading) {
    return (
      <S.Container>
        <S.State>기록을 불러오고 있어요...</S.State>
      </S.Container>
    );
  }

  if (isError) {
    return (
      <S.Container>
        <S.State>
          <strong>기록을 불러오지 못했어요</strong>
          <S.StateButton type="button" onClick={() => void refetch()}>
            다시 불러오기
          </S.StateButton>
        </S.State>
      </S.Container>
    );
  }

  if (!record) {
    return (
      <S.Container>
        <S.State>
          <strong>수정할 기록을 찾지 못했어요</strong>
          <S.StateButton
            type="button"
            onClick={() =>
              navigate(RECORD_VIEW_PATH, {
                replace: true,
                state: createRecordViewState(date),
              })
            }
          >
            기록 상세로 돌아가기
          </S.StateButton>
        </S.State>
      </S.Container>
    );
  }

  return <RecordEditForm record={record} fallbackDate={date} />;
};

export default RecordEdit;
