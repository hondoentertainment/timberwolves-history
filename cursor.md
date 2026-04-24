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

---

## 3. Roadmap (phased)

Phases are **sequential priorities**, not strict calendar quarters. Finish Phase A before starting Phase C unless an item is explicitly parallelizable.

| Phase | Name | Outcome |
|-------|------|-----------|
| **A** | **Depth & truth** | Every season has structured facts: record, ranks, playoff line, roster links, coach overlap; data freshness visible. |
| **B** | **Profile layer** | “Profile shell” pattern: bio block + stats + related links + optional editorial `content.md` / JSON fields per entity. |
| **C** | **Story & eras** | Era hub pages + 4–6 flagship longreads with citations; season pages gain short narrative summaries. |
| **D** | **Discovery & authority** | Search, sitemap expansion, `/about-data`, changelog, structured data for key templates. |

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

### Epic A — Historical depth (data + season experience)

| ID | Item | Acceptance criteria |
|----|------|---------------------|
| **HIST-001** | Season summary strip | Each `seasons/[season]` shows playoff result text (e.g. “Lost West First Round 1–4”) derived from `PO_WINS` / `PO_LOSSES` + optional static mapping for famous rounds. |
| **HIST-002** | Franchise timeline component | Reusable vertical timeline (expansion → arenas → conference finals → drought end → key drafts) driven by structured JSON in `src/data/`. |
| **HIST-003** | Draft picks by season | Per-season section listing Wolves picks (round, pick #, player, trade note); v1 can be static JSON keyed by `seasonId`, v2 optional API. |
| **HIST-004** | Transactions / roster churn | Static JSON or curated markdown per season: notable trades, signings, coach changes; link to player profiles. |
| **HIST-005** | Uniform / number notes (optional) | Static dataset “notable numbers retired / worn by legends”; link from player profiles. |
| **HIST-006** | Cache transparency | UI or footer chip: “Stats refreshed …” using `revalidate` boundaries or stored `fetchedAt` when you add KV/DB later. |

### Epic B — Profiles (players, coaches, “figures”)

| ID | Item | Acceptance criteria |
|----|------|---------------------|
| **PROF-001** | Profile layout component | Shared `ProfileLayout`: hero (name, photo, role), stats region, “Story” region, sidebar “Also see” (seasons, teammates era). |
| **PROF-002** | Editorial front-matter for players | Optional `src/content/players/{nbaId}.md` or `player-bios.json`: 2–6 paragraphs + sources; render below API bio on `/players/[id]` if present. |
| **PROF-003** | Coach profile upgrade | `/coaches/[id]` gains same profile shell: narrative from JSON/markdown, not only W–L table. |
| **PROF-004** | “Franchise figures” type | New route or section for non-coach personas (e.g. long-tenured GM, broadcast voice) using same profile shell + static content. |
| **PROF-005** | Wolves-only career highlights | Derived bullets from MIN rows (best PPG season, games played, playoff years); generated text + manual override in JSON. |
| **PROF-006** | Photo fallbacks | Headshot 404 → initials or silhouette; no broken image layout. |

### Epic C — Storytelling & eras

| ID | Item | Acceptance criteria |
|----|------|---------------------|
| **STORY-001** | Era hub routes | e.g. `/eras/expansion`, `/eras/kg`, `/eras/post-kg`, `/eras/butler`, `/eras/kat-ant`, `/eras/finch` — each with intro essay + linked seasons/people. |
| **STORY-002** | Flagship longread #1 | One ~1500–2500 word piece with headings, pull quotes, and **citations** (footnotes or “Sources” block). |
| **STORY-003** | Season “chapter” blurbs | Short 2–4 sentence editorial blurb on `seasons/[season]` from `season-stories.json` when present; omit if missing. |
| **STORY-004** | Internal story links | From player/coach pages, link to relevant era hub + longreads where tagged (tag array in frontmatter). |
| **STORY-005** | Memes page alignment | Memes list cross-links to era hubs / stories where appropriate (keep tone respectful). |

### Epic D — Discovery, SEO, trust

| ID | Item | Acceptance criteria |
|----|------|---------------------|
| **DISC-001** | `/about-data` | Single page: what is live from NBA.com, what is static JSON, refresh cadence, limitations, contact/correction path. |
| **DISC-002** | Global search | MVP: server search over player names + static story titles; v2: index coaches + season blurbs. |
| **DISC-003** | Sitemap strategy | Document decision on player URLs; optionally generate from cached index with `revalidate` to avoid build-time fan-out. |
| **DISC-004** | Structured data | `NewsArticle` or `Article` JSON-LD on longreads; `Person` / `SportsTeam` where accurate and maintainable. |
| **DISC-005** | Changelog | `CHANGELOG.md` or `/changelog` listing substantive content/data updates. |

---

## 5. Suggested execution order (first 12 tickets)

1. ~~**PROF-001**~~ ✅  
2. ~~**HIST-001**~~ ✅ (MVP)  
3. ~~**STORY-003**~~ ✅  
4. ~~**PROF-002**~~ ✅ (JSON + five players)  
5. ~~**STORY-001**~~ ✅ (pilot: `/eras/garnett`)  
6. ~~**HIST-002**~~ ✅ (`/timeline`)  
7. ~~**PROF-003**~~ ✅ (coach `bio` on selected entries)  
8. **STORY-002** — first flagship longread linked from home + era hub.  
9. **HIST-003** or **HIST-004** — whichever content you can source first.  
10. ~~**DISC-001**~~ ✅  
11. **DISC-002** — search MVP.  
12. **HIST-006** or **PROF-006** — polish credibility.

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

---

## 8. Content authoring conventions (for storytelling)

- **Eras:** slug `kebab-case`; one `index` longform + bullet “key moments” list.
- **Season blurbs:** JSON keyed by exact `seasonId` (e.g. `2003-04`); author field + `lastUpdated` ISO date.
- **Player bios:** prefer markdown with YAML frontmatter: `playerId`, `title`, `tags`, `sources` (URLs).
- **Voice:** third person, past tense for history; present tense only for “this site documents…”

---

## 9. Keeping this file useful

- **Agents:** start every substantial task by skimming §2–§5 and the backlog ID you are implementing.  
- **Humans:** after shipping a ticket, move its row to a “Done” subsection or update status in your external board and optionally add one line to **§5** if priorities shift.

---

*Last curated for the Wolves History Next.js app; extend backlog as new epics emerge.*
