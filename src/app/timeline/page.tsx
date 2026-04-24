import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { getFranchiseTimeline, timelineAttribution } from "@/lib/franchise-timeline";

export const metadata: Metadata = {
  title: "Franchise timeline",
  description:
    "Milestone dates in Minnesota Timberwolves history—expansion, arenas, peaks, rebuilds, and modern resurgence.",
};

export default function TimelinePage() {
  const events = getFranchiseTimeline();
  return (
    <>
      <PageHeader
        title="Franchise timeline"
        description={`${timelineAttribution()} This is a curated milestone list, not a play-by-play game log.`}
      />
      <div className="space-y-8 border-l border-zinc-800 pl-6">
        {events.map((ev) => (
          <article key={`${ev.dateLabel}-${ev.headline}`} className="relative">
            <span
              className="absolute -start-[calc(0.5rem+5px)] top-2 h-2.5 w-2.5 rounded-full border border-zinc-600 bg-emerald-600/80"
              aria-hidden
            />
            <p className="text-sm font-semibold text-emerald-400">{ev.dateLabel}</p>
            <h2 className="mt-1 text-lg font-semibold text-white">{ev.headline}</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{ev.body}</p>
          </article>
        ))}
      </div>
    </>
  );
}
