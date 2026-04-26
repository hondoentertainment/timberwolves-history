import { describe, expect, it } from "vitest";

import { inferContentGraphForSeason } from "@/lib/season-graph-infer";

describe("inferContentGraphForSeason", () => {
  it("adds a decade theme for canonical season slugs", () => {
    const g = inferContentGraphForSeason("2017-18");
    expect(g?.themes).toContain("decade-2010s");
  });

  it("includes era-highlight themes for hub highlight seasons", () => {
    const g = inferContentGraphForSeason("2017-18");
    expect(g?.themes?.some((t) => t.startsWith("era-highlight:"))).toBe(true);
  });
});
