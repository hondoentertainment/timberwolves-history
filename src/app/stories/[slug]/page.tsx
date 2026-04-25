import Link from "next/link";
import { notFound } from "next/navigation";

import type { Metadata } from "next";

import { ContentGraphRelated } from "@/components/ContentGraphRelated";
import { LongreadReadModeShell } from "@/components/LongreadReadModeShell";
import { getCorrectionMailto } from "@/lib/corrections";
import { getLongreadBySlug, getLongreadSlugs } from "@/lib/longreads";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getLongreadSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = getLongreadBySlug(slug);
  if (!story) return { title: "Story" };
  return {
    title: story.title,
    description: story.dek,
    openGraph: { title: story.title, description: story.dek, type: "article" },
    twitter: {
      card: "summary_large_image",
      title: story.title,
      description: story.dek,
    },
  };
}

export default async function LongreadPage({ params }: PageProps) {
  const { slug } = await params;
  const story = getLongreadBySlug(slug);
  if (!story) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.dek,
    datePublished: story.published,
    ...(story.lastReviewed ? { dateModified: story.lastReviewed } : {}),
    author: { "@type": "Organization", name: "Wolves History" },
    publisher: { "@type": "Organization", name: "Wolves History" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LongreadReadModeShell>
      <article className="longread-article mx-auto max-w-3xl">
        <header className="mb-10 border-b border-zinc-800/80 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500/90">
            Editorial · {story.readTimeMinutes} min read
          </p>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-[2.35rem] md:leading-tight">
            {story.title}
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-zinc-400">{story.dek}</p>
          <p className="mt-3 text-xs text-zinc-600">
            Published {story.published}
            {story.lastReviewed ? ` · Last reviewed ${story.lastReviewed}` : ""}
          </p>
        </header>
        <div className="space-y-6 text-base leading-relaxed text-zinc-300">
          {story.intro.map((p, i) => (
            <p key={i} className="text-pretty">
              {p}
            </p>
          ))}
        </div>
        {story.pullQuotes[0] ? (
          <figure className="longread-pullquote my-10 border-l-4 border-emerald-500/50 bg-zinc-900/40 py-4 pl-6 pr-4">
            <blockquote className="text-lg font-medium leading-snug text-zinc-100 sm:text-xl">
              “{story.pullQuotes[0].quote}”
            </blockquote>
            <figcaption className="mt-3 text-sm text-zinc-500">
              — {story.pullQuotes[0].attribution}
            </figcaption>
          </figure>
        ) : null}
        {story.sections.map((sec, i) => (
          <section key={sec.id} id={sec.id} className={i === 0 ? "mt-2" : "mt-14"}>
            <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {sec.heading}
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-zinc-300">
              {sec.paragraphs.map((p, j) => (
                <p key={j} className="text-pretty">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
        <ContentGraphRelated
          graph={story.contentGraph}
          playerLabels={story.contentGraphPlayerLabels}
          idPrefix={`story-graph-${story.slug}`}
        />
        <footer className="mt-16 border-t border-zinc-800/80 pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Sources</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-zinc-400">
            {story.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  className="text-emerald-400/95 underline decoration-emerald-500/35 underline-offset-2 hover:text-emerald-300"
                  rel="noopener noreferrer"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-zinc-500">
            <a
              href={getCorrectionMailto()}
              className="text-emerald-400/95 underline decoration-emerald-500/35 underline-offset-2 hover:text-emerald-300"
            >
              Suggest a correction
            </a>
            <span className="text-zinc-600"> · </span>
            <Link href="/stories" className="text-emerald-400 hover:text-emerald-300">
              ← All stories
            </Link>
            {" · "}
            <Link href="/" className="text-emerald-400 hover:text-emerald-300">
              Home
            </Link>
          </p>
        </footer>
      </article>
      </LongreadReadModeShell>
    </>
  );
}
