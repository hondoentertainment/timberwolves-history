import Link from "next/link";

import {
  getFranchiseTimeline,
  getTimelineEventsInCurrentCalendarWeek,
  timelineAttribution,
} from "@/lib/franchise-timeline";

export function ThisWeekInWolvesHistory() {
  const all = getFranchiseTimeline();
  const now = new Date();
  const weekHits = getTimelineEventsInCurrentCalendarWeek(now, all);
  const usingWeek = weekHits.length > 0;
  const display = usingWeek ? weekHits.slice(0, 3) : all.slice(-2).reverse();

  return (
    <section
      aria-labelledby="week-wolves-heading"
      className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 ring-1 ring-white/[0.04]"
    >
      <h2
        id="week-wolves-heading"
        className="text-lg font-semibold tracking-tight text-white"
      >
        {usingWeek ? "This week in Wolves history" : "Featured milestones"}
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-zinc-500">
        {usingWeek
          ? "Anniversaries from the franchise timeline whose month/day falls in your current calendar week (local time)."
          : "No anniversaries matched this week—here are recent timeline anchors instead."}{" "}
        <span className="text-zinc-600">{timelineAttribution()}</span>
      </p>
      <ul className="mt-4 space-y-4">
        {display.map((e) => (
          <li key={`${e.dateLabel}-${e.headline}`} className="border-l-2 border-emerald-500/40 pl-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500/90">
              {e.dateLabel}
            </p>
            <p className="mt-1 font-medium text-zinc-100">{e.headline}</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-400">{e.body}</p>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm">
        <Link href="/timeline" className="font-medium text-emerald-400 hover:text-emerald-300">
          Full franchise timeline →
        </Link>
      </p>
    </section>
  );
}
