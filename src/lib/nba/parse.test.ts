import { describe, expect, it } from "vitest";

import { parseNbaStatsJson, rowsToObjects } from "./parse";
import type { NbaResultSet } from "./types";

describe("parseNbaStatsJson", () => {
  it("rejects JSON arrays", () => {
    expect(() => parseNbaStatsJson("[]")).toThrow("Invalid NBA stats JSON");
  });

  it("accepts minimal valid stats shape", () => {
    const json = JSON.stringify({ resultSets: [] });
    expect(parseNbaStatsJson(json).resultSets).toEqual([]);
  });
});

describe("rowsToObjects", () => {
  it("returns empty array when headers or rowSet are not arrays", () => {
    const bad = { name: "x", headers: null, rowSet: [] } as unknown as NbaResultSet;
    expect(rowsToObjects(bad)).toEqual([]);
  });
});
