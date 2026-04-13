---
name: wireframes
description: "Render low-fidelity grey wireframes from briefings — structure, hierarchy, section order, spatial relationships only. No brand required. Optional stage: users can skip to /stardust:design if they want to go straight to branded layout. Use when the user wants to validate page structure before visual design, or when /stardust recommends the wireframes stage."
---

# Wireframes

Turn approved briefings into **grey, structural** wireframes — boxes, bars, shapes — so the user can validate page structure (section order, hierarchy, density, spatial relationships) before committing to visual design.

This stage is **optional**. A user who already has a clear structural vision can skip straight to `/stardust:design`.

## MANDATORY PREPARATION

1. Read `stardust/briefings/` — at least one `{page}.md` must exist. If none, stop and tell the user: "Wireframes need at least one briefing. Run `/stardust:briefings` first."
2. Do **not** require or read `stardust/brand-profile.json`. Wireframes at this stage are intentionally pre-brand.
3. Read `.impeccable.md` if it exists — informs tone when drafting section intents.

---

## Phase 1: Plan

For each page with an approved briefing:

1. Read the page briefing from `stardust/briefings/{page}.md`.
2. Read the site briefing from `stardust/briefings/_site.md` if it exists (including the Content Reuse Map).
3. Run `/impeccable shape` — UX discovery:
   - What sections does this page need?
   - What's the visual hierarchy?
   - How does the user flow through the content?
   - `/shape` produces a design brief — use this as the structural plan.
4. For multi-page sites, run `/write-plan` (from superpowers) first to plan the information architecture across all pages before wireframing individual ones.

## Phase 2: Render (Grey Mode)

Render each wireframe as visual HTML in grey mode:

- **Pure grey layout:** boxes, bars, shapes. No brand colors, no real fonts (system-ui is fine).
- Background: light grey (#f5f5f5); elements in shades of grey.
- Placeholder text as grey bars; images as grey rectangles with labels.
- Shows: section order, relative sizing, content density, spatial relationships.
- Each section gets `data-section`, `data-intent`, `data-layout` attributes so the design stage can pick up the structure.
- For multi-page sites: add `data-fragment`, `data-fragment-role`, and `data-fragment-source` attributes to reusable content sections — see [wireframe-guide.md](reference/wireframe-guide.md) Content Reuse & Fragments section.
- Include the JSON metadata block linking to the briefing (with `fragments` map for multi-page sites).
- Write to `stardust/wireframes/{page}.html`.

Follow the full rendering rules in [wireframe-guide.md](reference/wireframe-guide.md).

## Phase 3: Serve

- Start the AEM dev server if not running: `npx -y @adobe/aem-cli up --no-open`
- Tell the user: "Your wireframe is ready. Open http://localhost:3000/stardust/wireframes/{page}.html to review it."

## Phase 4: Approval Gate

Soft gate — the user approves structure, not visuals.

Present the wireframe and ask: "Does this structure match what you had in mind? What should change?"

Common feedback:
- **"Swap these sections"** → Reorder, re-render.
- **"Add a section for [X]"** → Add new section with data attributes, re-render.
- **"This section is too big/small relative to the rest"** → Adjust proportions, re-render.
- **"I want something interactive here"** → Add `data-interactive` attribute.

Iterate until the user approves. Then:
1. If `stardust/brand-profile.json` exists: "Wireframes approved. Run `/stardust:design` to upgrade them to branded designs."
2. If not: "Wireframes approved. Run `/stardust:brand` to capture your brand, then `/stardust:design` to layer it onto these wireframes."

**Pipeline automation:** When invoked as part of a full pipeline run, auto-approve and continue.

## Why Wireframes Before Design

Wireframes let you make **structural** decisions (what goes where, in what order, at what relative size) without being distracted by **visual** ones (what colors, fonts, and proportions). Separating the two means each decision gets full attention.

Users who already know the structure can skip this stage entirely and go briefings → design.

## Artifacts Written

| File | Description |
|------|-------------|
| `stardust/wireframes/{page}.html` | Grey structural wireframes — self-contained HTML |
