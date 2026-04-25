import { describe, expect, it } from "vitest";

import { inferContentGraphForSeason, mergedSeasonStoryGraph } from "./season-graph-infer";

describe("season-graph-infer", () => {
  it("infers garnett era for a KG highlight season", () => {
    const g = inferContentGraphForSeason("2003-04");
    expect(g?.eraSlugs).toContain("garnett");
    expect(g?.themes?.some((t) => t.includes("garnett"))).toBe(true);
  });

  it("merges explicit graph with inferred era slugs", () => {
    const merged = mergedSeasonStoryGraph({ playerIds: [708], themes: ["mvp-season"] }, "2003-04");
    expect(merged?.playerIds).toContain(708);
    expect(merged?.eraSlugs).toContain("garnett");
    expect(merged?.themes).toContain("mvp-season");
  });
});
