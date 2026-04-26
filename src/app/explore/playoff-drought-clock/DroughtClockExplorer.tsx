"use client";

import Link from "next/link";
import { useState } from "react";

import { premiumLinkFocus } from "@/components/PremiumUX";

const steps = [
  {
    id: "theme",
    title: "Seasons tagged for the return",
    body: "The drought ended in 2017–18, but the story lives in the years before. Filter the franchise list by the playoff-return theme to see which seasons the archive highlights—not a complete drought ledger, but editorial framing for the long gap.",
    href: "/seasons?theme=playoff-return" as const,
    cta: "Open themed seasons",
  },
  {
    id: "timeline",
    title: "Franchise timeline",
    body: "The site timeline puts eras and turning points in order—useful for remembering how many springs passed between the 2004 West finals run and the Butler-era postseason berth.",
    href: "/timeline" as const,
    cta: "Open timeline",
  },
  {
    id: "vignette",
    title: "2017–18 playoff return explorer",
    body: "A static STORY-008-style walkthrough: three steps on that drought-ending season, with sources. Pair with the season page and Butler era hub for structure and citations.",
    href: "/explore/2017-18-playoff-return" as const,
    cta: "Open drought-break vignette",
  },
] as const;

export function DroughtClockExplorer() {
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
      <p className="mt-6">
        <Link
          href={s.href}
          className={`inline-flex rounded-lg border border-emerald-700/60 bg-emerald-950/30 px-4 py-2 text-sm font-medium text-emerald-300 hover:border-emerald-500/80 ${premiumLinkFocus}`}
        >
          {s.cta} →
        </Link>
      </p>
    </div>
  );
}
