# Brand Board Format

The brand board is a visual HTML artifact rendered from `brand-profile.json`. The designer reviews and approves this — never the raw JSON.

## Sections (in order)

1. **Brand Philosophy** — mission statement, positioning
2. **Logo** — variants (full color, white on dark, black B&W, alternative), clear space rules with visual, do/don't grid, co-branding rules
3. **Color Palette** — primary, secondary, and web-specific palettes with Pantone codes, hex values, and usage context per color
4. **Typography** — full hierarchy (header, subheader, body, eyebrow, button) with live type specimens, weight/size/line-height metadata, and typographic rules (dollar signs, trademarks, capitalization)
5. **Photography & Video** — studio standards, demo setup, social content direction, do/don't rules. Covers lighting, composition, subject matter, platform-specific guidelines
6. **Voice** — personality traits as tags (this/not-this), paired do/don't copy examples, sound rules (what to never do)
7. **Tone Adaptation** — writing goals (educate/engage/inspire) with descriptions, clever vs. clear guidance by context
8. **Content Pillars** — the 3-5 themes anchoring all content, with purpose descriptions
9. **Personas** — target audience profiles with values, motivations, behavioral stats, quote/motto

## Design Principles

- **Sticky navigation** at top with section links for quick jumping
- **Live type specimens** using actual brand fonts (or closest web-safe fallback)
- **Visual color swatches** at actual size, not tiny dots
- **Do/Don't pairs** are always visual — side by side, color-coded green/red
- **Copy examples** are real brand-voice text, not lorem ipsum
- **Self-contained HTML** with embedded styles — no external dependencies

## Artifact Location

- `stardust/brand-board.html` — the visual board (generated, designer reviews this)
- `stardust/brand-profile.json` — the machine-readable source of truth (agent uses this)

## Fidelity Levels

The brand board always renders at full fidelity. Unlike wireframes (which have grey/branded modes), the brand board IS the brand — it uses the actual extracted values. If fonts aren't available as web fonts, it falls back to the closest system font and flags it.

## Reference Implementation

See `.superpowers/brainstorm/*/content/brand-board-full.html` for the Vitamix example at full depth.
