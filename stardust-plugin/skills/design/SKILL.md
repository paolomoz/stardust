---
name: design
description: "Design in the browser — render branded, high-fidelity HTML designs per page using the brand and (optionally) grey wireframes. EDS-independent. Iterate directly in the rendered page until the user approves. Use when the user is ready to design visuals, or when /stardust recommends the design stage."
---

# Design

Design in the browser. Produce **branded, high-fidelity HTML** for each page — real fonts, real colors, real copy — and iterate on it directly with the user until they approve. The output is static HTML, still EDS-independent.

This is the stage where visual design decisions happen: type scale, spacing, proportions, button sizing, visual weight, section rhythm. The approved designs become the authoritative input to `/stardust:eds-design`.

## MANDATORY PREPARATION

1. Read `stardust/brand-profile.json`. If missing, stop and tell the user: "Design needs a brand. Run `/stardust:brand` first."
2. Read `stardust/briefings/` — at least one `{page}.md` must exist. If none, stop and tell the user: "Design needs at least one briefing. Run `/stardust:briefings` first."
3. Read `stardust/wireframes/` if it exists — use approved grey wireframes as the **structural blueprint**. If wireframes don't exist, derive structure from the briefing directly (with `/impeccable shape`).
4. Read `.impeccable.md` — it's the taste filter for every visual judgment on this stage.

---

## Phase 1: Plan

For each briefing:

1. Load structural input:
   - If `stardust/wireframes/{page}.html` exists, use it as the section order and layout reference.
   - If not, run `/impeccable shape` to plan the sections from the briefing.
2. Re-read the briefing's `# Copy` section (if present) — use those strings verbatim. For sections without `# Copy`, generate on-brand copy following `brand-profile.json` voice rules and `.impeccable.md` principles.
3. Re-read the briefing's `# Imagery` section — follow source hints; otherwise generate branded placeholders.

## Phase 2: Render (Branded Mode)

Render each design as a self-contained HTML file at desktop fidelity (1440px design target):

- **Brand fonts** via `@import` or `<link>` to web fonts.
- **Brand colors** for surfaces, text, CTAs, and accents per `brand-profile.json` color roles.
- **Real component styles** — button patterns, border-radius, motifs from the brand profile.
- **Real copy** — briefing `# Copy` verbatim, or on-brand generated copy.
- **Images** — briefing `# Imagery` sources, or branded placeholders.
- **CSS custom properties in `:root`** that expose type scale, spacing, max-width, section padding, button proportions. These values are the **authoritative desktop tokens** that `/stardust:eds-design` will extract.
- Preserve `data-section`, `data-intent`, `data-layout` attributes from the wireframe so downstream stages can read structure.

Write to `stardust/designs/{page}.html`.

Follow the rendering rules in [design-guide.md](reference/design-guide.md).

## Phase 3: Serve

- Start the AEM dev server if not running: `npx -y @adobe/aem-cli up --no-open`
- Tell the user: "Your design is ready. Open http://localhost:3000/stardust/designs/{page}.html to review it."

## Phase 4: Iterate in the Browser

This is a **design loop**, not a one-shot render. Expect multiple rounds:

Common feedback and how to handle it:
- **"Headlines are too big/small"** → Adjust `--heading-*` custom properties, re-render, refresh.
- **"Section feels cramped"** → Adjust `--section-padding` or per-section spacing, re-render.
- **"Button needs more weight"** → Adjust button padding/font-size/weight in the design CSS.
- **"Try a different accent color"** → Swap the CSS variable value; do not edit `brand-profile.json` unless the user wants to make it the new brand default.
- **"This section should feel quieter"** → Adjust typographic weight or surface color on that specific section.

Every iteration updates `stardust/designs/{page}.html`. The user reviews in the browser and gives feedback. Keep iterating until they approve.

Run `/impeccable critique` before asking the user to look at a new iteration — catch obvious issues first.

## Phase 5: Approval Gate

**Hard gate** in interactive mode — do not proceed to `/stardust:eds-design` until the user approves.

**Pipeline automation:** When invoked as part of a full pipeline run, auto-approve after two critique passes and continue.

When the user approves:
1. Confirm all designs are saved under `stardust/designs/*.html`.
2. Tell the user: "Designs approved. Run `/stardust` to see your next step, or `/stardust:eds-design` to derive the EDS CSS design system from these designs."

## Why Design Is Separate from EDS Design

`/stardust:design` is platform-agnostic — the designs could in principle feed a non-EDS build later (different SSG, different CMS). It's pure HTML + CSS judgment calls.

`/stardust:eds-design` takes those approved judgments and converts them into the EDS-specific CSS shape (boilerplate contract, mobile-first scale, `design-tokens.json`, block CSS prep).

Keeping them separate means:
- Visual design can be iterated freely without EDS complications.
- EDS translation is mechanical, not judgmental.
- The same design layer could target other platforms later.

## Artifacts Written

| File | Description |
|------|-------------|
| `stardust/designs/{page}.html` | Branded, high-fidelity static HTML per page — self-contained, EDS-independent |
