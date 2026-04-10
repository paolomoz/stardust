# Boilerplate Baseline

Current state of this project (aem-boilerplate clone) and what needs to change.

## Project State

Fresh clone of https://github.com/adobe/aem-boilerplate/ with a single initial commit. No customizations.

## File Inventory

### Blocks (6 default)
```
blocks/
├── cards/          # Card grid (collection pattern)
│   ├── cards.js
│   └── cards.css
├── columns/        # Multi-column layout
│   ├── columns.js
│   └── columns.css
├── footer/         # Site footer
│   ├── footer.js
│   └── footer.css
├── fragment/       # Fragment loader (auto-blocked)
│   ├── fragment.js
│   └── fragment.css
├── header/         # Site header/navigation
│   ├── header.js
│   └── header.css
└── hero/           # Hero section (auto-blocked from h1 + picture)
    ├── hero.js
    └── hero.css
```

### Scripts
```
scripts/
├── aem.js          # Core AEM library — NEVER MODIFY
├── scripts.js      # Page decoration entry point (decorateMain, loadPage, buildAutoBlocks)
└── delayed.js      # Delayed loading (empty: just a comment placeholder)
```

### Styles
```
styles/
├── styles.css      # Global styles with CSS custom properties
├── lazy-styles.css # Below-fold styles (empty)
└── fonts.css       # Font definitions (Roboto family, @font-face)
```

### Other
```
fonts/              # Roboto woff2 files (regular, medium, bold, condensed-bold)
icons/              # search.svg only
head.html           # Global head content
404.html            # Custom 404
```

## Current Design Tokens (styles.css :root)

```css
/* colors */
--background-color: white;
--light-color: #f8f8f8;
--dark-color: #505050;
--text-color: #131313;
--link-color: #3b63fb;
--link-hover-color: #1d3ecf;

/* fonts */
--body-font-family: roboto, roboto-fallback, sans-serif;
--heading-font-family: roboto-condensed, roboto-condensed-fallback, sans-serif;

/* body sizes */
--body-font-size-m: 22px;
--body-font-size-s: 19px;
--body-font-size-xs: 17px;

/* heading sizes */
--heading-font-size-xxl: 55px;
--heading-font-size-xl: 44px;
--heading-font-size-l: 34px;
--heading-font-size-m: 27px;
--heading-font-size-s: 24px;
--heading-font-size-xs: 22px;

/* nav height */
--nav-height: 64px;
```

Desktop breakpoint at 900px scales sizes down (heading-xxl: 55→45, body-m: 22→18).

## What Must Change

### Fonts
- **Roboto is on impeccable's banned list** — Must be replaced during brand definition
- Font files in `fonts/` will need replacement
- `fonts.css` will need new `@font-face` declarations (or Google Fonts `@import`)
- Fallback font-face declarations in `styles.css` need updating

### Color Tokens
- Current palette is generic boilerplate (white/gray/blue)
- Will be completely replaced by brand-css-generator output
- Need to add secondary palette, accent colors, functional colors

### Typography Scale
- Current scale uses fixed px values
- Impeccable recommends fluid sizing with `clamp()` for marketing/content pages
- Or fixed rem scales for app UIs/dashboards
- Need modular scale with 1.25+ ratio between steps

### Missing Tokens
- No spacing scale (impeccable recommends 4pt: 4, 8, 12, 16, 24, 32, 48, 64, 96)
- No border-radius tokens
- No shadow tokens
- No transition/animation tokens
- No section-level style tokens (full-bleed, dark/light sections)

### Blocks to Add
The 6 default blocks are a starting point. Depending on the site being built, we'll need:
- Accordion (FAQ, progressive disclosure)
- Tabs (switchable views)
- Testimonials (social proof)
- CTA (call-to-action sections)
- Table (data comparison)
- Custom blocks based on wireframes

### Structure to Add
```
drafts/             # Local test content (.plain.html files)
docs/               # Documentation (research already here)
.impeccable.md      # Design context (from /impeccable teach)
```

### Scripts Changes
- `scripts.js` may need additional auto-blocking patterns
- `delayed.js` will need martech/analytics if applicable
- Section metadata handling may need enhancement (e.g., full-bleed, dark sections, id promotion)

## Installed Plugins Available

All these plugins are globally installed and available in this project:

| Invocation | Plugin | Key Skills |
|------------|--------|-----------|
| `/impeccable` | impeccable 2.1.0 | teach, craft, shape, critique, audit, extract, typeset, colorize, animate, harden, polish |
| AEM EDS skills | adobe-skills 1.0.0 | content-driven-development, building-blocks, testing-blocks, content-modeling, page-import, analyze-and-plan |
| EDS Site Builder | paolomoz-skills | brand-extractor, brand-css-generator, design-system-extractor, generative-page-pipeline, conversational-page-builder, da-content-pipeline, eds-website-builder, ai-image-generator |
| Superpowers | claude-plugins-official 5.0.7 | brainstorm, write-plan, execute-plan, parallel-agents, verification, code-review |
| Frontend Design | claude-plugins-official | Design foundations (base for impeccable) |
| Playground | claude-plugins-official | Prototyping |

## Development Commands

```bash
npm install                                           # Install dependencies
npx -y @adobe/aem-cli up --no-open --forward-browser-logs  # Start dev server at localhost:3000
npm run lint                                          # ESLint + Stylelint
npm run lint:fix                                      # Auto-fix lint issues
```
