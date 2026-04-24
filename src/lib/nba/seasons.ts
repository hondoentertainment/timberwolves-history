import { FIRST_WOLVES_SEASON_START_YEAR } from "./constants";

/** NBA season string, e.g. start year 2024 → `"2024-25"`. */
export function seasonIdFromStartYear(startYear: number): string {
  const endTwo = String(startYear + 1).slice(-2).padStart(2, "0");
  return `${startYear}-${endTwo}`;
}

/** First year of the NBA season that contains `date` (approximate calendar rules). */
export function currentNbaSeasonStartYear(date = new Date()): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  if (m >= 9) return y;
  if (m <= 5) return y - 1;
  return y - 1;
}

export function getWolvesSeasonStartYears(date = new Date()): number[] {
  const last = currentNbaSeasonStartYear(date);
  const out: number[] = [];
  for (let y = FIRST_WOLVES_SEASON_START_YEAR; y <= last; y += 1) {
    out.push(y);
  }
  return out;
}

export function getWolvesSeasonIds(date = new Date()): string[] {
  return getWolvesSeasonStartYears(date).map(seasonIdFromStartYear);
}

/**
 * Validates URL slug like `2024-25` and returns canonical season id, or null.
 */
export function parseSeasonSlug(slug: string, date = new Date()): string | null {
  const m = /^(\d{4})-(\d{2})$/.exec(slug.trim());
  if (!m) return null;
  const start = Number(m[1]);
  const endSuffix = m[2];
  if (!Number.isFinite(start)) return null;
  const expected = String(start + 1).slice(-2).padStart(2, "0");
  if (endSuffix !== expected) return null;
  if (start < FIRST_WOLVES_SEASON_START_YEAR) return null;
  if (start > currentNbaSeasonStartYear(date)) return null;
  return `${start}-${endSuffix}`;
}
