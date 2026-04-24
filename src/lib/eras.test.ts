import { describe, expect, it } from "vitest";

import { getEraHubLinkForPlayer } from "./eras";

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
