import { getSeasonStory } from "@/lib/season-stories";

export function themesForFranchiseSeason(seasonLabel: string): string[] {
  return getSeasonStory(seasonLabel)?.graph?.themes ?? [];
}

export function collectThemeFacetsForSeasons(seasonLabels: Iterable<string>): string[] {
  const set = new Set<string>();
  for (const sid of seasonLabels) {
    for (const t of themesForFranchiseSeason(sid)) {
      if (t.trim()) set.add(t);
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function seasonLabelMatchesThemeParam(seasonLabel: string, themeParam: string): boolean {
  const needle = themeParam.trim();
  if (!needle) return true;
  return themesForFranchiseSeason(seasonLabel).includes(needle);
}
