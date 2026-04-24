/**
 * Human-readable playoff copy from NBA `teamyearbyyearstats` row fields.
 * Stays conservative: we never invent a round beyond what the API string suggests.
 */

export type PlayoffRowInput = {
  playoffWins: number;
  playoffLosses: number;
  /** Raw `NBA_FINALS_APPEARANCE` (or similar) from TeamStats row when present. */
  finalsAppearance?: string | null;
};

function clean(s: unknown): string {
  if (s === null || s === undefined) return "";
  const t = String(s).trim();
  if (!t || t.toUpperCase() === "N/A") return "";
  return t;
}

/** Maps common NBA.com `NBA_FINALS_APPEARANCE` values to short prose. */
const APPEARANCE_PHRASE: Record<string, string> = {
  "League Champion": "Won the NBA championship.",
  "Lost Finals": "Reached the NBA Finals.",
  "NBA Finals": "Reached the NBA Finals.",
  "Conference Finals": "Reached the Western Conference finals.",
  "Conf Finals": "Reached the Western Conference finals.",
  "Conference Semifinals": "Reached the conference semifinals.",
  "Conf Semifinals": "Reached the conference semifinals.",
  "Conference Quarterfinals": "Reached the conference quarterfinals.",
  "Conf Quarterfinals": "Reached the conference quarterfinals.",
  "First Round": "Lost in the first round.",
};

export function formatPlayoffNarrative(input: PlayoffRowInput): string {
  const { playoffWins: w, playoffLosses: l } = input;
  if (w === 0 && l === 0) {
    return "Did not qualify for the playoffs.";
  }
  const record = `Postseason record ${w}-${l}`;
  const key = clean(input.finalsAppearance);
  const phrase = key ? APPEARANCE_PHRASE[key] ?? key : "";
  return phrase ? `${record}. ${phrase}` : `${record}.`;
}
