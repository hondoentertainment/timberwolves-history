import type { PlayerCareerSeasonRow } from "@/lib/nba/types";

function num(row: PlayerCareerSeasonRow, key: string): number {
  const v = row[key];
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

export type WolvesStatPeak = {
  value: number | null;
  season: string | null;
};

export type WolvesStatSummary = {
  seasonCount: number;
  totalGames: number;
  bestPts: WolvesStatPeak;
  bestReb: WolvesStatPeak;
  bestAst: WolvesStatPeak;
};

function emptyPeak(): WolvesStatPeak {
  return { value: null, season: null };
}

function peakFor(rows: PlayerCareerSeasonRow[], key: string): WolvesStatPeak {
  let best = -1;
  let season = "";
  for (const row of rows) {
    const value = num(row, key);
    if (value > best) {
      best = value;
      season = String(row["SEASON_ID"] ?? "");
    }
  }
  return best > 0 ? { value: best, season: season || null } : emptyPeak();
}

export function summarizeWolvesStatRows(rows: PlayerCareerSeasonRow[]): WolvesStatSummary {
  return {
    seasonCount: rows.length,
    totalGames: rows.reduce((sum, row) => sum + num(row, "GP"), 0),
    bestPts: peakFor(rows, "PTS"),
    bestReb: peakFor(rows, "REB"),
    bestAst: peakFor(rows, "AST"),
  };
}

/** Derive short Wolves-only bullets from MIN per-game rows (NBA.com-shaped objects). */
export function computeWolvesHighlightBullets(rows: PlayerCareerSeasonRow[]): string[] {
  if (!rows.length) return [];

  const summary = summarizeWolvesStatRows(rows);

  const bullets: string[] = [];
  bullets.push(
    `${rows.length} Timberwolves season${rows.length === 1 ? "" : "s"} on NBA.com per-game rows (MIN).`,
  );
  if (summary.bestPts.season && summary.bestPts.value) {
    bullets.push(`Best scoring season: ${summary.bestPts.value.toFixed(1)} PPG (${summary.bestPts.season}).`);
  }
  if (summary.bestReb.season && summary.bestReb.value) {
    bullets.push(`Best rebounding season: ${summary.bestReb.value.toFixed(1)} RPG (${summary.bestReb.season}).`);
  }
  if (summary.bestAst.season && summary.bestAst.value) {
    bullets.push(`Best assist season: ${summary.bestAst.value.toFixed(1)} APG (${summary.bestAst.season}).`);
  }
  if (summary.totalGames > 0) {
    bullets.push(`${summary.totalGames} total games played in those Wolves rows.`);
  }
  return bullets;
}
