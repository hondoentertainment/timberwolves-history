import { describe, expect, it } from "vitest";

import type { PlayerCareerSeasonRow } from "@/lib/nba/types";

import { computeWolvesHighlightBullets } from "./player-highlights";

describe("computeWolvesHighlightBullets", () => {
  it("returns empty for no rows", () => {
    expect(computeWolvesHighlightBullets([])).toEqual([]);
  });

  it("summarizes best counting-stat seasons", () => {
    const rows: PlayerCareerSeasonRow[] = [
      {
        SEASON_ID: "2022-23",
        TEAM_ABBREVIATION: "MIN",
        PTS: 20,
        REB: 5,
        AST: 4,
        GP: 79,
      },
      {
        SEASON_ID: "2023-24",
        TEAM_ABBREVIATION: "MIN",
        PTS: 25,
        REB: 6,
        AST: 5,
        GP: 80,
      },
    ];
    const b = computeWolvesHighlightBullets(rows);
    expect(b[0]).toContain("2 Timberwolves seasons");
    expect(b.some((x) => x.includes("25.0 PPG"))).toBe(true);
    expect(b.some((x) => x.includes("159"))).toBe(true);
  });
});
