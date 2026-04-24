import { describe, expect, it } from "vitest";

import { formatPlayoffNarrative } from "./playoff-summary";

describe("formatPlayoffNarrative", () => {
  it("describes missing playoffs", () => {
    expect(
      formatPlayoffNarrative({ playoffWins: 0, playoffLosses: 0, finalsAppearance: "N/A" }),
    ).toMatch(/Did not qualify/i);
  });

  it("uses NBA finals appearance when provided", () => {
    expect(
      formatPlayoffNarrative({
        playoffWins: 10,
        playoffLosses: 9,
        finalsAppearance: "Conference Finals",
      }),
    ).toMatch(/10-9/);
    expect(
      formatPlayoffNarrative({
        playoffWins: 10,
        playoffLosses: 9,
        finalsAppearance: "Conference Finals",
      }),
    ).toMatch(/Western Conference finals/i);
  });

  it("falls back to record-only when appearance unknown", () => {
    expect(
      formatPlayoffNarrative({ playoffWins: 1, playoffLosses: 4, finalsAppearance: "" }),
    ).toMatch(/1-4/);
  });
});
