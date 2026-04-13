# Stardust Artifact Map

All pipeline state lives under `stardust/`. EDS artifacts go to standard paths.

The pipeline has two phases:

- **Design phase** (EDS-agnostic): stages 1–4.
- **EDS phase** (implementation): stages 5–7.

## Design Phase

### Stage 1: Brand (`/stardust:brand`)

| Artifact | Path | Format | Description |
|----------|------|--------|-------------|
| Brand Profile | `stardust/brand-profile.json` | JSON | Structured brand tokens: colors, typography, spacing, voice, photography, personas |
| Design Personality | `.impeccable.md` | Markdown | Design context for impeccable quality gates (project root) |
| Brand Board | `stardust/brand-board.html` | HTML | Visual brand board for designer approval |
| Logo Assets | `icons/` | SVG/PNG | Logo variants, brand icons |

**Required input:** Brand guidelines (PDF, URL, or conversation)
**Human gate:** Designer approves brand board

### Stage 2: Briefings (`/stardust:briefings`)

| Artifact | Path | Format | Description |
|----------|------|--------|-------------|
| Site Briefing | `stardust/briefings/_site.md` | Markdown | Cross-cutting: sitemap, nav, shared messaging, content reuse map |
| Page Briefings | `stardust/briefings/{page}.md` | Markdown | Per-page intent. Fidelity spans prompt-only → structured → fully specified (with copy + imagery) |

**Required input:** None. Briefings are independent of brand extraction and can be authored before, after, or in parallel with `/stardust:brand`.
**Human gate:** User approves each briefing.

### Stage 3: Wireframes (`/stardust:wireframes`) — optional

| Artifact | Path | Format | Description |
|----------|------|--------|-------------|
| Wireframes | `stardust/wireframes/{page}.html` | HTML | Grey, structural wireframes — no brand colors, no real fonts |

**Required input:** `stardust/briefings/*.md`. Brand is **not** required — wireframes are intentionally pre-brand and focus on structure only.
**Human gate:** User approves each wireframe's structure.
**Optional:** users who already have a clear structural vision can skip this stage and go briefings → design.

### Stage 4: Design (`/stardust:design`)

| Artifact | Path | Format | Description |
|----------|------|--------|-------------|
| Designs | `stardust/designs/{page}.html` | HTML | Branded, high-fidelity static HTML per page — authoritative desktop tokens in `:root` |

**Required input:** `stardust/brand-profile.json` **AND** `stardust/briefings/*.md`. Optionally uses `stardust/wireframes/*.html` as structural input.
**Human gate:** User approves each design (iterative loop in the browser).
**Platform:** EDS-independent. The approved designs could in principle feed a non-EDS build.

## EDS Phase

### Stage 5: EDS Design (`/stardust:eds-design`)

| Artifact | Path | Format | Description |
|----------|------|--------|-------------|
| Base Styles | `styles/styles.css` | CSS | Custom properties, base typography, layout |
| Lazy Section Styles | `styles/lazy-styles.css` | CSS | Section style variants (dark, warm, highlight, etc.) |
| Font Definitions | `styles/fonts.css` | CSS | @font-face declarations |
| Font Files | `fonts/` | WOFF2/WOFF | Web font files |
| Design Tokens | `stardust/design-tokens.json` | JSON | Structured reference of all CSS custom properties, derived from approved designs |

**Required input:** `stardust/brand-profile.json`, `.impeccable.md`, approved designs in `stardust/designs/`
**Agent gate:** Automatic critique/audit before user sees result

### Stage 6: EDS Build (`/stardust:eds-build`)

| Artifact | Path | Format | Description |
|----------|------|--------|-------------|
| Block Manifest | `stardust/block-manifest.json` | JSON | Design → EDS block mapping |
| Content Models | `stardust/content-models/{block}.md` | Markdown | DA table contract per block |
| Block JS | `blocks/{name}/{name}.js` | JavaScript | Block decoration code |
| Block CSS | `blocks/{name}/{name}.css` | CSS | Block styles |
| Header CSS | `blocks/header/header.css` | CSS | Header styles updated for brand |
| Footer CSS | `blocks/footer/footer.css` | CSS | Footer styles updated for brand |
| Nav Fragment | `nav.plain.html` | HTML | Navigation fragment (project root, NOT drafts/) |
| Footer Fragment | `footer.plain.html` | HTML | Footer fragment (project root, NOT drafts/) |
| Test Content | `drafts/blocks/{name}.html` | HTML | Test page per block |
| Generated Pages | `drafts/{page}.plain.html` | HTML | Full pages — NO `<main>` wrapper |
| Placeholder Images | `drafts/media_*.{png,webp}` | Image | Branded gradient placeholders |

**Required input:** `stardust/designs/*.html`, `stardust/briefings/*.md`, `stardust/design-tokens.json`, `stardust/brand-profile.json`, `.impeccable.md`
**Human gate:** Designer reviews final pages

### Stage 7: EDS Refine (`/stardust:eds-refine`)

| Artifact | Path | Format | Description |
|----------|------|--------|-------------|
| DA Content | (DA/Google Docs) | - | Content pushed to Document Authoring |
| Preview URL | `https://{branch}--{repo}--{owner}.aem.page/` | URL | Branch deploy for review |

**Required input:** Designer feedback + built pages
**No gate:** Iterative until designer is satisfied

## Navigator Detection Logic

The navigator reads the filesystem and reports status per stage:

| Check | Status |
|-------|--------|
| `stardust/brand-profile.json` exists | Brand: complete |
| `.impeccable.md` exists | Design personality: set |
| `stardust/brand-board.html` exists | Brand board: rendered |
| `stardust/briefings/` has `.md` files | Briefings: authored |
| `stardust/wireframes/` has `.html` files | Wireframes: created (grey) — optional stage |
| `stardust/designs/` has `.html` files | Designs: created (branded) |
| `stardust/design-tokens.json` exists | EDS design tokens: exported |
| `styles/styles.css` has custom properties (not boilerplate) | EDS CSS: applied |
| `stardust/block-manifest.json` exists | Block mapping: done |
| `blocks/` has non-boilerplate blocks | Blocks: built |
| `nav.plain.html` exists at project root | Nav fragment: created |
| `footer.plain.html` exists at project root | Footer fragment: created |
| `drafts/` has page `.plain.html` files | Pages: generated |
