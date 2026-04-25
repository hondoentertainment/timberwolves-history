import draftFile from "@/data/draft-picks-by-season.json";
import storiesFile from "@/data/season-stories.json";
import txFile from "@/data/transactions-by-season.json";
import { coachNamesForSeason, getAllCoaches } from "@/lib/coaches";
import { getAllEras } from "@/lib/eras";
import { getFranchiseTimeline } from "@/lib/franchise-timeline";
import { getWolvesSeasonIds, parseSeasonSlug } from "@/lib/nba/seasons";
import {
  addChronologyQuestions,
  addMemeAndEraExcerptQuestions,
  addPairwiseFranchiseQuestions,
  addTripleMaxWinsQuestions,
} from "@/lib/trivia/bulk-generators";
import { excerpt, numericChoicePool, tryAdd } from "@/lib/trivia/question-kit";
import { intFromRange, pickUnique } from "@/lib/trivia/random";
import type { TriviaFranchiseRow, TriviaQuestion } from "@/lib/trivia/types";

const NBA_TEAM_YEARS = "Derived from NBA.com team year-over-year stats on this site.";
const STATIC_STORY = "Editorial season blurb from Wolves History.";
const STATIC_COACH = "Head-coach register on Wolves History.";
const STATIC_DRAFT = "Curated draft list on Wolves History.";
const STATIC_TX = "Curated trades and waiver-wire list on Wolves History.";
const STATIC_ERA = "Era hub copy on Wolves History.";
const STATIC_TIMELINE = "Franchise timeline on Wolves History.";

/** When NBA franchise rows are present, the deck aims to exceed this count. */
export const TRIVIA_DECK_TARGET_MIN = 1000;

function validFranchiseRow(r: TriviaFranchiseRow, date: Date): boolean {
  return parseSeasonSlug(r.seasonLabel, date) !== null;
}

function normalizeRows(rows: TriviaFranchiseRow[], date: Date): TriviaFranchiseRow[] {
  const seen = new Set<string>();
  const out: TriviaFranchiseRow[] = [];
  for (const r of rows) {
    if (!validFranchiseRow(r, date)) continue;
    if (seen.has(r.seasonLabel)) continue;
    seen.add(r.seasonLabel);
    out.push(r);
  }
  return out;
}

/**
 * Builds a large pool of multiple-choice questions spanning every franchise season
 * and static editorial datasets. Shuffle and slice on the client for each run.
 */
export function buildTriviaDeck(
  franchiseRows: TriviaFranchiseRow[],
  date = new Date(),
  rng: () => number = Math.random,
): TriviaQuestion[] {
  const rows = normalizeRows(franchiseRows, date);
  const seasonPool = getWolvesSeasonIds(date).filter((s) => parseSeasonSlug(s, date));
  const stories = storiesFile.stories as Record<string, { blurb?: string } | undefined>;
  const draftMap = draftFile.bySeason as Record<string, { playerName?: string }[] | undefined>;
  const txMap = txFile.bySeason as Record<string, { summary?: string }[] | undefined>;
  const coachNames = getAllCoaches().map((c) => c.name);
  const allDraftPlayerNames = [
    ...new Set(
      Object.values(draftMap)
        .flat()
        .map((p) => p?.playerName)
        .filter((n): n is string => typeof n === "string" && n.length > 0),
    ),
  ];
  const out: TriviaQuestion[] = [];

  for (const seasonId of seasonPool) {
    const blurb = stories[seasonId]?.blurb;
    if (!blurb || blurb.trim().length < 40) continue;
    tryAdd(
      out,
      `story-blurb-${seasonId}`,
      "deep",
      "season-story",
      `Which season is this site describing here?\n\n“${excerpt(blurb, 140)}”`,
      seasonId,
      seasonPool,
      seasonPool,
      seasonId,
      STATIC_STORY,
      rng,
    );
  }

  for (const seasonId of seasonPool) {
    const names = coachNamesForSeason(seasonId);
    if (!names.length) continue;
    const correct = names[intFromRange(0, names.length - 1, rng)]!;
    tryAdd(
      out,
      `coach-${seasonId}-${correct}`,
      "standard",
      "coach",
      `Which coach had a Timberwolves head-coaching tenure overlapping the ${seasonId} season?`,
      correct,
      [...coachNames, ...names],
      coachNames,
      seasonId,
      STATIC_COACH,
      rng,
    );
  }

  for (const [seasonId, picks] of Object.entries(draftMap)) {
    if (!parseSeasonSlug(seasonId, date) || !picks?.length) continue;
    const p = picks[0]!;
    const name = typeof p.playerName === "string" ? p.playerName : "";
    if (!name) continue;
    const distractors = allDraftPlayerNames.filter((n) => n !== name);
    tryAdd(
      out,
      `draft-${seasonId}-${name}`,
      "deep",
      "draft",
      `In ${seasonId}, who is listed as a Timberwolves draft pick on this site (first row in the draft table)?`,
      name,
      [...distractors, ...pickUnique(coachNames, 6, rng)],
      allDraftPlayerNames,
      seasonId,
      STATIC_DRAFT,
      rng,
    );
  }

  for (const [seasonId, items] of Object.entries(txMap)) {
    if (!parseSeasonSlug(seasonId, date) || !items?.length) continue;
    const sum = typeof items[0]!.summary === "string" ? items[0]!.summary : "";
    if (sum.length < 24) continue;
    tryAdd(
      out,
      `tx-${seasonId}`,
      "deep",
      "transaction",
      `Which season’s “trades & waiver wire” note on this site begins:\n\n“${excerpt(sum, 100)}”`,
      seasonId,
      seasonPool,
      seasonPool,
      seasonId,
      STATIC_TX,
      rng,
    );
  }

  const eraTitles = getAllEras().map((e) => e.title);
  for (const era of getAllEras()) {
    for (const sid of era.highlightSeasonIds) {
      if (!parseSeasonSlug(sid, date)) continue;
      const others = eraTitles.filter((t) => t !== era.title);
      tryAdd(
        out,
        `era-${era.slug}-${sid}`,
        "standard",
        "era",
        `On this site, which era hub highlights the ${sid} season among its spotlight years?`,
        era.title,
        [...others, era.title],
        eraTitles,
        sid,
        STATIC_ERA,
        rng,
      );
    }
  }

  const timeline = getFranchiseTimeline();
  const headlines = timeline.map((x) => x.headline);
  for (const ev of timeline) {
    if (!ev.headline?.trim()) continue;
    const others = headlines.filter((h) => h !== ev.headline);
    tryAdd(
      out,
      `timeline-${ev.dateLabel}-${ev.headline.slice(0, 20).replace(/\W+/g, "-")}`,
      "deep",
      "timeline",
      `The franchise timeline labels ${ev.dateLabel} with which headline on this site?`,
      ev.headline,
      [...others, ev.headline],
      headlines,
      undefined,
      STATIC_TIMELINE,
      rng,
    );
  }

  addMemeAndEraExcerptQuestions(seasonPool, out, rng);

  if (!rows.length) {
    return dedupeQuestions(out);
  }

  for (const r of rows) {
    const w = r.wins;
    if (!Number.isFinite(w) || w < 0) continue;
    const pool = numericChoicePool(w, rng);
    tryAdd(
      out,
      `wins-${r.seasonLabel}`,
      "standard",
      "franchise-record",
      `How many **regular-season wins** did Minnesota record in **${r.seasonLabel}** (per NBA.com team year table on this site)?`,
      String(w),
      pool,
      pool,
      r.seasonLabel,
      NBA_TEAM_YEARS,
      rng,
    );
  }

  for (const r of rows) {
    const l = r.losses;
    if (!Number.isFinite(l) || l < 0) continue;
    const pool = numericChoicePool(l, rng);
    tryAdd(
      out,
      `losses-${r.seasonLabel}`,
      "standard",
      "franchise-record",
      `How many **regular-season losses** did Minnesota have in **${r.seasonLabel}** on this site’s NBA.com-derived table?`,
      String(l),
      pool,
      pool,
      r.seasonLabel,
      NBA_TEAM_YEARS,
      rng,
    );
  }

  for (const r of rows) {
    const po = r.playoffWins + r.playoffLosses;
    const pool = numericChoicePool(po, rng);
    tryAdd(
      out,
      `po-games-${r.seasonLabel}`,
      "standard",
      "playoffs",
      `How many **total playoff games** (wins + losses) did Minnesota play in **${r.seasonLabel}** on NBA.com’s postseason columns for that row?`,
      String(po),
      pool,
      pool,
      r.seasonLabel,
      NBA_TEAM_YEARS,
      rng,
    );
  }

  const wlGroups = new Map<string, TriviaFranchiseRow[]>();
  for (const r of rows) {
    const k = `${r.wins}-${r.losses}`;
    const g = wlGroups.get(k) ?? [];
    g.push(r);
    wlGroups.set(k, g);
  }
  for (const [key, group] of wlGroups) {
    if (group.length !== 1) continue;
    const r = group[0]!;
    const [w, l] = key.split("-").map(Number);
    tryAdd(
      out,
      `wl-${key}`,
      "deep",
      "franchise-record",
      `Which season is the **only** Timberwolves campaign on this site’s cached NBA table with a **${w}–${l}** regular-season record?`,
      r.seasonLabel,
      seasonPool,
      seasonPool,
      r.seasonLabel,
      NBA_TEAM_YEARS,
      rng,
    );
  }

  const maxW = Math.max(...rows.map((x) => x.wins));
  const minW = Math.min(...rows.map((x) => x.wins));
  const maxRows = rows.filter((x) => x.wins === maxW);
  const minRows = rows.filter((x) => x.wins === minW);
  if (maxRows.length === 1) {
    const r = maxRows[0]!;
    tryAdd(
      out,
      "best-wins",
      "deep",
      "franchise-record",
      `Which Timberwolves season has the **most regular-season wins** in this site’s cached NBA.com franchise table?`,
      r.seasonLabel,
      seasonPool,
      seasonPool,
      r.seasonLabel,
      NBA_TEAM_YEARS,
      rng,
    );
  }
  if (minRows.length === 1 && minW !== maxW) {
    const r = minRows[0]!;
    tryAdd(
      out,
      "worst-wins",
      "deep",
      "franchise-record",
      `Which Timberwolves season has the **fewest regular-season wins** in this site’s cached NBA.com franchise table?`,
      r.seasonLabel,
      seasonPool,
      seasonPool,
      r.seasonLabel,
      NBA_TEAM_YEARS,
      rng,
    );
  }

  const withPct = rows.filter((x) => x.winPct !== null && x.winPct > 0 && x.winPct < 1);
  for (let k = 0; k < Math.min(28, withPct.length * 2); k += 1) {
    const a = withPct[intFromRange(0, withPct.length - 1, rng)]!;
    let b = withPct[intFromRange(0, withPct.length - 1, rng)]!;
    let guard = 0;
    while (b.seasonLabel === a.seasonLabel && guard < 14) {
      b = withPct[intFromRange(0, withPct.length - 1, rng)]!;
      guard += 1;
    }
    if (a.seasonLabel === b.seasonLabel) continue;
    const pctA = a.winPct!;
    const pctB = b.winPct!;
    if (Math.abs(pctA - pctB) < 0.025) continue;
    const higher = pctA > pctB ? a.seasonLabel : b.seasonLabel;
    const decoys = seasonPool.filter((s) => s !== a.seasonLabel && s !== b.seasonLabel);
    tryAdd(
      out,
      `pct-${higher}-vs-${a.seasonLabel}-${b.seasonLabel}-${k}`,
      "deep",
      "franchise-record",
      `Which Timberwolves season had the **higher regular-season win percentage** on NBA.com’s table: **${a.seasonLabel}** or **${b.seasonLabel}**?`,
      higher,
      [a.seasonLabel, b.seasonLabel, ...pickUnique(decoys, 8, rng)],
      seasonPool,
      higher,
      NBA_TEAM_YEARS,
      rng,
    );
  }

  for (const r of rows) {
    if (r.confRank === null || r.confRank < 1) continue;
    const same = rows.filter((x) => x.confRank === r.confRank);
    if (same.length !== 1) continue;
    const pool = numericChoicePool(r.confRank, rng).filter((n) => {
      const v = Number(n);
      return v >= 1 && v <= 15;
    });
    tryAdd(
      out,
      `conf-${r.seasonLabel}`,
      "deep",
      "franchise-record",
      `In **${r.seasonLabel}**, where did Minnesota finish in the **Western Conference** regular-season standings (CONF_RANK on NBA.com’s team row)?`,
      String(r.confRank),
      pool.length >= 4 ? pool : ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"],
      pool,
      r.seasonLabel,
      NBA_TEAM_YEARS,
      rng,
    );
  }

  for (const r of rows) {
    if (r.divRank === null || r.divRank < 1) continue;
    const pool = numericChoicePool(r.divRank, rng).filter((n) => {
      const v = Number(n);
      return v >= 1 && v <= 6;
    });
    tryAdd(
      out,
      `div-${r.seasonLabel}`,
      "standard",
      "franchise-record",
      `In **${r.seasonLabel}**, Minnesota’s **division rank** (DIV_RANK) on the cached NBA team row was:`,
      String(r.divRank),
      pool.length >= 4 ? pool : ["1", "2", "3", "4", "5", "6"],
      pool,
      r.seasonLabel,
      NBA_TEAM_YEARS,
      rng,
    );
  }

  const playedPo = rows.filter((x) => x.playoffWins + x.playoffLosses > 0).map((x) => x.seasonLabel);
  const missedPo = rows.filter((x) => x.playoffWins + x.playoffLosses === 0).map((x) => x.seasonLabel);
  if (playedPo.length && missedPo.length) {
    for (let i = 0; i < 22; i += 1) {
      const yes = playedPo[intFromRange(0, playedPo.length - 1, rng)]!;
      const mix = [...playedPo, ...missedPo];
      tryAdd(
        out,
        `po-yes-${yes}-${i}`,
        "standard",
        "playoffs",
        `Which of these seasons saw Minnesota play **at least one** postseason game (playoff wins plus playoff losses is greater than zero) on NBA.com’s franchise row?`,
        yes,
        pickUnique(mix, Math.min(12, mix.length), rng),
        seasonPool,
        yes,
        NBA_TEAM_YEARS,
        rng,
      );
    }
  }

  addPairwiseFranchiseQuestions(rows, seasonPool, out, rng);
  addChronologyQuestions(rows, seasonPool, out, rng);
  addTripleMaxWinsQuestions(rows, seasonPool, out, rng, 950);

  return dedupeQuestions(out);
}

function dedupeQuestions(qs: TriviaQuestion[]): TriviaQuestion[] {
  const seen = new Set<string>();
  const out: TriviaQuestion[] = [];
  for (const q of qs) {
    if (seen.has(q.id)) continue;
    seen.add(q.id);
    out.push(q);
  }
  return out;
}
