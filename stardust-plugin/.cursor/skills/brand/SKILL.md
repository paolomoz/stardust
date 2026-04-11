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
