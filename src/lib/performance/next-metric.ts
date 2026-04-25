/**
 * Subset of `web-vitals` `Metric` passed to `useReportWebVitals` (Next.js re-exports).
 * Defined locally so we do not import from `next/dist/compiled/*` (no `.d.ts` there).
 */
export type NextWebVitalsMetric = {
  id: string;
  name: string;
  value: number;
  rating?: "good" | "needs-improvement" | "poor";
  navigationType?: string;
};
