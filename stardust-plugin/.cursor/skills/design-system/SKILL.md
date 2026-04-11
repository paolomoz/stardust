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
