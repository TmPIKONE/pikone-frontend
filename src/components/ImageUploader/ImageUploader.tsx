import { useEffect, useId, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Plus } from 'lucide-react';
import { SUPPORTED_IMAGE_TYPES, validateImageFile } from '~/utils/imageValidation';
import * as S from './ImageUploader.styles';
import type { ImageUploaderProps } from './ImageUploader.types';

const PREVIEW_MAX_DIMENSION = 1280;
const PREVIEW_QUALITY = 0.8;

interface OptimizedPreviewProps {
  file: File;
  inputId: string;
  errorId?: string;
  onClick: () => void;
}

const OptimizedPreview = ({ file, inputId, errorId, onClick }: OptimizedPreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState(() => URL.createObjectURL(file));
  const currentUrlRef = useRef(previewUrl);

  useEffect(() => {
    let cancelled = false;

    const createLightweightPreview = async () => {
      if (!('createImageBitmap' in window)) return;

      try {
        const bitmap = await createImageBitmap(file);
        const scale = Math.min(1, PREVIEW_MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
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
        URL.revokeObjectURL(currentUrlRef.current);
        currentUrlRef.current = optimizedPreviewUrl;
        setPreviewUrl(optimizedPreviewUrl);
      } catch {
        // HEIC 등 브라우저에서 직접 디코딩하지 못하는 형식은 원본 미리보기를 유지한다.
      }
    };

    void createLightweightPreview();

    return () => {
      cancelled = true;
      URL.revokeObjectURL(currentUrlRef.current);
    };
  }, [file]);

  return (
    <S.PreviewButton
      type="button"
      aria-controls={inputId}
      aria-describedby={errorId}
      onClick={onClick}
    >
      <S.PreviewImage src={previewUrl} alt="선택한 사진" decoding="async" />
      <S.ChangeLabel>사진 변경</S.ChangeLabel>
    </S.PreviewButton>
  );
};

const ImageUploader = ({ file, onChange, className }: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const errorId = useId();
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;

    if (!nextFile) {
      setValidationError(null);
      onChange(null);
      return;
    }

    const error = validateImageFile(nextFile);
    if (error) {
      setValidationError(error);
      event.target.value = '';
      return;
    }

    setValidationError(null);
    onChange(nextFile);
  };

  return (
    <S.Wrapper className={className}>
      <S.HiddenInput
        id={inputId}
        ref={inputRef}
        type="file"
        accept={SUPPORTED_IMAGE_TYPES.join(',')}
        capture="environment"
        onChange={handleChange}
      />

      {file ? (
        <OptimizedPreview
          key={`${file.name}-${file.lastModified}-${file.size}`}
          file={file}
          inputId={inputId}
          errorId={validationError ? errorId : undefined}
          onClick={() => inputRef.current?.click()}
        />
      ) : (
        <S.EmptyButton
          type="button"
          aria-controls={inputId}
          aria-describedby={validationError ? errorId : undefined}
          onClick={() => inputRef.current?.click()}
        >
          <Plus size={42} strokeWidth={1.35} />
          <span>사진 추가</span>
        </S.EmptyButton>
      )}
      {validationError && (
        <S.ValidationError id={errorId} role="alert">
          {validationError}
        </S.ValidationError>
      )}
    </S.Wrapper>
  );
};

export default ImageUploader;
