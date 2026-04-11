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
Check: nav.plain.html (project root)         → nav_fragment
Check: footer.plain.html (project root)      → footer_fragment
Check: drafts/ (page .plain.html files)      → generated_pages
```

To check if `styles/styles.css` has custom properties (not just boilerplate), look for brand-specific custom property names like `--color-primary`, `--heading-font-family`, or properties that don't match the default boilerplate values.

To check for non-boilerplate blocks, compare `blocks/` contents against the standard set: cards, columns, footer, fragment, header, hero. Any additional blocks are custom.

## Step 2: Determine Pipeline State

Based on which artifacts exist, determine the stage:

| State | Condition | Next Step |
|---|---|---|
| **Fresh project** | No stardust/ artifacts | Start with `/stardust:brand` |
| **Brand in progress** | brand_profile but no brand_board | Complete brand: render the board |
| **Brand complete** | brand_profile + brand_board + design_personality | Run `/stardust:experience` |
| **Briefings authored** | briefings exist but no wireframes | Continue `/stardust:experience` to create wireframes |
| **Wireframes approved** | wireframes exist but no design_tokens | Run `/stardust:design-system` |
| **Design system applied** | design_system_css + design_tokens but no block_manifest | Run `/stardust:build` |
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
- ✓ Experience: 3 briefings authored, 3 wireframes approved

### Current
→ Design System: wireframes approved, ready to derive CSS tokens

### Next Step
Run `/stardust:design-system` to generate EDS CSS from your approved wireframes.
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
| Experience Design | `/stardust:experience` | Briefings + visual wireframes (uses brand colors/fonts) |
| Design System | `/stardust:design-system` | Derive EDS CSS from approved wireframes + brand profile |
| Build | `/stardust:build` | Wireframes → EDS blocks + generated pages |
| Refine | `/stardust:refine` | Polish + publish |
