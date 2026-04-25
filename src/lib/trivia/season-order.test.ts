import { describe, expect, it } from "vitest";

import { compareSeasonIds, seasonChronoKey } from "./season-order";

describe("season-order", () => {
  it("orders NBA season slugs chronologically", () => {
    expect(compareSeasonIds("1989-90", "1990-91")).toBeLessThan(0);
    expect(compareSeasonIds("2024-25", "2003-04")).toBeGreaterThan(0);
  });

  it("produces stable numeric keys for sorting", () => {
    expect(seasonChronoKey("2003-04")).toBeLessThan(seasonChronoKey("2004-05"));
  });
});
