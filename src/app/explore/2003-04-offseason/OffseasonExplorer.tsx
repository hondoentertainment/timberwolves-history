"use client";

import Link from "next/link";
import { useState } from "react";

const steps = [
  {
    id: "draft",
    title: "Draft night footprint",
    body: "The curated register lists Minnesota’s 2003 draft class as a second-round investment in a long-armed project big—context for how the roster was built around Garnett’s MVP window rather than another lottery splash.",
  },
  {
    id: "transactions",
    title: "Offseason narrative",
    body: "Editorial transaction notes describe a summer retool aimed at spacing and veteran defense for a West finals push—read alongside the season page for roster facts from NBA.com.",
  },
  {
    id: "season",
    title: "Jump to the season page",
    body: "Use the 2003–04 season hub for standings, playoff line, roster, and optional draft/transaction tables when present.",
  },
] as const;

export function OffseasonExplorer() {
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
        <p className="mt-6">
          <Link
            href="/seasons/2003-04"
            className="inline-flex rounded-lg border border-emerald-700/60 bg-emerald-950/30 px-4 py-2 text-sm font-medium text-emerald-300 hover:border-emerald-500/80"
          >
            Open 2003–04 season →
          </Link>
        </p>
      ) : null}
    </div>
  );
}
