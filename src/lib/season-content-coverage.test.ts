import { describe, expect, it } from "vitest";

import {
  formatSeasonContentAuditReport,
  missingDraftPickCoverage,
  missingRosterFallbackRows,
  missingSeasonStories,
  strayStoryKeys,
} from "./season-content-coverage";

describe("season content coverage", () => {
  it("every canonical franchise season has a season story blurb", () => {
    const missing = missingSeasonStories();
    expect(
      missing,
      `Add entries to src/data/season-stories.json for: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("has no stray season story keys outside the canonical list", () => {
    const stray = strayStoryKeys();
    expect(
      stray,
      `Remove or fix keys in season-stories.json: ${stray.join(", ")}`,
    ).toEqual([]);
  });

  it("has draft coverage keys for every canonical franchise season", () => {
    const missing = missingDraftPickCoverage();
    expect(
      missing,
      `Add explicit entries to src/data/draft-picks-by-season.json for: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("has fallback roster players for every canonical franchise season", () => {
    const missing = missingRosterFallbackRows();
    expect(
      missing,
      `Add all-time player snapshot seasons for: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("prints an audit report (used by npm run audit:seasons)", () => {
    const report = formatSeasonContentAuditReport();
    expect(report).toContain("Season stories:");
    expect(report.length).toBeGreaterThan(20);
  });
});
