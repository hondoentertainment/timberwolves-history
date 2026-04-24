import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { getMemesDisclaimer, getWolvesMemes } from "@/lib/memes";

export const metadata: Metadata = {
  title: "Memes & fan lore",
  description:
    "Curated list of Minnesota Timberwolves internet memes and recurring fan jokes—cultural shorthand, not official content.",
};

export default function MemesPage() {
  const memes = getWolvesMemes();
  const disclaimer = getMemesDisclaimer();

  return (
    <>
      <PageHeader
        title="Wolves memes & fan lore"
        description={disclaimer}
      />
      <ul className="list-none space-y-5 p-0">
        {memes.map((m, i) => (
          <li
            key={m.id}
            className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5"
          >
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-sm font-medium text-zinc-500" aria-hidden>
                {i + 1}.
              </span>
              <h2 className="text-lg font-semibold text-white">{m.title}</h2>
              <span className="text-xs text-zinc-500">· {m.era}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{m.summary}</p>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-xs text-zinc-600">
        Want something added or reworded? Edit{" "}
        <code className="rounded bg-zinc-900 px-1 py-0.5 text-zinc-400">
          src/data/wolves-memes.json
        </code>
        .
      </p>
    </>
  );
}
