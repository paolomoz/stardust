---
name: eds-build
description: "Map approved designs to EDS blocks, build blocks via CDD, generate pages with real content. The main EDS construction stage. Use when designs are approved and the EDS design system has been generated, when the user asks to change, refine, or refactor any file under `blocks/**` or any EDS page content under `drafts/**` (block JS/CSS, block DOM, page composition), or when /stardust recommends the eds-build stage."
---

# EDS Build

The heaviest stage. Map design sections to EDS blocks, build new blocks through CDD, generate pages with real content from briefings.

## MANDATORY PREPARATION

1. Check that designs exist: `stardust/designs/*.html`. If not, tell the user to run `/stardust:design` first.
2. Check that briefings exist: `stardust/briefings/*.md`. If not, tell the user to run `/stardust:briefings` first.
3. Read `.impeccable.md` for design context.
4. Read `stardust/brand-profile.json` for brand voice (needed for content generation).
5. Check that the EDS design system is applied: `stardust/design-tokens.json` exists. If not, tell the user to run `/stardust:eds-design` first.
6. Start the AEM dev server if not running: `npx -y @adobe/aem-cli up --no-open`

---

## Phase 1: Analyze Wireframes

For each wireframe in `stardust/wireframes/`:

1. Parse the HTML, extracting all `<section>` elements with their `data-` attributes
2. For each section, consult [wireframe-to-eds.md](reference/wireframe-to-eds.md) to determine the EDS block mapping
3. Check existing `blocks/` directory — inventory what's already available
4. Produce `stardust/block-manifest.json` with the mapping: which wireframe sections map to which blocks, which blocks exist, which need to be created

### Prefer Custom Blocks Over Generic Blocks

**When a wireframe section has a unique composition** — a hero with an eyebrow label and split layout, a feature section with alternating image/text, a story card with quote + attribution — **create a custom block** for it rather than forcing a generic block (hero, columns) to handle the variant.

Generic blocks (hero, columns, cards) work well for simple, uniform content. But when a wireframe section has a specific layout, content model, or visual treatment, a custom block is cheaper to build and easier to maintain than CSS variant hacks on a generic block. Name custom blocks after their wireframe intent: `hero-split`, `hero-centered`, `feature-split`, `story-card`, `stat-row`, `pillars`.

**Rule of thumb:** If a section would need more than a `section-metadata` style class to express its design, it needs its own block.

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

### Core Principle: All Block CSS Starts from Empty

**Do NOT patch boilerplate block CSS.** Every block's CSS file must be written from scratch, using only brand design tokens from `styles/styles.css`. The boilerplate block CSS contains arbitrary default values with no connection to any brand. Patching it leaves stale rules that silently degrade the design.

This applies equally to:
- **Boilerplate blocks** (hero, columns, cards, header, footer): Keep the JS where it provides structural value (DOM transformation, fragment loading). **Rewrite the CSS entirely** from brand tokens.
- **New blocks** (testimonials, specs, etc.): Write both JS and CSS from scratch.

The block JS generates specific DOM structures and class names. Read the JS to understand what classes and elements exist, then write CSS that targets them with brand-appropriate styling. Cross-reference the wireframe section that maps to each block to understand the design intent (typography, spacing, visual weight, layout).

### Disable `buildHeroBlock` Auto-Blocking for Custom Heroes

The boilerplate `scripts.js` contains a `buildHeroBlock()` function that auto-detects the first `<h1>` and first `<picture>` on the page and **moves them** into a new `.hero` block prepended to `<main>`. This silently destroys custom hero blocks like `hero-split` or `hero-centered` — their h1 and picture vanish from the DOM before the block's `decorate()` function runs.

**Fix:** In `scripts.js`, update the guard clause in `buildHeroBlock` to match any block whose class starts with `hero`:

```js
// Before (only checks .hero):
if (h1.closest('.hero') || picture.closest('.hero')) {
  return;
}

// After (catches hero-split, hero-centered, etc.):
if (h1.closest('[class^="hero"]') || picture.closest('[class^="hero"]')) {
  return;
}
```

**Apply this fix immediately after creating any custom hero block.** If you skip this, the hero will render without its headline and image — the auto-blocker steals them before your code runs.

### Full-Bleed Block Pattern

`decorateBlock()` in `aem.js` wraps every block in a `{block}-wrapper` div. The DOM chain is: `.section.{block}-container > div.{block}-wrapper > div.{block}.block`. The wrapper inherits `max-width: var(--content-max-width)` from `main > .section > div`. Blocks that need to extend edge-to-edge (heroes, CTA bands, full-width backgrounds) must override this on the container and wrapper:

```css
.{block}-container {
  padding-top: 0; /* remove section padding if needed */
}

main .{block}-container > div {
  max-width: unset;
  padding: 0;
}
```

**Specificity matters:** The base rule `main > .section > div` has specificity (0,1,2). A simple `.{block}-container > div` is only (0,1,1) and loses. Prefix with `main` to get (0,1,2) and win. Without this, the wrapper stays at `--content-max-width` and the block is not full-bleed.

For EACH block in the manifest:

### For boilerplate blocks (hero, columns, cards):
1. Read the block JS to understand the DOM structure it produces
2. Read the wireframe section(s) that map to this block for design intent
3. **Write the CSS from empty** — no reference to the boilerplate CSS. Every rule derived from brand tokens and wireframe intent
4. Verify against wireframe section's visual intent
5. Run `/impeccable craft` to visually iterate until the block matches the wireframe

### For new blocks:
1. Write the content model to `stardust/content-models/{block}.md` using `content-modeling` (from aem-edge-delivery-services)
   - Define the DA table structure (columns, cell contents)
   - Maximum 4 columns per row
   - Use semantic names
2. Create test content in `drafts/blocks/{block}.html` using the content model
3. Build the block using `content-driven-development` (from aem-edge-delivery-services):
   - `building-blocks` generates the initial `blocks/{name}/{name}.js` and `blocks/{name}/{name}.css`
   - **Discard the generated CSS and write from scratch** using brand tokens
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
4. **Write header CSS from scratch** (`blocks/header/header.css`):
   - Read the header JS to understand the DOM structure (.nav-wrapper, .nav-brand, .nav-sections, .nav-tools, .nav-hamburger)
   - Write all CSS from empty using brand tokens — nav background, link colors, brand typography, CTA button treatment, hamburger icon, mobile/desktop responsive layout
   - The header JS is structural plumbing (fragment loading, hamburger toggle, aria states) — keep it, rewrite only CSS
5. **Write footer CSS from scratch** (`blocks/footer/footer.css`):
   - Read the footer JS to understand the DOM structure
   - Write from empty — background, text color, link treatment, padding, typography

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

### Button / CTA Markup Rules

**CRITICAL:** The `decorateButtons()` function in `scripts.js` checks `p.textContent.trim() !== text` — if a `<p>` contains anything besides a single link, NEITHER link in that paragraph gets decorated as a button. Every CTA link must be the **sole content** of its own `<p>` element.

Button styles are determined by wrapping elements:
- **Primary button** (filled): `<p><strong><a href="...">Label</a></strong></p>`
- **Secondary button** (outline): `<p><em><a href="...">Label</a></em></p>`
- **Accent button** (strong + italic): `<p><strong><em><a href="...">Label</a></em></strong></p>`

**Correct (each CTA gets its own `<p>`):**
```html
<p><strong><a href="/buy">Shop VX1</a></strong></p>
<p><em><a href="/capabilities">See What It Can Do</a></em></p>
```

**Wrong (two links share one `<p>` — neither becomes a button):**
```html
<p><strong><a href="/buy">Shop VX1</a></strong> <em><a href="/capabilities">See What It Can Do</a></em></p>
```

**Wrong (link is not wrapped — renders as plain text link, not a button):**
```html
<p><a href="/buy">Shop VX1</a></p>
```

### Placeholder Images

Generate placeholder images that match the wireframe placeholder style — **flat solid colors with centered uppercase label text**, not gradients. This keeps visual consistency between wireframes and draft pages so the designer can evaluate layout and spacing without distraction.

Use Python/Pillow or similar to create images:
- **Colors must match the wireframe palette:** use the same CSS custom property values from the wireframe `:root` block. Typical mapping:
  - Product/lifestyle/general images: `--cool` color (light blue-gray, e.g., `#dce0e7`)
  - Food/recipe images: `--warm` color (light cream, e.g., `#f6ece4`)
  - Dark/dramatic backgrounds: `--navy` color (e.g., `#333f48`)
- **Label text:** centered, uppercase, 13px, using a muted version of the background color (e.g., `#a2aaad` on cool, `rgba(255,255,255,0.3)` on dark). Label describes the image intent (e.g., "VX1 PRODUCT IMAGE", "FOOD PHOTO")
- **Size:** all placeholders at 1600x900px (the `?width=` query param in `srcset` handles resizing)
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
- "Open http://localhost:3000/drafts/{page} to see your pages. Run `/stardust:eds-refine` when you're ready to polish and publish."

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
