# Stardust Plugin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the stardust Claude Code plugin — 6 skills that compose superpowers, impeccable v2, and Adobe EDS skills into a pipeline for creating EDS websites from brand guidelines.

**Architecture:** Standalone plugin with `.cursor/skills/` directory containing 6 SKILL.md files (navigator + 5 stage skills). Each skill is a thin orchestrator that reads/writes artifacts under `stardust/` and delegates to skills from peer plugins. Reference materials provide artifact schemas, templates, and mapping guides.

**Tech Stack:** Claude Code plugin format (SKILL.md files with YAML frontmatter), markdown reference materials, HTML templates (brand board, wireframe), JSON schemas (brand-profile, design-tokens, block-manifest).

**Spec:** `docs/superpowers/specs/2026-04-11-stardust-pipeline-design.md`

---

## File Structure

```
stardust-plugin/
├── .claude-plugin/
│   └── marketplace.json                          # Plugin metadata + registration
├── .cursor/
│   └── skills/
│       ├── stardust/                             # Navigator (reads state, recommends)
│       │   ├── SKILL.md
│       │   └── reference/
│       │       └── artifact-map.md               # All artifacts, locations, schemas
│       ├── brand/                                # Stage 1: Brand extraction
│       │   ├── SKILL.md
│       │   └── reference/
│       │       ├── brand-profile-schema.md       # JSON schema for brand-profile.json
│       │       └── brand-board-template.md       # HTML structure for brand board
│       ├── design-system/                        # Stage 2: Tokens → CSS
│       │   └── SKILL.md
│       ├── experience/                           # Stage 3: Briefing + wireframe
│       │   ├── SKILL.md
│       │   └── reference/
│       │       ├── briefing-format.md            # Briefing schema + examples
│       │       └── wireframe-guide.md            # HTML wireframe conventions
│       ├── build/                                # Stage 4: Blocks + pages
│       │   ├── SKILL.md
│       │   └── reference/
│       │       └── wireframe-to-eds.md           # How to map wireframe → EDS blocks
│       └── refine/                               # Post-build refinement + publish
│           └── SKILL.md
├── package.json
└── README.md
```

**Total files:** 16 (6 SKILL.md + 6 reference .md + marketplace.json + package.json + README.md + artifact-map.md)

---

### Task 1: Plugin Scaffold

**Files:**
- Create: `stardust-plugin/.claude-plugin/marketplace.json`
- Create: `stardust-plugin/package.json`
- Create: `stardust-plugin/README.md`

- [ ] **Step 1: Create plugin directory structure**

```bash
mkdir -p stardust-plugin/.claude-plugin
mkdir -p stardust-plugin/.cursor/skills/{stardust/reference,brand/reference,design-system,experience/reference,build/reference,refine}
```

- [ ] **Step 2: Write marketplace.json**

Create `stardust-plugin/.claude-plugin/marketplace.json`:

```json
{
  "$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
  "name": "stardust",
  "metadata": {
    "description": "Skill-based pipeline for creating AEM Edge Delivery Services websites from brand guidelines. Composes superpowers, impeccable, and Adobe EDS skills."
  },
  "owner": {
    "name": "Paolo Mottadelli",
    "email": "mottadel@adobe.com"
  },
  "plugins": [
    {
      "name": "stardust",
      "description": "Navigate brand → design system → experience design → build pipeline for AEM EDS websites. 6 skills: /stardust (navigator), /stardust:brand, /stardust:design-system, /stardust:experience, /stardust:build, /stardust:refine.",
      "version": "0.1.0",
      "author": {
        "name": "Paolo Mottadelli",
        "email": "mottadel@adobe.com"
      },
      "source": "./",
      "category": "design",
      "tags": ["aem", "eds", "edge-delivery", "brand", "design-system", "pipeline"]
    }
  ]
}
```

- [ ] **Step 3: Write package.json**

Create `stardust-plugin/package.json`:

```json
{
  "name": "@excat/stardust",
  "version": "0.1.0",
  "description": "Skill-based pipeline for creating AEM Edge Delivery Services websites from brand guidelines",
  "author": "Paolo Mottadelli <mottadel@adobe.com>",
  "license": "Apache-2.0",
  "keywords": ["claude-code", "plugin", "aem", "eds", "brand", "design-system"],
  "repository": {
    "type": "git",
    "url": "https://github.com/excat/stardust"
  }
}
```

- [ ] **Step 4: Write README.md**

Create `stardust-plugin/README.md`:

```markdown
# Stardust

A skill-based pipeline for creating AEM Edge Delivery Services websites from brand guidelines through generated experiences.

## Skills

| Skill | Purpose |
|-------|---------|
| `/stardust` | Navigator — assess project state, recommend next step |
| `/stardust:brand` | Extract brand from guidelines → visual brand board |
| `/stardust:design-system` | Translate brand tokens → EDS CSS |
| `/stardust:experience` | Briefing + wireframe → visual page blueprints |
| `/stardust:build` | Map wireframes → EDS blocks + generate pages |
| `/stardust:refine` | Designer-driven refinement + publish |

## Dependencies

Requires these peer plugins:
- [superpowers](https://github.com/anthropics/claude-code-plugins) — process methodology
- [impeccable](https://impeccable.style/) (v2+) — design methodology
- [aem-edge-delivery-services](https://github.com/adobe/skills) — EDS block development
- [eds-site-builder](https://github.com/paolomoz/skills) — brand extraction, CSS generation, content pipeline

## Pipeline

```
Brand → Design System → Experience Design → Build → Refine
```

Each stage is independently invocable. The navigator (`/stardust`) guides non-technical users through the flow. Experts invoke stages directly.

## Artifacts

All pipeline state lives under `stardust/` in your project root. EDS artifacts go to their standard paths (`styles/`, `blocks/`, `drafts/`).
```

- [ ] **Step 5: Commit scaffold**

```bash
git add stardust-plugin/
git commit -m "feat: scaffold stardust plugin structure"
```

---

### Task 2: Shared Reference — Artifact Map

The artifact map is the navigator's reference and the single source of truth for what each stage produces and consumes. Write this first because every skill references it.

**Files:**
- Create: `stardust-plugin/.cursor/skills/stardust/reference/artifact-map.md`

- [ ] **Step 1: Write artifact-map.md**

Create `stardust-plugin/.cursor/skills/stardust/reference/artifact-map.md`:

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add stardust-plugin/.cursor/skills/stardust/reference/artifact-map.md
git commit -m "feat: add artifact map reference for navigator"
```

---

### Task 3: Brand Skill References

Write the brand-profile JSON schema and brand board HTML template before the skill itself — these are the contracts the skill must fulfill.

**Files:**
- Create: `stardust-plugin/.cursor/skills/brand/reference/brand-profile-schema.md`
- Create: `stardust-plugin/.cursor/skills/brand/reference/brand-board-template.md`

- [ ] **Step 1: Write brand-profile-schema.md**

Create `stardust-plugin/.cursor/skills/brand/reference/brand-profile-schema.md`:

```markdown
# Brand Profile Schema

`stardust/brand-profile.json` is the machine-readable source of truth for all extracted brand tokens. The brand board HTML is rendered from this file.

## Schema

```json
{
  "name": "string — brand name",
  "philosophy": "string — mission/positioning statement",

  "logo": {
    "primary": "string — path to primary logo SVG in icons/",
    "variants": [
      {
        "name": "string — e.g. 'white on dark', 'black B&W'",
        "path": "string — path to variant file",
        "usage": "string — when to use this variant"
      }
    ],
    "clearSpace": "string — clear space rule description",
    "donts": ["string — common logo misuse to avoid"]
  },

  "colors": {
    "primary": [
      {
        "name": "string — color name e.g. 'Vitamix Red'",
        "hex": "string — #RRGGBB",
        "pantone": "string|null — Pantone code if available",
        "role": "string — e.g. 'Primary brand', 'Accent', 'Background'"
      }
    ],
    "secondary": [
      { "name": "string", "hex": "string", "role": "string" }
    ],
    "web": [
      { "name": "string", "hex": "string", "role": "string — e.g. 'Links', 'Offer text'" }
    ]
  },

  "typography": {
    "heading": {
      "family": "string — font family name",
      "weights": ["string — e.g. 'Book', 'Medium', 'Bold'"],
      "usage": "string — when to use"
    },
    "subheading": {
      "family": "string",
      "weight": "string",
      "usage": "string"
    },
    "body": {
      "family": "string",
      "weight": "string",
      "usage": "string"
    },
    "eyebrow": {
      "family": "string",
      "weight": "string",
      "transform": "string — e.g. 'uppercase'",
      "usage": "string"
    },
    "button": {
      "family": "string",
      "weight": "string",
      "usage": "string"
    },
    "rules": ["string — specific typographic rules e.g. 'Dollar signs half-size + top-aligned'"]
  },

  "photography": {
    "style": "string — overall photographic direction",
    "rules": ["string — composition/lighting/subject rules"],
    "donts": ["string — what to avoid"],
    "social": "string — social media specific guidance"
  },

  "voice": {
    "character": "string — voice character summary",
    "traits": ["string — personality traits e.g. 'Sophisticated', 'Informed'"],
    "antiTraits": ["string — what voice is NOT e.g. 'Stuffy', 'Arrogant'"],
    "examples": {
      "do": [
        { "text": "string — good copy example", "context": "string — why it works" }
      ],
      "dont": [
        { "text": "string — bad copy example", "context": "string — why it fails" }
      ]
    },
    "rules": ["string — hard rules e.g. 'NO excessive exclamation marks'"]
  },

  "tone": {
    "description": "string — how tone adapts by context",
    "writingGoals": [
      {
        "goal": "string — e.g. 'To Educate'",
        "description": "string — how this goal manifests in copy"
      }
    ],
    "cleverVsClear": {
      "clever": "string — when to be witty",
      "clear": "string — when to be direct"
    }
  },

  "contentPillars": [
    {
      "name": "string — pillar name e.g. 'Recipes'",
      "description": "string — what this pillar covers"
    }
  ],

  "personas": [
    {
      "name": "string — persona name e.g. 'The Essentialist'",
      "description": "string — who they are",
      "values": ["string"],
      "motto": "string — representative quote",
      "stats": [
        { "value": "string — e.g. '46%'", "description": "string" }
      ]
    }
  ],

  "spacing": {
    "scale": [
      { "name": "string — e.g. 'XS'", "value": "string — e.g. '8px'" }
    ],
    "borderRadius": [
      { "name": "string", "value": "string" }
    ]
  }
}
```

## Notes for Implementation

- All fields are optional except `name` and `colors.primary` — brands vary in what they document.
- The brand skill should extract what's available and leave missing fields as `null`.
- The brand board template renders whatever fields are present and omits sections for missing data.
- Voice examples are critical for copy generation — extract as many as possible.
- Photography style feeds into `ai-image-generator` style prefixes.
```

- [ ] **Step 2: Write brand-board-template.md**

Create `stardust-plugin/.cursor/skills/brand/reference/brand-board-template.md`:

```markdown
# Brand Board Template

The brand board is a self-contained HTML file rendered from `brand-profile.json`. The designer reviews this visual artifact — never the raw JSON.

## Structure

The brand board is a single HTML file with embedded CSS. No external dependencies. It must render correctly when opened directly in a browser or served via the AEM dev server.

### Required Sections (render if data present, skip if absent)

1. **Sticky Navigation** — fixed top bar with brand name + section jump links
2. **Brand Philosophy** — hero section with mission statement and positioning (dark background, serif typography)
3. **Logo** — variant grid (primary, white-on-dark, black, alternative), clear space diagram, do/don't grid
4. **Color Palette** — primary swatches (large, with Pantone + hex + role), secondary swatches, web-specific functional colors
5. **Typography** — live type specimens per hierarchy level (heading, subheading, body, eyebrow, button), typographic rules
6. **Photography & Video** — style direction cards (studio, video, social) with do/don't grid
7. **Voice** — character statement, trait tags (this/not-this split), paired do/don't copy examples, hard rules
8. **Tone Adaptation** — writing goal cards (educate/engage/inspire), clever vs. clear guidance
9. **Content Pillars** — pillar cards with icons and descriptions
10. **Personas** — profile card with values, motto, behavioral stats
11. **Spacing & Shape** — visual spacing scale blocks, border radius samples

### Design Guidelines

- Use the brand's own colors and fonts in the board wherever possible
- Light background (#faf9f6 or similar warm neutral) for the page body
- Dark sections for hero/philosophy and voice character statement
- All color swatches rendered at 80x80px minimum with hex, Pantone, and role labels
- Type specimens use the actual extracted fonts (or closest web-safe fallback, flagged if substituted)
- Do/Don't pairs color-coded: green (#7B997C) for do, red (#C8102E or brand red) for don't
- Responsive — must look good on desktop (primary) and tablet
- Sticky nav enables quick section jumping on long boards

### Template Generation

When rendering the brand board, read `stardust/brand-profile.json` and:
1. Build the sticky nav from present sections (skip links for absent sections)
2. Render each section using the data fields. Omit entire sections if the corresponding brand-profile field is null/missing.
3. Write the complete HTML to `stardust/brand-board.html`
4. Tell the designer to open the URL to review

### Reference

See the Vitamix example at `.superpowers/brainstorm/*/content/brand-board-full.html` in the project for the full-depth visual reference.
```

- [ ] **Step 3: Commit**

```bash
git add stardust-plugin/.cursor/skills/brand/reference/
git commit -m "feat: add brand profile schema and board template references"
```

---

### Task 4: Brand Skill

**Files:**
- Create: `stardust-plugin/.cursor/skills/brand/SKILL.md`

- [ ] **Step 1: Write SKILL.md**

Create `stardust-plugin/.cursor/skills/brand/SKILL.md`:

```markdown
---
name: brand
description: "Extract brand identity from guidelines (PDF, URL, or conversation) into structured tokens and a visual brand board. Use when starting a new EDS website project, when the user provides brand guidelines, or when /stardust recommends the brand stage."
---

# Brand Extraction

Extract brand identity from guidelines and produce a visual brand board for designer approval.

## MANDATORY PREPARATION

This skill is part of the stardust pipeline. Check for `.impeccable.md` — if it exists, read it for existing design context. If it doesn't exist, this skill will create it.

---

## Inputs

The designer provides ONE of:
1. **Brand guidelines URL** — a web-based brand guide (e.g., Corebook, Frontify, Brandfolder)
2. **Brand guidelines PDF** — uploaded document
3. **No guidelines** — the designer describes their brand vision conversationally

## Phase 1: Extract

### If guidelines URL or PDF provided:

1. Use `brand-extractor` (from eds-site-builder) to analyze the guidelines and extract structured tokens
2. Read the extraction output and map it to the brand profile schema — consult [brand-profile-schema.md](reference/brand-profile-schema.md) for the full schema
3. Write the structured data to `stardust/brand-profile.json`
4. Pay special attention to extracting:
   - **Voice examples** — do/don't copy pairs. These are critical for content generation. Extract as many as available.
   - **Photography direction** — style rules, composition guidance, subject matter. Feeds image generation.
   - **Logo variants** — save all variants to `icons/`. SVG preferred, optimized PNG as fallback.
   - **Color roles** — don't just extract hex values, capture what each color is FOR (CTAs, headings, backgrounds)

### If no guidelines (conversational):

1. Invoke `/brainstorm` (from superpowers) to run a brand discovery conversation
2. Ask about: brand name, mission, target audience, personality (3-5 adjectives), colors they like/dislike, typography preference (serif/sans/mixed), photography style, competitive positioning
3. From the conversation, construct `stardust/brand-profile.json` with whatever was discussed
4. Mark optional fields as null — the designer can fill them in later

## Phase 2: Design Personality

1. Run `/impeccable teach` — this interviews the designer about the project's brand, users, and aesthetic
2. Feed it context from the brand profile you just extracted (colors, voice, personas)
3. `/teach` produces `.impeccable.md` at the project root — this is the design context for all future quality gates

If `.impeccable.md` already exists (designer ran /teach separately), skip this phase.

## Phase 3: Render Brand Board

1. Read `stardust/brand-profile.json`
2. Generate `stardust/brand-board.html` following the template structure in [brand-board-template.md](reference/brand-board-template.md)
3. The board must:
   - Use the brand's own extracted colors and fonts
   - Include sticky navigation for section jumping
   - Render only sections that have data (omit sections for null fields)
   - Be self-contained HTML with embedded CSS (no external dependencies)
4. Start the AEM dev server if not running: `npx -y @adobe/aem-cli up --no-open`
5. Tell the designer: "Your brand board is ready. Open http://localhost:3000/stardust/brand-board.html to review it."
   - In SLICC: the board renders in the browser panel automatically
   - In Claude Code: the designer opens the URL

## Phase 4: Approval Gate

This is a **hard gate**. Do not proceed until the designer approves.

Present the brand board and ask: "Does this accurately represent your brand? What needs to change?"

Common feedback and how to handle it:
- **"That color is wrong"** → Update the hex in brand-profile.json, re-render the board
- **"The voice feels too [formal/casual/etc]"** → Update voice traits and examples, re-run `/teach` to update .impeccable.md
- **"Missing our secondary font"** → Add to typography section, re-render
- **"Photography direction is off"** → Update photography rules, re-render

Iterate until the designer says the board looks right. Then:
1. Confirm the brand profile is saved
2. Confirm .impeccable.md exists
3. Tell the designer: "Brand extraction complete. Run `/stardust` to see your next step, or `/stardust:design-system` to build your CSS."

## Artifacts Written

| File | Description |
|------|-------------|
| `stardust/brand-profile.json` | Structured brand tokens (source of truth) |
| `stardust/brand-board.html` | Visual brand board (rendered view) |
| `.impeccable.md` | Design personality for quality gates |
| `icons/*` | Logo variants and brand SVGs |
```

- [ ] **Step 2: Commit**

```bash
git add stardust-plugin/.cursor/skills/brand/SKILL.md
git commit -m "feat: add /stardust:brand skill"
```

---

### Task 5: Design System Skill

**Files:**
- Create: `stardust-plugin/.cursor/skills/design-system/SKILL.md`

- [ ] **Step 1: Write SKILL.md**

Create `stardust-plugin/.cursor/skills/design-system/SKILL.md`:

```markdown
---
name: design-system
description: "Translate brand tokens into EDS CSS — custom properties, font declarations, base styles. Use when brand extraction is complete and you need to build the site's design system, or when /stardust recommends the design system stage."
---

# Design System Generation

Translate brand tokens from `brand-profile.json` into production-ready EDS CSS.

## MANDATORY PREPARATION

1. Check that `stardust/brand-profile.json` exists. If not, tell the user to run `/stardust:brand` first.
2. Read `.impeccable.md` for design context. If it doesn't exist, tell the user to run `/stardust:brand` first (it creates this).

---

## Phase 1: Generate CSS

1. Read `stardust/brand-profile.json` for color, typography, and spacing tokens
2. Use `brand-css-generator` (from eds-site-builder) to generate initial CSS from the brand profile
3. The generated CSS must include:

**In `styles/styles.css`:**
- CSS custom properties for all brand colors: `--color-primary`, `--color-accent`, `--color-background`, etc.
- Typography custom properties: `--heading-font-family`, `--body-font-family`, `--font-size-*` scale
- Spacing custom properties: `--spacing-xs` through `--spacing-2xl`
- Border radius: `--border-radius-sm`, `--border-radius-md`, `--border-radius-lg`
- Base styles for body, headings (h1-h6), links, buttons using the custom properties
- Responsive breakpoints at 600px/900px/1200px (mobile-first, min-width)

**In `styles/fonts.css`:**
- @font-face declarations for all brand fonts
- Font-display: swap for performance
- Multiple formats (woff2 primary, woff fallback)

**In `fonts/`:**
- Downloaded web font files (woff2/woff format)
- If brand fonts are Google Fonts, download them (don't use CDN links — EDS performance requirement)
- If brand fonts are commercial/unavailable, select the closest Google Font alternative and flag the substitution

4. Write `stardust/design-tokens.json` — a structured export of all CSS custom properties for programmatic access:

```json
{
  "colors": {
    "primary": { "property": "--color-primary", "value": "#C8102E" },
    "accent": { "property": "--color-accent", "value": "#333F48" }
  },
  "typography": {
    "headingFamily": { "property": "--heading-font-family", "value": "Sentinel, Georgia, serif" }
  },
  "spacing": {
    "xs": { "property": "--spacing-xs", "value": "8px" }
  }
}
```

## Phase 2: Quality Gate (Agent Automatic)

The designer does NOT see intermediate states. Run these checks and fix issues before exposing the result:

1. Run `/impeccable critique` against the dev server (start it if not running: `npx -y @adobe/aem-cli up --no-open`)
   - Check: no banned fonts (Roboto, system-ui as primary, generic sans-serif alone)
   - Check: color contrast meets WCAG AA for all text/background combinations
   - Check: typographic hierarchy is clear (h1 > h2 > h3 visually distinct)
   - Fix any issues found automatically

2. Run `/impeccable typeset` to refine the type hierarchy if needed

3. Run `/impeccable colorize` to verify color application and accessibility

4. Use `/verification` (from superpowers) to check that generated CSS custom properties match brand-profile.json values — catch any drift between the source tokens and generated output

## Phase 3: Expose to Designer

1. The design system is visible through the dev server at http://localhost:3000
2. Tell the designer: "Your design system is applied. Open http://localhost:3000 to see the base styles. The boilerplate content will now use your brand's colors, fonts, and spacing."
3. If the designer wants changes: update brand-profile.json or tweak CSS directly, then re-run the quality gate
4. When satisfied: "Design system complete. Run `/stardust` to see your next step, or `/stardust:experience` to start wireframing."

## Artifacts Written

| File | Description |
|------|-------------|
| `styles/styles.css` | CSS custom properties + base styles |
| `styles/fonts.css` | @font-face declarations |
| `fonts/*` | Web font files (woff2/woff) |
| `stardust/design-tokens.json` | Structured token export |
```

- [ ] **Step 2: Commit**

```bash
git add stardust-plugin/.cursor/skills/design-system/SKILL.md
git commit -m "feat: add /stardust:design-system skill"
```

---

### Task 6: Experience Skill References

**Files:**
- Create: `stardust-plugin/.cursor/skills/experience/reference/briefing-format.md`
- Create: `stardust-plugin/.cursor/skills/experience/reference/wireframe-guide.md`

- [ ] **Step 1: Write briefing-format.md**

Create `stardust-plugin/.cursor/skills/experience/reference/briefing-format.md`:

```markdown
# Briefing Format

Briefings are human-authored structured documents that capture business intent. The agent helps draft them through conversation but the designer owns the content.

## Page Briefing Schema

```markdown
---
page: [Page Name]
path: /[url-path]
type: landing|product|about|contact|blog|custom
---

# Intent
[1-3 sentences: What is this page FOR? What should a visitor feel/do after seeing it?]

# Audience
[Who visits this page? Demographics, mindset, how they arrived (search, social, direct)]

# Key Messages
1. [Primary message — the one thing they must take away]
2. [Supporting message]
3. [Supporting message]

# Calls to Action
- Primary: [Main action — verb + object, e.g. "Explore Products"]
- Secondary: [Alternative action, e.g. "Browse Recipes"]

# Tone
[How should the voice adapt for this specific page? Reference brand voice but specify adjustments.]
```

## Site Briefing Schema

For multi-page sites, `stardust/briefings/_site.md` captures cross-cutting concerns:

```markdown
---
site: [Site Name]
pages: [homepage, products, about, contact]
---

# Purpose
[What is this website FOR as a whole?]

# Navigation
- [Primary nav items in order]
- [Footer nav structure if different]

# Shared Messaging
[Tagline, value proposition, or messaging that appears across pages]

# Content Hierarchy
[Which page is most important? How do pages relate to each other?]
```

Page briefings inherit context from the site briefing. They don't need to repeat shared information.

## Rules

1. The agent NEVER generates a briefing autonomously. It can help draft through conversation, but the designer must review and approve the content.
2. All briefing sections are optional except `Intent`. A minimal briefing is just the YAML frontmatter + Intent.
3. Briefings use plain language, not marketing jargon. "Make them want to buy" is better than "Drive conversion through compelling value articulation."
4. One briefing per page. The filename matches the page: `homepage.md`, `products.md`, `about.md`.
```

- [ ] **Step 2: Write wireframe-guide.md**

Create `stardust-plugin/.cursor/skills/experience/reference/wireframe-guide.md`:

```markdown
# Wireframe Guide

Wireframes are visual HTML pages that show page layout and content structure. They are unconstrained by EDS blocks — the designer thinks in terms of what they SEE, not how it's coded.

## Two Fidelity Modes

### Grey Mode (no design system yet)
- Pure grey layout: boxes, bars, shapes
- No brand colors, no real fonts
- Shows: section order, relative sizing, content density, spatial relationships
- Background: light grey (#f5f5f5), elements in shades of grey
- Placeholder text as grey bars, images as grey rectangles with labels

### Branded Mode (design system present)
- Same structure as grey mode but styled with brand tokens
- Read `stardust/design-tokens.json` for colors, fonts, spacing
- Use actual brand typography for headings
- Use brand colors for backgrounds, accents, CTAs
- Still placeholder content (grey bars for body text) but with real visual identity

### Mode Selection
- Check if `stardust/design-tokens.json` exists
- If yes: branded mode
- If no: grey mode

## HTML Structure

Each wireframe is a self-contained HTML file with embedded CSS.

### Data Attributes

Every section must include semantic data attributes for the Build stage to parse:

```html
<section data-section="hero" data-intent="emotional hook" data-layout="full-bleed">
  <!-- section content -->
</section>

<section data-section="features" data-intent="value proposition" data-layout="contained" data-items="3">
  <!-- section content -->
</section>
```

**Required attributes:**
- `data-section` — descriptive name (not an EDS block type). Use natural language: "hero", "features", "social-proof", "recipe-showcase", "closing-cta"
- `data-intent` — why this section exists: "emotional hook", "build trust", "drive action"
- `data-layout` — spatial hint: "full-bleed", "contained", "split-media", "grid"

**Optional attributes:**
- `data-items` — number of repeated items (cards, features, testimonials)
- `data-media` — media type: "image", "video", "animation", "none"
- `data-interactive` — if section has interaction: "carousel", "filter", "calculator", "tabs"

### Metadata Block

Each wireframe includes a JSON metadata block linking to its briefing:

```html
<script type="application/json" id="wireframe-meta">
{
  "page": "Homepage",
  "briefing": "homepage.md",
  "mode": "grey",
  "sections": ["hero", "features", "social-proof", "recipe-showcase", "closing-cta"]
}
</script>
```

## Visual Rendering Rules

1. **Sections are full-width dividers.** Each section is visually distinct — separated by whitespace or background color changes.
2. **Grey placeholder bars** for text: 60% width for headings, 40% for subheadings, 80-100% for body lines.
3. **Grey rectangles** for images/video with centered label text ("lifestyle image", "demo video").
4. **Rounded rectangles** for buttons/CTAs with label text ("Primary CTA", "Secondary").
5. **Card layouts** show 3-4 items side by side with image placeholder + text bars.
6. **No real copy.** Section labels (e.g., "Hero", "Features") appear as small annotations above or beside the section, not as content.
7. **Responsive.** Wireframes should be viewport-responsive — stack to single column on narrow viewports.

## Reference

See the project's `.superpowers/brainstorm/*/content/visual-wireframe.html` for a dual-mode example (grey + branded side by side).
```

- [ ] **Step 3: Commit**

```bash
git add stardust-plugin/.cursor/skills/experience/reference/
git commit -m "feat: add briefing format and wireframe guide references"
```

---

### Task 7: Experience Skill

**Files:**
- Create: `stardust-plugin/.cursor/skills/experience/SKILL.md`

- [ ] **Step 1: Write SKILL.md**

Create `stardust-plugin/.cursor/skills/experience/SKILL.md`:

```markdown
---
name: experience
description: "Design page experiences through briefings and visual wireframes. Takes business intent and produces visual HTML wireframes unconstrained by EDS blocks. Use when the designer wants to plan pages, create wireframes, or when /stardust recommends the experience design stage."
---

# Experience Design

Help the designer express their page vision through briefings (what + why) and visual wireframes (how it looks).

## MANDATORY PREPARATION

1. Read `.impeccable.md` for design context. If it doesn't exist, recommend running `/stardust:brand` first.
2. Read `stardust/brand-profile.json` if it exists — use brand voice and personality to inform the conversation.
3. Check if `stardust/design-tokens.json` exists — this determines wireframe fidelity mode (grey vs branded).

---

## Phase 1: Briefing

### If no briefings exist yet:

1. Ask the designer: "What pages do you need? Let's start with the most important one."
2. For multi-page sites, create `stardust/briefings/_site.md` first — see [briefing-format.md](reference/briefing-format.md) for the site briefing schema
3. Use `/brainstorm` (from superpowers) to explore page concepts: "What should visitors feel when they land on this page? What's the one action you want them to take?"
4. Draft the briefing from the conversation and present it to the designer for approval
5. Write approved briefings to `stardust/briefings/{page}.md`

### If briefings already exist:

1. Read `stardust/briefings/` and confirm which pages have briefings
2. Ask the designer which page to wireframe next

**Reminder:** The agent helps draft briefings but the designer owns the content. Always present the draft and wait for approval before writing the file.

## Phase 2: Wireframe

For each page with an approved briefing:

1. Read the page briefing from `stardust/briefings/{page}.md`
2. Read the site briefing from `stardust/briefings/_site.md` if it exists
3. Run `/impeccable shape` — this conducts UX discovery for the page:
   - What sections does this page need?
   - What's the visual hierarchy?
   - How does the user flow through the content?
   - `/shape` produces a design brief — use this as the structural plan

4. For multi-page sites, run `/write-plan` (from superpowers) first to plan the information architecture across all pages before wireframing individual ones

5. Render the wireframe as visual HTML:
   - Check wireframe mode: grey (no design-tokens.json) or branded (design-tokens.json exists)
   - Follow the rendering rules in [wireframe-guide.md](reference/wireframe-guide.md)
   - Each section gets `data-section`, `data-intent`, `data-layout` attributes
   - Include the JSON metadata block linking to the briefing
   - Write to `stardust/wireframes/{page}.html`

6. Serve the wireframe for designer review:
   - Start the AEM dev server if not running: `npx -y @adobe/aem-cli up --no-open`
   - Tell the designer: "Your wireframe is ready. Open http://localhost:3000/stardust/wireframes/{page}.html to review it."
   - In SLICC: renders in the browser panel automatically

## Phase 3: Approval Gate

This is a **hard gate**. Do not proceed to Build until the designer approves.

Present the wireframe and ask: "Does this layout capture what you had in mind? What should change?"

Common feedback and how to handle it:
- **"Swap these sections"** → Reorder sections in the HTML, re-render
- **"Make the hero bigger/smaller"** → Adjust section proportions, re-render
- **"Add a section for [X]"** → Add new section with appropriate data attributes, re-render
- **"I want something interactive here"** → Add `data-interactive` attribute with the interaction type
- **"This section feels wrong"** → Ask what they want instead, redesign that section
- **"Can I see it with brand colors?"** → If design-tokens.json exists, switch to branded mode and re-render

Iterate until the designer approves. Then:
1. Confirm wireframes are saved
2. Tell the designer: "Wireframes approved. Run `/stardust` to see your next step, or `/stardust:build` to start building."

## Artifacts Written

| File | Description |
|------|-------------|
| `stardust/briefings/_site.md` | Site-level briefing (multi-page only) |
| `stardust/briefings/{page}.md` | Page-level briefings |
| `stardust/wireframes/{page}.html` | Visual wireframe HTML files |
```

- [ ] **Step 2: Commit**

```bash
git add stardust-plugin/.cursor/skills/experience/SKILL.md
git commit -m "feat: add /stardust:experience skill"
```

---

### Task 8: Build Skill Reference + Skill

**Files:**
- Create: `stardust-plugin/.cursor/skills/build/reference/wireframe-to-eds.md`
- Create: `stardust-plugin/.cursor/skills/build/SKILL.md`

- [ ] **Step 1: Write wireframe-to-eds.md**

Create `stardust-plugin/.cursor/skills/build/reference/wireframe-to-eds.md`:

```markdown
# Wireframe to EDS Block Mapping

The Build stage translates unconstrained wireframe sections into EDS blocks. This reference guides that translation.

## Mapping Process

For each section in the wireframe HTML:

1. Read `data-section`, `data-intent`, `data-layout`, and optional attributes
2. Check existing `blocks/` directory — can an existing block handle this section?
3. If yes: note the existing block name and any variant needed
4. If no: this section needs a new block built via CDD

## Common Mappings

These are starting points, not rules. The wireframe description and intent override these defaults.

| Wireframe Pattern | Likely EDS Block | Notes |
|---|---|---|
| Full-width hero with image/video + heading + CTA | `hero` | Already in boilerplate |
| 2-4 items side by side with icon + text | `columns` | Already in boilerplate, use variants |
| Card grid with image + title + description | `cards` | Already in boilerplate |
| Quote/testimonial with author | `testimonials` | New block needed |
| Accordion/expandable sections | `accordion` | New block needed |
| Tab-switched content panels | `tabs` | New block needed |
| Media + text split (image left, text right or vice versa) | `columns` (2-up variant) | Existing block, CSS variant |
| Full-width colored band with CTA | `cta-band` | New block, section-level styling |
| Data table or comparison | `table` | New block needed |
| Interactive element (calculator, filter, slider) | Custom block | Always new, name from wireframe |
| Newsletter/email signup | `signup` | New block needed |
| Logo grid / partner logos | `logo-wall` | New block needed |

## When to Create a New Block vs. Reuse

**Reuse** when:
- An existing block's content model can express the wireframe section's content
- The visual difference is achievable with CSS alone (no JS behavior changes)
- The authoring experience in DA stays clean (≤4 cells per row)

**Create new** when:
- The section requires JS behavior that doesn't exist (carousel, accordion, tabs, filtering)
- The content model would need more than 4 cells per row to express the wireframe
- Forcing into an existing block would make the DA authoring confusing for content authors

## Block Manifest Format

`stardust/block-manifest.json`:

```json
{
  "blocks": [
    {
      "name": "hero",
      "status": "existing",
      "wireframeSections": ["hero"],
      "notes": "Existing boilerplate block, may need CSS updates for brand"
    },
    {
      "name": "testimonials",
      "status": "new",
      "wireframeSections": ["social-proof"],
      "contentModel": "3 columns: quote, author-name, author-photo",
      "notes": "Card-style layout with quotation styling"
    }
  ]
}
```

## Content Model Principles (from CDD)

- Content models define the DA/Google Docs table structure for each block
- Maximum 4 columns per row — beyond this, authoring becomes confusing
- Use semantic column names (not "column1", "column2")
- Always create a test content HTML file in `drafts/blocks/{name}.html`
- The content model is the contract between author and developer — decide it BEFORE writing code
```

- [ ] **Step 2: Write SKILL.md**

Create `stardust-plugin/.cursor/skills/build/SKILL.md`:

```markdown
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

## Phase 4: Generate Pages

For each wireframe that has all its blocks built:

1. Read the wireframe (`stardust/wireframes/{page}.html`) for structure
2. Read the briefing (`stardust/briefings/{page}.md`) for content intent
3. Read `stardust/brand-profile.json` for brand voice, tone, and content pillars
4. Use `generative-page-pipeline` (from eds-site-builder) to generate the page:
   - Section-by-section, fill wireframe structure with real content
   - Headlines, body copy, CTA text generated in brand voice
   - Use `ai-image-generator` (from eds-site-builder) for images, applying photography style from brand profile
5. Write generated pages to `drafts/{page}.html`
6. Serve via dev server at `http://localhost:3000/drafts/{page}`

## Phase 5: Quality Gate

1. Run `/impeccable audit` on each generated page:
   - Scores 0-20 across: accessibility, performance, theming, responsive, anti-patterns
   - For each issue found, `/audit` recommends which command to run
2. Auto-fix P0 (critical) and P1 (serious) issues by running the recommended commands
3. Collect P2-P3 issues for designer review
4. Run `npm run lint` to verify code quality

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
| `drafts/blocks/{name}.html` | Test content per block |
| `drafts/{page}.html` | Full generated pages |
```

- [ ] **Step 3: Commit**

```bash
git add stardust-plugin/.cursor/skills/build/
git commit -m "feat: add /stardust:build skill with wireframe-to-EDS mapping"
```

---

### Task 9: Refine Skill

**Files:**
- Create: `stardust-plugin/.cursor/skills/refine/SKILL.md`

- [ ] **Step 1: Write SKILL.md**

Create `stardust-plugin/.cursor/skills/refine/SKILL.md`:

```markdown
---
name: refine
description: "Designer-driven refinement and publishing. Translates natural feedback into impeccable commands, handles DA content pipeline and deployment. Use after build is complete, or when the designer wants to polish and publish their pages."
---

# Refine

Iterative refinement driven by designer feedback, plus publishing to DA and preview/production environments.

## MANDATORY PREPARATION

1. Check that generated pages exist in `drafts/`. If not, tell the user to run `/stardust:build` first.
2. Read `.impeccable.md` for design context.
3. Start the AEM dev server if not running: `npx -y @adobe/aem-cli up --no-open`

---

## Refinement Loop

This stage is **iterative**. The designer reviews pages and gives feedback until satisfied.

### Feedback Vocabulary

Map designer feedback to impeccable commands:

| Designer says | Run | What it does |
|---|---|---|
| "Make this bolder/more dramatic" | `/impeccable bolder` | Increase visual weight, contrast, size |
| "Too loud/busy/overwhelming" | `/impeccable quieter` | Reduce visual noise, simplify |
| "Add some personality/delight" | `/impeccable delight` | Add micro-interactions, visual surprises |
| "Add animations/transitions" | `/impeccable animate` | Add meaningful motion |
| "Polish this/make it perfect" | `/impeccable polish` | Final refinement pass |
| "Check accessibility" | `/impeccable audit` | Run 5-dimension quality audit |
| "Fix the responsive layout" | `/impeccable harden` | Fix edge cases and responsive issues |
| "The colors feel off" | `/impeccable colorize` | Refine color application |
| "Typography needs work" | `/impeccable typeset` | Refine type hierarchy and spacing |
| "Simplify this section" | `/impeccable distill` | Reduce to essentials |
| "This layout doesn't work" | `/impeccable arrange` | Restructure spatial layout |

If the feedback doesn't map to a specific command, apply the changes directly and run `/impeccable critique` to verify the result.

### Refinement Process

1. Ask: "What would you like to change? You can point to specific sections or give overall direction."
2. Map feedback to the appropriate impeccable command(s)
3. Run the command against the relevant page/section
4. Show the result: "Changes applied. Refresh http://localhost:3000/drafts/{page} to see the update."
5. Ask: "How does that look? Anything else?"
6. Repeat until designer is satisfied

### Verification

Before publishing, run `/verification` (from superpowers) to check that final pages match the approved wireframe intent:
- Do all wireframe sections have corresponding rendered sections?
- Does the visual hierarchy match the wireframe's proportions?
- Are the CTAs from the briefing present and prominent?

Run `/code-review` (from superpowers) on any new or modified blocks to check code quality before shipping.

## Publishing

When the designer is ready to publish:

### Option A: DA Content Pipeline

1. Use `da-content-pipeline` (from eds-site-builder) to push content to Document Authoring
2. This converts `drafts/*.html` into DA-editable content that authors can maintain
3. Confirm: "Content pushed to DA. Authors can now edit pages in Google Docs/Word."

### Option B: Git + Preview

1. Commit all changes (blocks, styles, drafts)
2. Push to a feature branch
3. Construct preview URL: `https://{branch}--{repo}--{owner}.aem.page/`
4. Run `pagespeed-audit` (from eds-site-builder) against the preview URL
   - Target: score of 100
   - Fix any performance issues before proceeding
5. Tell designer: "Preview is live at {URL}. Review and let me know when ready for a PR."

### Option C: Both

Run DA pipeline first, then git push for code changes. Content lives in DA, presentation lives in the repo.

## Artifacts Written

| File | Description |
|------|-------------|
| Modified `blocks/` and `styles/` | Refinement changes |
| DA content | Pushed to Document Authoring (if chosen) |
| Git branch + preview URL | Deployed for review (if chosen) |
```

- [ ] **Step 2: Commit**

```bash
git add stardust-plugin/.cursor/skills/refine/SKILL.md
git commit -m "feat: add /stardust:refine skill"
```

---

### Task 10: Navigator Skill

The navigator is written last because it needs to know about all artifacts from all stages.

**Files:**
- Create: `stardust-plugin/.cursor/skills/stardust/SKILL.md`

- [ ] **Step 1: Write SKILL.md**

Create `stardust-plugin/.cursor/skills/stardust/SKILL.md`:

```markdown
---
name: stardust
description: "Navigate the stardust pipeline — assess project state and recommend the next step for building an AEM EDS website from brand guidelines. Use when the user wants to check progress, doesn't know what to do next, or says /stardust."
---

# Stardust Navigator

Assess the current project state and guide the user to the right next step.

## How This Works

You are the navigator for the stardust pipeline — a skill-based flow for creating AEM Edge Delivery Services websites from brand guidelines. You read artifacts on disk to determine where the project is, then recommend the next step.

You NEVER write or modify files. You only read and recommend.

---

## Step 1: Read Project State

Check for these artifacts and record which exist:

```
Check: stardust/brand-profile.json          → brand_extracted
Check: .impeccable.md                        → design_personality
Check: stardust/brand-board.html             → brand_board
Check: styles/styles.css (has custom props)  → design_system_css
Check: stardust/design-tokens.json           → design_tokens
Check: stardust/briefings/ (has .md files)   → briefings
Check: stardust/wireframes/ (has .html files)→ wireframes
Check: stardust/block-manifest.json          → block_manifest
Check: blocks/ (non-boilerplate blocks)      → custom_blocks
Check: drafts/ (page .html files)            → generated_pages
```

To check if `styles/styles.css` has custom properties (not just boilerplate), look for brand-specific custom property names like `--color-primary`, `--heading-font-family`, or properties that don't match the default boilerplate values.

To check for non-boilerplate blocks, compare `blocks/` contents against the standard set: cards, columns, footer, fragment, header, hero. Any additional blocks are custom.

## Step 2: Determine Pipeline State

Based on which artifacts exist, determine the stage:

| State | Condition | Next Step |
|---|---|---|
| **Fresh project** | No stardust/ artifacts | Start with `/stardust:brand` |
| **Brand in progress** | brand_profile but no brand_board | Complete brand: render the board |
| **Brand complete** | brand_profile + brand_board + design_personality | Run `/stardust:design-system` |
| **Design system applied** | design_system_css + design_tokens | Run `/stardust:experience` |
| **Briefings authored** | briefings exist but no wireframes | Continue `/stardust:experience` to create wireframes |
| **Wireframes approved** | wireframes exist but no block_manifest | Run `/stardust:build` |
| **Build in progress** | block_manifest exists, some blocks built | Continue `/stardust:build` |
| **Build complete** | generated_pages exist | Run `/stardust:refine` |
| **Ready to ship** | All artifacts present, pages refined | Publish via `/stardust:refine` |

## Step 3: Present Status

Report to the user in this format:

```
## Stardust Pipeline Status

### Completed
- ✓ Brand extracted (brand-profile.json)
- ✓ Design personality set (.impeccable.md)
- ✓ Brand board rendered
- ✓ Design system applied

### Current
→ Experience Design: 2 briefings authored, 0 wireframes created

### Next Step
Run `/stardust:experience` to create visual wireframes from your briefings.
```

Adapt the format to what's actually present. If nothing exists yet:

```
## Stardust Pipeline Status

This is a fresh project. No pipeline artifacts found yet.

### Next Step
Run `/stardust:brand` to start by extracting your brand identity.

You'll need one of:
- A brand guidelines URL (Corebook, Frontify, etc.)
- A brand guidelines PDF
- Or we can discover your brand through conversation
```

## Step 4: Offer Entry Points

If the user already has some artifacts from outside the pipeline (e.g., they manually created CSS or have brand tokens from another tool), acknowledge this:

- "I see you already have custom styles in styles.css. Want me to extract design tokens from your existing CSS so you can skip to experience design?"
- "You have blocks beyond the boilerplate (accordion, testimonials). These will be available for the build stage."

## Pipeline Reference

Consult [artifact-map.md](reference/artifact-map.md) for the complete artifact specification including file formats, required fields, and detection logic.

## Skills in the Pipeline

| Stage | Skill | What it does |
|---|---|---|
| Brand | `/stardust:brand` | Extract brand → board + tokens + personality |
| Design System | `/stardust:design-system` | Tokens → EDS CSS |
| Experience Design | `/stardust:experience` | Briefings + visual wireframes |
| Build | `/stardust:build` | Wireframes → EDS blocks + generated pages |
| Refine | `/stardust:refine` | Polish + publish |
```

- [ ] **Step 2: Commit**

```bash
git add stardust-plugin/.cursor/skills/stardust/SKILL.md
git commit -m "feat: add /stardust navigator skill"
```

---

### Task 11: Validate Plugin Structure

Verify the complete plugin is structurally correct and ready for local installation.

**Files:**
- None created — validation only

- [ ] **Step 1: Verify directory structure**

```bash
find stardust-plugin -type f | sort
```

Expected output:
```
stardust-plugin/.claude-plugin/marketplace.json
stardust-plugin/.cursor/skills/brand/SKILL.md
stardust-plugin/.cursor/skills/brand/reference/brand-board-template.md
stardust-plugin/.cursor/skills/brand/reference/brand-profile-schema.md
stardust-plugin/.cursor/skills/build/SKILL.md
stardust-plugin/.cursor/skills/build/reference/wireframe-to-eds.md
stardust-plugin/.cursor/skills/design-system/SKILL.md
stardust-plugin/.cursor/skills/experience/SKILL.md
stardust-plugin/.cursor/skills/experience/reference/briefing-format.md
stardust-plugin/.cursor/skills/experience/reference/wireframe-guide.md
stardust-plugin/.cursor/skills/refine/SKILL.md
stardust-plugin/.cursor/skills/stardust/SKILL.md
stardust-plugin/.cursor/skills/stardust/reference/artifact-map.md
stardust-plugin/README.md
stardust-plugin/package.json
```

15 files total.

- [ ] **Step 2: Verify all SKILL.md files have valid frontmatter**

```bash
for f in stardust-plugin/.cursor/skills/*/SKILL.md; do
  echo "=== $f ==="
  head -4 "$f"
  echo
done
```

Each file should start with `---`, have `name:` and `description:` fields, and close with `---`.

- [ ] **Step 3: Verify skill names match directory names**

| Directory | Expected `name:` in frontmatter |
|---|---|
| `stardust/` | `stardust` |
| `brand/` | `brand` |
| `design-system/` | `design-system` |
| `experience/` | `experience` |
| `build/` | `build` |
| `refine/` | `refine` |

- [ ] **Step 4: Verify all reference links resolve**

Check that every `[text](reference/file.md)` link in SKILL.md files points to a file that exists:

```bash
grep -roh 'reference/[a-z-]*.md' stardust-plugin/.cursor/skills/*/SKILL.md | sort -u | while read ref; do
  skill_dir=$(grep -rl "$ref" stardust-plugin/.cursor/skills/*/SKILL.md | head -1 | xargs dirname)
  if [ ! -f "$skill_dir/$ref" ]; then
    echo "MISSING: $skill_dir/$ref"
  else
    echo "OK: $skill_dir/$ref"
  fi
done
```

All should report OK.

- [ ] **Step 5: Verify marketplace.json is valid JSON**

```bash
python3 -m json.tool stardust-plugin/.claude-plugin/marketplace.json > /dev/null && echo "Valid JSON" || echo "Invalid JSON"
```

- [ ] **Step 6: Commit final validation**

```bash
git add -A stardust-plugin/
git commit -m "feat: complete stardust plugin v0.1.0"
```
