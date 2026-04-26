import { describe, expect, it } from "vitest";

import { changelogAttribution, getChangelogEntries } from "./changelog";

describe("getChangelogEntries", () => {
  it("returns entries sorted newest date first", () => {
    const entries = getChangelogEntries();
    expect(entries.length).toBeGreaterThan(1);
    for (let i = 0; i < entries.length - 1; i++) {
      expect(entries[i].date >= entries[i + 1].date).toBe(true);
    }
  });

  it("each entry has date, title, and string items", () => {
    for (const e of getChangelogEntries()) {
      expect(e.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(typeof e.title).toBe("string");
      expect(e.title.length).toBeGreaterThan(0);
      expect(Array.isArray(e.items)).toBe(true);
      expect(e.items.length).toBeGreaterThan(0);
      for (const item of e.items) {
        expect(typeof item).toBe("string");
      }
    }
  });
});

describe("changelogAttribution", () => {
  it("returns a non-empty attribution string", () => {
    expect(changelogAttribution().length).toBeGreaterThan(0);
  });
});
