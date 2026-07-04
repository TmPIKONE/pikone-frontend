import { useEffect } from 'react';
import ImageUploader from '~/components/ImageUploader/ImageUploader';
import * as S from './Step1Photo.styles';
import type { Step1PhotoProps } from './Step1Photo.types';

const Step1Photo = ({ file, onFileChange, onLocationResolved, onNext }: Step1PhotoProps) => {
  useEffect(() => {
    if (!navigator.geolocation) {
      onLocationResolved(undefined, undefined);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationResolved(position.coords.latitude, position.coords.longitude);
      },
      () => {
        // 위치 권한 거부 시 좌표 없이 진행 — 다음 단계에서 근처 식당 후보가 안 나올 수 있어요.
        onLocationResolved(undefined, undefined);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <S.Container>
      <S.Title>오늘 뭐 드셨어요?</S.Title>
      <S.Description>음식 사진을 올려주시면 AI가 메뉴와 식당을 찾아드려요.</S.Description>

      <ImageUploader file={file} onChange={onFileChange} />

      <S.NextButton type="button" disabled={!file} onClick={onNext}>
        다음
      </S.NextButton>
    </S.Container>
  );
};

export default Step1Photo;
