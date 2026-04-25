import { describe, expect, it } from "vitest";

import { collectThemeFacetsForSeasons, seasonLabelMatchesThemeParam } from "./season-theme-facets";

describe("seasonLabelMatchesThemeParam", () => {
  it("matches explicit season story theme", () => {
    expect(seasonLabelMatchesThemeParam("2003-04", "mvp-season")).toBe(true);
  });

  it("matches inferred era-highlight theme for highlight season", () => {
    expect(seasonLabelMatchesThemeParam("1995-96", "era-highlight:garnett")).toBe(true);
  });

  it("returns true when theme param empty", () => {
    expect(seasonLabelMatchesThemeParam("2003-04", "")).toBe(true);
    expect(seasonLabelMatchesThemeParam("2003-04", "   ")).toBe(true);
  });

  it("returns false for wrong theme", () => {
    expect(seasonLabelMatchesThemeParam("1990-91", "mvp-season")).toBe(false);
  });
});

describe("collectThemeFacetsForSeasons", () => {
  it("includes merged themes for known seasons", () => {
    const themes = collectThemeFacetsForSeasons(["2003-04", "1995-96"]);
    expect(themes).toContain("mvp-season");
    expect(themes).toContain("era-highlight:garnett");
  });
});
