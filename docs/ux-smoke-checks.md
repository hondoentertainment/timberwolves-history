# UX Smoke Checks

Run these checks before shipping major public UX changes.

## Mobile
- Test at 320px, 390px, and 430px widths.
- Confirm the bottom quick nav does not cover page content.
- Confirm primary nav, in-page nav, chips, and form controls are at least 44px tall.
- Confirm wide tables show the "Swipe for more" affordance and remain horizontally scrollable.

## Keyboard And Screen Reader
- Tab from the browser chrome to "Skip to content" and confirm focus lands on `#main`.
- Tab through the primary nav, bottom quick nav, search form, filter chips, and table links.
- Confirm `aria-current` is present on active primary nav items.
- Confirm loading states include a screen-reader status message.

## Performance
- Run a mobile Lighthouse pass on `/`, `/start-here`, `/browse`, `/search`, `/record-book`, `/compare/seasons`, and `/compare/players`.
- Watch for LCP regressions on the home hero and record-book cards.
- Watch for CLS in sticky header, bottom nav, and loading skeleton transitions.

## Data Honesty
- Confirm comparison pages degrade when NBA.com fetches fail and still show snapshot/index-backed content.
- Confirm playoff-era overlap copy does not imply player postseason minutes.
- Confirm record-book copy names the source or limitation for each ranking.
