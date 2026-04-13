# Wireframe to EDS Block Mapping

The Build stage translates unconstrained wireframe sections into EDS blocks. This reference guides that translation.

## Mapping Process

For each section in the wireframe HTML:

1. Read `data-section`, `data-intent`, `data-layout`, and optional attributes
2. Check existing `blocks/` directory — can an existing block handle this section?
3. If yes: note the existing block name and any variant needed
4. If no: this section needs a new block built via CDD

## Common Mappings

These are starting points, not rules. The wireframe description and intent override these defaults.

| Wireframe Pattern | Likely EDS Block | Notes |
|---|---|---|
| Full-width hero with image/video + heading + CTA | `hero` | Already in boilerplate |
| 2-4 items side by side with icon + text | `columns` | Already in boilerplate, use variants |
| Card grid with image + title + description | `cards` | Already in boilerplate |
| Quote/testimonial with author | `testimonials` | New block needed |
| Accordion/expandable sections | `accordion` | New block needed |
| Tab-switched content panels | `tabs` | New block needed |
| Media + text split (image left, text right or vice versa) | `columns` (2-up variant) | Existing block, CSS variant |
| Full-width colored band with CTA | `cta-band` | New block, section-level styling |
| Data table or comparison | `table` | New block needed |
| Interactive element (calculator, filter, slider) | Custom block | Always new, name from wireframe |
| Newsletter/email signup | `signup` | New block needed |
| Logo grid / partner logos | `logo-wall` | New block needed |

## When to Create a New Block vs. Reuse

**Reuse** when:
- An existing block's content model can express the wireframe section's content
- The visual difference is achievable with CSS alone (no JS behavior changes)
- The authoring experience in DA stays clean (≤4 cells per row)

**Create new** when:
- The section requires JS behavior that doesn't exist (carousel, accordion, tabs, filtering)
- The content model would need more than 4 cells per row to express the wireframe
- Forcing into an existing block would make the DA authoring confusing for content authors

## Block Manifest Format

`stardust/block-manifest.json`:

```json
{
  "blocks": [
    {
      "name": "hero",
      "status": "existing",
      "wireframeSections": ["hero"],
      "notes": "Existing boilerplate block, may need CSS updates for brand"
    },
    {
      "name": "testimonials",
      "status": "new",
      "wireframeSections": ["social-proof"],
      "contentModel": "3 columns: quote, author-name, author-photo",
      "notes": "Card-style layout with quotation styling"
    }
  ]
}
```

## Content Model Principles (from CDD)

- Content models define the DA/Google Docs table structure for each block
- Maximum 4 columns per row — beyond this, authoring becomes confusing
- Use semantic column names (not "column1", "column2")
- Always create a test content HTML file in `drafts/blocks/{name}.html`
- The content model is the contract between author and developer — decide it BEFORE writing code
