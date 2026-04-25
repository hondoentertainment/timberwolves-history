import { describe, expect, it } from "vitest";

import { groupSearchHits, siteSearch } from "./site-search";

describe("siteSearch (DISC-002 v2)", () => {
  it("finds memes by summary keyword", async () => {
    const hits = await siteSearch("lottery");
    expect(hits.some((h) => h.kind === "Meme" && h.href.includes("/memes#"))).toBe(true);
  });

  it("matches season blurbs when query length is sufficient", async () => {
    const hits = await siteSearch("garnett");
    expect(hits.some((h) => h.kind === "Season")).toBe(true);
  });

  it("finds merged season graph themes by substring", async () => {
    const hits = await siteSearch("mvp");
    expect(hits.some((h) => h.kind === "Theme" && h.href.includes("theme="))).toBe(true);
  });

  it("titles inferred era-highlight theme hits readably", async () => {
    const hits = await siteSearch("era-highlight");
    const themeHit = hits.find((h) => h.kind === "Theme" && h.href.includes("era-highlight"));
    expect(themeHit?.title).toMatch(/^Era highlight \(/);
  });

  it("finds guided journeys", async () => {
    const hits = await siteSearch("start here");
    expect(hits.some((h) => h.kind === "Journey" && h.href === "/start-here")).toBe(true);
  });

  it("groups search hits in product-friendly order", () => {
    const groups = groupSearchHits([
      { kind: "Season", href: "/seasons/2003-04", title: "2003-04 season" },
      { kind: "Journey", href: "/start-here", title: "New fan? Start here" },
      { kind: "Player", href: "/players/1", title: "Player" },
    ]);
    expect(groups.map((g) => g.kind)).toEqual(["Journey", "Player", "Season"]);
  });
});
