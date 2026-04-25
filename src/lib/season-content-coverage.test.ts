import { describe, expect, it } from "vitest";

import {
  formatSeasonContentAuditReport,
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

  it("prints an audit report (used by npm run audit:seasons)", () => {
    const report = formatSeasonContentAuditReport();
    expect(report).toContain("Season stories:");
    expect(report.length).toBeGreaterThan(20);
  });
});
