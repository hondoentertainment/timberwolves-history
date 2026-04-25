import { describe, expect, it } from "vitest";

import { getAllEraHubsForPlayer, getEraHubLinkForPlayer, getEraHubsForCoach } from "./eras";

describe("getEraHubLinkForPlayer", () => {
  it("returns slug and label for KG from pilot data", () => {
    const link = getEraHubLinkForPlayer(708);
    expect(link).toEqual({
      slug: "garnett",
      linkLabel: "Kevin Garnett era hub",
    });
  });

  it("returns undefined when no era spotlights the player", () => {
    expect(getEraHubLinkForPlayer(1)).toBeUndefined();
  });
});

describe("getAllEraHubsForPlayer", () => {
  it("returns every era hub that spotlights the player", () => {
    const hubs = getAllEraHubsForPlayer(708);
    expect(hubs.map((h) => h.slug)).toEqual(["garnett"]);
  });
});

describe("getEraHubsForCoach", () => {
  it("returns era hubs that reference the coach", () => {
    const hubs = getEraHubsForCoach("flip-saunders");
    const slugs = hubs.map((h) => h.slug).sort();
    expect(slugs).toContain("garnett");
    expect(slugs).toContain("post-kg-rebuild");
  });
});
