const API_BASE_URL = (import.meta.env.VITE_BASE_URL || 'http://localhost:8080').replace(
  /\/$/,
  '',
);

export const resolveImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) return '';

  if (
    imageUrl.startsWith('http://') ||
    imageUrl.startsWith('https://') ||
    imageUrl.startsWith('data:') ||
    imageUrl.startsWith('blob:')
  ) {
    return imageUrl;
  }

  if (imageUrl.startsWith('/uploads/')) {
    return `${API_BASE_URL}${imageUrl}`;
  }

  return imageUrl;
};
