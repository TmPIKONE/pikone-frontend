import { useState } from 'react';
import { CalendarDays, ChevronLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HomeDatePicker } from '~/components/HomeDatePicker/HomeDatePicker';
import Step1Photo from '~/components/RecordAddStep/Step1Photo';
import Step2Save from '~/components/RecordAddStep/Step2Save';
import { MAX_RECORDS_PER_DAY } from '~/features/records/record.constants';
import {
  createRecordViewState,
  RECORD_VIEW_PATH,
} from '~/features/records/recordViewNavigation';
import {
  useAnalyzeImage,
  useRecordsByDate,
  useSaveRecord,
} from '~/features/records/record.queries';
import type {
  AiFoodResponse,
  LocationType,
  RestaurantCandidate,
  RestaurantInfo,
} from '~/apis/record/record.types';
import { toLocalIsoDate } from '~/utils/date';
import * as S from './RecordAdd.styles';

const RecordAdd = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialDate = searchParams.get('date') ?? toLocalIsoDate(new Date());

  const [step, setStep] = useState<1 | 2>(1);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [coords, setCoords] = useState<{ latitude?: number; longitude?: number }>({});
  const [isLocationResolved, setIsLocationResolved] = useState(false);

  const [analysis, setAnalysis] = useState<AiFoodResponse | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [foodName, setFoodName] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantCandidate | null>(null);

  const [companionIds, setCompanionIds] = useState<number[]>([]);
  const [visitDate, setVisitDate] = useState(initialDate);
  const [willRevisit, setWillRevisit] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [locationType, setLocationType] = useState<LocationType>('RESTAURANT');
  const [isSaving, setIsSaving] = useState(false);
  const [isLimitDatePickerOpen, setIsLimitDatePickerOpen] = useState(false);

  const { mutate: analyzeImage, isPending: isAnalyzing } = useAnalyzeImage(
    coords.latitude,
    coords.longitude,
  );
  const { mutateAsync: saveRecord } = useSaveRecord();
  const { data: existingRecords = [], isLoading: isDateCapacityLoading = false } =
    useRecordsByDate(visitDate);
  const isDateLimitReached = existingRecords.length >= MAX_RECORDS_PER_DAY;

  const handleLocationResolved = (latitude?: number, longitude?: number) => {
    setCoords({ latitude, longitude });
    setIsLocationResolved(true);
  };

  const runAnalysis = (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    analyzeImage(formData, {
      onSuccess: (data) => {
        setAnalysis(data);
        setUploadedImageUrl(data.imageUrl);
        setFoodName(data.foodName);
        setSelectedRestaurant(data.recommendedRestaurant ?? data.restaurants[0] ?? null);
      },
      onError: () => {
        setAnalysis(null);
      },
    });
  };

  const handleGoToSave = () => {
    if (!photoFile) return;
    if (isDateLimitReached) {
      setIsLimitDatePickerOpen(true);
      return;
    }

    setStep(2);
    setAnalysis(null);
    runAnalysis(photoFile);
  };

  const handleRetryAnalysis = () => {
    if (!photoFile) return;

    runAnalysis(photoFile);
  };

  const handleRetakePhoto = () => {
    setAnalysis(null);
    setUploadedImageUrl('');
    setPhotoFile(null);
    setFoodName('');
    setSelectedRestaurant(null);
    setStep(1);
  };

  const handleSave = async () => {
    if (
      !selectedRestaurant ||
      !uploadedImageUrl ||
      isSaving ||
      isDateCapacityLoading ||
      isDateLimitReached
    )
      return;

    const restaurant: RestaurantInfo = {
      kakaoPlaceId: selectedRestaurant.kakaoPlaceId,
      placeName: selectedRestaurant.placeName,
      category: selectedRestaurant.category,
      address: selectedRestaurant.address,
      latitude: selectedRestaurant.latitude,
      longitude: selectedRestaurant.longitude,
    };

    const request = {
      kakaoPlaceId: restaurant.kakaoPlaceId,
      restaurant,
      foodName: foodName.trim(),
      imageUrl: uploadedImageUrl,
      visitDate,
      willRevisit,
      isPublic,
      companionId: companionIds[0],
      companionIds,
      locationType,
      placeName: restaurant.placeName,
      category: restaurant.category,
      address: restaurant.address,
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
    };

    try {
      setIsSaving(true);

      // 분석 단계에서 원본 업로드와 서버 최적화가 끝났으므로
      // 최종 저장에서는 imageUrl을 포함한 작은 JSON만 전송한다.
      await saveRecord(request);

      navigate(RECORD_VIEW_PATH, {
        replace: true,
        state: createRecordViewState(visitDate),
      });
    } catch {
      // useSaveRecord가 사용자에게 실패 토스트를 표시한다.
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackFromStep = () => {
    if (step === 2) {
      handleRetakePhoto();
      return;
    }

    navigate(-1);
  };

  return (
    <S.Container>
      <S.HeaderRow>
        <S.BackButton type="button" aria-label="이전 단계" onClick={handleBackFromStep}>
          <ChevronLeft size={29} strokeWidth={2.1} />
        </S.BackButton>
      </S.HeaderRow>

      {step === 1 && isDateLimitReached && (
        <S.RecordLimitBanner>
          <S.RecordLimitIcon>
            <CalendarDays size={19} strokeWidth={2.3} aria-hidden="true" />
          </S.RecordLimitIcon>
          <S.RecordLimitCopy>
            <strong>이 날짜의 기록이 꽉 찼어요</strong>
            <span>하루에는 최대 {MAX_RECORDS_PER_DAY}개까지 기록할 수 있어요.</span>
          </S.RecordLimitCopy>
          <S.ChangeDateButton type="button" onClick={() => setIsLimitDatePickerOpen(true)}>
            날짜 변경
          </S.ChangeDateButton>
        </S.RecordLimitBanner>
      )}

      {isLimitDatePickerOpen && (
        <HomeDatePicker
          isOpen
          selectedDate={visitDate}
          title="방문 날짜 변경"
          ariaLabel="기록할 날짜 선택"
          actionLabel="이 날짜로 변경"
          onClose={() => setIsLimitDatePickerOpen(false)}
          onDateChange={setVisitDate}
        />
      )}

      {step === 1 && (
        <Step1Photo
          file={photoFile}
          isLocationResolved={isLocationResolved}
          onFileChange={setPhotoFile}
          onLocationResolved={handleLocationResolved}
          onNext={handleGoToSave}
        />
      )}

      {step === 2 && (
        <Step2Save
          isAnalyzing={isAnalyzing}
          analysis={analysis}
          onRetryAnalysis={handleRetryAnalysis}
          foodName={foodName}
          onFoodNameChange={setFoodName}
          selectedRestaurant={selectedRestaurant}
          onSelectRestaurant={setSelectedRestaurant}
          companionIds={companionIds}
          onCompanionChange={setCompanionIds}
          latitude={coords.latitude}
          longitude={coords.longitude}
          visitDate={visitDate}
          onVisitDateChange={setVisitDate}
          existingRecordCount={existingRecords.length}
          isDateCapacityLoading={isDateCapacityLoading}
          willRevisit={willRevisit}
          onWillRevisitChange={setWillRevisit}
          isPublic={isPublic}
          onIsPublicChange={setIsPublic}
          locationType={locationType}
          onLocationTypeChange={setLocationType}
          isSaving={isSaving}
          onSave={handleSave}
          onBack={handleBackFromStep}
        />
      )}
    </S.Container>
  );
};

export default RecordAdd;
