import { getAllEras } from "@/lib/eras";
import { getWolvesMemes } from "@/lib/memes";
import { excerpt, tryAdd } from "@/lib/trivia/question-kit";
import { pickUnique } from "@/lib/trivia/random";
import { compareSeasonIds, seasonChronoKey } from "@/lib/trivia/season-order";
import type { TriviaFranchiseRow, TriviaQuestion } from "@/lib/trivia/types";

const NBA_TEAM_YEARS = "Derived from NBA.com team year-over-year stats on this site.";
const STATIC_MEME = "Curated meme list on Wolves History.";
const STATIC_ERA = "Era hub copy on Wolves History.";

export function addPairwiseFranchiseQuestions(
  rows: TriviaFranchiseRow[],
  seasonPool: string[],
  out: TriviaQuestion[],
  rng: () => number,
): void {
  const bySeason = new Map(rows.map((r) => [r.seasonLabel, r]));
  const labels = [...bySeason.keys()].sort(compareSeasonIds);

  for (let i = 0; i < labels.length; i += 1) {
    for (let j = i + 1; j < labels.length; j += 1) {
      const ida = labels[i]!;
      const idb = labels[j]!;
      const ra = bySeason.get(ida)!;
      const rb = bySeason.get(idb)!;
      const decoys = seasonPool.filter((s) => s !== ida && s !== idb);
      const pairPool = [ida, idb, ...pickUnique(decoys, 10, rng)];

      if (ra.wins !== rb.wins) {
        const correct = ra.wins > rb.wins ? ida : idb;
        tryAdd(
          out,
          `cmp-wins-${ida}-vs-${idb}`,
          "standard",
          "franchise-record",
          `Which Timberwolves season finished with more regular-season wins on this site’s NBA.com table: ${ida} or ${idb}?`,
          correct,
          pairPool,
          seasonPool,
          correct,
          NBA_TEAM_YEARS,
          rng,
        );
      }

      if (ra.losses !== rb.losses) {
        const correct = ra.losses > rb.losses ? ida : idb;
        tryAdd(
          out,
          `cmp-loss-${ida}-vs-${idb}`,
          "standard",
          "franchise-record",
          `Which Timberwolves season finished with more regular-season losses on this site’s NBA.com table: ${ida} or ${idb}?`,
          correct,
          pairPool,
          seasonPool,
          correct,
          NBA_TEAM_YEARS,
          rng,
        );
      }

      const poA = ra.playoffWins + ra.playoffLosses;
      const poB = rb.playoffWins + rb.playoffLosses;
      if (poA !== poB) {
        const correct = poA > poB ? ida : idb;
        tryAdd(
          out,
          `cmp-po-${ida}-vs-${idb}`,
          "standard",
          "playoffs",
          `Which Timberwolves season included more total playoff games (wins + losses) on NBA.com’s row: ${ida} or ${idb}?`,
          correct,
          pairPool,
          seasonPool,
          correct,
          NBA_TEAM_YEARS,
          rng,
        );
      }

      if (
        ra.winPct !== null &&
        rb.winPct !== null &&
        Math.abs(ra.winPct - rb.winPct) > 0.008
      ) {
        const correct = ra.winPct! > rb.winPct! ? ida : idb;
        tryAdd(
          out,
          `cmp-pct-${ida}-vs-${idb}`,
          "deep",
          "franchise-record",
          `Which Timberwolves season posted the higher regular-season win percentage on NBA.com’s table: ${ida} or ${idb}?`,
          correct,
          pairPool,
          seasonPool,
          correct,
          NBA_TEAM_YEARS,
          rng,
        );
      }
    }
  }
}

export function addChronologyQuestions(
  rows: TriviaFranchiseRow[],
  seasonPool: string[],
  out: TriviaQuestion[],
  rng: () => number,
): void {
  const labels = [...new Set(rows.map((r) => r.seasonLabel))].sort(compareSeasonIds);
  if (labels.length < 2) return;
  const decoysFull = seasonPool.filter((s) => !labels.includes(s));

  for (let idx = 0; idx < labels.length - 1; idx += 1) {
    const cur = labels[idx]!;
    const next = labels[idx + 1]!;
    const decoys = [...labels.filter((s) => s !== next), ...decoysFull].filter((s) => s !== next);
    tryAdd(
      out,
      `chrono-after-${cur}`,
      "standard",
      "franchise-record",
      `In chronological order, which NBA season label comes immediately after ${cur} for the Timberwolves on this site?`,
      next,
      [next, ...pickUnique(decoys, 12, rng)],
      seasonPool,
      next,
      NBA_TEAM_YEARS,
      rng,
    );
  }

  for (let idx = 1; idx < labels.length; idx += 1) {
    const cur = labels[idx]!;
    const prev = labels[idx - 1]!;
    const decoys = [...labels.filter((s) => s !== prev), ...decoysFull].filter((s) => s !== prev);
    tryAdd(
      out,
      `chrono-before-${cur}`,
      "standard",
      "franchise-record",
      `In chronological order, which NBA season label comes immediately before ${cur} for the Timberwolves on this site?`,
      prev,
      [prev, ...pickUnique(decoys, 12, rng)],
      seasonPool,
      prev,
      NBA_TEAM_YEARS,
      rng,
    );
  }

  for (let ord = 0; ord < labels.length; ord += 1) {
    const correct = labels[ord]!;
    const n = ord + 1;
    const decoys = labels.filter((s) => s !== correct);
    tryAdd(
      out,
      `chrono-ordinal-${n}`,
      "deep",
      "franchise-record",
      `Counting expansion onward in chronological order on this site, which season slug is Minnesota’s ${n}${ordinalSuffix(n)} NBA season?`,
      correct,
      [...decoys, ...pickUnique(decoysFull, 8, rng)],
      seasonPool,
      correct,
      NBA_TEAM_YEARS,
      rng,
    );
  }
}

function ordinalSuffix(n: number): string {
  const v = n % 100;
  if (v >= 11 && v <= 13) return "th";
  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export function addTripleMaxWinsQuestions(
  rows: TriviaFranchiseRow[],
  seasonPool: string[],
  out: TriviaQuestion[],
  rng: () => number,
  maxTriples: number,
): void {
  const labels = [...new Set(rows.map((r) => r.seasonLabel))].sort(
    (a, b) => seasonChronoKey(a) - seasonChronoKey(b),
  );
  const bySeason = new Map(rows.map((r) => [r.seasonLabel, r]));
  let count = 0;
  outer: for (let i = 0; i < labels.length; i += 1) {
    for (let j = i + 1; j < labels.length; j += 1) {
      for (let k = j + 1; k < labels.length; k += 1) {
        if (count >= maxTriples) break outer;
        const sa = labels[i]!;
        const sb = labels[j]!;
        const sc = labels[k]!;
        const ra = bySeason.get(sa)!;
        const rb = bySeason.get(sb)!;
        const rc = bySeason.get(sc)!;
        const mw = Math.max(ra.wins, rb.wins, rc.wins);
        const winners = [ra, rb, rc].filter((r) => r.wins === mw);
        if (winners.length !== 1) continue;
        count += 1;
        const correct = winners[0]!.seasonLabel;
        const decoys = seasonPool.filter((s) => s !== sa && s !== sb && s !== sc);
        tryAdd(
          out,
          `triple-wins-${sa}-${sb}-${sc}`,
          "deep",
          "franchise-record",
          `Among ${sa}, ${sb}, and ${sc}, which Timberwolves season had the most regular-season wins on this site’s NBA.com table?`,
          correct,
          [sa, sb, sc, ...pickUnique(decoys, 10, rng)],
          seasonPool,
          correct,
          NBA_TEAM_YEARS,
          rng,
        );
      }
    }
  }
}

export function addMemeAndEraExcerptQuestions(
  seasonPool: string[],
  out: TriviaQuestion[],
  rng: () => number,
): void {
  const memes = getWolvesMemes();
  const titles = memes.map((m) => m.title);
  for (const m of memes) {
    if (m.summary.length < 30) continue;
    const others = titles.filter((t) => t !== m.title);
    tryAdd(
      out,
      `meme-sum-${m.id}`,
      "deep",
      "meme",
      `Which Wolves meme / lore entry on this site matches this summary?\n\n“${excerpt(m.summary, 120)}”`,
      m.title,
      [...others, m.title, ...pickUnique(memes.map((x) => x.era), 6, rng)],
      seasonPool,
      undefined,
      STATIC_MEME,
      rng,
    );
  }

  const eras = getAllEras();
  const eraTitles = eras.map((e) => e.title);
  for (const e of eras) {
    const intro = e.intro[0];
    if (!intro || intro.length < 40) continue;
    const others = eraTitles.filter((t) => t !== e.title);
    tryAdd(
      out,
      `era-intro-${e.slug}`,
      "deep",
      "era",
      `Which era hub on this site opens with this line?\n\n“${excerpt(intro, 130)}”`,
      e.title,
      [...others, e.title],
      eraTitles,
      undefined,
      STATIC_ERA,
      rng,
    );
    tryAdd(
      out,
      `era-years-${e.slug}`,
      "standard",
      "era",
      `On this site, which era hub is labeled with the span “${e.yearsLabel}”?`,
      e.title,
      eraTitles,
      eraTitles,
      undefined,
      STATIC_ERA,
      rng,
    );
  }
}
