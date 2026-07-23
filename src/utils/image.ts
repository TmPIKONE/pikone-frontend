const API_BASE_URL = (import.meta.env.VITE_BASE_URL || 'http://localhost:8080').replace(
  /\/$/,
  '',
);

const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return '';
  }
})();

const getLocalUploadPath = (imageUrl?: string | null) => {
  if (!imageUrl) return null;

  if (imageUrl.startsWith('/uploads/')) {
    return imageUrl.split('?')[0];
  }

  try {
    const url = new URL(imageUrl);
    if (url.origin === API_ORIGIN && url.pathname.startsWith('/uploads/')) {
      return url.pathname;
    }
  } catch {
    return null;
  }

  return null;
};

const getUploadFileName = (imageUrl?: string | null) => {
  const uploadPath = getLocalUploadPath(imageUrl);
  if (!uploadPath) return null;

  const parts = uploadPath.split('/').filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : null;
};

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

export const resolveOptimizedImageUrl = (imageUrl?: string | null) => {
  const fileName = getUploadFileName(imageUrl);
  if (!fileName) return resolveImageUrl(imageUrl);

  return `${API_BASE_URL}/uploads/optimized/${encodeURIComponent(fileName)}`;
};

export const resolveThumbnailUrl = (imageUrl?: string | null) => {
  const fileName = getUploadFileName(imageUrl);
  if (!fileName) return resolveImageUrl(imageUrl);

  return `${API_BASE_URL}/uploads/thumbnails/${encodeURIComponent(fileName)}`;
};
