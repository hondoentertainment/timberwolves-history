import type { PlayerCareerSeasonRow } from "@/lib/nba/types";

const WOLVES_STAT_HEADERS = [
  "SEASON_ID",
  "TEAM_ABBREVIATION",
  "PLAYER_AGE",
  "GP",
  "MIN",
  "PTS",
  "REB",
  "AST",
  "STL",
  "BLK",
  "TOV",
  "PF",
  "FG_PCT",
  "FG3_PCT",
  "FT_PCT",
] as const;

function formatCell(value: unknown, header: string): string | number {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "—";
    if (header.endsWith("_PCT")) return value.toFixed(3);
    return value;
  }
  return String(value);
}

export function formatCareerStatRows(rows: PlayerCareerSeasonRow[]) {
  const columns = [...WOLVES_STAT_HEADERS];
  const tableRows = rows.map((r) =>
    WOLVES_STAT_HEADERS.map((h) =>
      formatCell(r[h as keyof PlayerCareerSeasonRow], h),
    ),
  );
  return { columns, tableRows };
}
