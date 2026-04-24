import { describe, expect, it } from "vitest";

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
