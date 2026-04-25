import { describe, expect, it } from "vitest";

import { mergeAllTimePlayerEntries } from "./players-index";
import { mergeRosterIntoIndex } from "./roster-merge";

describe("mergeRosterIntoIndex", () => {
  it("dedupes players and accumulates seasons", () => {
    const index = new Map<number, { name: string; seasons: Set<string> }>();
    mergeRosterIntoIndex(index, "2023-24", [
      { playerId: 1, name: "A" },
      { playerId: 2, name: "B" },
    ]);
    mergeRosterIntoIndex(index, "2024-25", [
      { playerId: 1, name: "A" },
      { playerId: 3, name: "C" },
    ]);
    expect([...(index.get(1)?.seasons ?? [])].sort()).toEqual(["2023-24", "2024-25"]);
    expect([...(index.get(2)?.seasons ?? [])].sort()).toEqual(["2023-24"]);
    expect([...(index.get(3)?.seasons ?? [])].sort()).toEqual(["2024-25"]);
  });
});

describe("mergeAllTimePlayerEntries", () => {
  it("keeps snapshot players when live roster results are partial", () => {
    const merged = mergeAllTimePlayerEntries(
      [
        { playerId: 1, name: "Kevin Garnett", seasons: ["1995-96"] },
        { playerId: 2, name: "Sam Mitchell", seasons: ["1989-90"] },
      ],
      [{ playerId: 1, name: "Kevin Garnett", seasons: ["1996-97"] }],
    );

    expect(merged).toEqual([
      { playerId: 1, name: "Kevin Garnett", seasons: ["1995-96", "1996-97"] },
      { playerId: 2, name: "Sam Mitchell", seasons: ["1989-90"] },
    ]);
  });

  it("adds live-only players while deduping by normalized name", () => {
    const merged = mergeAllTimePlayerEntries(
      [{ playerId: 900000001, name: "Jose Player", seasons: ["1990-91"] }],
      [
        { playerId: 123, name: "José Player", seasons: ["1991-92"] },
        { playerId: 456, name: "New Wolf", seasons: ["2025-26"] },
      ],
    );

    expect(merged).toEqual([
      { playerId: 900000001, name: "José Player", seasons: ["1990-91", "1991-92"] },
      { playerId: 456, name: "New Wolf", seasons: ["2025-26"] },
    ]);
  });
});
