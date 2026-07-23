import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Step1Photo from '~/components/RecordAddStep/Step1Photo';
import Step2Save from '~/components/RecordAddStep/Step2Save';
import { useAnalyzeImage } from '~/hooks/useAnalyzeImage';
import { useSaveRecord } from '~/hooks/useSaveRecord';
import type {
  AiFoodResponse,
  LocationType,
  RestaurantCandidate,
  RestaurantInfo,
} from '~/apis/record/record.types';
import * as S from './RecordAdd.styles';

const todayStr = () => {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')}`;
};

const RecordAdd = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialDate = searchParams.get('date') ?? todayStr();

  const [step, setStep] = useState<1 | 2>(1);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [coords, setCoords] = useState<{ latitude?: number; longitude?: number }>({});
  const [isLocationResolved, setIsLocationResolved] = useState(false);

  const [analysis, setAnalysis] = useState<AiFoodResponse | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [foodName, setFoodName] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantCandidate | null>(null);

  const [companionId, setCompanionId] = useState<number | null>(null);
  const [visitDate, setVisitDate] = useState(initialDate);
  const [willRevisit, setWillRevisit] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [locationType, setLocationType] = useState<LocationType>('RESTAURANT');
  const [isSaving, setIsSaving] = useState(false);

  const { mutate: analyzeImage, isPending: isAnalyzing } = useAnalyzeImage(
    coords.latitude,
    coords.longitude,
  );
  const { mutateAsync: saveRecord } = useSaveRecord();

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
      },
      onError: () => {
        setAnalysis(null);
      },
    });
  };

  const handleGoToSave = () => {
    if (!photoFile) return;

    setStep(2);
    setAnalysis(null);
    runAnalysis(photoFile);
  };

  const handleRetryAnalysis = () => {
    if (!photoFile) return;

    runAnalysis(photoFile);
  };

  const handleApplyAnalysis = () => {
    if (!analysis) return;

    setFoodName(analysis.foodName);
    setSelectedRestaurant(analysis.recommendedRestaurant ?? analysis.restaurants[0] ?? null);
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
    if (!selectedRestaurant || !uploadedImageUrl || isSaving) return;

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
      companionId: companionId ?? undefined,
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

      navigate(`/record/${visitDate}`);
    } catch (error) {
      console.error('기록 저장 실패:', error);
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
        <S.BackButton onClick={handleBackFromStep}>{'<'}</S.BackButton>
        <S.ProgressTrack>
          <S.ProgressFill $step={step} />
        </S.ProgressTrack>
      </S.HeaderRow>

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
          onApplyAnalysis={handleApplyAnalysis}
          onRetryAnalysis={handleRetryAnalysis}
          foodName={foodName}
          onFoodNameChange={setFoodName}
          selectedRestaurant={selectedRestaurant}
          onSelectRestaurant={setSelectedRestaurant}
          companionId={companionId}
          onCompanionChange={setCompanionId}
          visitDate={visitDate}
          onVisitDateChange={setVisitDate}
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
