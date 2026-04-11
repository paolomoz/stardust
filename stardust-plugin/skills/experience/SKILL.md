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

This is a **hard gate** in interactive mode. Do not proceed to Build until the designer approves.

**Pipeline automation:** When invoked as part of a full pipeline run (e.g., the user asked to run all stardust stages end-to-end with auto-approve), skip the interactive approval loop. Auto-approve and continue to the next stage. The user can always come back to refine later.

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
