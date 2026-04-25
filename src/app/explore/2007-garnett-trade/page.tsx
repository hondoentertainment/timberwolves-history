import Link from "next/link";
import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";

import { GarnettTradeExplorer } from "./GarnettTradeExplorer";

export const metadata: Metadata = {
  title: "2007 Garnett trade explorer",
  description:
    "Static, cited walkthrough of the Kevin Garnett trade window—curated transactions, draft register rows, and links to the 2007–08 season hub.",
};

export default function Explore2007GarnettTradePage() {
  return (
    <>
      <PageHeader
        title="2007 Garnett trade explorer"
        description="A small interactive shell: three steps, no live APIs. Tone stays even—see sources before citing elsewhere."
      />
      <GarnettTradeExplorer />
      <section className="mt-10 space-y-3 text-sm text-zinc-400">
        <h2 className="text-base font-semibold text-white">Sources</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <code className="text-zinc-500">src/data/transactions-by-season.json</code> — 2007–08
            editorial notes.
          </li>
          <li>
            <code className="text-zinc-500">src/data/draft-picks-by-season.json</code> — 2007–08
            draft rows.
          </li>
          <li>
            <Link href="/seasons/2007-08" className="text-emerald-400 hover:text-emerald-300">
              /seasons/2007-08
            </Link>{" "}
            — NBA.com-backed tables.
          </li>
          <li>
            <Link href="/eras/post-kg-rebuild" className="text-emerald-400 hover:text-emerald-300">
              /eras/post-kg-rebuild
            </Link>{" "}
            — era hub context.
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
