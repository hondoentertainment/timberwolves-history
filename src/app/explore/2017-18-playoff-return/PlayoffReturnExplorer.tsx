"use client";

import Link from "next/link";
import { useState } from "react";

const steps = [
  {
    id: "context",
    title: "Fourteen years, then noise",
    body: "The 2017–18 season is remembered as the drought’s end—but also as the start of a very public conversation about identity, effort, and fit. This vignette is editorial framing only; use NBA.com tables on the season page for facts.",
  },
  {
    id: "transactions",
    title: "Curated transaction note",
    body: "The static register summarizes the Butler acquisition summer in plain language. It is not a complete transaction log.",
  },
  {
    id: "season",
    title: "Season hub",
    body: "Open the season page for standings, playoff line, roster, and optional draft/transaction panels.",
  },
] as const;

export function PlayoffReturnExplorer() {
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
            href="/seasons/2017-18"
            className="inline-flex rounded-lg border border-emerald-700/60 bg-emerald-950/30 px-4 py-2 text-sm font-medium text-emerald-300 hover:border-emerald-500/80"
          >
            Open 2017–18 season →
          </Link>
          <Link
            href="/eras/butler-era"
            className="inline-flex rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:border-zinc-600"
          >
            Butler era hub →
          </Link>
        </p>
      ) : null}
    </div>
  );
}
