import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Step1Photo from '~/components/RecordAddStep/Step1Photo';
import Step2Analyze from '~/components/RecordAddStep/Step2Analyze';
import Step3Save from '~/components/RecordAddStep/Step3Save';
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

  // RecordDetail 빈 상태에서 특정 날짜를 눌러 들어온 경우, 그 날짜를 기본값으로 사용
  const initialDate = searchParams.get('date') ?? todayStr();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [coords, setCoords] = useState<{ latitude?: number; longitude?: number }>({});

  const [analysis, setAnalysis] = useState<AiFoodResponse | null>(null);
  const [foodName, setFoodName] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantCandidate | null>(null);

  const [companionId, setCompanionId] = useState<number | null>(null);
  const [visitDate, setVisitDate] = useState(initialDate);
  const [willRevisit, setWillRevisit] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [locationType, setLocationType] = useState<LocationType>('RESTAURANT');

  const { mutate: analyzeImage, isPending: isAnalyzing } = useAnalyzeImage(
    coords.latitude,
    coords.longitude,
  );
  const { mutate: saveRecord, isPending: isSaving } = useSaveRecord();

  const handleLocationResolved = (latitude?: number, longitude?: number) => {
    setCoords({ latitude, longitude });
  };

  const handleGoToAnalyze = () => {
    if (!photoFile) return;
    setStep(2);

    const formData = new FormData();
    formData.append('image', photoFile);

    analyzeImage(formData, {
      onSuccess: (data) => {
        setAnalysis(data);
        setFoodName(data.foodName);
        setSelectedRestaurant(data.recommendedRestaurant ?? data.restaurants[0] ?? null);
      },
      onError: () => {
        setAnalysis(null);
      },
    });
  };

  const handleRetakePhoto = () => {
    setAnalysis(null);
    setPhotoFile(null);
    setStep(1);
  };

  const handleGoToSave = () => {
    if (!selectedRestaurant || !foodName.trim()) return;
    setStep(3);
  };

  const handleSave = () => {
    if (!selectedRestaurant) return;

    const restaurant: RestaurantInfo = {
      kakaoPlaceId: selectedRestaurant.kakaoPlaceId,
      placeName: selectedRestaurant.placeName,
      category: selectedRestaurant.category,
      address: selectedRestaurant.address,
      latitude: selectedRestaurant.latitude,
      longitude: selectedRestaurant.longitude,
    };

    saveRecord(
      {
        kakaoPlaceId: restaurant.kakaoPlaceId,
        restaurant,
        foodName: foodName.trim(),
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
      },
      {
        onSuccess: () => {
          navigate(`/record/${visitDate}`);
        },
      },
    );
  };

  const handleBackFromStep = () => {
    if (step === 2) {
      setStep(1);
      return;
    }
    if (step === 3) {
      setStep(2);
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
          onFileChange={setPhotoFile}
          onLocationResolved={handleLocationResolved}
          onNext={handleGoToAnalyze}
        />
      )}

      {step === 2 && (
        <Step2Analyze
          isAnalyzing={isAnalyzing}
          analysis={analysis}
          foodName={foodName}
          onFoodNameChange={setFoodName}
          selectedRestaurant={selectedRestaurant}
          onSelectRestaurant={setSelectedRestaurant}
          onNext={handleGoToSave}
          onBack={handleRetakePhoto}
        />
      )}

      {step === 3 && (
        <Step3Save
          foodName={foodName}
          restaurantName={selectedRestaurant?.placeName ?? ''}
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
