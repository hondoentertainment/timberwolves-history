import { seasonStoriesAttribution } from "@/lib/season-stories";

type Props = {
  blurb: string;
  updated?: string;
};

export function SeasonStoryBlurb({ blurb, updated }: Props) {
  return (
    <aside className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
        Season story
      </h2>
      <p className="mt-3 text-base leading-relaxed text-zinc-200">{blurb}</p>
      <p className="mt-4 text-xs text-zinc-500">
        {seasonStoriesAttribution()}
        {updated ? ` Last updated ${updated}.` : ""}
      </p>
    </aside>
  );
}
