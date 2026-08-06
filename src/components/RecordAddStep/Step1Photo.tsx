import { useEffect } from 'react';
import ImageUploader from '~/components/ImageUploader/ImageUploader';
import type { Step1PhotoProps } from './Step1Photo.types';
import * as S from './Step1Photo.styles';

const Step1Photo = ({
  file,
  isLocationResolved,
  onFileChange,
  onLocationResolved,
  onNext,
}: Step1PhotoProps) => {
  useEffect(() => {
    if (!navigator.geolocation) {
      onLocationResolved(undefined, undefined);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => onLocationResolved(position.coords.latitude, position.coords.longitude),
      () => onLocationResolved(undefined, undefined),
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300_000 },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <S.Container>
      <S.Title>
        오늘의 식사를
        <br />한 장으로 남겨주세요
      </S.Title>
      <S.Description>사진을 고르면 AI가 메뉴와 식당을 먼저 찾아드려요.</S.Description>

      <S.Field>
        <S.Label>사진 등록 (1장)</S.Label>
        <ImageUploader file={file} onChange={onFileChange} />
      </S.Field>

      <S.Guide>
        <span>메뉴와 가까운 식당을 자동으로 채우고, 틀린 것만 바꿀 수 있어요.</span>
      </S.Guide>

      <S.NextButton type="button" disabled={!file} onClick={onNext}>
        다음
      </S.NextButton>
      {!isLocationResolved && <S.LocationStatus>현재 위치를 확인하고 있어요.</S.LocationStatus>}
    </S.Container>
  );
};

export default Step1Photo;
