import Link from "next/link";

import { WolvesMemeCard } from "@/components/memes/WolvesMemeCard";
import { SectionHeader, premiumLinkFocus } from "@/components/PremiumUX";
import { getWolvesMemes } from "@/lib/memes";

export function HomeMemesBand() {
  const memes = getWolvesMemes();

  return (
    <section className="mb-12 sm:mb-14" aria-labelledby="home-memes">
      <SectionHeader
        id="home-memes"
        title="Wolves memes & fan lore"
        description="Every curated entry from the memes index—loaded with the page so search, readers, and archives see the same fan-culture shorthand. Not official team content."
        action={
          <Link href="/memes" className={`text-sm font-semibold text-emerald-400 hover:text-emerald-300 ${premiumLinkFocus}`}>
            Memes page + disclaimer
          </Link>
        }
      />
      <ul className="list-none space-y-4 p-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
        {memes.map((m, i) => (
          <WolvesMemeCard
            key={m.id}
            meme={m}
            headingLevel="h3"
            index={i}
            showIndex
            titleHref={`/memes#meme-${encodeURIComponent(m.id)}`}
          />
        ))}
      </ul>
    </section>
  );
}
