import { API_BASE_URL } from '../services/api';

const normalizeString = (value: any): string | null => {
  if (!value) return null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || null;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (typeof value === 'object') {
    const nested = (value as any).url || (value as any).image || (value as any).image_url || (value as any).product_image || (value as any).src || (value as any).path || null;
    return normalizeString(nested);
  }
  return null;
};

export const resolveImage = (url?: any): string | null => {
  const normalized = normalizeString(url);
  if (!normalized) return null;

  const trimmed = normalized.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) return trimmed;

  const baseUrl = API_BASE_URL.replace(/\/api\/?$/, '');
  return `${baseUrl}/${trimmed.replace(/^\/+/, '')}`;
};

const flattenImageCandidates = (value: any): any[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.flatMap((item) => flattenImageCandidates(item));
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      return flattenImageCandidates(parsed);
    } catch {
      return [trimmed];
    }
  }

  if (typeof value === 'object') {
    const candidates = [
      (value as any).url,
      (value as any).image,
      (value as any).image_url,
      (value as any).product_image,
      (value as any).src,
      (value as any).path,
      (value as any).images,
      (value as any).product_images,
      (value as any).thumbnail_image,
    ];

    return candidates.flatMap((candidate) => flattenImageCandidates(candidate));
  }

  return [];
};

export const normalizeImageList = (value: any): string[] => {
  return flattenImageCandidates(value)
    .map((item) => resolveImage(item))
    .filter((item): item is string => Boolean(item));
};

export const getImageList = (item: any, fallbackName?: string) => {
  const candidates = [
    item?.variants?.[0]?.images,
    item?.variant_info?.images,
    item?.variant?.images,
    item?.selectedVariant?.images,
    item?.product_images,
    item?.images,
    item?.thumbnail_image,
    item?.image,
    item?.image_url,
    item?.product_image,
    item?.product?.product_images,
    item?.product?.images,
    item?.product?.image,
    item?.product?.thumbnail_image,
    item?.product?.image_url,
    item?.product?.product_image,
  ];

  const images = Array.from(new Set(candidates.flatMap((candidate) => normalizeImageList(candidate))));
  if (images.length > 0) return images;

  const fallbackName = fallbackName || item?.product_name || item?.name || item?.product?.name || 'Product';
  return [`https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=random`];
};

export const getImageUrl = (item: any, fallbackName?: string) => {
  return getImageList(item, fallbackName)[0];
};
