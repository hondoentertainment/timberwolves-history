import Link from "next/link";
import type { ReactNode } from "react";

import { premiumLinkFocus } from "@/components/PremiumUX";
import type { WolvesMeme } from "@/lib/memes";

export function WolvesMemeCard({
  meme,
  headingLevel = "h2",
  index,
  showIndex = false,
  domId,
  titleHref,
}: {
  meme: WolvesMeme;
  headingLevel?: "h2" | "h3";
  index?: number;
  showIndex?: boolean;
  domId?: string;
  /** When set, the title becomes a link (e.g. home → /memes#anchor). */
  titleHref?: string;
}) {
  const Heading = headingLevel;
  const titleNode: ReactNode =
    titleHref != null ? (
      <Link href={titleHref} className={`text-inherit hover:text-emerald-300 ${premiumLinkFocus}`}>
        {meme.title}
      </Link>
    ) : (
      meme.title
    );

  return (
    <li
      id={domId}
      className="scroll-mt-24 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5"
    >
      <div className="flex flex-wrap items-baseline gap-2">
        {showIndex && index !== undefined ? (
          <span className="text-sm font-medium text-zinc-500" aria-hidden>
            {index + 1}.
          </span>
        ) : null}
        <Heading className="text-lg font-semibold text-white">{titleNode}</Heading>
        <span className="text-xs text-zinc-500">· {meme.era}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{meme.summary}</p>
    </li>
  );
}
