export type ReviewSource = 'google' | 'supabase';

export interface ReviewRecord {
  id: string;
  name: string;
  text: string;
  rating: number;
  created_at?: string | null;
  authorUrl?: string | null;
  authorPhotoUrl?: string | null;
  reviewUrl?: string | null;
}

export interface ReviewSummary {
  totalCount: number;
  averageRating: number;
  latestApprovedAt?: string | null;
}

export interface ReviewPayload {
  reviews: ReviewRecord[];
  summary: ReviewSummary;
  source: ReviewSource;
  reviewUrl?: string | null;
  sortDescription?: string | null;
}

interface GoogleAuthorAttribution {
  displayName?: string;
  uri?: string;
  photoUri?: string;
}

interface GoogleLocalizedText {
  text?: string;
}

interface GoogleReview {
  name?: string;
  relativePublishTimeDescription?: string;
  text?: GoogleLocalizedText;
  originalText?: GoogleLocalizedText;
  rating?: number;
  authorAttribution?: GoogleAuthorAttribution;
  publishTime?: string;
  googleMapsUri?: string;
}

interface GooglePlaceDetailsResponse {
  id?: string;
  displayName?: GoogleLocalizedText;
  rating?: number;
  userRatingCount?: number;
  reviews?: GoogleReview[];
  googleMapsUri?: string;
}

interface GoogleReviewsConfig {
  apiKey: string;
  placeId: string;
  languageCode?: string;
  regionCode?: string;
  reviewUrl?: string;
}

function getGoogleReviewsConfig(): GoogleReviewsConfig | null {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACES_PLACE_ID;

  if (!apiKey || !placeId) return null;

  return {
    apiKey,
    placeId,
    languageCode: process.env.GOOGLE_PLACES_LANGUAGE_CODE || 'en-GB',
    regionCode: process.env.GOOGLE_PLACES_REGION_CODE || 'GB',
    reviewUrl: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || undefined,
  };
}

export function googleReviewsEnabled() {
  return getGoogleReviewsConfig() !== null;
}

export function getConfiguredGoogleReviewUrl() {
  return getGoogleReviewsConfig()?.reviewUrl ?? process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ?? null;
}

export async function fetchGoogleReviews(): Promise<ReviewPayload | null> {
  const config = getGoogleReviewsConfig();
  if (!config) return null;

  const url = new URL(`https://places.googleapis.com/v1/places/${config.placeId}`);
  if (config.languageCode) url.searchParams.set('languageCode', config.languageCode);
  if (config.regionCode) url.searchParams.set('regionCode', config.regionCode);

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': config.apiKey,
      'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,reviews,googleMapsUri',
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Google Places request failed with status ${response.status}`);
  }

  const place = (await response.json()) as GooglePlaceDetailsResponse;
  const reviews = (place.reviews || [])
    .filter((review) => (review.text?.text || review.originalText?.text || '').trim().length > 0)
    .map((review, index) => ({
      id: review.name || `${place.id || config.placeId}-${index}`,
      name: review.authorAttribution?.displayName || 'Google user',
      text: review.text?.text?.trim() || review.originalText?.text?.trim() || '',
      rating: Math.max(1, Math.min(5, Math.round(review.rating || 0))),
      created_at: review.publishTime || null,
      authorUrl: review.authorAttribution?.uri || null,
      authorPhotoUrl: review.authorAttribution?.photoUri || null,
      reviewUrl: review.googleMapsUri || null,
    }));

  const averageRating = typeof place.rating === 'number'
    ? place.rating
    : reviews.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return {
    reviews,
    summary: {
      totalCount: place.userRatingCount || reviews.length,
      averageRating,
      latestApprovedAt: null,
    },
    source: 'google',
    reviewUrl: config.reviewUrl || place.googleMapsUri || null,
    sortDescription: 'Google reviews sorted by relevance',
  };
}
