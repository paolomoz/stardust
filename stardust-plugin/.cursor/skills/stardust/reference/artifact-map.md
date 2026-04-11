# Stardust Artifact Map

All pipeline state lives under `stardust/`. EDS artifacts go to standard paths.

## Pipeline Artifacts

### Stage 1: Brand (`/stardust:brand`)

| Artifact | Path | Format | Description |
|----------|------|--------|-------------|
| Brand Profile | `stardust/brand-profile.json` | JSON | Structured brand tokens: colors, typography, spacing, voice, photography, personas |
| Design Personality | `.impeccable.md` | Markdown | Design context for impeccable quality gates (project root) |
| Brand Board | `stardust/brand-board.html` | HTML | Visual brand board for designer approval |
| Logo Assets | `icons/` | SVG/PNG | Logo variants, brand icons |

**Required input:** Brand guidelines (PDF, URL, or conversation)
**Human gate:** Designer approves brand board

### Stage 2: Design System (`/stardust:design-system`)

| Artifact | Path | Format | Description |
|----------|------|--------|-------------|
| Base Styles | `styles/styles.css` | CSS | Custom properties, base typography, layout |
| Font Definitions | `styles/fonts.css` | CSS | @font-face declarations |
| Font Files | `fonts/` | WOFF2/WOFF | Web font files |
| Design Tokens | `stardust/design-tokens.json` | JSON | Structured reference of all CSS custom properties |

**Required input:** `stardust/brand-profile.json`, `.impeccable.md`
**Agent gate:** Automatic critique/audit before designer sees result

### Stage 3: Experience Design (`/stardust:experience`)

| Artifact | Path | Format | Description |
|----------|------|--------|-------------|
| Site Briefing | `stardust/briefings/_site.md` | Markdown | Cross-cutting: sitemap, nav, shared messaging |
| Page Briefings | `stardust/briefings/{page}.md` | Markdown | Per-page: intent, audience, messages, CTAs, tone |
| Wireframes | `stardust/wireframes/{page}.html` | HTML | Visual wireframes (grey or branded) |

**Required input:** `stardust/brand-profile.json`, `.impeccable.md`, briefings authored by designer
**Human gate:** Designer approves wireframe

### Stage 4: Build (`/stardust:build`)

| Artifact | Path | Format | Description |
|----------|------|--------|-------------|
| Block Manifest | `stardust/block-manifest.json` | JSON | Wireframe → EDS block mapping |
| Content Models | `stardust/content-models/{block}.md` | Markdown | DA table contract per block |
| Block JS | `blocks/{name}/{name}.js` | JavaScript | Block decoration code |
| Block CSS | `blocks/{name}/{name}.css` | CSS | Block styles |
| Test Content | `drafts/blocks/{name}.html` | HTML | Test page per block |
| Generated Pages | `drafts/{page}.html` | HTML | Full pages with real content |

**Required input:** `stardust/wireframes/*.html`, `stardust/briefings/*.md`, `stardust/design-tokens.json`, `stardust/brand-profile.json`, `.impeccable.md`
**Human gate:** Designer reviews final pages

### Stage 5: Refine (`/stardust:refine`)

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
| `styles/styles.css` has custom properties (not boilerplate) | Design system: applied |
| `stardust/design-tokens.json` exists | Design tokens: exported |
| `stardust/briefings/` has `.md` files | Briefings: authored |
| `stardust/wireframes/` has `.html` files | Wireframes: created |
| `stardust/block-manifest.json` exists | Block mapping: done |
| `blocks/` has non-boilerplate blocks | Blocks: built |
| `drafts/` has page `.html` files | Pages: generated |
