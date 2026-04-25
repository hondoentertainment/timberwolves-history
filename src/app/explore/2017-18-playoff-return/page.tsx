import Link from "next/link";
import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";

import { PlayoffReturnExplorer } from "./PlayoffReturnExplorer";

export const metadata: Metadata = {
  title: "2017–18 playoff return explorer",
  description:
    "Static vignette for the drought-ending season: editorial steps, curated transaction JSON, and links to the season + Butler era hub.",
};

export default function Explore201718PlayoffReturnPage() {
  return (
    <>
      <PageHeader
        title="2017–18 playoff return explorer"
        description="A second STORY-008-style shell: three steps, no live APIs. Pair with STORY-007 tone—cite sources on sensitive locker-room claims elsewhere; this route only points to structured pages."
      />
      <PlayoffReturnExplorer />
      <section className="mt-10 space-y-3 text-sm text-zinc-400">
        <h2 className="text-base font-semibold text-white">Sources</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <code className="text-zinc-500">src/data/transactions-by-season.json</code> — 2017–18
            offseason note.
          </li>
          <li>
            <Link href="/seasons/2017-18" className="text-emerald-400 hover:text-emerald-300">
              /seasons/2017-18
            </Link>{" "}
            — NBA.com-backed tables.
          </li>
          <li>
            <Link href="/eras/butler-era" className="text-emerald-400 hover:text-emerald-300">
              /eras/butler-era
            </Link>{" "}
            — editorial hub with <code className="text-zinc-500">lastReviewed</code> when maintained.
          </li>
        </ul>
      </section>
      <p className="mt-8 text-sm text-zinc-500">
        <Link href="/browse" className="text-emerald-400 hover:text-emerald-300">
          ← Browse the archive
        </Link>
      </p>
    </>
  );
}
