/**
 * Thresholds aligned with Chrome / Web Vitals guidance (lab-oriented cutoffs).
 * @see https://web.dev/articles/vitals
 */

export type VitalName = "CLS" | "FCP" | "FID" | "INP" | "LCP" | "TTFB";

export type VitalRating = "good" | "needs-improvement" | "poor";

const RANK: Record<VitalRating, number> = {
  good: 0,
  "needs-improvement": 1,
  poor: 2,
};

/** Upper bound (inclusive) for "good" — above that up to `poorMin` is needs-improvement, else poor. */
type ThresholdTriple = { goodMax: number; niMax: number };

const THRESHOLDS: Record<Exclude<VitalName, "FID">, ThresholdTriple> = {
  LCP: { goodMax: 2500, niMax: 4000 },
  INP: { goodMax: 200, niMax: 500 },
  CLS: { goodMax: 0.1, niMax: 0.25 },
  FCP: { goodMax: 1800, niMax: 3000 },
  TTFB: { goodMax: 800, niMax: 1800 },
};

/** FID is legacy; keep coarse thresholds if it still fires. */
const FID_THRESHOLDS: ThresholdTriple = { goodMax: 100, niMax: 300 };

export function ratingForVital(name: string, value: number): VitalRating | null {
  if (name === "FID") return rateTriple(value, FID_THRESHOLDS);
  if (name in THRESHOLDS) return rateTriple(value, THRESHOLDS[name as keyof typeof THRESHOLDS]);
  return null;
}

function rateTriple(value: number, t: ThresholdTriple): VitalRating {
  if (value <= t.goodMax) return "good";
  if (value <= t.niMax) return "needs-improvement";
  return "poor";
}

export function worseRating(a: VitalRating | null, b: VitalRating | null): VitalRating | null {
  if (!a) return b;
  if (!b) return a;
  return RANK[a] >= RANK[b] ? a : b;
}

export function shouldRecommend(rating: VitalRating | null): boolean {
  return rating === "needs-improvement" || rating === "poor";
}

export function recommendationsForVital(name: string, rating: VitalRating): readonly string[] {
  const urgent = rating === "poor";

  switch (name) {
    case "LCP":
      return urgent
        ? [
            "Largest Contentful Paint is poor: cut server work on the critical path (cache NBA bundles, stream below-the-fold UI with Suspense).",
            "Reduce hero weight: prefer `next/font`, avoid large inline images without `priority` / modern formats.",
            "Check TTFB and document weight; defer non-critical scripts.",
          ]
        : [
            "LCP is slower than ideal: confirm the LCP element is not waiting on slow data or large images.",
            "Use streaming and `loading` priorities so above-the-fold content resolves earlier.",
          ];
    case "INP":
    case "FID":
      return urgent
        ? [
            "Interaction latency is poor: shrink client JS, split heavy client islands, and avoid long main-thread tasks after clicks.",
            "Audit event handlers and re-renders on nav and forms; prefer server components where possible.",
          ]
        : [
            "Interactions feel sluggish: profile main-thread work after route changes and defer non-urgent effects.",
          ];
    case "CLS":
      return urgent
        ? [
            "Layout shift is high: reserve space for images and async UI (skeletons with stable min-height).",
            "Avoid inserting banners or fonts late without reserved layout; prefer `size` on media.",
          ]
        : [
            "Minor layout movement: match skeleton dimensions to final cards and stabilize footer streaming fallbacks.",
          ];
    case "FCP":
      return urgent
        ? [
            "First paint is slow: reduce blocking CSS/JS in the head, trim the initial HTML payload, and verify CDN caching.",
          ]
        : [
            "First paint could improve: inline only critical CSS and defer the rest; audit font loading.",
          ];
    case "TTFB":
      return urgent
        ? [
            "TTFB is poor: move blocking awaits out of the root layout, warm `unstable_cache`, and check region/DB latency.",
            "Ensure HTML is cacheable at the edge where appropriate (ISR / static segments).",
          ]
        : [
            "TTFB is elevated: defer footer-only server work behind Suspense and dedupe data reads with `cache()`.",
          ];
    default:
      return ["Inspect recent deploys, third-party scripts, and network waterfalls for regressions."];
  }
}
