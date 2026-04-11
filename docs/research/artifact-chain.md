# Artifact Chain (Revised)

4-stage pipeline. Each stage reads artifacts from prior stages and writes new ones. The navigator infers pipeline state from what exists on disk.

## Stage 1: Brand (`/stardust:brand`)

**Input (human provides):**
- Brand guidelines PDF/URL
- Logo files (SVG/PNG)
- Optional: existing style guide

**Output:**
- `stardust/brand-profile.json` — colors, typography, spacing, voice
- `.impeccable.md` — design personality for quality gates
- `icons/` — logo + brand SVGs

**Delegates to:** brand-extractor, impeccable:teach

---

## Stage 2: Design System (`/stardust:design-system`)

Depends only on brand tokens, not on page structure. Can be built as soon as brand is extracted.

**Input:**
- `brand-profile.json` — brand tokens
- `.impeccable.md` — design personality

**Output:**
- `styles/styles.css` — CSS custom properties, base styles
- `styles/fonts.css` — @font-face declarations
- `fonts/` — font files
- `stardust/design-tokens.json` — structured token reference

**Delegates to:** brand-css-generator, impeccable:typeset, impeccable:colorize, impeccable:extract

---

## Stage 3: Experience Design (`/stardust:experience`)

Briefing (intent + messaging) and wireframe (unconstrained layout) are two faces of the same creative act. The designer works on both without thinking about EDS blocks.

**Input:**
- `brand-profile.json` — brand context, voice, content pillars
- `.impeccable.md` — design personality
- Conversation or structured brief from designer/marketer
- Optional: reference URLs, competitor sites

**Output:**
- `stardust/briefings/{page}.md` — intent, audience, messaging (human-authored)
- `stardust/wireframes/{page}.md` — unconstrained layout + content slots (EDS-unaware)

**Delegates to:** impeccable:shape, analyze-and-plan, identify-page-structure, page-decomposition

---

## Stage 4: Build (`/stardust:build`)

Reads wireframe + briefing, maps to EDS blocks (reuse or create), builds blocks via CDD, generates pages — all in one pass.

**Input:**
- `stardust/wireframes/{page}.md` — unconstrained page structure
- `stardust/briefings/{page}.md` — intent + messaging
- `stardust/design-tokens.json` + `styles/styles.css` — design system
- `.impeccable.md` — design personality
- `brand-profile.json` — voice for copy generation
- Existing `blocks/` — what's already available

**Output:**
- `stardust/block-manifest.json` — wireframe → EDS block mapping
- `stardust/content-models/*.md` — DA table contracts per block
- `blocks/{name}/{name}.js` — block JS (new or modified)
- `blocks/{name}/{name}.css` — block CSS (new or modified)
- `drafts/{page}.html` — full pages with real content
- DA-ready content (if DA integration enabled)

**Delegates to:** content-driven-development, building-blocks, testing-blocks, content-modeling, generative-page-pipeline, ai-image-generator, da-content-pipeline

---

## Navigator (`/stardust`)

The navigator reads, never writes. It checks for artifacts and tells the user where they are in the pipeline. It never creates or modifies them — it just reads and recommends.

**Entry at any point:** If a user already has a design system, they can skip to Experience Design. If they have wireframes and briefings ready, they can go straight to Build.

**All pipeline state lives under `stardust/`** — brand profile, wireframes, briefings, content models, design tokens, block manifest. EDS artifacts go to their standard paths (`styles/`, `blocks/`, `drafts/`). The pipeline metadata is cleanly removable without touching the site.
