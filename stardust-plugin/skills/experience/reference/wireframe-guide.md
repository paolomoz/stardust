# Wireframe Guide

Wireframes are visual HTML pages that show page layout and content structure. They are unconstrained by EDS blocks — the designer thinks in terms of what they SEE, not how it's coded.

## Two Fidelity Modes

### Grey Mode (no design system yet)
- Pure grey layout: boxes, bars, shapes
- No brand colors, no real fonts
- Shows: section order, relative sizing, content density, spatial relationships
- Background: light grey (#f5f5f5), elements in shades of grey
- Placeholder text as grey bars, images as grey rectangles with labels

### Branded Mode (design system present)
- Same structure as grey mode but styled with brand tokens
- Read `stardust/design-tokens.json` for colors, fonts, spacing
- Use actual brand typography for headings
- Use brand colors for backgrounds, accents, CTAs
- Still placeholder content (grey bars for body text) but with real visual identity

### Mode Selection
- Check if `stardust/design-tokens.json` exists
- If yes: branded mode
- If no: grey mode

## HTML Structure

Each wireframe is a self-contained HTML file with embedded CSS.

### Data Attributes

Every section must include semantic data attributes for the Build stage to parse:

```html
<section data-section="hero" data-intent="emotional hook" data-layout="full-bleed">
  <!-- section content -->
</section>

<section data-section="features" data-intent="value proposition" data-layout="contained" data-items="3">
  <!-- section content -->
</section>
```

**Required attributes:**
- `data-section` — descriptive name (not an EDS block type). Use natural language: "hero", "features", "social-proof", "recipe-showcase", "closing-cta"
- `data-intent` — why this section exists: "emotional hook", "build trust", "drive action"
- `data-layout` — spatial hint: "full-bleed", "contained", "split-media", "grid"

**Optional attributes:**
- `data-items` — number of repeated items (cards, features, testimonials)
- `data-media` — media type: "image", "video", "animation", "none"
- `data-interactive` — if section has interaction: "carousel", "filter", "calculator", "tabs"

### Metadata Block

Each wireframe includes a JSON metadata block linking to its briefing:

```html
<script type="application/json" id="wireframe-meta">
{
  "page": "Homepage",
  "briefing": "homepage.md",
  "mode": "grey",
  "sections": ["hero", "features", "social-proof", "recipe-showcase", "closing-cta"]
}
</script>
```

## Visual Rendering Rules

1. **Sections are full-width dividers.** Each section is visually distinct — separated by whitespace or background color changes.
2. **Grey placeholder bars** for text: 60% width for headings, 40% for subheadings, 80-100% for body lines.
3. **Grey rectangles** for images/video with centered label text ("lifestyle image", "demo video").
4. **Rounded rectangles** for buttons/CTAs with label text ("Primary CTA", "Secondary").
5. **Card layouts** show 3-4 items side by side with image placeholder + text bars.
6. **No real copy.** Section labels (e.g., "Hero", "Features") appear as small annotations above or beside the section, not as content.
7. **Responsive.** Wireframes should be viewport-responsive — stack to single column on narrow viewports.

## Content Reuse & Fragments (Multi-Page Sites)

For multi-page sites, pages should be connected through shared content — not just navigation links. Content reuse means the same card, quote, or highlight appears on multiple pages, authored once and embedded everywhere.

### Fragment Data Attributes

Mark reusable content sections with fragment attributes so the Build stage can implement them as shared fragments:

```html
<!-- On the SOURCE page (where content is authored): -->
<section data-section="recipe-grid" data-fragment="recipe-card" data-fragment-role="source">

<!-- On CONSUMING pages (where content is reused): -->
<section data-section="recipe-teaser" data-fragment="recipe-card" data-fragment-role="reuse" data-fragment-source="/recipes">
```

**Fragment attributes:**
- `data-fragment` — fragment type identifier (e.g., "recipe-card", "testimonial-card", "capability-highlight")
- `data-fragment-role` — either "source" (canonical home) or "reuse" (consuming page)
- `data-fragment-source` — path to the source page (only on reuse sections)

### Fragment Manifest in Metadata

The wireframe metadata block should include a `fragments` map documenting which content types are shared across pages:

```json
{
  "page": "Homepage",
  "briefing": "homepage.md",
  "mode": "branded",
  "sections": ["hero", "capabilities-tease", "recipe-showcase", "stories-teaser", "closing-cta"],
  "fragments": {
    "capability-highlight": { "source": "/capabilities", "reusedOn": ["/"] },
    "recipe-card": { "source": "/recipes", "reusedOn": ["/", "/capabilities", "/stories"] },
    "testimonial-card": { "source": "/stories", "reusedOn": ["/", "/capabilities", "/recipes"] }
  }
}
```

### Common Fragment Patterns

| Fragment Type | Source Page | Typical Reuse |
|---|---|---|
| Recipe cards (image, title, meta) | Recipes page | Homepage, product pages |
| Testimonial quotes (stars, quote, author) | Stories/testimonials page | Homepage, product pages, recipe pages |
| Capability highlights (stat, label, description) | Capabilities/product page | Homepage, recipe pages, stories pages |
| CTA banner (headline, button) | Shared across all | Every page (closing CTA) |

### Design Rules for Reused Content

1. **The homepage is a hub.** It should pull excerpts from every major content page — capabilities, recipes, stories — with clear CTAs to explore more.
2. **Inner pages cross-link to at least two other pages.** Each inner page should include at least one reused content section from a sibling page, plus a link to a third.
3. **Reused sections are excerpts, not duplicates.** Show 3-4 items from a source that has 6+. This creates a "see more" motivation.
4. **Every reused section has a cross-link CTA.** A "See All Recipes" button, "Read Their Stories" link, or "Explore Capabilities" button connects to the source page.
5. **Annotate reused sections.** Use HTML comments and annotation labels to make the reuse relationship visible in the wireframe: `<!-- Recipe teaser — content reused from /recipes -->`.

## Reference

See the project's `.superpowers/brainstorm/*/content/visual-wireframe.html` for a dual-mode example (grey + branded side by side).
