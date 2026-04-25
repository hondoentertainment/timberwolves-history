import {
  ratingForVital,
  recommendationsForVital,
  shouldRecommend,
  type VitalRating,
} from "@/lib/performance/web-vitals-policy";

export type WebVitalInput = {
  name: string;
  value: number;
  /** From `web-vitals` when available; otherwise recomputed from thresholds. */
  rating?: string;
  id?: string;
  navigationType?: string;
};

export type ProcessedWebVital = {
  name: string;
  value: number;
  rating: VitalRating | null;
  recommendations: string[];
  shouldRecommend: boolean;
  /** Safe to POST to analytics / internal API. */
  payload: Record<string, unknown>;
};

function normalizeRating(metric: WebVitalInput): VitalRating | null {
  const r = metric.rating;
  if (r === "good" || r === "needs-improvement" || r === "poor") return r;
  return ratingForVital(metric.name, metric.value);
}

/**
 * Turn a raw metric into ratings, actionable copy, and a logging payload.
 * Call from `useReportWebVitals` and optional server ingest.
 */
export function processWebVital(metric: WebVitalInput): ProcessedWebVital | null {
  const rating = normalizeRating(metric);
  if (!rating) return null;

  const needs = shouldRecommend(rating);
  const recommendations = needs ? [...recommendationsForVital(metric.name, rating)] : [];

  return {
    name: metric.name,
    value: metric.value,
    rating,
    recommendations,
    shouldRecommend: needs,
    payload: {
      name: metric.name,
      value: metric.value,
      rating,
      id: metric.id,
      navigationType: metric.navigationType,
      recommendations,
      recordedAt: new Date().toISOString(),
    },
  };
}
