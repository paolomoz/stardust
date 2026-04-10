# Existing Pipeline Analysis

Deep analysis of the three main pipeline frameworks that inform our design.

## 1. EDS Website Builder (eds-site-builder plugin)

Source: /Users/paolo/.claude/plugins/cache/paolomoz-skills/eds-site-builder/

### The 12-Phase Pipeline

```
Phase 1:  Project Setup         — Clone boilerplate, connect GitHub, configure fstab.yaml, npm install
Phase 2:  Brand Analysis        — Screenshot 10-20 pages, create visual design analysis + brand voice doc
Phase 3:  Design Foundation     — CSS custom properties, fonts, buttons, block tokens
Phase 4:  Content Planning      — Product briefing, page structure, content models, BLOCK-REFERENCE.md
Phase 5:  Block Development     — JS decoration + CSS styling per block
Phase 6:  AI Image Generation   — Style prefix + generation script + CDN deployment (Cloudflare Pages)
Phase 7:  Content Authoring     — .plain.html in drafts/ or DA
  7a: Sequential (<6 pages)     — Single agent maintains context
  7b: Parallel (>6 pages)       — Spawn parallel agents with shared context bundle
Phase 8:  DA Integration        — Service token auth, upload, preview trigger
Phase 9:  Universal Editor      — Component definitions for WYSIWYG (optional)
Phase 10: Three-Phase Loading   — Eager/Lazy/Delayed optimization
Phase 11: Testing & Quality     — Linting, CI/CD, PageSpeed 100, WCAG AA
Phase 12: Deployment            — Branch preview → PR → merge → production
```

### Strengths
- Comprehensive end-to-end coverage
- Parallel agent spawning for content generation (Phase 7b)
- Validation scripts between phases (CDN reachability, no local paths, structural checks)
- DA integration with IMS auth
- Image CDN deployment pattern

### Weaknesses / Gaps
- **No explicit wireframing step** — Jumps from brand analysis to design foundation
- **No design system as distinct artifact** — Tokens live directly in styles.css, no extractable system
- **No impeccable integration** — Quality relies on linting and PageSpeed, not design critique
- **Brand analysis is screenshot-based** — Requires existing pages to screenshot, not brand guidelines input
- **No briefing generation** — Expects user to provide product briefing, doesn't help create one
- **Monolithic orchestrator** — 12 phases in one skill makes it hard to enter at any point

### Key Patterns to Reuse
- **Shared context bundle** for parallel agents (CDN base URL, site prefix, accordion content, metadata pattern, block reference, reference example)
- **Validation scripts** between phases
- **Block token naming**: `--{blockname}-{element}-{property}`
- **DA upload pattern**: FormData PUT with IMS auth
- **Image CDN pattern**: Cloudflare Pages deployment

---

## 2. Impeccable Pipeline

Source: /Users/paolo/.claude/plugins/cache/impeccable/impeccable/2.1.0

### The Workflow

```
/impeccable teach    → .impeccable.md (design context: audience, brand, aesthetic, principles)
        ↓
/shape               → Design brief (purpose, action, direction, layout, states, interactions, content)
        ↓
/impeccable craft    → Shape + build + visual iteration + present
        ↓
/critique            → Parallel LLM review + automated detection → combined report (Nielsen heuristics /40)
        ↓
/typeset, /colorize, /animate, /clarify, etc. → Targeted refinement
        ↓
/audit               → Technical quality scan (a11y, performance, theming, responsive, anti-patterns /20)
        ↓
/harden, /optimize, /polish → Production readiness
        ↓
/extract             → Design system extraction (tokens, components, patterns)
```

### Strengths
- **Context-first design** — Won't work without `.impeccable.md`
- **Anti-slop enforcement** — Banned fonts, patterns, and aesthetics with specific detection
- **Anti-attractor procedure** — Forces model to list reflex defaults then reject them
- **Parallel assessment** (critique) — LLM review + automated `npx impeccable` scanner
- **Persona-based testing** — 5 predefined personas (power user, first-timer, a11y-dependent, stress tester, mobile distracted)
- **Severity tagging** — P0-P3 with concrete fix recommendations
- **Reference files** — 7 domain-specific references (typography, color/OKLCH, spatial, motion, interaction, responsive, UX writing)

### Weaknesses / Gaps
- **No EDS awareness** — Designed for general frontend, not EDS blocks/sections/three-phase loading
- **No content modeling** — Shape produces a design brief, not a content model
- **No DA integration** — Outputs code, not authored content
- **No image generation** — Relies on placeholder or user-provided images
- **Single-feature focus** — Shape/craft target one feature at a time, not full site architecture

### Key Patterns to Reuse
- **`.impeccable.md` as persistent design context** — Survives across sessions
- **Font selection procedure** — Write 3 brand words → list reflex fonts → reject all → browse fresh → cross-check
- **OKLCH for color** — Perceptually uniform, tinted neutrals
- **60-30-10 color rule** — Visual weight distribution
- **4pt spacing scale** — 4, 8, 12, 16, 24, 32, 48, 64, 96
- **Craft visual iteration loop** — Match brief → AI slop test → DON'Ts → states → responsive → details
- **Audit 5-dimension scoring** — Comparable across projects
- **Critique persona testing** — Concrete red flags per persona

### Critical Anti-Patterns (Enforced)
- **BANNED fonts**: Inter, Roboto, Arial, system fonts, Space Grotesk/Mono, DM Sans/Serif, Fraunces, Newsreader, Syne, IBM Plex, Outfit, Plus Jakarta Sans, Instrument Sans/Serif
- **BANNED patterns**: Side-stripe borders on cards, gradient text (background-clip: text), glassmorphism decorative, nested cards, bounce/elastic easing, hero metric layouts, identical card grids
- **BANNED colors**: Purple-to-blue gradients, neon glows on dark, cyan-on-dark

**Note**: The boilerplate ships with Roboto — this MUST be replaced as part of brand definition.

---

## 3. Adobe Content-Driven Development (adobe-eds plugin)

Source: /Users/paolo/.claude/plugins/cache/adobe-skills/aem-edge-delivery-services/1.0.0

### The CDD Workflow

```
Step 1: Start Dev Server        — Verify localhost:3000 responds
Step 2: Analyze & Plan          → analyze-and-plan skill → acceptance criteria
Step 3: Design Content Model    → content-modeling skill → table structure (max 4 cells/row)
Step 4: Identify/Create Content → find-test-content OR create drafts/ OR CMS authoring
Step 5: Implement               → building-blocks skill → JS decoration + CSS
Step 6: Lint & Test             → npm run lint + npm test
Step 7: Final Validation        → Browser check (mobile/tablet/desktop), acceptance criteria
Step 8: Ship It                 → Feature branch, commit, push, PR with preview URL
```

### Content Modeling: 4 Canonical Patterns
1. **Standalone** — Unique visual elements (Hero, Blockquote). One content area.
2. **Collection** — Repeating items (Cards, Carousel). Each row = one item.
3. **Configuration** — API-driven content (Blog Listing). Key/value pairs.
4. **Auto-Blocked** — Pattern detection (Tabs, YouTube). Sections with metadata.

### Building Blocks: Key Rules
- **Re-use existing DOM elements** — Don't create from scratch when possible
- **Platform delivers `<picture>` elements** — Don't build your own image wrappers
- **Check variants from classList** — CSS-only variants handled in CSS, JS-affecting variants checked in JS
- **Selectors scoped to block** — `main .my-block .item`, never `.item` alone
- **Mobile-first** — Default styles for mobile, `@media (width >= 600px)` for tablet, `>= 900px` for desktop
- **No `-container`/`-wrapper` classes** — Reserved for EDS sections

### Testing Blocks: Mandatory Browser Testing
- **3 viewports**: Mobile 375px, Tablet 768px, Desktop 1200px
- **Console check** at each viewport
- **Options**: Playwright MCP, temporary Playwright script, or manual dev tools
- **Unit tests only for**: logic-heavy functions, utilities, data processing, API integrations
- **Skip unit tests for**: DOM manipulation, CSS-only, straightforward decoration

### Page Import Pipeline

```
Step 1: scrape-webpage           → metadata.json, screenshot.png, cleaned.html, images/
Step 2: identify-page-structure  → Section boundaries, content sequences
Step 3: authoring-analysis       → Default content vs block decisions per sequence
Step 4: generate-import-html     → EDS HTML file with sections, blocks, metadata
Step 5: preview-import           → Local preview, compare against screenshot
```

### Strengths
- **Content-first methodology** — Content model before implementation
- **Mandatory browser testing** — No shipping without visual verification
- **Block Collection reference** — Community patterns to learn from
- **David's Model compliance** — Author experience over developer convenience
- **Well-structured acceptance criteria** — analyze-and-plan produces clear criteria

### Weaknesses / Gaps
- **No brand awareness** — Doesn't know about brand guidelines
- **No design system** — Blocks styled individually, no token system
- **No design quality gates** — Testing is functional, not aesthetic
- **No content generation** — Expects authored content, doesn't create it
- **Single-block focus** — CDD operates on one block at a time, not full pages

### Key Patterns to Reuse
- **Content modeling as explicit step** — Before implementation, always
- **4 canonical block patterns** — Standalone, Collection, Configuration, Auto-Blocked
- **Test content in drafts/** — `--html-folder drafts` for local dev
- **3-viewport mandatory testing** — 375/768/1200
- **PR with preview URL** — `https://{branch}--{repo}--{owner}.aem.page/{path}`

---

## Synthesis: How the Three Pipelines Complement Each Other

```
                    Impeccable                Adobe CDD              EDS Website Builder
                    ----------                ---------              -------------------
Brand Input         .impeccable.md            (none)                 BrandProfile JSON
                    teach interview                                  screenshot analysis

Design Planning     /shape brief              analyze-and-plan       content planning
                                              content-modeling       briefing

Implementation      /craft (build)            building-blocks        block development
                                              (CDD 8-step)

Quality             /critique (design)        testing-blocks         linting + PageSpeed
                    /audit (technical)         code-review
                    persona testing            browser testing

Content             (none)                    (manual authoring)     generative pipeline
                                                                     conversational builder

Deployment          (none)                    git + PR               DA upload + preview
```

### What the Combined Pipeline Needs

1. **Brand input** → Impeccable's `.impeccable.md` + EDS Builder's BrandProfile. Need both: `.impeccable.md` for design context, BrandProfile for structured tokens.

2. **Design planning** → Impeccable's `/shape` for UX brief + Adobe's `content-modeling` for block structure. Need both: shape for visual direction, content model for author experience.

3. **Design system** → Missing explicit step. Currently tokens go directly into `styles.css`. Need an intermediate artifact that can be reviewed, refined, and applied consistently.

4. **Implementation** → Adobe's CDD for block mechanics + Impeccable's craft for visual quality. The build step should follow CDD structure but use impeccable principles.

5. **Quality** → Impeccable's critique/audit for design + Adobe's testing-blocks for browser. Both are needed at different points.

6. **Content** → EDS Builder's generative pipeline for scale + Impeccable's quality for copy. Content generation needs brand voice enforcement.

7. **Deployment** → EDS Builder's DA pipeline for publishing. No gaps here.
