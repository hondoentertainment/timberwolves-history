import type { PlayerCareerSeasonRow } from "./types";

const WOLVES_KEYS = [
  "SEASON_ID",
  "TEAM_ABBREVIATION",
  "GP",
  "MIN",
  "PTS",
  "REB",
  "AST",
  "STL",
  "BLK",
  "FG_PCT",
  "FG3_PCT",
  "FT_PCT",
] as const;

const CAREER_KEYS = [
  "SEASON_ID",
  "TEAM_ABBREVIATION",
  "GP",
  "MIN",
  "PTS",
  "REB",
  "AST",
  "STL",
  "BLK",
  "FG_PCT",
  "FG3_PCT",
  "FT_PCT",
] as const;

function cell(row: PlayerCareerSeasonRow, key: string): string | number {
  const v = row[key];
  if (v === null || v === undefined) return "—";
  if (typeof v === "number") {
    if (key.endsWith("_PCT") && v <= 1) return Number.isFinite(v) ? v.toFixed(3) : "—";
    return Number.isFinite(v) ? (Number.isInteger(v) ? v : Number(v.toFixed(1))) : "—";
  }
  return String(v);
}

export function wolvesPerGameRows(rows: PlayerCareerSeasonRow[]) {
  const cols = [...WOLVES_KEYS];
  return {
    columns: cols as unknown as string[],
    rows: rows.map((r) => cols.map((k) => cell(r, k))),
  };
}

export function careerPerGameRows(rows: PlayerCareerSeasonRow[]) {
  const cols = [...CAREER_KEYS];
  return {
    columns: cols as unknown as string[],
    rows: rows.map((r) => cols.map((k) => cell(r, k))),
  };
}
