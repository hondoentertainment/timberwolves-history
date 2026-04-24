import { describe, expect, it } from "vitest";

import {
  currentNbaSeasonStartYear,
  parseSeasonSlug,
  seasonIdFromStartYear,
} from "./seasons";

describe("seasonIdFromStartYear", () => {
  it("formats classic and century-boundary seasons", () => {
    expect(seasonIdFromStartYear(1989)).toBe("1989-90");
    expect(seasonIdFromStartYear(1999)).toBe("1999-00");
    expect(seasonIdFromStartYear(2000)).toBe("2000-01");
    expect(seasonIdFromStartYear(2024)).toBe("2024-25");
  });
});

describe("parseSeasonSlug", () => {
  it("accepts valid Wolves-era slugs", () => {
    const ref = new Date(Date.UTC(2026, 3, 24));
    expect(parseSeasonSlug("1989-90", ref)).toBe("1989-90");
    expect(parseSeasonSlug("1999-00", ref)).toBe("1999-00");
    expect(parseSeasonSlug("2024-25", ref)).toBe("2024-25");
  });

  it("rejects malformed slugs", () => {
    const ref = new Date(Date.UTC(2026, 3, 24));
    expect(parseSeasonSlug("2024-26", ref)).toBeNull();
    expect(parseSeasonSlug("nope", ref)).toBeNull();
  });
});

describe("currentNbaSeasonStartYear", () => {
  it("maps April to the active season start year", () => {
    expect(currentNbaSeasonStartYear(new Date(Date.UTC(2026, 3, 24)))).toBe(2025);
  });

  it("maps November to the calendar year", () => {
    expect(currentNbaSeasonStartYear(new Date(Date.UTC(2026, 10, 1)))).toBe(2026);
  });
});
