---
name: build
description: "Map wireframes to EDS blocks, build blocks via CDD, generate pages with real content. The main construction stage. Use when wireframes are approved and you're ready to build, or when /stardust recommends the build stage."
---

# Build

The heaviest stage. Map wireframe sections to EDS blocks, build new blocks through CDD, generate pages with real content from briefings.

## MANDATORY PREPARATION

1. Check that wireframes exist: `stardust/wireframes/*.html`. If not, tell the user to run `/stardust:experience` first.
2. Check that briefings exist: `stardust/briefings/*.md`. If not, tell the user to run `/stardust:experience` first.
3. Read `.impeccable.md` for design context.
4. Read `stardust/brand-profile.json` for brand voice (needed for content generation).
5. Check that design system is applied: `stardust/design-tokens.json` exists. If not, tell the user to run `/stardust:design-system` first.
6. Start the AEM dev server if not running: `npx -y @adobe/aem-cli up --no-open`

---

## Phase 1: Analyze Wireframes

For each wireframe in `stardust/wireframes/`:

1. Parse the HTML, extracting all `<section>` elements with their `data-` attributes
2. For each section, consult [wireframe-to-eds.md](reference/wireframe-to-eds.md) to determine the EDS block mapping
3. Check existing `blocks/` directory — inventory what's already available
4. Produce `stardust/block-manifest.json` with the mapping: which wireframe sections map to which blocks, which blocks exist, which need to be created

5. Present the manifest to the user:
   - "I've analyzed your wireframes. Here's what I need to build:"
   - List existing blocks that can be reused (with any CSS updates needed)
   - List new blocks that need to be created
   - Ask: "Does this look right? Any sections I'm interpreting incorrectly?"

## Phase 2: Plan the Build

1. Run `/write-plan` (from superpowers) to create a build order:
   - Group blocks by dependency (independent blocks can be built in parallel)
   - Order: reuse/update existing blocks first, then build new blocks, then assemble pages
   - Each block is a self-contained task: content model → code → test → verify

2. For independent blocks, use `/parallel-agents` (from superpowers) to build them concurrently

## Phase 3: Build Blocks

For EACH block in the manifest (existing or new):

### For existing blocks that need updates:
1. Read the current block code
2. Update CSS to use brand design tokens (custom properties from `styles/styles.css`)
3. Verify against wireframe section's visual intent
4. Run `/impeccable craft` to visually iterate until the block matches the wireframe

### For new blocks:
1. Write the content model to `stardust/content-models/{block}.md` using `content-modeling` (from aem-edge-delivery-services)
   - Define the DA table structure (columns, cell contents)
   - Maximum 4 columns per row
   - Use semantic names
2. Create test content in `drafts/blocks/{block}.html` using the content model
3. Build the block using `content-driven-development` (from aem-edge-delivery-services):
   - `building-blocks` generates the initial `blocks/{name}/{name}.js` and `blocks/{name}/{name}.css`
   - Apply brand design tokens in the CSS
4. Run `/impeccable craft` to enter the visual build loop:
   - `/craft` builds the block, takes a screenshot, evaluates against the wireframe intent, and iterates
   - Loop until the block is production-grade
5. Run `testing-blocks` (from aem-edge-delivery-services) to verify the block works correctly

### For each block, verify:
- Block renders correctly at 3 viewports (mobile 375px, tablet 768px, desktop 1440px)
- Block uses CSS custom properties from the design system (no hardcoded colors/fonts)
- Block follows EDS conventions (scoped selectors, no `-container`/`-wrapper` classes)
- Block decoration handles missing optional fields gracefully

## Phase 3.5: Build Nav and Footer Fragments

Before generating pages, create the navigation and footer that appear on every page:

1. Read the site briefing (`stardust/briefings/_site.md`) for navigation structure
2. Create `nav.plain.html` **at the project root** (NOT in `drafts/`):
   - Three sections (divs): brand, nav links, tools — in that order
   - The header block maps these to `.nav-brand`, `.nav-sections`, `.nav-tools`
   - Brand link should be `<p><a href="/">Brand Name</a></p>`
   - Nav links as `<ul><li><a href="...">Page Name</a></li>...</ul>`
   - Tools section for CTAs (e.g., `<p><strong><a href="...">Shop</a></strong></p>`)
3. Create `footer.plain.html` **at the project root**:
   - Simple content: copyright, tagline, optional links
4. Update **header CSS** (`blocks/header/header.css`) to use brand design tokens:
   - Background: `var(--color-dark)` or appropriate brand color
   - Text/links: `var(--color-accent)` or light brand color
   - Brand name: `var(--heading-font-family)`
5. Update **footer CSS** (`blocks/footer/footer.css`) to use brand design tokens

**Why this matters:** The header block loads `/nav.plain.html` and the footer loads `/footer.plain.html` as fragments. Without these files at the project root, the header/footer crash and may block page rendering. These are NOT served from `drafts/` — the fragment loader fetches from the root path.

## Phase 4: Generate Pages

For each wireframe that has all its blocks built:

1. Read the wireframe (`stardust/wireframes/{page}.html`) for structure
2. Read the briefing (`stardust/briefings/{page}.md`) for content intent
3. Read `stardust/brand-profile.json` for brand voice, tone, and content pillars
4. Use `generative-page-pipeline` (from eds-site-builder) to generate the page:
   - Section-by-section, fill wireframe structure with real content
   - Headlines, body copy, CTA text generated in brand voice
   - Use `ai-image-generator` (from eds-site-builder) for images, applying photography style from brand profile
5. Write generated pages to `drafts/{page}.plain.html`
6. Restart the dev server with the drafts folder: `npx -y @adobe/aem-cli up --no-open --html-folder drafts`
7. Serve via dev server at `http://localhost:3000/drafts/{page}`

**URL path note:** When using `--html-folder drafts`, pages are served under `/drafts/` — NOT at the root. So `drafts/index.plain.html` is at `http://localhost:3000/drafts/index`, NOT `http://localhost:3000/`. Tell the designer the correct `/drafts/{page}` URLs.

### `.plain.html` Format Rules

**CRITICAL:** Draft page files MUST follow the AEM `.plain.html` format:
- File extension: `.plain.html`
- Content is **section divs only** — NO `<html>`, `<body>`, or `<main>` wrapper tags
- The dev server wraps content in `<html><body><main>...</main></body></html>` automatically
- If you include `<main>` tags, the result is nested `<main><main>` which breaks section loading — `decorateSections` cannot find sections inside a nested main

**Correct format:**
```html
<div>
  <h1>Page heading</h1>
  <p>Default content</p>
</div>
<div>
  <div class="block-name">
    ...block content...
  </div>
</div>
```

**Wrong format (will break):**
```html
<main>
  <div>...</div>
</main>
```

This rule applies equally to page drafts (`drafts/*.plain.html`) and fragment files (`nav.plain.html`, `footer.plain.html`).

**Section Metadata placement:** `section-metadata` must be the **last child inside** the section div it styles — never a standalone sibling div. The `decorateSections` function in `aem.js` looks for `.section-metadata` within each section wrapper. If it's a separate top-level `<div>`, it becomes its own section and renders as visible text.

**Correct (inside the section):**
```html
<div>
  <h2>Heading</h2>
  <p>Content</p>
  <div class="section-metadata">
    <div><div>style</div><div>dark</div></div>
  </div>
</div>
```

**Wrong (standalone sibling — renders as visible text):**
```html
<div>
  <h2>Heading</h2>
  <p>Content</p>
</div>
<div class="section-metadata">
  <div><div>style</div><div>dark</div></div>
</div>
```

### Placeholder Images

Generate placeholder images for all `<picture>` elements referenced in draft pages:
- Use Python/Pillow, ImageMagick, or similar to create branded gradient images
- Use brand colors from `brand-profile.json` for warm, on-brand gradients
- Hero images: 1600x800px, content images: 800x600px, card images: 600x450px
- Save as both `.png` and `.webp` in `drafts/`
- Image filenames must match the `src`/`srcset` references in the HTML

## Phase 5: Quality Gate

1. Run `/impeccable audit` on each generated page:
   - Scores 0-20 across: accessibility, performance, theming, responsive, anti-patterns
   - For each issue found, `/audit` recommends which command to run
2. Auto-fix P0 (critical) and P1 (serious) issues by running the recommended commands
3. Collect P2-P3 issues for designer review
4. Run `npm run lint` to verify code quality

**Headless browser fallback:** If Playwright/Puppeteer is not installed, skip screenshot-based visual checks and fall back to structural HTML verification:
- Check each page returns HTTP 200 from the dev server
- Verify `<main>` exists and is not nested (`<main><main>` breaks decoration)
- Verify blocks are present in the HTML (`.cards`, `.columns`, `.hero` etc.)
- Verify section-metadata divs are correctly nested inside section divs
- Verify CSS and JS are linked (`styles.css`, `aem.js`, `scripts.js`)

Present results to designer:
- "Pages are built. Here's what to review:"
- Link to each page on the dev server
- List any P2-P3 issues found by audit
- "Open http://localhost:3000/drafts/{page} to see your pages. Run `/stardust:refine` when you're ready to polish and publish."

## Artifacts Written

| File | Description |
|------|-------------|
| `stardust/block-manifest.json` | Wireframe → EDS block mapping |
| `stardust/content-models/{block}.md` | DA table contract per new block |
| `blocks/{name}/{name}.js` | Block JavaScript (new or modified) |
| `blocks/{name}/{name}.css` | Block CSS (new or modified) |
| `blocks/header/header.css` | Header CSS updated for brand |
| `blocks/footer/footer.css` | Footer CSS updated for brand |
| `nav.plain.html` | Navigation fragment (project root) |
| `footer.plain.html` | Footer fragment (project root) |
| `drafts/blocks/{name}.html` | Test content per block |
| `drafts/{page}.plain.html` | Full generated pages |
| `drafts/media_*.{png,webp}` | Placeholder images for draft pages |
