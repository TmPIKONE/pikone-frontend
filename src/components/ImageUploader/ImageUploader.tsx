import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Camera } from 'lucide-react';
import * as S from './ImageUploader.styles';
import type { ImageUploaderProps } from './ImageUploader.types';

const PREVIEW_MAX_DIMENSION = 1280;
const PREVIEW_QUALITY = 0.8;

const ImageUploader = ({ file, onChange, className }: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return undefined;
    }

    let cancelled = false;
    let currentUrl = URL.createObjectURL(file);
    setPreviewUrl(currentUrl);

    const createLightweightPreview = async () => {
      if (!('createImageBitmap' in window)) return;

      try {
        const bitmap = await createImageBitmap(file);
        const scale = Math.min(
          1,
          PREVIEW_MAX_DIMENSION / Math.max(bitmap.width, bitmap.height),
        );
        const width = Math.max(1, Math.round(bitmap.width * scale));
        const height = Math.max(1, Math.round(bitmap.height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');
        if (!context) {
          bitmap.close();
          return;
        }

        context.drawImage(bitmap, 0, 0, width, height);
        bitmap.close();

        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, 'image/jpeg', PREVIEW_QUALITY);
        });

        if (!blob || cancelled) return;

        const optimizedPreviewUrl = URL.createObjectURL(blob);
        URL.revokeObjectURL(currentUrl);
        currentUrl = optimizedPreviewUrl;
        setPreviewUrl(optimizedPreviewUrl);
      } catch {
        // HEIC 등 브라우저에서 직접 디코딩하지 못하는 형식은 원본 미리보기를 유지한다.
      }
    };

    void createLightweightPreview();

    return () => {
      cancelled = true;
      URL.revokeObjectURL(currentUrl);
    };
  }, [file]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.files?.[0] ?? null);
  };

  return (
    <S.Wrapper className={className}>
      <S.HiddenInput
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        capture="environment"
        onChange={handleChange}
      />

      {previewUrl ? (
        <S.PreviewButton type="button" onClick={() => inputRef.current?.click()}>
          <S.PreviewImage src={previewUrl} alt="선택한 사진" decoding="async" />
          <S.ChangeLabel>사진 변경</S.ChangeLabel>
        </S.PreviewButton>
      ) : (
        <S.EmptyButton type="button" onClick={() => inputRef.current?.click()}>
          <Camera size={28} strokeWidth={1.5} />
          <span>사진 선택</span>
        </S.EmptyButton>
      )}
    </S.Wrapper>
  );
};

export default ImageUploader;
