import { describe, expect, it } from 'vitest';
import { resolveImageUrl, resolveOptimizedImageUrl, resolveThumbnailUrl } from './image';

describe('image URL resolution', () => {
  it('preserves the backend signature when resolving protected images', () => {
    const signed =
      '/uploads/optimized/meal.jpg?expires=1900000000&signature=server-generated-signature';

    expect(resolveOptimizedImageUrl(signed).endsWith(signed)).toBe(true);
    expect(resolveThumbnailUrl(signed).endsWith(signed)).toBe(true);
  });

  it('keeps external profile images unchanged', () => {
    expect(resolveImageUrl('https://profile.example/user.jpg')).toBe(
      'https://profile.example/user.jpg',
    );
  });

  it('converts a legacy local path to its requested variant', () => {
    expect(new URL(resolveOptimizedImageUrl('/uploads/meal.jpg')).pathname).toBe(
      '/uploads/optimized/meal.jpg',
    );
    expect(new URL(resolveThumbnailUrl('/uploads/meal.jpg')).pathname).toBe(
      '/uploads/thumbnails/meal.jpg',
    );
  });
});
