import { describe, expect, it } from "vitest";

import {
  draftPicksAttribution,
  getDraftPicksForSeason,
  hasDraftPickCoverageForSeason,
} from "./draft-picks";

describe("getDraftPicksForSeason", () => {
  it("returns picks for a season that has rows", () => {
    const picks = getDraftPicksForSeason("1989-90");
    expect(picks.length).toBeGreaterThan(0);
    expect(picks[0]).toMatchObject({
      round: expect.any(Number),
      pickOverall: expect.any(Number),
      playerName: expect.any(String),
    });
  });

  it("returns an empty array for a covered season with no selections", () => {
    expect(getDraftPicksForSeason("2021-22")).toEqual([]);
  });

  it("returns an empty array when the season key is absent", () => {
    expect(getDraftPicksForSeason("2099-00")).toEqual([]);
  });
});

describe("hasDraftPickCoverageForSeason", () => {
  it("is true when the season exists in the register (including empty arrays)", () => {
    expect(hasDraftPickCoverageForSeason("2021-22")).toBe(true);
  });

  it("is false for an unknown season slug", () => {
    expect(hasDraftPickCoverageForSeason("2099-00")).toBe(false);
  });
});

describe("draftPicksAttribution", () => {
  it("returns a non-empty attribution string", () => {
    expect(draftPicksAttribution().length).toBeGreaterThan(0);
  });
});
