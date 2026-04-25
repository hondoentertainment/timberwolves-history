# Wolves History — roadmap, backlog & agent guide

**Audience:** humans and AI agents (Cursor) working on this repository.  
**Product focus:** historical depth, narrative storytelling, and rich **profiles** (people, seasons, eras)—not live scores or a news ticker.

---

## 1. Mission & bar for “comprehensive”

We are building the deepest **Minnesota Timberwolves franchise archive** on the open web: every season grounded in real data, every person who mattered given a **profile-shaped** treatment (stats + context + narrative hooks), and longform **story** pages that cite sources and connect entities.

**Non-goals:** competing with ESPN on breaking news, scraping Basketball-Reference at scale, or implying NBA/team endorsement.

---

## 2. Product principles (agents must align to these)

1. **Historical depth first** — completeness of franchise timeline, rosters, and leadership; then embellish with story.
2. **Profiles are hubs** — a player/coach/season page should answer “who / when / why it mattered,” not only “what were the numbers.”
3. **Storytelling is editorial** — longform is allowed to interpret; **stats tables are not** (attribute NBA.com; cite prose sources).
4. **Graceful data** — when NBA feeds fail, show last-known cache + timestamp; never a silent blank.
5. **Small, shippable slices** — each backlog item should merge as a coherent vertical (e.g. one season’s narrative block), not a 6-month mega-PR.
6. **Trust over hot takes** — difficult franchise chapters are sourced and even-handed; corrections are easy to submit and acknowledged where fixed.

**Quality bar (“best archive”):** depth and citations beat feature count. Compete on **guided paths** (eras, timeline, draft/transaction context), **internal linking**, **shareable longreads**, and **obvious data honesty**—not on mirroring generic stat tables or breaking news.

### 2.1 Strategic pillars (nine themes)

These are the product differentiators behind “best Wolves archive.” Agents should treat them as cross-cutting requirements, not one-off tickets.

1. **Story ↔ entity graph** — Eras, season blurbs, and longreads declare **typed** relations (`ContentGraph`: people, seasons, coaches, eras, story slugs, optional game anchors, themes). Powers related reading today and search facets tomorrow. **Shipped:** same as MVP plus **`mergedSeasonStoryGraph`** (every season blurb inherits era-highlight links even without JSON `graph`) and **`mergeContentGraphs`**.
2. **Uncomfortable chapters** — Butler-era politics, injuries, crunch-time culture: **even tone, sources, no punch-down** (**STORY-007**). Era hub `lastReviewed` pilot on `butler-era`.
3. **Corrections & versioning** — Obvious correction path + optional `lastReviewed` on sensitive hubs and flagship essays. **Shipped (MVP):** `getCorrectionMailto`, footer + `/about-data#suggest-correction`, longread JSON-LD `dateModified`, `NEXT_PUBLIC_CORRECTIONS_EMAIL`.
4. **Discovery for how fans browse** — Dense hub index first; filters (era, playoffs, role) and **PROF-005** Wolves-only leaderboards are **DISC-009** / follow-on. **Shipped:** `/browse`.
5. **Shareability** — OG/Twitter on eras and stories; RSS for aggregators. **Shipped:** `/feed.xml`, layout `alternates`, **DISC-006** on era pages, story twitter card.
6. **Reading experience** — Typography, pull quotes, print. **Shipped:** `longread-article` print CSS + measure tweak; **`LongreadReadModeShell`** read-mode toggle on longreads.
7. **Performance & a11y as reputation** — **PERF-001:** treat CWV spot-checks on list routes and keyboard/skip coverage as ongoing gates (see **§7**).
8. **Content ops at scale** — **OPS-001** + season-content-audit skill; optional authoring templates in **§8**.
9. **Delight without scope creep** — **HIST-007** “this week in history”; **STORY-008** static cited interactives (**`/explore/2003-04-offseason`**, **`/explore/2017-18-playoff-return`**). **Next:** trade-tree SVG, more season vignettes.

---

## 3. Roadmap (phased)

Phases are **sequential priorities**, not strict calendar quarters. Finish Phase A before starting Phase C unless an item is explicitly parallelizable.

| Phase | Name | Outcome |
|-------|------|-----------|
| **A** | **Depth & truth** | Every season has structured facts: record, ranks, playoff line, roster links, coach overlap; data freshness visible. |
| **B** | **Profile layer** | “Profile shell” pattern: bio block + stats + related links + optional editorial `content.md` / JSON fields per entity. |
| **C** | **Story & eras** | Era hub pages + 4–6 flagship longreads with citations; season pages gain short narrative summaries. |
| **D** | **Discovery & authority** | Search, sitemap expansion, `/about-data`, changelog, structured data, **OG/social metadata**, optional **RSS**, **corrections** path. |
| **E** | **Reading & reach** | Longform reading/print polish, content graph in data, browse hubs/density, optional “this week in history” delight. |

---

## 4. Backlog

Status legend: `todo` · `doing` · `done` (update in this file or your tracker as you ship).

### Recently shipped (keep in sync when you merge)

- **PROF-001** `done` — Profile primitives in `src/components/profile/`; wired on **player**, **coach**, and **season** detail routes.
- **HIST-001** `done` (MVP) — Season hero shows postseason **record** + mapped **`NBA_FINALS_APPEARANCE`** line via `formatPlayoffNarrative` (does not infer round from W–L alone).
- **STORY-003** `done` — `src/data/season-stories.json` + `SeasonStoryBlurb` on season pages when a key exists.
- **PROF-002** `done` — `src/data/player-bios.json` + `getPlayerBio`; **Story** block on player profiles with optional sources.
- **STORY-001** `done` (pilot) — `/eras` + `/eras/garnett` from `src/data/eras.json` + `src/lib/eras.ts`.
- **HIST-002** `done` — `/timeline` + `src/data/franchise-timeline.json` + `src/lib/franchise-timeline.ts`.
- **DISC-001** `done` — `/about-data` static documentation page.
- **PROF-003** `done` (MVP) — optional `bio[]` on entries in `wolves-coaches.json` (Flip, Thibs, Finch); rendered via `EditorialProse`.
- **GRAPH / DISC / UX (MVP)** `done` (2026-04-25) — Typed **`ContentGraph`** + **`ContentGraphRelated`** on all era hubs (pilot `lastReviewed` on **butler-era**), pilot **`graph` / `graphPlayerLabels`** on two season blurbs, graph on flagship longread; **`/browse`**; **`/feed.xml`** + root RSS alternate; **corrections** mailto site-wide; era **Open Graph** / Twitter; longread **`lastReviewed`** + JSON-LD **`dateModified`**; **print** stylesheet for longreads.
- **STORY-004 / STORY-006 / DISC-009 / PROF-005 / HIST-007 / STORY-008 / UX-001** `done` (2026-04-25 sweep) — **`mergedSeasonStoryGraph`** infers era links for **every** season blurb; **`getLongreadRelatedLinksForPlayer/Coach`** + **`getAllEraHubsForPlayer`** on profiles; **`/seasons`** query filters (`playoffs`, `era`); **`/players/leaders`**; home **`ThisWeekInWolvesHistory`** + timeline **`occursOn`**; **`/explore/2003-04-offseason`**; longread **read mode**; **`mergeContentGraphs`**; **`/sitemap.xml`** + **`/players/leaders`** `force-dynamic` for roster-index build budget.
- **Agentic sweep (2026-04-25+)** `done` — **DISC-002** v2 (`site-search`: memes, themes, blurbs); **DISC-009** theme chips on **`/browse?theme=`**; **PROF-005** leaders enriched (`wolves-leaders-stats.ts`); **HIST-003/004** empty-state **`ProfileSection`** on seasons; second **`/explore/2017-18-playoff-return`**; **about-data** cache table + **STORY-007** policy; **DataFreshness** → **`#cache-windows`**; **`.github/workflows/ci.yml`**; **`site-search.test.ts`**.

### Epic A — Historical depth (data + season experience)

| ID | Item | Acceptance criteria |
|----|------|---------------------|
| **HIST-001** | Season summary strip | Each `seasons/[season]` shows playoff result text (e.g. “Lost West First Round 1–4”) derived from `PO_WINS` / `PO_LOSSES` + optional static mapping for famous rounds. |
| **HIST-002** | Franchise timeline component | Reusable vertical timeline (expansion → arenas → conference finals → drought end → key drafts) driven by structured JSON in `src/data/`. |
| **HIST-003** | Draft picks by season | Per-season section listing Wolves picks (round, pick #, player, trade note); v1 can be static JSON keyed by `seasonId`, v2 optional API. |
| **HIST-004** | Transactions / roster churn | Static JSON or curated markdown per season: notable trades, signings, coach changes; link to player profiles. |
| **HIST-005** | Uniform / number notes (optional) | Static dataset “notable numbers retired / worn by legends”; link from player profiles. |
| **HIST-006** | Cache transparency | UI or footer chip: “Stats refreshed …” using `revalidate` boundaries or stored `fetchedAt` when you add KV/DB later. |
| **HIST-007** | “This week in history” (optional) | ~~MVP:~~ **`ThisWeekInWolvesHistory`** on home; **`occursOn`** (YYYY-MM-DD) on timeline events + **`getTimelineEventsInCurrentCalendarWeek`**. Fallback shows last two milestones when no anniversary hits the week. |

### Epic B — Profiles (players, coaches, “figures”)

| ID | Item | Acceptance criteria |
|----|------|---------------------|
| **PROF-001** | Profile layout component | Shared `ProfileLayout`: hero (name, photo, role), stats region, “Story” region, sidebar “Also see” (seasons, teammates era). |
| **PROF-002** | Editorial front-matter for players | Optional `src/content/players/{nbaId}.md` or `player-bios.json`: 2–6 paragraphs + sources; render below API bio on `/players/[id]` if present. |
| **PROF-003** | Coach profile upgrade | `/coaches/[id]` gains same profile shell: narrative from JSON/markdown, not only W–L table. |
| **PROF-004** | “Franchise figures” type | New route or section for non-coach personas (e.g. long-tenured GM, broadcast voice) using same profile shell + static content. |
| **PROF-005** | Wolves-only career highlights | ~~Tenure slice:~~ **`/players/leaders`** ranks roster-index season counts. **Next:** best MIN PPG season, playoff years column, JSON overrides—pair with existing **`computeWolvesHighlightBullets`**. |
| **PROF-006** | Photo fallbacks | Headshot 404 → initials or silhouette; no broken image layout. |

### Epic C — Storytelling & eras

| ID | Item | Acceptance criteria |
|----|------|---------------------|
| **STORY-001** | Era hub routes | e.g. `/eras/expansion`, `/eras/kg`, `/eras/post-kg`, `/eras/butler`, `/eras/kat-ant`, `/eras/finch` — each with intro essay + linked seasons/people. |
| **STORY-002** | Flagship longread #1 | One ~1500–2500 word piece with headings, pull quotes, and **citations** (footnotes or “Sources” block). |
| **STORY-003** | Season “chapter” blurbs | Short 2–4 sentence editorial blurb on `seasons/[season]` from `season-stories.json` when present; omit if missing. |
| **STORY-004** | Internal story links | ~~MVP:~~ player/coach pages dedupe **all** era spotlight hubs + **`entity-links.json`** stories + longreads whose **`contentGraph`** lists the entity. Extend with more longreads and optional MDX tags later. |
| **STORY-005** | Memes page alignment | Memes list cross-links to era hubs / stories where appropriate (keep tone respectful). |
| **STORY-006** | Content graph in data | Eras use `contentGraph` in `eras.json`; season blurbs use optional `graph` + `graphPlayerLabels` in `season-stories.json`; longreads use `contentGraph` + `contentGraphPlayerLabels` on the typed module. Fields mirror **`ContentGraph`** (`playerIds`, `seasonIds`, `coachIds`, `eraSlugs`, `gameIds`, `storySlugs`, `themes`). **`ContentGraphRelated`** renders on those surfaces; extend coverage to **every** blurb and new longreads (pairs with **STORY-004**). |
| **STORY-007** | Sensitive chapters standard | Flagship and era copy on controversial stretches (e.g. high-profile exits) cite sources, avoid punch-down, and use **§8** `lastReviewed` where maintained. |

### Epic D — Discovery, SEO, trust

| ID | Item | Acceptance criteria |
|----|------|---------------------|
| **DISC-001** | `/about-data` | Single page: what is live from NBA.com, what is static JSON, refresh cadence, limitations, contact/correction path. |
| **DISC-002** | Global search | MVP: server search over player names + static story titles; v2: index coaches + season blurbs + **themes** from **`ContentGraph`**. |
| **DISC-003** | Sitemap strategy | Document decision on player URLs; optionally generate from cached index with `revalidate` to avoid build-time fan-out. |
| **DISC-004** | Structured data | `NewsArticle` or `Article` JSON-LD on longreads; `Person` / `SportsTeam` where accurate and maintainable. |
| **DISC-005** | Changelog | `CHANGELOG.md` or `/changelog` listing substantive content/data updates. |
| **DISC-006** | Open Graph & social cards | `metadata.openGraph` / Twitter cards for `/eras/*`, longread routes, and optionally key season pages; titles/descriptions match in-app headings. |
| **DISC-007** | RSS or Atom | Feed for changelog entries and/or new stories; discoverable link in footer next to `/about-data`. |
| **DISC-008** | Corrections workflow | Prominent “Suggest a correction” (form or `mailto:` with subject/body template); linked from `/about-data`, footer, and longread footers. |
| **DISC-009** | Faceted browse v2 | ~~MVP:~~ `/seasons?playoffs=1` and `/seasons?era={slug}` (era = hub **highlight** seasons). **Next:** role / position buckets, All-Star flags, theme facets from **`ContentGraph.themes`**. |

### Epic E — Reading experience, browse density & ops

| ID | Item | Acceptance criteria |
|----|------|---------------------|
| **UX-001** | Longform reading polish | ~~MVP:~~ client **read mode** toggle + print CSS + measure tweak on flagship template. Optional: sepia theme, persisted user pref. |
| **UX-002** | Browse hub / index density | `/browse` or expanded footer: links to all era slugs, season index, timeline, data map; v2 can add filters (playoffs, role)—keep v1 static HTML from existing routes. |
| **OPS-001** | Authoring discipline | Before merge: new editorial JSON/markdown includes `lastUpdated`; longreads include `sources` + optional `lastReviewed`; run **`.cursor/skills/season-content-audit`** when changing season coverage. |
| **PERF-001** | CWV & a11y gates | Spot-check LCP/CLS (or Lighthouse) on `/players` and `/seasons` after list changes; verify skip link + heading order on new templates. |

### Epic F — Optional delight

| ID | Item | Acceptance criteria |
|----|------|---------------------|
| **STORY-008** | One static interactive | ~~MVP:~~ **`/explore/2003-04-offseason`** stepper cites draft + transaction JSON and links **`/seasons/2003-04`**. **Next:** richer trade-tree SVG, another season vignette. |

---

## 5. Suggested execution order (first 12 tickets)

1. ~~**PROF-001**~~ ✅  
2. ~~**HIST-001**~~ ✅ (MVP)  
3. ~~**STORY-003**~~ ✅  
4. ~~**PROF-002**~~ ✅ (JSON + five players)  
5. ~~**STORY-001**~~ ✅ (pilot: `/eras/garnett`)  
6. ~~**HIST-002**~~ ✅ (`/timeline`)  
7. ~~**PROF-003**~~ ✅ (coach `bio` on selected entries)  
8. ~~**STORY-002**~~ ✅ (flagship **weight-of-the-north** on home + era hubs).  
9. **HIST-003** or **HIST-004** — whichever content you can source first.  
10. ~~**DISC-001**~~ ✅  
11. ~~**DISC-002**~~ ✅ (`/search`).  
12. **HIST-006** or **PROF-006** — polish credibility (partial: footer **revalidate** note for **HIST-006**; headshot initials fallback for **PROF-006**).

**Next 8 (after the first dozen):** ~~**STORY-006** / **STORY-004** / **UX-001** / **DISC-009** (MVP) / **PROF-005** (MVP) / **HIST-007** / **STORY-008**~~ → **HIST-003** or **HIST-004** → deepen **DISC-009** (role facets) + **PROF-005** (PPG leaders) → **PERF-001** (CI or Lighthouse budget) → **STORY-007** editorial passes on sensitive copy.

---

## 6. Agent guide — repository map

| Area | Location | Notes |
|------|----------|--------|
| App routes | `src/app/` | App Router; server components by default. |
| NBA fetch | `src/lib/nba/client.ts`, `queries.ts` | **`server-only`**; never import into client components. |
| Seasons math | `src/lib/nba/seasons.ts` | Season slugs `YYYY-YY`; tests in `*.test.ts`. |
| Static franchise facts | `src/data/*.json` | Coaches (+ optional bios), memes, **`season-stories.json`**, **`player-bios.json`**, **`eras.json`**, **`franchise-timeline.json`**. |
| Profile UI | `src/components/profile/*` | **`ProfileLayout`**, **`ProfileHero`**, **`ProfileSection`**, **`ProfileMetaGrid`**, **`SeasonStoryBlurb`**. |
| Editorial blocks | `src/components/EditorialProse.tsx` | Shared prose + sources list for player/coach story sections. |
| Eras | `src/lib/eras.ts`, `src/app/eras/*` | **`getAllEras`**, **`getEraBySlug`**. |
| Timeline | `src/lib/franchise-timeline.ts`, `src/app/timeline/page.tsx` | **`getFranchiseTimeline`**. |
| Player bios | `src/lib/player-bios.ts` | **`getPlayerBio`** keyed by NBA player id string. |
| Data transparency | `src/app/about-data/page.tsx` | Sources, JSON inventory, cron, limitations. |
| Playoff copy | `src/lib/playoff-summary.ts` | **`formatPlayoffNarrative`** — uses PO record + `NBA_FINALS_APPEARANCE` when set. |
| Season stories | `src/lib/season-stories.ts` | **`getSeasonStory`** reads keyed blurbs for `seasons/[season]`. |
| UI shell | `src/components/SiteShell.tsx` | Nav + footer attribution. |
| Cron / revalidate | `src/app/api/cron/rebuild/route.ts`, `vercel.json` | `CRON_SECRET`; `revalidateTag(name, "max")` per Next 16. |
| Content graph | `src/types/content-graph.ts`, `src/lib/content-graph.ts`, `ContentGraphRelated.tsx` | **`ContentGraph`**, **`linksFromContentGraph`**, **`normalizeContentGraph`**. |
| Corrections mailto | `src/lib/corrections.ts` | **`getCorrectionMailto`**; env **`NEXT_PUBLIC_CORRECTIONS_EMAIL`**. |
| Browse + RSS | `src/app/browse/page.tsx`, `src/app/feed.xml/route.ts` | Hub index and RSS (changelog + longreads). |
| Season graph inference | `src/lib/season-graph-infer.ts` | **`inferContentGraphForSeason`**, **`mergedSeasonStoryGraph`**. |
| Profile graph links | `src/lib/profile-related-from-graph.ts` | Longread **`contentGraph`** → related reading on people pages. |
| Week widget | `src/components/ThisWeekInWolvesHistory.tsx` | Uses **`getTimelineEventsInCurrentCalendarWeek`**. |
| Offseason explorer | `src/app/explore/2003-04-offseason/*` | Static **STORY-008** shell. |
| Tenure leaders | `src/app/players/leaders/page.tsx` | **`force-dynamic`** (roster index cost). |

---

## 7. Agent rules — do / don’t

**Do**

- Read existing patterns (`getCachedFranchiseSeasons`, `StatTable`, `PageHeader`) before adding new UI.
- Keep **editorial content** in `src/data/` or `src/content/` (markdown/MDX if you add MDX later), separate from API parsers in `src/lib/nba/parse.ts`.
- Add **tests** for date/season string logic and any new merge or index helpers (Vitest: `npm run test`).
- Preserve **attribution** in the site footer and on data-heavy pages.

**Don’t**

- Call `stats.nba.com` from the browser or expose an open proxy.
- Scrape Basketball-Reference or Getty for bulk content.
- Rewrite unrelated files or drive-by refactor when shipping a single backlog item.

**Definition of Done (default)**

- `npm run lint` and `npm run build` pass.
- New routes appear in nav or are linked from a sensible parent page.
- Accessibility: sensible heading order, `alt` text for non-decorative images, visible focus for interactive controls.
- New **editorial** data: `lastUpdated` or `lastReviewed` where applicable; at least one inbound link from home, era hub, or parent index.
- List-heavy changes: quick **PERF-001** pass (LCP/CLS smoke test on `/players` and `/seasons`); confirm **skip to content** still reaches `#main`.

---

## 8. Content authoring conventions (for storytelling)

- **Era hubs (`eras.json`):** slug `kebab-case`; intro + spotlight seasons/people; optional **`contentGraph`** (`ContentGraph`) + optional **`lastReviewed`** on sensitive hubs.
- **Season blurbs:** JSON keyed by exact `seasonId` (e.g. `2003-04`); `updated` ISO date; optional **`graph`** (`ContentGraph`) and **`graphPlayerLabels`** (`Record<string, string>` keyed by NBA player id) for **STORY-006**.
- **Player bios:** prefer markdown with YAML frontmatter: `playerId`, `title`, `tags`, `sources` (URLs).
- **Franchise timeline (`franchise-timeline.json`):** optional **`occursOn`** (`YYYY-MM-DD`) for anniversary week matching on the home widget; keep **`dateLabel`** as the human-facing year/era tag.
- **Longreads (typed modules):** include `sources` (URLs); optional `lastReviewed`; **`contentGraph`** + optional **`contentGraphPlayerLabels`** for **STORY-006** (same field names as **`ContentGraph`**); add **`coachIds`** when the essay is a coaching through-line.
- **Voice:** third person, past tense for history; present tense only for “this site documents…”
- **Sensitive stretches:** cite prose sources; attribute stats to NBA.com; no speculative injury/personal claims without sources.

---

## 9. Keeping this file useful

- **Agents:** start every substantial task by skimming §2–§5, **§8** when adding editorial data, and the backlog ID you are implementing (Epics **D**/**E** for discovery, share, reading polish, and ops gates).  
- **Humans:** after shipping a ticket, move its row to a “Done” subsection or update status in your external board and optionally add one line to **§5** if priorities shift.

---

*Last curated for the Wolves History Next.js app; extend backlog as new epics emerge. Updated 2026-04-25 — includes agentic sweep: search v2 (memes/themes/blurbs), browse theme facets, leaders enrichment, season empty-states, second explore route, about-data cache table + policy, CI workflow.*
