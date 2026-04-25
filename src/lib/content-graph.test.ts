import { describe, expect, it } from "vitest";

import {
  humanizeIdSlug,
  isSeasonSlugForGraph,
  linksFromContentGraph,
  mergeContentGraphs,
  normalizeContentGraph,
  opaqueGameLabels,
} from "./content-graph";

describe("content-graph", () => {
  it("detects season-shaped game anchors", () => {
    expect(isSeasonSlugForGraph("2003-04")).toBe(true);
    expect(isSeasonSlugForGraph("2003-4")).toBe(false);
    expect(isSeasonSlugForGraph("wcf-game-6")).toBe(false);
  });

  it("humanizes kebab slugs", () => {
    expect(humanizeIdSlug("tom-thibodeau")).toBe("Tom Thibodeau");
    expect(humanizeIdSlug("post-kg-rebuild")).toBe("Post Kg Rebuild");
  });

  it("normalizes empty graph to undefined", () => {
    expect(normalizeContentGraph({})).toBeUndefined();
    expect(normalizeContentGraph({ themes: [] })).toBeUndefined();
  });

  it("mergeContentGraphs unions and dedupes", () => {
    const m = mergeContentGraphs(
      { playerIds: [1], eraSlugs: ["a"] },
      { playerIds: [1, 2], themes: ["x"] },
    );
    expect(m?.playerIds).toEqual([1, 2]);
    expect(m?.eraSlugs).toEqual(["a"]);
    expect(m?.themes).toEqual(["x"]);
  });

  it("builds links and separates opaque game labels", () => {
    const g = normalizeContentGraph({
      playerIds: [708],
      seasonIds: ["2003-04"],
      gameIds: ["2003-04", "curated-moment-slug"],
      themes: ["mvp-season"],
    });
    expect(opaqueGameLabels(g)).toEqual(["curated-moment-slug"]);
    const links = linksFromContentGraph(g);
    expect(links.map((l) => l.href)).toContain("/players/708");
    expect(links.map((l) => l.href)).toContain("/seasons/2003-04");
    expect(links.filter((l) => l.href === "/seasons/2003-04").length).toBe(1);
  });
});
