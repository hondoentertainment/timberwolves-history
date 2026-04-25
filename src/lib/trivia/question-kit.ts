import { intFromRange, pickUnique, shuffled } from "@/lib/trivia/random";
import type {
  TriviaCategory,
  TriviaDifficulty,
  TriviaQuestion,
} from "@/lib/trivia/types";

function fourFromPool(
  correct: string,
  pool: string[],
  rng: () => number,
  fallbacks: string[],
): { choices: [string, string, string, string]; correctIndex: 0 | 1 | 2 | 3 } {
  const others = [...new Set(pool.filter((x) => x !== correct && x.trim().length > 0))];
  const picks: string[] = pickUnique(others, 3, rng);
  let i = 0;
  while (picks.length < 3 && i < fallbacks.length) {
    const f = fallbacks[i]!;
    i += 1;
    if (f !== correct && !picks.includes(f)) picks.push(f);
  }
  while (picks.length < 3) {
    picks.push(`Alternate (${picks.length + 1})`);
  }
  const ordered = shuffled([correct, picks[0]!, picks[1]!, picks[2]!], rng);
  const choices = ordered as [string, string, string, string];
  const idx = choices.indexOf(correct);
  return { choices, correctIndex: idx as 0 | 1 | 2 | 3 };
}

export function excerpt(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
}

export function pushQ(
  out: TriviaQuestion[],
  partial: Omit<TriviaQuestion, "choices" | "correctIndex"> & {
    choices: string[];
    correct: string;
  },
  rng: () => number,
  fallbacks: string[],
) {
  const { choices: rawChoices, correct, ...rest } = partial;
  const others = rawChoices.filter((c) => c !== correct);
  const uniqueOthers = [...new Set(others)];
  if (uniqueOthers.length < 3) return;
  const { choices, correctIndex } = fourFromPool(correct, uniqueOthers, rng, fallbacks);
  out.push({ ...rest, choices, correctIndex });
}

export function tryAdd(
  out: TriviaQuestion[],
  id: string,
  difficulty: TriviaDifficulty,
  category: TriviaCategory,
  prompt: string,
  correct: string,
  choicePool: string[],
  fallbacks: string[],
  seasonId: string | undefined,
  sourceNote: string | undefined,
  rng: () => number,
): boolean {
  const pool = [...new Set(choicePool.filter((x) => x && x.trim().length > 0))];
  if (!pool.includes(correct)) pool.push(correct);
  const others = pool.filter((x) => x !== correct);
  if (others.length < 3) return false;
  pushQ(
    out,
    {
      id,
      difficulty,
      category,
      prompt,
      correct,
      choices: pool,
      seasonId,
      sourceNote,
    },
    rng,
    fallbacks,
  );
  return true;
}

export function numericChoicePool(value: number, rng: () => number): string[] {
  const s = new Set<string>([String(value)]);
  let guard = 0;
  while (s.size < 8 && guard < 40) {
    const delta = intFromRange(-12, 12, rng);
    s.add(String(Math.max(0, value + delta)));
    guard += 1;
  }
  return [...s];
}
