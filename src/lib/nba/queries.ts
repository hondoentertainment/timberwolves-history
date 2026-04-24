import "server-only";

import { unstable_cache } from "next/cache";

import { NBA_LEAGUE_ID, WOLVES_TEAM_ID } from "./constants";
import { nbaStatsFetch } from "./client";
import { getResultSet, rowsToObjects } from "./parse";
import type { NbaStatsJson, PlayerCareerSeasonRow, PlayerInfoRow, TeamYearRow } from "./types";

const cacheHours = 3600;

export type FranchiseSeasonSummary = {
  seasonLabel: string;
  gp: number;
  wins: number;
  losses: number;
  winPct: number | null;
  playoffWins: number;
  playoffLosses: number;
  confRank: number | null;
  divRank: number | null;
  raw: TeamYearRow;
};

function pickNumber(row: TeamYearRow, keys: string[]): number {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "") {
      const n = Number(v);
      if (Number.isFinite(n)) return n;
    }
  }
  return 0;
}

function seasonLabelFromRow(row: TeamYearRow): string {
  const year = row["YEAR"];
  if (typeof year === "string" && /^\d{4}-\d{2}$/.test(year)) {
    return year;
  }
  const seasonId = row["SEASON_ID"];
  if (typeof seasonId === "string" && /^\d{4}-\d{2}$/.test(seasonId)) {
    return seasonId;
  }
  const start = row["START_YEAR"] ?? row["MIN_YEAR"] ?? row["YEAR_ID"];
  const end = row["END_YEAR"] ?? row["MAX_YEAR"];
  if (typeof start === "number" && typeof end === "number") {
    const endTwo = String(end).slice(-2).padStart(2, "0");
    return `${start}-${endTwo}`;
  }
  if (typeof start === "number") {
    const endTwo = String(start + 1).slice(-2).padStart(2, "0");
    return `${start}-${endTwo}`;
  }
  const yearVal = row["YEAR"];
  if (typeof yearVal === "number" || typeof yearVal === "string") {
    const y = Number(yearVal);
    if (Number.isFinite(y)) {
      const endTwo = String(y + 1).slice(-2).padStart(2, "0");
      return `${y}-${endTwo}`;
    }
  }
  return String(row["TEAM_NAME"] ?? "Season");
}

function parseFranchiseSeasons(data: NbaStatsJson): FranchiseSeasonSummary[] {
  const rs =
    getResultSet(data, "TeamStats") ??
    getResultSet(data, "TeamYears") ??
    getResultSet(data, 0) ??
    data.resultSets?.[0];
  if (!rs) return [];
  const rows = rowsToObjects<TeamYearRow>(rs);
  return rows.map((raw) => {
    const wins = pickNumber(raw, ["WINS", "W"]);
    const losses = pickNumber(raw, ["LOSSES", "L"]);
    const gp = pickNumber(raw, ["GP", "G"]);
    const pctRaw = raw["W_PCT"] ?? raw["WIN_PCT"];
    let winPct: number | null = null;
    if (typeof pctRaw === "number" && Number.isFinite(pctRaw)) winPct = pctRaw;
    else if (typeof pctRaw === "string") {
      const n = Number(pctRaw);
      if (Number.isFinite(n)) winPct = n;
    }
    const conf = pickNumber(raw, ["CONF_RANK"]);
    const div = pickNumber(raw, ["DIV_RANK"]);
    return {
      seasonLabel: seasonLabelFromRow(raw),
      gp,
      wins,
      losses,
      winPct,
      playoffWins: pickNumber(raw, ["PO_WINS"]),
      playoffLosses: pickNumber(raw, ["PO_LOSSES"]),
      confRank: conf > 0 ? conf : null,
      divRank: div > 0 ? div : null,
      raw,
    };
  });
}

export async function fetchTeamYearByYearJson(): Promise<NbaStatsJson> {
  return nbaStatsFetch(
    "teamyearbyyearstats",
    {
      LeagueID: NBA_LEAGUE_ID,
      TeamID: WOLVES_TEAM_ID,
      SeasonType: "Regular Season",
      PerMode: "Totals",
    },
    {
      next: { revalidate: cacheHours, tags: ["nba-team-years"] },
    },
  );
}

export const getCachedFranchiseSeasons = unstable_cache(
  async () => parseFranchiseSeasons(await fetchTeamYearByYearJson()),
  ["wolves-franchise-seasons-v2"],
  { revalidate: cacheHours, tags: ["nba-team-years"] },
);

export async function fetchTeamRoster(seasonId: string): Promise<NbaStatsJson> {
  return nbaStatsFetch(
    "commonteamroster",
    {
      Season: seasonId,
      TeamID: WOLVES_TEAM_ID,
      LeagueID: NBA_LEAGUE_ID,
    },
    {
      next: { revalidate: cacheHours, tags: ["nba-roster", `roster-${seasonId}`] },
    },
  );
}

export type RosterEntry = {
  playerId: number;
  name: string;
  number: string;
  position: string;
  height: string;
  weight: string;
  birthDate: string;
  country: string;
  seasonId: string;
};

export function parseRoster(data: NbaStatsJson, seasonId: string): RosterEntry[] {
  const rs = getResultSet(data, "CommonTeamRoster") ?? getResultSet(data, 0);
  if (!rs) return [];
  const rows = rowsToObjects<Record<string, unknown>>(rs);
  return rows
    .map((r) => {
      const playerId = Number(r["PLAYER_ID"]);
      if (!Number.isFinite(playerId)) return null;
      return {
        playerId,
        name: String(r["PLAYER"] ?? ""),
        number: String(r["NUM"] ?? ""),
        position: String(r["POSITION"] ?? ""),
        height: String(r["HEIGHT"] ?? ""),
        weight: String(r["WEIGHT"] ?? ""),
        birthDate: String(r["BIRTH_DATE"] ?? ""),
        country: String(r["COUNTRY"] ?? ""),
        seasonId,
      } satisfies RosterEntry;
    })
    .filter((x): x is RosterEntry => x !== null);
}

export async function fetchCommonPlayerInfo(playerId: number): Promise<NbaStatsJson> {
  return nbaStatsFetch(
    "commonplayerinfo",
    { PlayerID: playerId },
    {
      next: { revalidate: cacheHours, tags: ["nba-player", `player-${playerId}`] },
    },
  );
}

export function parseCommonPlayerInfo(data: NbaStatsJson): PlayerInfoRow | null {
  const rs = getResultSet(data, "CommonPlayerInfo") ?? getResultSet(data, 0);
  if (!rs?.rowSet?.length) return null;
  return rowsToObjects<PlayerInfoRow>(rs)[0] ?? null;
}

export async function fetchPlayerCareerStats(playerId: number): Promise<NbaStatsJson> {
  return nbaStatsFetch(
    "playercareerstats",
    {
      PlayerID: playerId,
      PerMode: "PerGame",
      LeagueID: NBA_LEAGUE_ID,
    },
    {
      next: { revalidate: cacheHours, tags: ["nba-player", `player-${playerId}`] },
    },
  );
}

export function parseSeasonTotalsPerGame(
  data: NbaStatsJson,
): PlayerCareerSeasonRow[] {
  const rs =
    getResultSet(data, "SeasonTotalsRegularSeason") ??
    data.resultSets?.find((s) => s.name?.includes("SeasonTotals")) ??
    getResultSet(data, 0);
  if (!rs) return [];
  return rowsToObjects<PlayerCareerSeasonRow>(rs);
}

export function filterWolvesSeasons(
  rows: PlayerCareerSeasonRow[],
): PlayerCareerSeasonRow[] {
  return rows.filter((r) => String(r["TEAM_ABBREVIATION"] ?? "") === "MIN");
}
