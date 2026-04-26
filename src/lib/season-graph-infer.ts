import { mergeContentGraphs, normalizeContentGraph } from "@/lib/content-graph";
import { getAllEras } from "@/lib/eras";
import type { ContentGraph } from "@/types/content-graph";

/**
 * Infers era hub links for any season that appears on an era hub’s highlight list.
 * Merged with explicit `graph` in `season-stories.json` so every season page gets graph chips.
 */
export function inferContentGraphForSeason(seasonId: string): ContentGraph | undefined {
  const eraSlugs: string[] = [];
  const themes: string[] = [];
  for (const era of getAllEras()) {
    if (era.highlightSeasonIds.includes(seasonId)) {
      eraSlugs.push(era.slug);
      themes.push(`era-highlight:${era.slug}`);
    }
  }
  const startYear = Number.parseInt(seasonId.slice(0, 4), 10);
  if (Number.isFinite(startYear) && startYear >= 1900 && startYear < 2100) {
    const decade = Math.floor(startYear / 10) * 10;
    themes.push(`decade-${decade}s`);
  }
  return normalizeContentGraph({ eraSlugs, themes });
}

export function mergedSeasonStoryGraph(
  explicit: ContentGraph | undefined,
  seasonId: string,
): ContentGraph | undefined {
  return mergeContentGraphs(explicit, inferContentGraphForSeason(seasonId));
}
