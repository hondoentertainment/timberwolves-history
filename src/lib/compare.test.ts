import { describe, expect, it } from "vitest";

import { compareFranchiseSeasons, comparePlayerTenures } from "./compare";
import type { AllTimePlayerEntry } from "./nba/players-index";
import type { FranchiseSeasonSummary } from "./nba/queries";

const seasonA = { seasonLabel: "2003-04", wins: 58, losses: 24, gp: 82, winPct: 0.707, playoffWins: 10, playoffLosses: 8, confRank: 1, divRank: 1, raw: {} } satisfies FranchiseSeasonSummary;
const seasonB = { seasonLabel: "2017-18", wins: 47, losses: 35, gp: 82, winPct: 0.573, playoffWins: 1, playoffLosses: 4, confRank: 8, divRank: 4, raw: {} } satisfies FranchiseSeasonSummary;

describe("compareFranchiseSeasons", () => {
  it("marks metric leaders", () => {
    const metrics = compareFranchiseSeasons(seasonA, seasonB);
    expect(metrics.find((m) => m.label === "Wins")?.leader).toBe("a");
    expect(metrics.find((m) => m.label === "Conference rank")?.leader).toBe("a");
  });
});

describe("comparePlayerTenures", () => {
  it("computes shared and unique seasons", () => {
    const a = { playerId: 1, name: "A", seasons: ["2003-04", "2004-05", "2017-18"] } satisfies AllTimePlayerEntry;
    const b = { playerId: 2, name: "B", seasons: ["2004-05", "2017-18", "2020-21"] } satisfies AllTimePlayerEntry;
    const result = comparePlayerTenures(a, b, [seasonA, seasonB]);

    expect(result.sharedSeasons).toEqual(["2004-05", "2017-18"]);
    expect(result.onlyA).toEqual(["2003-04"]);
    expect(result.onlyB).toEqual(["2020-21"]);
    expect(result.aPlayoffOverlap).toBe(2);
    expect(result.bPlayoffOverlap).toBe(1);
  });
});
