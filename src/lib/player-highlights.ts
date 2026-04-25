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

/** Derive short Wolves-only bullets from MIN per-game rows (NBA.com-shaped objects). */
export function computeWolvesHighlightBullets(rows: PlayerCareerSeasonRow[]): string[] {
  if (!rows.length) return [];

  let bestPts = -1;
  let bestPtsSeason = "";
  let bestReb = -1;
  let bestRebSeason = "";
  let bestAst = -1;
  let bestAstSeason = "";
  let totalGp = 0;

  for (const r of rows) {
    const sid = String(r["SEASON_ID"] ?? "");
    const pts = num(r, "PTS");
    const reb = num(r, "REB");
    const ast = num(r, "AST");
    const gp = num(r, "GP");
    totalGp += gp;
    if (pts > bestPts) {
      bestPts = pts;
      bestPtsSeason = sid;
    }
    if (reb > bestReb) {
      bestReb = reb;
      bestRebSeason = sid;
    }
    if (ast > bestAst) {
      bestAst = ast;
      bestAstSeason = sid;
    }
  }

  const bullets: string[] = [];
  bullets.push(
    `${rows.length} Timberwolves season${rows.length === 1 ? "" : "s"} on NBA.com per-game rows (MIN).`,
  );
  if (bestPtsSeason && bestPts > 0) {
    bullets.push(`Best scoring season: ${bestPts.toFixed(1)} PPG (${bestPtsSeason}).`);
  }
  if (bestRebSeason && bestReb > 0) {
    bullets.push(`Best rebounding season: ${bestReb.toFixed(1)} RPG (${bestRebSeason}).`);
  }
  if (bestAstSeason && bestAst > 0) {
    bullets.push(`Best assist season: ${bestAst.toFixed(1)} APG (${bestAstSeason}).`);
  }
  if (totalGp > 0) {
    bullets.push(`${totalGp} total games played in those Wolves rows.`);
  }
  return bullets;
}
