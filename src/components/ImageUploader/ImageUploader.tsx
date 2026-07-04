import { useEffect, useMemo, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { Camera } from 'lucide-react';
import * as S from './ImageUploader.styles';
import type { ImageUploaderProps } from './ImageUploader.types';

const ImageUploader = ({ file, onChange, className }: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.files?.[0] ?? null);
  };

  return (
    <S.Wrapper className={className}>
      <S.HiddenInput
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
      />

      {previewUrl ? (
        <S.PreviewButton type="button" onClick={() => inputRef.current?.click()}>
          <S.PreviewImage src={previewUrl} alt="선택한 사진" />
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
