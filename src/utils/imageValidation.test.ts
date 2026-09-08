import { describe, expect, it } from 'vitest';
import { MAX_IMAGE_SIZE_BYTES, validateImageFile } from './imageValidation';

describe('validateImageFile', () => {
  it('JPG와 PNG 사진을 허용한다', () => {
    expect(validateImageFile({ type: 'image/jpeg', size: 1024 })).toBeNull();
    expect(validateImageFile({ type: 'image/png', size: 1024 })).toBeNull();
  });

  it('지원하지 않는 형식을 거절한다', () => {
    expect(validateImageFile({ type: 'image/gif', size: 1024 })).toBe(
      'JPG 또는 PNG 사진만 올릴 수 있어요.',
    );
  });

  it('빈 파일과 20MB 초과 파일을 거절한다', () => {
    expect(validateImageFile({ type: 'image/jpeg', size: 0 })).toBe(
      '내용이 없는 사진이에요. 다른 사진을 선택해주세요.',
    );
    expect(validateImageFile({ type: 'image/jpeg', size: MAX_IMAGE_SIZE_BYTES + 1 })).toBe(
      '사진은 20MB 이하로 올려주세요.',
    );
  });
});
