import { describe, expect, it } from "vitest";

import {
  ratingForVital,
  recommendationsForVital,
  shouldRecommend,
  worseRating,
} from "@/lib/performance/web-vitals-policy";

describe("ratingForVital", () => {
  it("rates LCP at thresholds", () => {
    expect(ratingForVital("LCP", 2000)).toBe("good");
    expect(ratingForVital("LCP", 3000)).toBe("needs-improvement");
    expect(ratingForVital("LCP", 5000)).toBe("poor");
  });

  it("rates CLS at thresholds", () => {
    expect(ratingForVital("CLS", 0.05)).toBe("good");
    expect(ratingForVital("CLS", 0.15)).toBe("needs-improvement");
    expect(ratingForVital("CLS", 0.3)).toBe("poor");
  });

  it("returns null for unknown metrics", () => {
    expect(ratingForVital("UNKNOWN", 100)).toBeNull();
  });
});

describe("shouldRecommend", () => {
  it("is true only for degraded ratings", () => {
    expect(shouldRecommend("good")).toBe(false);
    expect(shouldRecommend("needs-improvement")).toBe(true);
    expect(shouldRecommend("poor")).toBe(true);
    expect(shouldRecommend(null)).toBe(false);
  });
});

describe("worseRating", () => {
  it("picks the worse of two", () => {
    expect(worseRating("good", "poor")).toBe("poor");
    expect(worseRating("needs-improvement", "good")).toBe("needs-improvement");
  });
});

describe("recommendationsForVital", () => {
  it("returns non-empty guidance for LCP", () => {
    const ni = recommendationsForVital("LCP", "needs-improvement");
    const poor = recommendationsForVital("LCP", "poor");
    expect(ni.length).toBeGreaterThan(0);
    expect(poor.length).toBeGreaterThan(0);
    expect(poor[0]).toContain("Largest Contentful Paint");
  });
});
