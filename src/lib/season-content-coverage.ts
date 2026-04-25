import draftFile from "@/data/draft-picks-by-season.json";
import playersFile from "@/data/all-time-players.json";
import storiesFile from "@/data/season-stories.json";
import txFile from "@/data/transactions-by-season.json";
import { getWolvesSeasonIds } from "@/lib/nba/seasons";

type StoriesMap = Record<string, { blurb?: string } | undefined>;
type BySeasonMap = Record<string, unknown[] | undefined>;
type PlayerSnapshotRow = { seasons?: string[] };

function storiesMap(): StoriesMap {
  return storiesFile.stories as StoriesMap;
}

function draftBySeason(): BySeasonMap {
  return draftFile.bySeason as BySeasonMap;
}

function txBySeason(): BySeasonMap {
  return txFile.bySeason as BySeasonMap;
}

function playerSnapshotRows(): PlayerSnapshotRow[] {
  return playersFile.players as PlayerSnapshotRow[];
}

/** Franchise seasons that should exist on the site for `date` (NBA season slugs). */
export function getCanonicalSeasonIds(date = new Date()): string[] {
  return getWolvesSeasonIds(date);
}

/** Seasons missing a non-empty editorial blurb in `season-stories.json`. */
export function missingSeasonStories(date = new Date()): string[] {
  const stories = storiesMap();
  return getWolvesSeasonIds(date).filter((id) => {
    const row = stories[id];
    return typeof row?.blurb !== "string" || row.blurb.trim().length === 0;
  });
}

/** Seasons with at least one static draft row (optional dataset). */
export function seasonsWithDraftPicks(): string[] {
  return Object.keys(draftBySeason())
    .filter((id) => (draftBySeason()[id]?.length ?? 0) > 0)
    .sort();
}

/** Seasons with at least one static transaction note (optional dataset). */
export function seasonsWithTransactions(): string[] {
  return Object.keys(txBySeason())
    .filter((id) => (txBySeason()[id]?.length ?? 0) > 0)
    .sort();
}

export function missingDraftPickRows(date = new Date()): string[] {
  const map = draftBySeason();
  return getWolvesSeasonIds(date).filter((id) => (map[id]?.length ?? 0) === 0);
}

export function missingDraftPickCoverage(date = new Date()): string[] {
  const map = draftBySeason();
  return getWolvesSeasonIds(date).filter((id) => !Object.prototype.hasOwnProperty.call(map, id));
}

export function seasonsWithRosterFallbackRows(): string[] {
  const seasons = new Set<string>();
  for (const player of playerSnapshotRows()) {
    for (const seasonId of player.seasons ?? []) {
      seasons.add(seasonId);
    }
  }
  return [...seasons].sort();
}

export function missingRosterFallbackRows(date = new Date()): string[] {
  const covered = new Set(seasonsWithRosterFallbackRows());
  return getWolvesSeasonIds(date).filter((id) => !covered.has(id));
}

export function missingTransactionRows(date = new Date()): string[] {
  const map = txBySeason();
  return getWolvesSeasonIds(date).filter((id) => (map[id]?.length ?? 0) === 0);
}

/** Keys present under `stories` but not in the canonical franchise range for `date` (typos / stale years). */
export function strayStoryKeys(date = new Date()): string[] {
  const allowed = new Set(getWolvesSeasonIds(date));
  return Object.keys(storiesMap()).filter((k) => !allowed.has(k));
}

/**
 * Human-readable audit for agents and contributors.
 * Required line: every canonical season must have a story blurb.
 * Optional lines: transactions are curated sparse JSON.
 */
export function formatSeasonContentAuditReport(date = new Date()): string {
  const lines: string[] = [];
  const missingStories = missingSeasonStories(date);
  lines.push(
    missingStories.length === 0
      ? "Season stories: OK (every canonical season has a blurb)."
      : `Season stories: MISSING for: ${missingStories.join(", ")}`,
  );
  lines.push(
    missingRosterFallbackRows(date).length === 0
      ? `Roster fallback JSON: OK (${seasonsWithRosterFallbackRows().length} season(s) covered).`
      : `Roster fallback JSON: MISSING for: ${missingRosterFallbackRows(date).join(", ")}`,
  );
  const missingDraftCoverage = missingDraftPickCoverage(date);
  lines.push(
    missingDraftCoverage.length === 0
      ? `Draft picks JSON: OK (${seasonsWithDraftPicks().length} season(s) with selections; ${missingDraftPickRows(date).length} season(s) explicitly empty).`
      : `Draft picks JSON: MISSING coverage for: ${missingDraftCoverage.join(", ")}`,
  );
  lines.push(
    `Transactions JSON: ${seasonsWithTransactions().length} season(s) with rows; ${missingTransactionRows(date).length} season(s) without rows.`,
  );
  const stray = strayStoryKeys(date);
  if (stray.length > 0) {
    lines.push(`Stray story keys (not in canonical list): ${stray.join(", ")}`);
  }
  return lines.join("\n");
}
