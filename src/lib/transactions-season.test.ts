import { describe, expect, it } from "vitest";

import { getTransactionsForSeason, transactionKindLabel } from "./transactions-season";

describe("transactions-season", () => {
  it("returns curated rows with category labels", () => {
    const rows = getTransactionsForSeason("2017-18");

    expect(rows.length).toBeGreaterThan(0);
    expect(rows.map((row) => transactionKindLabel(row.kind))).toContain("Trade");
  });

  it("keeps older uncategorized rows readable", () => {
    expect(transactionKindLabel(undefined)).toBe("Transaction");
  });
});
