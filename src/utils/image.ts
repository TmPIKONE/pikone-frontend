import { API_BASE_URL } from '~/apis/config/apiConfig';

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

const isSignedUploadUrl = (imageUrl?: string | null) => {
  if (!imageUrl) return false;

  try {
    const url = new URL(imageUrl, API_BASE_URL);
    const isApiUrl = !url.origin || url.origin === API_ORIGIN;
    const isProtectedVariant = /^\/uploads\/(optimized|thumbnails)\/[^/]+$/.test(url.pathname);

    return (
      isApiUrl &&
      isProtectedVariant &&
      url.searchParams.has('expires') &&
      url.searchParams.has('signature')
    );
  } catch {
    return false;
  }
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
  if (isSignedUploadUrl(imageUrl)) return resolveImageUrl(imageUrl);

  const fileName = getUploadFileName(imageUrl);
  if (!fileName) return resolveImageUrl(imageUrl);

  return `${API_BASE_URL}/uploads/optimized/${encodeURIComponent(fileName)}`;
};

export const resolveThumbnailUrl = (imageUrl?: string | null) => {
  if (isSignedUploadUrl(imageUrl)) return resolveImageUrl(imageUrl);

  const fileName = getUploadFileName(imageUrl);
  if (!fileName) return resolveImageUrl(imageUrl);

  return `${API_BASE_URL}/uploads/thumbnails/${encodeURIComponent(fileName)}`;
};
