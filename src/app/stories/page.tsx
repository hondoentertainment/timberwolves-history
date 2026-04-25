import Link from "next/link";
import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { SurfaceCard, premiumLinkFocus } from "@/components/PremiumUX";
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
        description="Editorial pieces that interpret franchise history with citations and links back into the archive. Use season and player pages when you need structured statistics."
      />
      <ul className="grid gap-4 md:grid-cols-2">
        {stories.map((s) => (
          <li key={s.slug}>
            <SurfaceCard className="group h-full p-6 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-700/90 hover:bg-zinc-900/50">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              {s.readTimeMinutes} min read · {s.published}
            </p>
            <Link
              href={`/stories/${s.slug}`}
              className={`mt-3 block text-xl font-semibold tracking-tight text-emerald-400/95 decoration-emerald-500/30 underline-offset-2 hover:text-emerald-300 hover:underline ${premiumLinkFocus}`}
            >
              {s.title}
            </Link>
            <p className="mt-3 max-w-3xl text-pretty text-sm leading-relaxed text-zinc-400">{s.dek}</p>
            <p className="mt-5 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-300">
              Read essay <span aria-hidden>→</span>
            </p>
            </SurfaceCard>
          </li>
        ))}
      </ul>
    </>
  );
}
