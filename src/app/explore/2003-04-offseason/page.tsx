import Link from "next/link";
import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";

import { OffseasonExplorer } from "./OffseasonExplorer";

export const metadata: Metadata = {
  title: "2003–04 offseason explorer",
  description:
    "Static, cited walkthrough of the 2003–04 Timberwolves offseason context—draft register row, editorial transaction note, and season hub.",
};

export default function Explore200304OffseasonPage() {
  return (
    <>
      <PageHeader
        title="2003–04 offseason explorer"
        description="A tiny interactive shell: three steps, no live APIs. It exists to show how a cited, static ‘vignette’ can sit beside full season pages."
      />
      <OffseasonExplorer />
      <section className="mt-10 space-y-3 text-sm text-zinc-400">
        <h2 className="text-base font-semibold text-white">Sources</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <code className="text-zinc-500">src/data/draft-picks-by-season.json</code> — 2003–04
            draft row(s).
          </li>
          <li>
            <code className="text-zinc-500">src/data/transactions-by-season.json</code> — summer
            2003 editorial note.
          </li>
          <li>
            <Link href="/seasons/2003-04" className="text-emerald-400 hover:text-emerald-300">
              /seasons/2003-04
            </Link>{" "}
            — live NBA.com-backed tables.
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
