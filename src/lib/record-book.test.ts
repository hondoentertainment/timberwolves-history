import { describe, expect, it } from "vitest";

import { buildRecordBook } from "./record-book";
import type { CoachRecord } from "./coaches";
import type { AllTimePlayerEntry } from "./nba/players-index";
import type { FranchiseSeasonSummary } from "./nba/queries";

const seasons = [
  { seasonLabel: "2003-04", wins: 58, losses: 24, gp: 82, winPct: 0.707, playoffWins: 10, playoffLosses: 8, confRank: 1, divRank: 1, raw: {} },
  { seasonLabel: "2017-18", wins: 47, losses: 35, gp: 82, winPct: 0.573, playoffWins: 1, playoffLosses: 4, confRank: 8, divRank: 4, raw: {} },
  { seasonLabel: "1991-92", wins: 15, losses: 67, gp: 82, winPct: 0.183, playoffWins: 0, playoffLosses: 0, confRank: 13, divRank: 7, raw: {} },
] satisfies FranchiseSeasonSummary[];

const coaches = [
  { id: "flip", name: "Flip Saunders", tenures: [{ from: "1995-96", to: "2004-05", gc: 10, w: 411, l: 326, playoffGc: 51, playoffW: 17, playoffL: 34 }] },
  { id: "finch", name: "Chris Finch", tenures: [{ from: "2020-21", to: "2024-25", gc: 5, w: 209, l: 160, playoffGc: 27, playoffW: 12, playoffL: 15 }] },
] satisfies CoachRecord[];

const players = [
  { playerId: 1, name: "Kevin Garnett", seasons: ["1995-96", "1996-97", "2003-04"] },
  { playerId: 2, name: "Anthony Edwards", seasons: ["2020-21", "2021-22"] },
] satisfies AllTimePlayerEntry[];

describe("buildRecordBook", () => {
  it("ranks seasons, coaches, and tenures deterministically", () => {
    const book = buildRecordBook(seasons, coaches, players, 2);
    expect(book.mostWins[0]?.seasonLabel).toBe("2003-04");
    expect(book.mostPlayoffWins[0]?.playoffWins).toBe(10);
    expect(book.coachWins[0]?.id).toBe("flip");
    expect(book.longestTenures[0]?.name).toBe("Kevin Garnett");
  });
});
