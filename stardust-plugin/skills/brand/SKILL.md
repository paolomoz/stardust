---
name: brand
description: "Create, extract, refine, review, critique, or iterate on the brand identity at `stardust/brand-profile.json` and `stardust/brand-board.html` — philosophy, logo, colors, typography, componentStyle, motifs, photography direction, voice, tone, content pillars, personas, spacing. Ingests guidelines (PDF, URL, or conversation) or iterates on an existing profile. Use when starting a new EDS website project, when the user provides brand guidelines, when the user asks to change, refine, refactor, review, improve, or suggest changes to any aspect of brand identity or any file under `stardust/brand-profile.json` / `stardust/brand-board.html`, or when /stardust recommends the brand stage."
---

# Brand Extraction

Extract brand identity from guidelines and produce a visual brand board for designer approval.

## Pre-flight

Run the procedure in [`../_shared/preflight.md`](../_shared/preflight.md) first.
`.impeccable.md` is optional input; if absent this skill may create it.

## Contract

**Needs (reads if present):**
- Brand URL, PDF, or conversational description from the user
- `.impeccable.md` (design personality, if any)

**Produces:**
- `stardust/brand-profile.json`
- `stardust/brand-board.html`
- `.impeccable.md` (created or updated)

**If missing:**
- No URL/PDF/description → ask the user one conversational prompt ("tell me about the brand in a sentence"), synthesize a neutral brand-profile shape (system fonts, mono palette, straight voice), and stamp provenance per [`../_shared/skill-contract.md`](../_shared/skill-contract.md).
- No `.impeccable.md` → create a minimal one and stamp provenance at the top.

---

## Inputs

The designer provides ONE of:
1. **Brand guidelines URL** — a web-based brand guide (e.g., Corebook, Frontify, Brandfolder)
2. **Brand guidelines PDF** — uploaded document
3. **No guidelines** — the designer describes their brand vision conversationally

## Phase 1: Extract

### If guidelines URL or PDF provided:

**Always use a real browser (Playwright or equivalent) to extract brand signals from a URL. Do NOT rely on WebFetch or raw HTML — it misses JS-rendered copy, computed styles, and the visual identity cues that actually make a brand recognizable.**

WebFetch inference produces generic brand profiles ("Inter body, pill buttons, deep blue accent") that could describe any product. The goal here is *specificity* — the quirks that make the brand itself, not a generic version of its category.

#### 1. Drive a real browser

Use Playwright (Chromium, viewport 1440×900, deviceScaleFactor 2) to load the URL, wait for network idle + ~1.5s, then both:

- **Take screenshots** — a hero clip (1440×900) and a full-page screenshot. Save to a scratch dir.
- **Evaluate computed styles in the page context** and capture:
  - `:root` / `html` CSS custom properties (brand often exposes design tokens here)
  - `<body>` computed `background-color`, `color`, `font-family`
  - All unique `font-family` values in use (walk `body, body *`)
  - First 10 headings: tag, text, `font-family`, `font-weight`, `font-size`, `line-height`, `letter-spacing`, `color`
  - First `<p>` body sample with the same style props — note `color` carefully (Arc uses `rgba(0,0,0,0.65)`, not pure ink)
  - `<em>`, `<i>`, or `[class*="italic"]` elements — the italic display accent often lives here and is brand-specific (Exposure VAR, etc.)
  - First 8 CTAs (`a[class*="button"]`, `button`, `[class*="cta"]`): text, `background-color`, `color`, `border-radius`, `padding`, `font-family`, `font-weight`. Capture **multiple CTA variants** — primary/inverted/inked patterns matter.
  - Section background colors (walk `section, header, main > div`) — surface a variant cream, a variant ink, or an off-white you'd otherwise miss
  - `<img>` and `<svg>` with logo/brand/hero classes — source paths
  - Meta tags, especially `theme-color` (the brand's official color), `description`, `og:*`
  - Hero copy text (first 6 h1/h2/p contents)

#### 2. Identify identity traits, not just tokens

After extraction, explicitly look for and record:

- **Signature border-radius** — brands often pick a specific non-round value (10px, 14px). Record it as `componentStyle.borderRadius.default`.
- **Body text opacity** — is body copy at full ink or softened (e.g. 65%)? This is a recurring brand trait.
- **Display metrics** — if headings run tight (`line-height < 1.0`, `letter-spacing < -0.03em`), capture both values verbatim. These feel-of-type details are what separate a real brand from a generic clone.
- **Multiple CTA patterns** — if you see inked-black, branded-color, and inverted buttons, record all three with their exact styles.
- **Color variants for context** — capture "cream on blue" as a separate color if the value differs from "cream on cream" (e.g. `#FFFADD` vs `#FFFCEC`).
- **Visual motifs beyond logos/colors** — look at the screenshot and name them: dashed dividers, aurora gradients, squiggle separators, noise textures, hand-drawn elements. Add a `motifs` array to the brand profile with `name`, `description`, `usage`. These motifs are what signal the brand before a word is read.

#### 3. Voice examples from live copy

Pull real copy from the rendered page (hero headlines, CTAs, micro-copy) for `voice.examples.do`. Real examples beat invented ones. Note rhetorical devices — em-dashes, rhythmic triplets, single-word italic accents — and call them out in `voice.rules`.

#### 4. PDFs and non-URL sources

If the input is a PDF or uploaded asset, use `brand-extractor` (from eds-site-builder) as a fallback. Playwright is the primary path only for URLs.

#### 5. Write the profile

Map everything to the brand profile schema — consult [brand-profile-schema.md](reference/brand-profile-schema.md). Include an `extraction` block recording `method`, `source`, `capturedAt`, and screenshot paths so future runs can verify against ground truth.

If any input was synthesized (no URL/PDF/description), add a `"_provenance"` key at the top of the JSON per [`../_shared/skill-contract.md`](../_shared/skill-contract.md).

Pay special attention to:
- **Voice examples** — do/don't copy pairs. Critical for content generation. Extract from live copy.
- **Photography direction** — style rules, composition, subject matter. Feeds image generation.
- **Logo variants** — save all variants to `icons/`. SVG preferred, optimized PNG fallback.
- **Color roles** — don't just capture hex, capture what each color is FOR (CTAs, headings, backgrounds, on-blue text).
- **Motifs** — the non-obvious visual gestures. Without these the board reads as a generic palette.

### If no guidelines (conversational):

1. Invoke `/brainstorm` (from superpowers) to run a brand discovery conversation
2. Ask about: brand name, mission, target audience, personality (3-5 adjectives), colors they like/dislike, typography preference (serif/sans/mixed), photography style, competitive positioning
3. From the conversation, construct `stardust/brand-profile.json` with whatever was discussed
4. Mark optional fields as null — the designer can fill them in later

## Phase 2: Design Personality

`.impeccable.md` captures the designer's *taste* — references, pet peeves, which rules to bend — signal that can't be inferred from the brand profile alone. It's produced by an interactive interview and used as a quality gate by downstream skills.

**`/impeccable teach` is a slash command — you (the assistant) cannot invoke it directly.** Instead:

1. If `.impeccable.md` already exists, skip this phase.
2. Otherwise, pause and recommend to the designer:
   > Before we render the brand board, run `/impeccable teach` in the prompt. It will interview you about design personality (references, do's and don'ts, taste) and write `.impeccable.md`. Downstream quality gates read this file.
   >
   > This is optional but recommended. You can also skip it — we can always run `/impeccable teach` later and re-refine. Reply "skip" to continue without it, or run the command now and then ask me to continue.
3. Wait for the designer to either run `/impeccable teach` (then resume) or explicitly say "skip". Do not invent `.impeccable.md` content from the brand profile — that provides no signal beyond what's already captured.

**Pipeline automation:** When invoked as part of a full end-to-end pipeline run, skip this phase without prompting. The designer can run `/impeccable teach` later and re-refine.

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

This is a **hard gate** in interactive mode. Do not proceed until the designer approves.

**Pipeline automation:** When invoked as part of a full pipeline run (e.g., the user asked to run all stardust stages end-to-end with auto-approve), skip the interactive approval loop. Auto-approve and continue to the next stage. The user can always come back to refine later.

Present the brand board and ask: "Does this accurately represent your brand? What needs to change?"

Common feedback and how to handle it:
- **"That color is wrong"** → Update the hex in brand-profile.json, re-render the board
- **"The voice feels too [formal/casual/etc]"** → Update voice traits and examples, re-run `/teach` to update .impeccable.md
- **"Missing our secondary font"** → Add to typography section, re-render
- **"Photography direction is off"** → Update photography rules, re-render

Iterate until the designer says the board looks right. Then:
1. Confirm the brand profile is saved
2. Confirm .impeccable.md exists
3. Tell the designer: "Brand extraction complete. Run `/stardust` to see your next step. Briefings (`/stardust:briefings`) can be written in parallel; once brand and briefings are ready, choose `/stardust:wireframes` for a grey structural pass, or jump straight to `/stardust:design`."

## Artifacts Written

| File | Description |
|------|-------------|
| `stardust/brand-profile.json` | Structured brand tokens (source of truth) |
| `stardust/brand-board.html` | Visual brand board (rendered view) |
| `.impeccable.md` | Design personality for quality gates |
| `icons/*` | Logo variants and brand SVGs |
