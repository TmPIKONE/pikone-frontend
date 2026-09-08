export const MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024;
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png'] as const;

interface ImageFileCandidate {
  size: number;
  type: string;
}

export const validateImageFile = (file: ImageFileCandidate): string | null => {
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type as (typeof SUPPORTED_IMAGE_TYPES)[number])) {
    return 'JPG 또는 PNG 사진만 올릴 수 있어요.';
  }

  if (file.size === 0) {
    return '내용이 없는 사진이에요. 다른 사진을 선택해주세요.';
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return '사진은 20MB 이하로 올려주세요.';
  }

  return null;
};
