---
name: design
description: "Design in the browser — render branded, high-fidelity HTML designs per page using the brand and (optionally) grey wireframes. EDS-independent. Iterate directly in the rendered page until the user approves. Use when the user is ready to design visuals, or when /stardust recommends the design stage."
---

# Design

Design in the browser. Produce **branded, high-fidelity HTML** for each page — real fonts, real colors, real copy — and iterate on it directly with the user until they approve. The output is static HTML, still EDS-independent.

This is the stage where visual design decisions happen: type scale, spacing, proportions, button sizing, visual weight, section rhythm. The approved designs become the authoritative input to `/stardust:eds-design`.

## Pre-flight

Run the procedure in [`../_shared/preflight.md`](../_shared/preflight.md) first.

## Contract

**Needs (reads if present):**
- `stardust/brand-profile.json`
- `stardust/briefings/{page}.md` (including optional `# Copy` and `# Imagery`)
- `stardust/wireframes/{page}.html`
- `.impeccable.md`

**Produces:**
- `stardust/designs/{page}.html` (self-contained, branded, desktop fidelity)

**If missing:**
- No brand-profile.json → synthesize a neutral brand shape (system-ui fonts, mono palette, straight voice). Stamp provenance in the design's `<head>`.
- No briefing → prompt the user for a one-line page intent; synthesize a minimal briefing (in memory only, unless the user says "save it"); stamp provenance.
- Briefing has no `# Copy` → generate on-brand copy following `brand-profile.json` voice rules and `.impeccable.md`. Stamp provenance per section.
- No wireframe → shape structure from the briefing directly.
- No `.impeccable.md` → use brand-profile defaults only.

## Copy Ownership

The briefing is the source of truth for copy.

- If a section has `# Copy` in the briefing, use those strings **verbatim**. Never rewrite.
- If a section has no `# Copy`, generate on-brand copy and record provenance (per-section, in the `<head>` provenance block — e.g. `hero.headline: synthesized`).
- **Never auto-write generated copy back to the briefing.** If the user asks ("also save this to the briefing") perform a single, targeted writeback and report what changed.

---

## Phase 1: Plan

For each briefing:

1. Load structural input:
   - If `stardust/wireframes/{page}.html` exists, use it as the section order and layout reference.
   - If not, run `/impeccable shape` to plan the sections from the briefing.
2. For each section, check the briefing's `# Copy`:
   - Present → use **verbatim**. Do not rewrite under any feedback loop unless the user explicitly says to change the words in the briefing.
   - Absent → generate on-brand copy; add the slot to the design's provenance block (e.g. `hero.headline: synthesized`).
   - Never write generated copy back to the briefing automatically. Offer: "Want me to also save these lines to the briefing?" after the first render — act only on explicit confirmation.
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
- **Provenance block** — if any input was synthesized (brand, briefing, wireframe, or any `# Copy` slot), include a `<!-- stardust:provenance ... -->` comment as the first child of `<head>` per [`../_shared/skill-contract.md`](../_shared/skill-contract.md). List each synthesized input and, for copy, each synthesized slot.

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
