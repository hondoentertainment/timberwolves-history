export type TriviaDifficulty = "standard" | "deep";

export type TriviaCategory =
  | "franchise-record"
  | "playoffs"
  | "season-story"
  | "coach"
  | "draft"
  | "transaction"
  | "era"
  | "timeline"
  | "meme";

export type TriviaQuestion = {
  id: string;
  difficulty: TriviaDifficulty;
  category: TriviaCategory;
  prompt: string;
  choices: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  /** Season page to link for “learn more,” when relevant. */
  seasonId?: string;
  /** Attribution / provenance for the fact (shown after answering). */
  sourceNote?: string;
};

export type TriviaFranchiseRow = {
  seasonLabel: string;
  wins: number;
  losses: number;
  winPct: number | null;
  playoffWins: number;
  playoffLosses: number;
  confRank: number | null;
  divRank: number | null;
};
