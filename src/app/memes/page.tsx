import Link from "next/link";
import type { Metadata } from "next";

import { WolvesMemeCard } from "@/components/memes/WolvesMemeCard";
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
      <p className="mb-8 max-w-3xl text-sm leading-relaxed text-zinc-500">
        For broader historical framing (not jokes), see{" "}
        <Link href="/eras" className="text-emerald-400 hover:text-emerald-300">
          era hubs
        </Link>{" "}
        and the flagship essay{" "}
        <Link href="/stories/weight-of-the-north" className="text-emerald-400 hover:text-emerald-300">
          The weight of the North
        </Link>
        .
      </p>
      <ul className="list-none space-y-5 p-0">
        {memes.map((m, i) => (
          <WolvesMemeCard
            key={m.id}
            meme={m}
            headingLevel="h2"
            index={i}
            showIndex
            domId={`meme-${m.id}`}
          />
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
