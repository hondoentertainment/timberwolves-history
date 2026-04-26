import { describe, expect, it } from "vitest";

import {
  coachCoversSeason,
  coachNamesForSeason,
  coachesFileAttribution,
  getAllCoaches,
  getCoachById,
} from "@/lib/coaches";

describe("getCoachById", () => {
  it("returns a coach record for a known id", () => {
    const flip = getCoachById("flip-saunders");
    expect(flip?.name).toBe("Flip Saunders");
    expect(flip?.tenures.length).toBeGreaterThan(0);
  });

  it("returns undefined for an unknown id", () => {
    expect(getCoachById("not-a-real-coach")).toBeUndefined();
  });
});

describe("coachCoversSeason", () => {
  it("returns true when the coach tenure spans the season", () => {
    expect(coachCoversSeason("flip-saunders", "2003-04")).toBe(true);
  });

  it("returns true on tenure boundary seasons", () => {
    expect(coachCoversSeason("flip-saunders", "1995-96")).toBe(true);
    expect(coachCoversSeason("flip-saunders", "2004-05")).toBe(true);
  });

  it("returns false just outside a tenure span", () => {
    expect(coachCoversSeason("flip-saunders", "2005-06")).toBe(false);
  });

  it("returns false for unknown coach ids", () => {
    expect(coachCoversSeason("not-a-real-coach", "2003-04")).toBe(false);
  });
});

describe("coachNamesForSeason", () => {
  it("includes Flip Saunders for a season inside his first tenure", () => {
    const names = coachNamesForSeason("2003-04");
    expect(names).toContain("Flip Saunders");
  });

  it("never lists the same coach name twice in one season", () => {
    const names = coachNamesForSeason("2003-04");
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("getAllCoaches", () => {
  it("returns a non-empty roster", () => {
    expect(getAllCoaches().length).toBeGreaterThan(0);
  });
});

describe("coachesFileAttribution", () => {
  it("returns a non-empty attribution string", () => {
    expect(coachesFileAttribution().length).toBeGreaterThan(0);
  });
});
