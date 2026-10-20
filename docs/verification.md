# Verification

Date: 2026-10-20 · Windows 11 · Node 24.15.0 · Chromium 155.0.8059.85 (driven by REA `capture-browser-scenario`)

## Automated checks

| Check | Command | Result |
|---|---|---|
| TypeScript (app + `scripts/` + vite config) | `npm run typecheck` | PASS, 0 errors |
| Lint | `npm run lint` (oxlint) | PASS, 0 warnings, 0 errors |
| Production build, base `/` | `npm run build` | PASS: JS 245.5 kB (76.9 kB gzip), CSS 22.5 kB (5.4 kB gzip) |
| Production build, base `/portfolio/` | `VITE_BASE=/portfolio/ npx vite build` | PASS; asset, favicon and OG URLs carry the `/portfolio/` prefix |
| Sub-path serving | `vite preview` under `/portfolio/` and curl | 200 for page, JS, favicon and `og.png`; REA rendered the page (`ev_1b492f0a…`) |
| No token in the client bundle | grep `Authorization`/`GITHUB_TOKEN` in `dist/assets/*.js` | 0 matches |
| GitHub snapshot script | `npm run snapshot` | PASS: 3 repos fetched, unauthenticated |
| External links | curl -L on the profile, repositories tab, 3 repos, avatar, Google Fonts CSS | all 200 |

## Browser checks (REA scenarios, evidence IDs abbreviated)

| Scenario | Viewport | Evidence | Outcome |
|---|---|---|---|
| Desktop render, live API | 1440×900 | `ev_cb553fb4…` | Hero, facts card and nav correct; status "live"; Vietnamese diacritics render |
| Tablet render | 820×1180 | `ev_df63bd5c…` | Single column, desktop nav still visible. The facts card was very wide, so it was capped at `max-w-lg` afterwards (after-fix not re-captured) |
| Mobile render | 390×844 | `ev_27c43b46…` | Hamburger nav, no horizontal overflow observed |
| Mobile section walk (anchor navigation) | 390×844 | `ev_1f06f118…` | About, Skills, Projects, Journey and Contact all render; cards stack; no clipping |
| Mobile menu: open, then pick "Journey" | 390×844 | `ev_1f0385a3…` | Menu opens (`aria-expanded`), link navigates to `#journey`, menu closes |
| Skip link (Enter) | 1280×800 | `ev_d944be37…` | URL becomes `#main`; `main` is focusable (`tabIndex=-1`) |
| Nav click "Projects" | 1280×800 | `ev_da9636b9…` | Scrolls to section; nav item gets `aria-current` and the accent colour |
| API failure with snapshot (`?gh=offline`) | 1280×800 | `ev_da9636b9…` | Banner "Showing saved GitHub data…" + Retry; cards still shown |
| Rate limit (`?gh=ratelimit`) | 1280×800 | `ev_f9f97d9e…` | Banner reads "GitHub's hourly API limit was reached; it resets at …" |
| API failure, no snapshot (`?gh=nosnapshot`), then Retry | 1280×800 | `ev_77f8df32…` | Error panel with reason, "Try again" and "Browse on GitHub"; retry returns to the error state |
| Empty repositories (`?gh=empty`) | 1280×800 | `ev_05e2e197…` | Empty-state message with a profile link; journey shows only "Joined GitHub" |

The `?gh=` switches exist only in dev builds (`import.meta.env.DEV`) and are stripped from production.

Screenshots: `docs/screenshots/`.

## Accessibility (basic)

- **Landmarks and headings** (from the REA accessibility tree of the production build): skip link → `banner` with a `navigation "Primary"` → `main` with one h1 (name), an h2 per section and h3 per card/entry → `contentinfo` with a `navigation "Repositories"`.
- External links announce "(opens in a new tab)". Decorative SVGs are `aria-hidden`. The avatar has alt text.
- **Contrast** (WCAG relative luminance, computed): body text 16.2:1, muted 7.4–7.9:1, faint metadata 4.8–5.5:1 (raised from 4.3:1 during testing), accent 12.8–13.7:1, button text on accent 13.7:1.
- **Keyboard:** `:focus-visible` ring on all interactive elements. Escape closes the mobile menu. Each project card is a single tab stop (stretched link), with the optional "live site" link layered above it.
- **Reduced motion:** smooth scroll, the reveal animation and transitions are disabled under `prefers-reduced-motion: reduce`. All REA site captures ran with `reduced_motion: reduce`, so content was visible without animation. The animated (no-preference) path was **not** visually captured.

## Not verified

- **No automated axe/Lighthouse audit**: neither tool is installed and none was added. Screen-reader testing with NVDA/VoiceOver was not done.
- **Full Tab-order traversal**: REA's `press` action needs a target locator, so only targeted presses (skip link) and clicks were exercised.
- **The GitHub Actions workflow has not run**: nothing has been pushed. Its base-path logic was reproduced locally with `/portfolio/`.
- **Open Graph preview** in real social crawlers (needs a public URL).
- Real browsers other than Chromium (Firefox, Safari).
