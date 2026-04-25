import { describe, expect, it } from "vitest";

import { processWebVital } from "@/lib/performance/process-web-vital";

describe("processWebVital", () => {
  it("returns null for unknown metric names", () => {
    expect(processWebVital({ name: "CUSTOM", value: 1 })).toBeNull();
  });

  it("flags poor LCP with recommendations", () => {
    const p = processWebVital({ name: "LCP", value: 6000, rating: "poor" });
    expect(p?.shouldRecommend).toBe(true);
    expect(p?.recommendations.length).toBeGreaterThan(0);
    expect(p?.payload.rating).toBe("poor");
  });

  it("does not recommend good LCP", () => {
    const p = processWebVital({ name: "LCP", value: 1000, rating: "good" });
    expect(p?.shouldRecommend).toBe(false);
    expect(p?.recommendations).toEqual([]);
  });

  it("derives rating when omitted", () => {
    const p = processWebVital({ name: "TTFB", value: 3000 });
    expect(p?.rating).toBe("poor");
    expect(p?.shouldRecommend).toBe(true);
  });
});
