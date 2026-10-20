# Design research

Date: 2026-10-20 · Tool: REA (`rea-agents@6.7.0`) · Browser: Chromium 155.0.8059.85 (headless, launched by REA)

## How REA was used, and its limits

- **REA MCP tools were not available in the Claude Code session.** The `rea` MCP server was registered (and `claude mcp list` reports it connected) after the session had already started. Claude Code loads MCP tools only at session start, so none of REA's `mcp__rea__*` tools were exposed.
- **The same REA engine was used through its CLI** instead: `npx rea-agents@6.7.0 capture-browser-scenario <scenario.json>`. This is REA's Playwright browser scenario provider. Every observation below comes from those REA evidence bundles or from the screenshots they contain.
- Captures are **single-viewport** screenshots (1440×900 desktop, 390×844 mobile) plus the accessibility tree and DOM taken after a 2.5 s settle. No scrolling, hover or click interactions were captured on the reference sites. Hover effects, scroll-spy behaviour and animation timing on the reference sites were therefore **not observed** and are not described here.
- Raw captures (screenshots, scenario inputs) are kept locally in `research-evidence/`. That folder is git-ignored because it contains third-party content.

| Capture | Viewport | REA evidence ID |
|---|---|---|
| brittanychiang.com | 1440×900 | `ev_41170559207509cde93ade996e4f745a6f3c5bb64f1ad656f121f0a2afe768aa` |
| brittanychiang.com | 390×844 | `ev_986ff8ed9b4def7b2a63484e0e01fcc66ee697206120cd5fa9d39c2b8ef199fd` |
| leerob.com | 1440×900 | `ev_6da12632c552bada2303e2197133a47f504f58fd1b00319805f2a88dc1a8dcd2` |
| leerob.com | 390×844 | `ev_ea25e3aac92ac5be129002cd697c20051567bf3907ca01b8c204f9bc7573c250` |

## Observations

### brittanychiang.com
- **Hierarchy / hero:** desktop is a two-column split. A fixed left column holds the name (largest type on the page), a role line and a one-sentence statement. The right column scrolls the long-form content.
- **Navigation:** in-page jump links (About / Experience / Projects) sit in the left column. In the screenshot the active item is marked by a longer horizontal rule and brighter text. Social icon links are pinned near the bottom of the left column.
- **Accessibility tree:** a "Skip to Content" link comes first, then `banner` with h1 (name) and h2 (role), a named `navigation`, and `main` with named `region`s ("About me", "Work experience", "Selected projects"), each with an h2. Every external link announces "(opens in a new tab)".
- **Typography & colour:** one sans-serif family on a deep navy background. Body text is a desaturated blue-grey, with emphasis in bright white. A single teal accent appears in tech-tag pills.
- **Experience pattern:** a date column on the left and title, description and tag pills on the right.
- **Mobile:** the split collapses to one column. The name, role and statement come first, with social icons directly under them; section labels become small uppercase headings.

### leerob.com
- **Hierarchy:** a minimal, text-first page. The h1 is a handle ("@leerob") in a serif face, followed by a short bio, link lists ("Notes") and a dated list ("Blogs"). A large illustration fills the right column on desktop.
- **Navigation:** no global nav bar was observed in the captured viewport. A small tab control (Default / Long) switches the bio length.
- **Accessibility tree:** a `main` with named `region`s ("Biography", "Notes", "Blogs") and h2 headings.
- **Typography & colour:** serif throughout on a near-black warm background, with underlined links in a muted grey. List rows are separated by hairline rules, with dates right-aligned.
- **Mobile:** single column; the illustration is not shown in the mobile viewport.

## Principles extracted, not layouts copied

1. **The name is the single dominant element**, with a short verifiable statement under it.
2. **Semantic skeleton:** a skip link, landmark regions, one h1, an h2 per section, and "(opens in a new tab)" on external links.
3. **Hairline rules and quiet metadata** (dates, counts) in a smaller, muted face to separate content without boxes everywhere.
4. **One restrained accent colour**, used for state and emphasis only.
5. **Mobile collapses to a single reading column** with identity first.

## Resulting identity (distinct from both references)

- **Palette:** warm graphite `#0d0e0c` with a chartreuse "signal" accent `#c9e46f`. This avoids both the navy/teal and the monochrome-serif looks.
- **Type:** Bricolage Grotesque for display, Be Vietnam Pro for body (chosen for full Vietnamese diacritic support, e.g. "Võ Quang Triều"), and JetBrains Mono for metadata and labels.
- **Layout:** a sticky top bar (not a fixed side column) and a full-width editorial hero with a masked grid texture. A **"verified facts" ledger card** shows the GitHub data source and its live/cached status. This motif reflects the site's data-honesty rule rather than either reference.
- **Sections** are numbered `01–05` in mono. Project cards are whole-card links with a language-composition bar. The journey is a vertical timeline that labels each entry *from GitHub* or *self-reported*.
- **Motion:** a fade-up reveal on scroll and small arrow nudges on hover. Both are disabled under `prefers-reduced-motion`.

No source code, assets, illustrations, copy or branding from either site was reused.
