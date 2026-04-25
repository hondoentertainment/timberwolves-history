"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { shuffled } from "@/lib/trivia/random";
import type { TriviaDifficulty, TriviaQuestion } from "@/lib/trivia/types";

type Phase = "setup" | "play" | "done";

type TriviaGameProps = {
  deck: TriviaQuestion[];
};

const labels = ["A", "B", "C", "D"] as const;

function filterDeck(deck: TriviaQuestion[], mode: "all" | TriviaDifficulty): TriviaQuestion[] {
  if (mode === "all") return deck;
  return deck.filter((q) => q.difficulty === mode);
}

export function TriviaGame({ deck }: TriviaGameProps) {
  const [phase, setPhase] = useState<Phase>("setup");
  const [difficulty, setDifficulty] = useState<"all" | TriviaDifficulty>("all");
  const [roundSize, setRoundSize] = useState(12);
  const [order, setOrder] = useState<TriviaQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const pool = useMemo(() => filterDeck(deck, difficulty), [deck, difficulty]);

  const start = useCallback(() => {
    const sh = shuffled(pool, Math.random);
    const n = Math.min(roundSize, sh.length);
    setOrder(sh.slice(0, n));
    setIndex(0);
    setScore(0);
    setPicked(null);
    setStreak(0);
    setBestStreak(0);
    setPhase("play");
  }, [pool, roundSize]);

  const current = order[index] ?? null;
  const answered = picked !== null;
  const correct = current !== null && picked === current.correctIndex;

  const choose = (i: number) => {
    if (!current || picked !== null) return;
    setPicked(i);
    if (i === current.correctIndex) {
      setScore((s) => s + 1);
      setStreak((st) => {
        const n = st + 1;
        setBestStreak((b) => Math.max(b, n));
        return n;
      });
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    if (index + 1 >= order.length) {
      setPhase("done");
      return;
    }
    setIndex((x) => x + 1);
    setPicked(null);
  };

  if (!deck.length) {
    return (
      <p className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-6 text-zinc-400">
        Trivia deck is empty. Check back after NBA.com franchise stats load for this deployment.
      </p>
    );
  }

  if (phase === "setup") {
    return (
      <div className="space-y-8 rounded-2xl border border-zinc-800/90 bg-zinc-950/60 p-6 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.65)] sm:p-8">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">How to play</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
            Questions are built from season blurbs, era hubs, the franchise timeline, curated draft
            and transaction notes, coach tenures, and cached NBA.com team-year stats.{" "}
            <strong className="text-zinc-300">Standard</strong> skews records and playoffs;{" "}
            <strong className="text-zinc-300">Deep</strong> adds blurb matching, timeline headlines,
            and fingerprint stats. Streaks are tracked for fun between questions.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-zinc-300">Difficulty mix</legend>
            {(
              [
                ["all", "Mixed (everything)"],
                ["standard", "Standard"],
                ["deep", "Deep"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/30 px-4 py-3 transition hover:border-emerald-500/30"
              >
                <input
                  type="radio"
                  name="diff"
                  value={value}
                  checked={difficulty === value}
                  onChange={() => setDifficulty(value)}
                  className="size-4 accent-emerald-500"
                />
                <span className="text-sm text-zinc-200">{label}</span>
              </label>
            ))}
          </fieldset>
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-zinc-300">Round length</legend>
            {[8, 12, 20, 30].map((n) => (
              <label
                key={n}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/30 px-4 py-3 transition hover:border-emerald-500/30"
              >
                <input
                  type="radio"
                  name="len"
                  value={n}
                  checked={roundSize === n}
                  onChange={() => setRoundSize(n)}
                  className="size-4 accent-emerald-500"
                />
                <span className="text-sm text-zinc-200">{n} questions</span>
              </label>
            ))}
          </fieldset>
        </div>
        <p className="text-xs text-zinc-500">
          Pool size after filter: <span className="font-mono text-zinc-400">{pool.length}</span>{" "}
          questions. A new shuffle runs each game.
        </p>
        <button
          type="button"
          onClick={start}
          disabled={pool.length < 4}
          className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 outline-offset-2 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70"
        >
          Start game
        </button>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="space-y-6 rounded-2xl border border-emerald-500/25 bg-emerald-950/20 p-8 text-center">
        <h2 className="text-2xl font-semibold text-white">Round complete</h2>
        <p className="text-zinc-300">
          Score <span className="font-mono text-emerald-300">{score}</span> /{" "}
          <span className="font-mono text-zinc-400">{order.length}</span>
        </p>
        <p className="text-sm text-zinc-500">Best streak: {bestStreak}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={start}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white outline-offset-2 hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70"
          >
            Play again
          </button>
          <button
            type="button"
            onClick={() => setPhase("setup")}
            className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 outline-offset-2 hover:border-zinc-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70"
          >
            Change options
          </button>
        </div>
      </div>
    );
  }

  if (!current) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3 text-sm text-zinc-500">
        <span>
          Question{" "}
          <span className="font-mono text-zinc-300">
            {index + 1}/{order.length}
          </span>
        </span>
        <span>
          Score <span className="font-mono text-emerald-400">{score}</span> · Streak{" "}
          <span className="font-mono text-zinc-300">{streak}</span>
        </span>
        <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs uppercase tracking-wide text-zinc-400">
          {current.difficulty} · {current.category.replaceAll("-", " ")}
        </span>
      </div>

      <article className="rounded-2xl border border-zinc-800/90 bg-zinc-950/50 p-6 sm:p-8">
        <h2 className="whitespace-pre-line text-lg font-medium leading-relaxed text-zinc-100 sm:text-xl">
          {current.prompt}
        </h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2" role="group" aria-label="Answer choices">
          {current.choices.map((choice, i) => {
            const isSel = picked === i;
            const isCor = i === current.correctIndex;
            let ring = "border-zinc-800 bg-zinc-900/40 hover:border-emerald-500/35";
            if (answered) {
              if (isCor) ring = "border-emerald-500/60 bg-emerald-950/40";
              else if (isSel) ring = "border-rose-500/50 bg-rose-950/25";
              else ring = "border-zinc-800/60 bg-zinc-950/30 opacity-60";
            }
            return (
              <button
                key={`${current.id}-${i}`}
                type="button"
                disabled={answered}
                onClick={() => choose(i)}
                className={`flex gap-3 rounded-xl border px-4 py-4 text-left text-sm leading-snug text-zinc-200 transition ${ring} disabled:cursor-default outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70`}
              >
                <span className="font-mono text-xs text-zinc-500">{labels[i]}.</span>
                <span>{choice}</span>
              </button>
            );
          })}
        </div>

        {answered ? (
          <div className="mt-8 space-y-4 border-t border-zinc-800/80 pt-6">
            <p className={correct ? "text-emerald-400" : "text-rose-300"}>
              {correct ? "Correct." : "Not quite."}
            </p>
            {current.sourceNote ? (
              <p className="text-xs leading-relaxed text-zinc-500">{current.sourceNote}</p>
            ) : null}
            {current.seasonId ? (
              <p>
                <Link
                  href={`/seasons/${encodeURIComponent(current.seasonId)}`}
                  className="text-sm font-medium text-emerald-400 underline decoration-emerald-500/35 underline-offset-2 hover:text-emerald-300"
                >
                  Open {current.seasonId} season page
                </Link>
              </p>
            ) : null}
            <button
              type="button"
              onClick={next}
              className="rounded-xl bg-zinc-100 px-5 py-2.5 text-sm font-semibold text-zinc-900 outline-offset-2 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70"
            >
              {index + 1 >= order.length ? "See results" : "Next question"}
            </button>
          </div>
        ) : null}
      </article>
    </div>
  );
}
