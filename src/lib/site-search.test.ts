import { describe, expect, it } from "vitest";

import { siteSearch } from "./site-search";

describe("siteSearch (DISC-002 v2)", () => {
  it("finds memes by summary keyword", async () => {
    const hits = await siteSearch("lottery");
    expect(hits.some((h) => h.kind === "Meme" && h.href.includes("/memes#"))).toBe(true);
  });

  it("matches season blurbs when query length is sufficient", async () => {
    const hits = await siteSearch("garnett");
    expect(hits.some((h) => h.kind === "Season")).toBe(true);
  });
});
