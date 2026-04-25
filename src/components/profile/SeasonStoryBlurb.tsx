import { ContentGraphRelated } from "@/components/ContentGraphRelated";
import { seasonStoriesAttribution } from "@/lib/season-stories";
import type { ContentGraph } from "@/types/content-graph";

type Props = {
  blurb: string;
  updated?: string;
  /** When set (e.g. from JSON `lastUpdated`), shown in the freshness line. */
  lastUpdated?: string;
  graph?: ContentGraph;
  graphPlayerLabels?: Record<string, string>;
};

export function SeasonStoryBlurb({ blurb, updated, lastUpdated, graph, graphPlayerLabels }: Props) {
  const freshness = (lastUpdated ?? updated)?.trim();
  return (
    <aside
      id="story"
      className="scroll-mt-28 relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 p-6 shadow-lg shadow-black/20 ring-1 ring-white/[0.03]"
    >
      <div
        className="pointer-events-none absolute inset-y-4 left-0 w-0.5 rounded-full bg-gradient-to-b from-amber-400/70 to-orange-600/40 sm:w-1"
        aria-hidden
      />
      <div className="relative space-y-6 pl-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-amber-500/90">
            Season story
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-zinc-200">{blurb}</p>
          <p className="mt-4 text-xs leading-relaxed text-zinc-500">
            {seasonStoriesAttribution()}
            {freshness ? ` Last updated ${freshness}.` : ""}
          </p>
        </div>
        <ContentGraphRelated
          graph={graph}
          playerLabels={graphPlayerLabels}
          idPrefix="season-story-graph"
        />
      </div>
    </aside>
  );
}
