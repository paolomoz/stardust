---
name: stardust
description: "Navigate the stardust pipeline — assess project state and recommend the next step for building an AEM EDS website. Use when the user wants to check progress, doesn't know what to do next, or says /stardust."
---

# Stardust Navigator

Assess the current project state and guide the user to the right next step.

## How This Works

You are the navigator for the stardust pipeline — a skill-based flow with two phases:

- **Design phase (EDS-agnostic):** `/stardust:brand`, `/stardust:briefings`, `/stardust:wireframes` (optional), `/stardust:design`.
- **EDS phase (implementation):** `/stardust:eds-design`, `/stardust:eds-build`, `/stardust:eds-refine`.

You read artifacts on disk to determine where the project is, then recommend the next step. You NEVER write or modify files.

---

## Step 1: Read Project State

Check for these artifacts and record which exist:

```
Check: stardust/brand-profile.json          → brand_extracted
Check: .impeccable.md                        → design_personality
Check: stardust/brand-board.html             → brand_board
Check: stardust/briefings/ (has .md files)   → briefings
Check: stardust/wireframes/ (has .html files)→ wireframes (optional, grey)
Check: stardust/designs/ (has .html files)   → designs (branded)
Check: stardust/design-tokens.json           → design_tokens
Check: styles/styles.css (has custom props)  → eds_css
Check: stardust/block-manifest.json          → block_manifest
Check: blocks/ (non-boilerplate blocks)      → custom_blocks
Check: nav.plain.html (project root)         → nav_fragment
Check: footer.plain.html (project root)      → footer_fragment
Check: drafts/ (page .plain.html files)      → generated_pages
```

To check if `styles/styles.css` has custom properties (not just boilerplate), look for brand-specific custom property names like `--color-primary`, `--heading-font-family`, or properties that don't match the default boilerplate values.

To check for non-boilerplate blocks, compare `blocks/` contents against the standard set: cards, columns, footer, fragment, header, hero. Any additional blocks are custom.

## Soft-Gate Model

The non-EDS skills (`brand`, `briefings`, `wireframes`, `design`) never block
on missing inputs. If a user invokes any of them with gaps upstream, the skill
synthesizes plausible defaults and stamps a provenance comment on the produced
artifact. You recommend the ideal next step, but the user is free to skip
around — they will see the provenance notes when they open the artifacts.

The EDS skills (`eds-design`, `eds-build`, `eds-refine`) stay strict and do
require their inputs. Your recommendations for those still gate.

## Step 2: Determine Pipeline State

Brand, briefings, wireframes, and design can each run in any order. The ideal
path is brand → briefings → wireframes → design, but any skill can run with
upstream gaps — inputs will be synthesized and provenance stamped. Your job is
to recommend the most useful next step, not to enforce a sequence.

### Design phase

| State | Condition | Next Step |
|---|---|---|
| **Fresh project** | Nothing in `stardust/` | Recommended: `/stardust:brand` or `/stardust:briefings` first — but any skill can be invoked; missing inputs will be synthesized with provenance. |
| **Brand in progress** | brand_profile but no brand_board | Complete brand: render the board |
| **Brand only** | brand artifacts present, no briefings | Run `/stardust:briefings` |
| **Briefings only** | briefings present, no brand | Run `/stardust:brand` |
| **Both ready** | brand + briefings present, no wireframes and no designs | Run `/stardust:wireframes` (optional, grey structural pass) **or** `/stardust:design` (skip wireframes and go straight to branded) |
| **Wireframes approved** | wireframes exist, no designs | Run `/stardust:design` |
| **Designs in progress** | some designs rendered, others not | Continue `/stardust:design` |

### EDS phase

| State | Condition | Next Step |
|---|---|---|
| **Designs approved** | designs exist, no design_tokens | Run `/stardust:eds-design` |
| **EDS design applied** | design_tokens + eds_css, no block_manifest | Run `/stardust:eds-build` |
| **EDS build in progress** | block_manifest exists, some blocks built | Continue `/stardust:eds-build` |
| **EDS build complete** | generated_pages exist | Run `/stardust:eds-refine` |
| **Ready to ship** | All artifacts present, pages refined | Publish via `/stardust:eds-refine` |

## Step 3: Present Status

Report to the user in two phases so the agnostic/EDS boundary is visible:

```
## Stardust Pipeline Status

### Design phase
- ✓ Brand extracted (brand-profile.json)
- ✓ Design personality set (.impeccable.md)
- ✓ Brand board rendered
- ✓ Briefings: 3 pages authored
- ✓ Wireframes: 3 pages (grey, approved)
- → Designs: 1 of 3 rendered

### EDS phase
- Not started

### Next Step
Continue `/stardust:design` to render the remaining pages.
```

Adapt the format to what's actually present. If nothing exists yet:

```
## Stardust Pipeline Status

This is a fresh project. No pipeline artifacts found yet.

### Next Step
Run `/stardust:brand` or `/stardust:briefings` — they are independent; either can come first.

Brand needs one of:
- A brand guidelines URL (Corebook, Frontify, etc.)
- A brand guidelines PDF
- Or we can discover your brand through conversation

Briefings need one of:
- A one-line prompt per page
- Or a structured description of intent, audience, CTAs
- Or fully-specified copy and imagery
```

## Step 4: Offer Entry Points

If the user already has some artifacts from outside the pipeline (e.g., they manually created CSS or have brand tokens from another tool), acknowledge this:

- "I see you already have custom styles in styles.css. Want me to extract design tokens from your existing CSS so you can skip to briefings and designs?"
- "You have blocks beyond the boilerplate (accordion, testimonials). These will be available for the eds-build stage."

## Full Pipeline Run (End-to-End)

When the user asks to run the full pipeline end-to-end (e.g., "run all stardust stages", "build the whole site", or provides a detailed brief with brand source + page requirements), execute each stage in sequence without waiting for approval at each gate:

1. **`/stardust:brand`** — extract brand identity, render board, auto-approve.
2. **`/stardust:briefings`** — capture page intent from the user's brief, auto-approve.
3. **`/stardust:wireframes`** — grey structural pass, auto-approve. (Skip if the user explicitly opts out — going straight to `design` is valid.)
4. **`/stardust:design`** — branded design per page, auto-approve after critique.
5. **`/stardust:eds-design`** — derive EDS CSS tokens from approved designs + brand profile.
6. **`/stardust:eds-build`** — build blocks, generate pages, start dev server.

Brand and briefings are independent and can run in either order, but the end-to-end default runs brand first so briefings can reference brand voice when the user wants fully-specified copy.

Each stage skill has a "pipeline automation" note in its approval gate section — when running end-to-end, skip interactive approval loops and continue to the next stage.

At the end, report the dev server URL(s) for the user to review all pages.

## Pipeline Reference

Consult [artifact-map.md](reference/artifact-map.md) for the complete artifact specification including file formats, required fields, and detection logic.

## Skills in the Pipeline

| Phase | Stage | Skill | What it does |
|---|---|---|---|
| Design | Brand | `/stardust:brand` | Extract brand → board + tokens + personality |
| Design | Briefings | `/stardust:briefings` | Capture page intent (standalone, no brand dependency) |
| Design | Wireframes | `/stardust:wireframes` | Optional — grey structural pass from briefings |
| Design | Design | `/stardust:design` | Branded, high-fidelity HTML designs (EDS-independent) |
| EDS | EDS Design | `/stardust:eds-design` | Derive EDS CSS from approved designs + brand profile |
| EDS | EDS Build | `/stardust:eds-build` | Designs → EDS blocks + generated pages |
| EDS | EDS Refine | `/stardust:eds-refine` | Polish + publish |
