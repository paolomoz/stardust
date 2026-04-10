# Prior Art: Lessons Learned

## 1. SLICC Website Build (Paolo's Experience)

Source: /Users/paolo/playground/ai-ecoverse/slicc-website/design/design-journal.md
Source: /Users/paolo/playground/ai-ecoverse/slicc-website/design/eds-migration-journal.md
Source: /Users/paolo/playground/ai-ecoverse/slicc-website/docs/superpowers/

### Process Used

```
Competitive analysis (9 dev tool sites)
  → Brand positioning (tagline, tone, differentiation)
  → Font selection (26 fonts evaluated, Space Grotesk + Space Mono chosen)
  → Color palette (Adobe accent colors remixed)
  → Wireframing (sitemap, section hierarchy)
  → Audacity pivot (tone inversion to bold/irreverent)
  → Section-by-section design in static HTML
  → Impeccable critique on each section
  → Clarity passes (2 rounds of user feedback)
  → EDS migration (static HTML → EDS blocks)
  → Pixel-perfect verification (Playwright computed style comparison)
  → PR review & polish
```

### What Worked

1. **Competitive benchmarking** — Analyzed 9 sites to identify patterns and anti-patterns before designing
2. **One-line tagline as north star** — "Your browser. Every workflow." guided all decisions
3. **Content-thin blocks** — Static page was ~95% bespoke interactive, ~5% editable copy. Each block authored simple content table; `decorate()` JS rebuilt full visual structure
4. **Local test content** — `drafts/homepage.plain.html` with all sections. Faster than DA API
5. **CDD workflow per block** — Test content → decorate() JS → port CSS → visual check → computed style comparison → mobile check → lint → commit
6. **Pixel-perfect verification** — Playwright MCP to compare every computed style value between static reference and EDS version
7. **Section-level CSS for full-bleed** — `.section.full-bleed > div { max-width: none; padding: 0; }` instead of fighting block-level containers
8. **Impeccable section-by-section critique** — Each section extracted to standalone HTML, critiqued, then brought back with fixes. Prevented design fragmentation

### What Failed / Lessons Learned

1. **Scoop-O letters with googly eyes** — Clever but read as unintentional. Lesson: personality must never compromise clarity on first contact
2. **Hero shader iterations** — 16 variations, all removed. Lesson: don't fill white space with animations; clean background lets text speak
3. **Terminal window chrome in footer** — Most overused AI-slop pattern. Lesson: raw stdout is more authentic than fake terminal
4. **Four identical bit layouts** — Copy did all the work. Lesson: every section needs unique visual composition
5. **Use cases as simple 2x2 grid** — Undersold hero capabilities. Lesson: use two-tier hierarchy for emphasis
6. **Platforms behind tabs** — Hiding content behind tabs added complexity with no benefit. Lesson: show everything if it fits
7. **Five-column bento grid** — Conservative layout despite promising "weird." Lesson: commit to the aesthetic claim

### Key Design Principles Distilled

- **Clarity first on first contact, personality deepens with scroll depth**
- **Show, don't tell** — visual proof, not claims
- **Asymmetric design defeats AI slop** — never repeat identical card grids
- **Materials differentiate sections** — different visual "materials" (browser chrome, terminal, document, ASCII art, cards) prevent section blur
- **Personality requires precision** — 1px differences matter

### EDS Migration Technical Lessons

- **Option A wins over Option B**: Rebuild exact markup (clear innerHTML, reconstruct) produces cleaner DOM than adapting CSS to EDS row/cell divs
- **decorateButtons() runs before block decorate()**: Block code must check for both original markup (`strong > a`) and decorated class (`a.button.primary`)
- **CSS animations over setInterval**: For visual effects (blinks, pulses), use CSS keyframes — zero JS overhead
- **`<button>` not `<a href="#">`**: Interactive elements that trigger behavior need button semantics
- **ARIA tabs required**: Any tab-style UI needs full ARIA pattern (roles, aria-selected, keyboard nav)
- **IntersectionObserver gates event listeners**: Never attach permanent scroll/resize listeners from a block
- **Event delegation for dynamic content**: Use delegation on stable ancestor for rebuilt innerHTML
- **Section-level CSS > block-level CSS**: Full-bleed, backgrounds, no-top-padding are section concerns
- **DA token scoping**: Use user-scoped IMS token from `adobeIMS.getAccessToken()`, not service tokens scoped to different orgs
- **Dev server restart after fstab.yaml changes**

### EMA Landing Page (Subpage Using Block Library)

Source: /Users/paolo/playground/ai-ecoverse/slicc-website/docs/superpowers/plans/2026-03-27-ema-landing-page.md

- **Block variants for different contexts** — Hero and video blocks reused with `simple` variants
- **5 of 6 sections reused existing blocks**, only 1 new block needed
- **Professional tone for different audience** — Same library, different variant choices and CSS theming
- **Subagent-driven development** — 7 discrete tasks with clear ownership, test steps, commit messages

---

## 2. Gabriel's Demo: React Page → EDS via SLICC

Source: /Users/paolo/Desktop/ema-design-publish-summit-page.mp4
Transcript: provided in conversation
Frames extracted: /tmp/ema-frames/ and /tmp/ema-detail/

### What Was Built

An "Adobe Summit Portal" — personalized performance report page ("Hello, Erika!") showing Nike's digital metrics. Originally a React/TypeScript client-side app with:
- Hero with personalized greeting and key stats (54.3M visits, 22/100 perf score, 3.8M AI mentions, 400k metrics)
- Tabbed navigation (Executive overview, Marketer insights, IT/Engineering learnings)
- Carousel slides with data visualizations (bar charts, donut charts, line charts)
- "Download full report" CTA
- Dark mode support

### The Workflow

**Step 1: Content Pre-work (Martin, human)**
Martin (EDS expert) broke down the design into EDS table structures in DA:
- `report-hero (insight)` — personalized greeting + stats
- `report-stats (dark)` — key metrics with status indicators
- `report-carousel` — tabbed content with chart types specified as table columns (columnchart, donutchart, barchart, linechart, speedometer)

Key insight: **The content modeling was done by a human EDS expert**, not the agent. Martin understood what data each visualization needed and structured the tables accordingly.

**Step 2: SLICC Migration from Localhost**
Gabriel used SLICC browser extension with "site migration" sprinkle. The React app was running on localhost — not publicly deployed. SLICC migrated it directly from the browser tab.

**Step 3: Content Structure Refinement in Chat**
After migration, Gabriel used free-form chat (not the migration sprinkle) to tell SLICC:
"I want the content structure to be exactly like that, so refactor everything so that I have this content structure, and all the blocks follow this convention."

The agent refactored blocks to match Martin's DA table structure. It worked through EDS framework loading, block decoration, and `fetchIndex` queries.

**Step 4: Files Downloaded from SLICC VFS**
SLICC's browser VFS contains all generated files. Gabriel downloaded them as a zip and continued in the AEM Coder site modernization console.

**Step 5: Continued Refinement in AEM Coder**
Further prompting for:
- Responsive behavior
- Visual improvements
- Animations
- Dark mode CSS variables (`light-scheme` / `dark-scheme` classes)
- Chart rendering

**Step 6: Published to AEM**
Final result on `*.aem.live` with full dark mode, animated data visualizations, responsive carousel, all working.

### Key Takeaways

1. **Content structure is king** — Martin's pre-work (content modeling by an EDS expert) was the critical enabler. The agent built blocks to match the structure, not the other way around.

2. **Localhost migration** — SLICC doesn't need a public URL. This is huge for iterating on designs.

3. **Two-phase workflow**: Structured migration (sprinkle) gets 70%, then free-form chat refinement gets to 95%.

4. **Cross-tool portability**: SLICC VFS → zip → AEM Coder console. Files move between tools.

5. **"Any design task, not just migrations"** — Gabriel's closing point. Same agent + skills approach works for greenfield design.

6. **Dark mode was added via prompting** — Not designed in; added post-migration by asking the agent to add CSS variables and a toggle.

7. **Complex data visualizations** — Charts (bar, donut, line, speedometer) were all built as EDS blocks with vanilla JS/CSS. No charting library.

8. **Gabriel estimated "a few hours yesterday evening"** — React page with complex data viz → fully responsive EDS site with dark mode in one session.

### What's Missing from Gabriel's Demo (For Our Flow)

- **No brand guidelines step** — The design was migrated from an existing React app, not created from brand guidelines
- **No wireframing step** — The wireframe was the existing page
- **No design system extraction** — CSS was derived from the source, not from brand tokens
- **No briefing-driven content** — Content was pre-structured by Martin, not generated from a briefing
- **No quality gates** — No impeccable critique or audit during the process

These are exactly the gaps our pipeline needs to fill.
