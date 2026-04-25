import Link from "next/link";
import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { getAllLongreads } from "@/lib/longreads";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Flagship editorial essays on Minnesota Timberwolves history—interpretation with citations, separate from NBA.com stats on this site.",
};

export default function StoriesIndexPage() {
  const stories = getAllLongreads();
  return (
    <>
      <PageHeader
        title="Stories & essays"
        description="Longer editorial pieces that interpret franchise history. They are not sourced from live NBA feeds; use season and player pages for structured statistics."
      />
      <ul className="space-y-4">
        {stories.map((s) => (
          <li
            key={s.slug}
            className="rounded-2xl border border-zinc-800/90 bg-zinc-900/35 p-6 shadow-lg shadow-black/20 ring-1 ring-white/[0.03] transition hover:border-zinc-700/90"
          >
            <Link
              href={`/stories/${s.slug}`}
              className="text-lg font-semibold text-emerald-400/95 decoration-emerald-500/30 underline-offset-2 hover:text-emerald-300 hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70"
            >
              {s.title}
            </Link>
            <p className="mt-2 text-sm text-zinc-500">
              {s.readTimeMinutes} min read · Published {s.published}
            </p>
            <p className="mt-3 max-w-3xl text-pretty text-sm leading-relaxed text-zinc-400">{s.dek}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
