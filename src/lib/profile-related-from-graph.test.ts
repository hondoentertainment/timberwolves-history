import { describe, expect, it } from "vitest";

import { getLongreadRelatedLinksForCoach, getLongreadRelatedLinksForPlayer } from "./profile-related-from-graph";

describe("profile-related-from-graph", () => {
  it("finds flagship longread for KG via content graph", () => {
    const links = getLongreadRelatedLinksForPlayer(708);
    expect(links.some((l) => l.href.includes("weight-of-the-north"))).toBe(true);
  });

  it("finds flagship longread for Flip via coach graph", () => {
    const links = getLongreadRelatedLinksForCoach("flip-saunders");
    expect(links.some((l) => l.href.includes("weight-of-the-north"))).toBe(true);
  });
});
