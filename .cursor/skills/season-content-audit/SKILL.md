---
name: season-content-audit
description: >-
  Audits Minnesota Timberwolves season pages for required editorial blurbs and
  optional draft/transaction JSON. Use when the user asks for season content
  coverage, missing season blurbs, franchise-year gaps, or to verify every
  season slug has site content.
---

# Season content audit (Wolves History)

## What “content per season” means here

1. **Required:** Every canonical franchise season slug from `getWolvesSeasonIds()` must have a non-empty `blurb` in `src/data/season-stories.json`. Season pages render this via `SeasonStoryBlurb` when present; missing keys omit the block and fail CI tests.
2. **Optional (curated):** `src/data/draft-picks-by-season.json` and `src/data/transactions-by-season.json` may only cover some years. Gaps are expected until HIST-003/HIST-004 work fills them.

## How to audit

1. Run **`npm run audit:seasons`** (Vitest: `src/lib/season-content-coverage.test.ts`). If it fails, add or fix `stories` entries in `season-stories.json` for the listed season ids (format `YYYY-YY`, e.g. `2024-25`).
2. For a readable gap summary without failing optional datasets, import from `src/lib/season-content-coverage.ts`:
   - `formatSeasonContentAuditReport()` — full text report
   - `missingDraftPickRows()` / `missingTransactionRows()` — seasons lacking those arrays

## Code map

| Concern | Location |
|--------|----------|
| Canonical season list | `src/lib/nba/seasons.ts` (`getWolvesSeasonIds`, `FIRST_WOLVES_SEASON_START_YEAR`) |
| Story blurbs | `src/data/season-stories.json` + `src/lib/season-stories.ts` |
| Coverage helpers | `src/lib/season-content-coverage.ts` |
| Season page | `src/app/seasons/[season]/page.tsx` |

## When a new NBA year starts

`getWolvesSeasonIds()` grows by one slug. Add a new `stories` object for that season in `season-stories.json` (placeholder blurb is fine until the arc is clear), then re-run `npm run audit:seasons`.
