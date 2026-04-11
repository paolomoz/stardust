# Stardust Pipeline Design

A skill-based pipeline for creating AEM Edge Delivery Services websites from brand guidelines through generated experiences. Ships as a standalone Claude Code / SLICC plugin that composes three skill layers: superpowers (process), impeccable (design), and Adobe EDS skills (production).

## Target User

Designers and marketers who know their brand but not EDS. They bring guidelines and briefings; the pipeline handles the technical translation. They should never need to think about `.plain.html`, block decoration, or content-driven development directly.

## Architecture: Navigator + Independent Stages

A thin navigator skill assesses project state and guides users to the right stage. Each stage is independently invocable — the navigator is optional. Experts bypass it; non-technical users follow it.

The navigator is **stateless**. It reads artifacts on disk to determine where the project is in the pipeline. If you manually create a `brand-profile.json`, the navigator picks it up. No state machine, no sync issues.

### Pipeline Stages

```
Brand → Design System → Experience Design → Build → Refine
  1          2                 3              4        5
```

**4 core stages + 1 post-build refinement stage.** Entry at any point — each stage checks for its required inputs and either proceeds or tells the user what's missing.

## Three-Layer Skill Composition

Each stardust skill is a thin orchestrator that composes skills from three layers:

| Layer | Role | Skills |
|-------|------|--------|
| **Superpowers** | Process — how the agent works | brainstorm, write-plan, execute-plan, parallel-agents, verification, debugging, code-review |
| **Impeccable v2** | Design — how the agent designs | /teach, /shape, /craft, /audit, /critique, /bolder, /quieter, /delight, /animate, /polish |
| **Stardust + Adobe EDS** | Production — what the agent produces | brand-extractor, brand-css-generator, content-driven-development, content-modeling, building-blocks, generative-page-pipeline, ai-image-generator, da-content-pipeline |

A stardust skill's code is mostly: read artifacts → decide what to delegate → render visual output → gate on human or agent approval.

## Skill Inventory

### `/stardust` — Navigator

Reads `stardust/` directory to assess project state. Reports what exists, what's missing, recommends next stage. Stateless — infers everything from artifacts on disk.

- **Reads:** all `stardust/` artifacts + `blocks/` + `styles/`
- **Writes:** nothing
- **Delegates:** recommends which skill to invoke

### `/stardust:brand` — Stage 1

Extracts brand from guidelines input (URL, PDF, or conversation). Produces structured tokens + design personality + visual brand board. Human approves the board.

- **Input:** brand guidelines (PDF, URL, or conversation)
- **Output:** `stardust/brand-profile.json`, `.impeccable.md`, `stardust/brand-board.html`, `icons/`
- **Composes:**
  - Superpowers: `/brainstorm` drives brand discovery when no PDF exists
  - Impeccable: `/teach` captures design personality into `.impeccable.md`
  - EDS: `brand-extractor` pulls structured tokens
- **Gate:** Human approves brand board (hard gate)

### `/stardust:design-system` — Stage 2

Translates brand tokens into EDS CSS. Generates custom properties, font-face declarations, base styles. Runs agent critique automatically — designer sees only the polished result via dev server.

- **Input:** `brand-profile.json`, `.impeccable.md`
- **Output:** `styles/styles.css`, `styles/fonts.css`, `fonts/`, `stardust/design-tokens.json`
- **Composes:**
  - Superpowers: `/verification` checks CSS against brand tokens
  - Impeccable: `/typeset` + `/colorize` refine type and color; `/critique` catches banned patterns
  - EDS: `brand-css-generator` generates CSS
- **Gate:** Agent automatic (critique/audit fix issues before designer sees result)

### `/stardust:experience` — Stage 3

Takes a human-authored briefing and runs UX discovery per page to produce visual wireframes. Renders wireframes as HTML (grey or branded depending on design system availability). Human approves the wireframe.

- **Input:** `stardust/briefings/*.md`, `brand-profile.json`, `.impeccable.md`
- **Output:** `stardust/wireframes/*.html`
- **Composes:**
  - Superpowers: `/brainstorm` explores page concepts; `/write-plan` plans multi-page information architecture
  - Impeccable: `/shape` runs UX discovery per page, produces design brief
  - EDS: `analyze-and-plan`, `identify-page-structure` for reference site analysis
- **Gate:** Human approves wireframe (hard gate)

### `/stardust:build` — Stage 4

Maps wireframe sections to EDS blocks (reuse or create). Runs `/craft` per block through CDD. Generates page content from briefing + brand voice. Runs `/audit` at the end.

- **Input:** `stardust/wireframes/*.html`, `stardust/briefings/*.md`, `stardust/design-tokens.json`, `brand-profile.json`, `.impeccable.md`, existing `blocks/`
- **Output:** `stardust/block-manifest.json`, `stardust/content-models/*.md`, `blocks/{name}/{name}.js`, `blocks/{name}/{name}.css`, `drafts/{page}.html`
- **Composes:**
  - Superpowers: `/write-plan` plans build order; `/execute-plan` manages block-by-block execution; `/parallel-agents` builds independent blocks concurrently; `/debugging` handles failures
  - Impeccable: `/craft` drives visual build loop per block; `/audit` scores quality 0-20 across 5 dimensions, auto-fixes P0-P1
  - EDS: `content-driven-development`, `content-modeling`, `building-blocks`, `testing-blocks`, `generative-page-pipeline`, `ai-image-generator`
- **Gate:** Human reviews final pages (hard gate, with refinement skills available)

### `/stardust:refine` — Post-build

Designer-driven refinement and publishing. Maps natural feedback ("make this bolder," "too busy") to the right impeccable command. Handles DA content pipeline, preview URLs, PageSpeed. This stage is **iterative** — the designer stays in a feedback loop until satisfied, then triggers publish.

- **Input:** designer feedback + built pages
- **Output:** modified blocks/styles, DA content, preview URLs
- **Composes:**
  - Superpowers: `/code-review` reviews blocks before shipping; `/verification` checks pages match wireframe intent
  - Impeccable: `/bolder`, `/quieter`, `/delight`, `/animate`, `/polish` — designer feedback vocabulary
  - EDS: `da-content-pipeline`, `pagespeed-audit`

## Artifact Chain

All pipeline state lives under `stardust/`. EDS artifacts go to their standard paths (`styles/`, `blocks/`, `drafts/`). The pipeline metadata is cleanly removable without touching the site.

```
stardust/
  brand-profile.json       ← structured brand tokens (colors, fonts, spacing, voice)
  brand-board.html         ← visual brand board for designer approval
  design-tokens.json       ← structured token reference for CSS generation
  block-manifest.json      ← wireframe → EDS block mapping
  briefings/
    _site.md               ← site-wide: sitemap, nav, shared messaging
    homepage.md            ← page-level: intent, audience, tone, CTAs
    products.md
  wireframes/
    homepage.html          ← visual wireframe (grey or branded)
    products.html
  content-models/
    hero.md                ← DA table contract per block
    columns.md

.impeccable.md             ← design personality (at project root)
styles/styles.css          ← CSS custom properties, base styles
styles/fonts.css           ← @font-face declarations
fonts/                     ← font files
blocks/{name}/{name}.js    ← block JavaScript
blocks/{name}/{name}.css   ← block CSS
drafts/{page}.html         ← generated pages with real content
```

## Visual Artifacts

Design principle: **if the designer can't see it, they don't have to know it exists.**

Every stage that produces artifacts the designer cares about renders them as visual HTML:

| Stage | Visual Artifact | Description |
|-------|----------------|-------------|
| Brand | `brand-board.html` | Full-depth brand board with sticky nav: philosophy, logo (variants, clear space, do/don't), colors (primary/secondary/web), typography (full hierarchy with specimens), photography direction, voice (traits, examples, rules), tone adaptation, content pillars, personas with stats, spacing scale |
| Design System | Dev server at localhost:3000 | Live site with real brand styles applied |
| Experience Design | `wireframes/*.html` | Visual wireframes — grey boxes if no design system, brand-styled if tokens available. Unconstrained by EDS block types. |
| Build | `drafts/*.html` | Actual rendered pages served via dev server |
| Refine | Preview URLs | Branch deploy at `{branch}--{repo}--{owner}.aem.page` |

Machine-readable artifacts (`brand-profile.json`, `design-tokens.json`, `data-` attributes in wireframe HTML) exist for the agent but the designer never interacts with them directly.

## Briefing Format

Briefings are human-authored structured documents. The agent never generates them (it may help draft through conversation, but the designer owns the content).

```markdown
---
page: Homepage
path: /
type: landing
---

# Intent
First impression for the brand. Establish emotional connection,
communicate core value proposition, drive visitors toward product exploration.

# Audience
Health-conscious home cooks, ages 28-55.
Value quality, sustainability, and simplicity.

# Key Messages
1. Professional-grade power, home-kitchen simplicity
2. Built to last — not disposable
3. Unlock recipes you didn't think were possible

# Calls to Action
- Primary: Explore Products
- Secondary: Browse Recipes

# Tone
Confident but warm. Aspirational without being preachy.
```

For multi-page sites, `_site.md` captures cross-cutting concerns (sitemap, navigation, shared messaging). Page briefings inherit from it.

## Wireframe Format

Wireframes are visual HTML — not markdown, not structured data. The designer sees a rendered page in their browser and iterates visually.

**Two fidelity modes:**
- **Grey mode** (no design system yet): pure layout — grey boxes, placeholder bars, structural shapes. Shows section order, relative sizing, content density.
- **Branded mode** (design system present): same structure, styled with brand colors, real fonts, copy direction.

**The visual IS the spec.** Wireframe HTML uses semantic `data-` attributes (`data-section`, `data-intent`, `data-layout`) so the Build stage can parse structure directly. No separate structured file needed.

**Unconstrained by EDS.** The wireframe says "interactive recipe calculator" or "before/after comparison slider" — not "columns block variant." The Build stage maps these to EDS blocks.

**Wireframe metadata** links to its briefing via a `<script type="application/json">` tag in the HTML.

## Quality Gates

### Human gates (subjective decisions)
1. **Brand board approval** — after `/teach` + brand-extractor render the board. Only the brand owner can validate extraction accuracy.
2. **Wireframe approval** — after `/shape` renders visual wireframe HTML. Only the designer knows if the layout communicates their intent.
3. **Final page review** — after `/craft` + `/audit` complete. Refinement skills available as feedback vocabulary.

### Agent gates (objective checks)
1. **Design system critique** — `/critique` + `/audit` after CSS generation. Checks: banned fonts, color contrast (WCAG AA), spacing consistency, responsive breakpoints, typographic hierarchy. Designer sees only the polished result.
2. **Build quality loop** — `/craft` iterates visually per block until production-grade. `/audit` scores 0-20 across 5 dimensions (accessibility, performance, theming, responsive, anti-patterns). P0-P1 issues fixed automatically. P2-P3 presented to designer.

**The rule:** The agent never asks the designer to check something it can verify itself. The designer never waits while the agent debates something only a human can judge.

## Platform Abstraction

Skills are written for Claude Code conventions (Read/Write/Edit/Bash tools). SLICC maps these to its VFS and shell via skill discovery.

| Capability | SLICC | Claude Code |
|---|---|---|
| Filesystem | VFS (IndexedDB-backed) | Real filesystem |
| Browser | Native CDP — agent sees localhost directly | Playwright via npm, or user opens URL |
| Visual artifacts | Rendered in same browser tab | Visual companion server or dev server |
| Shell | 78+ Unix commands, bash pipelines | Full Bash tool |

**Abstraction strategy: thin, not deep.** No platform abstraction layer in stardust skills. The platform handles translation. The only skill-level awareness needed: "can I take a screenshot automatically, or do I need to ask the user?"

## Dependencies

The stardust plugin depends on these as peer plugins:
- **superpowers** — process methodology
- **impeccable** (v2+) — design methodology
- **aem-edge-delivery-services** — EDS block development skills
- **eds-site-builder** — brand extraction, CSS generation, content pipeline, image generation
- **frontend-design** — (optional) additional frontend patterns

## Open Questions Resolved

1. **Pipeline architecture** — Navigator + Independent Stages. Navigator is stateless, reads artifacts on disk.
2. **Skill design** — 6 skills in a standalone plugin. Each is a thin orchestrator composing three layers.
3. **Artifacts** — All pipeline state under `stardust/`, EDS artifacts in standard paths.
4. **Quality gates** — Human gates for subjective (brand, wireframe, final), agent gates for objective (critique, audit). P0-P1 auto-fixed, P2-P3 presented.
5. **Wireframe format** — Visual HTML, unconstrained by EDS blocks. Grey or branded fidelity. The visual IS the spec.
6. **Briefings** — Human-authored markdown with minimal schema (intent, audience, messages, CTAs, tone). Agent helps draft but designer owns.
