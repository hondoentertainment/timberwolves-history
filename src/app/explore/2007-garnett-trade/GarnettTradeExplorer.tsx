"use client";

import Link from "next/link";
import { useState } from "react";

const steps = [
  {
    id: "context",
    title: "Why this summer mattered",
    body: "After years of KG carrying playoff hopes, the franchise faced a fork: keep betting on one superstar window or accept a painful reset. Public discourse framed the trade as both basketball math and emotional whiplash for fans who grew up with No. 21.",
  },
  {
    id: "data",
    title: "What the archive shows",
    body: "Curated transaction notes summarize the Boston blockbuster; the draft register lists Minnesota’s lottery picks from the same window. Cross-check against NBA.com-backed roster tables on the season hub—this explorer stays static and cited.",
  },
  {
    id: "season",
    title: "Open the season hub",
    body: "Use the 2007–08 season page for standings, coaching register matches, roster rows, and the draft/transaction tables when present.",
  },
] as const;

export function GarnettTradeExplorer() {
  const [step, setStep] = useState(0);
  const s = steps[step]!;

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/35 p-6 ring-1 ring-white/[0.04]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500/90">
          Step {step + 1} / {steps.length}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((i) => Math.max(0, i - 1))}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-200 disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            disabled={step >= steps.length - 1}
            onClick={() => setStep((i) => Math.min(steps.length - 1, i + 1))}
            className="rounded-lg border border-emerald-700/50 bg-emerald-950/40 px-3 py-1.5 text-sm font-medium text-emerald-200 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
      <h2 className="mt-6 text-xl font-semibold text-white">{s.title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{s.body}</p>
      {step === steps.length - 1 ? (
        <p className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/seasons/2007-08"
            className="inline-flex rounded-lg border border-emerald-700/60 bg-emerald-950/30 px-4 py-2 text-sm font-medium text-emerald-300 hover:border-emerald-500/80"
          >
            Open 2007–08 season →
          </Link>
          <Link
            href="/eras/post-kg-rebuild"
            className="inline-flex rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:border-zinc-500"
          >
            Post-KG rebuild era →
          </Link>
        </p>
      ) : null}
    </div>
  );
}
