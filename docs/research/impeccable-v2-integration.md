# Impeccable v2 Integration

Impeccable v2 is the design methodology. Stardust is the EDS production pipeline wrapped around it.

## Command Mapping

| Impeccable v2 | Stardust Stage | What stardust adds |
|---|---|---|
| `/teach` | Brand | Brand-extractor for structured tokens, visual brand board rendering |
| `/shape` | Experience Design | Visual wireframe HTML, briefing format, multi-page coordination |
| `/craft` | Build | CDD integration, wireframe-to-block mapping, copy/image generation, DA pipeline |
| `/audit` | Quality Gate | EDS-specific rules (LCP, three-phase loading, DA compatibility), brand alignment scoring |

## Impeccable v2 Pipeline

1. `/teach` — interviews about brand, users, aesthetic → `.impeccable.md`
2. `/shape` — UX discovery interview per feature → design brief
3. `/craft` — takes brief, builds feature, visually iterates with browser automation, loops until production-grade
4. `/audit` — scores 0-20 across 5 dimensions (accessibility, performance, theming, responsive, anti-patterns), recommends which command to fix each issue

## What Stardust Adds

Stardust is NOT a replacement for impeccable. It's the EDS + brand + content layer:

- **Brand extraction** into structured, reusable tokens (`brand-profile.json`) — not just `.impeccable.md`
- **Visual artifacts** at every stage (brand board HTML, wireframe HTML, rendered pages)
- **Briefing format** as the human-authored intent input
- **EDS translation** — mapping unconstrained wireframes to content models and blocks via CDD
- **Content generation** — copy from brand voice, images from photography direction
- **DA pipeline** — content pushed to Document Authoring for CMS editing
- **The navigator** — stateless orchestration reading artifacts on disk

## Quality Gates (revised)

### Human gates (subjective)
1. **Brand board approval** — after `/teach` + brand-extractor render the board
2. **Wireframe approval** — after `/shape` renders visual wireframe HTML
3. **Final page review** — after `/craft` + `/audit` complete, with refinement skills available

### Agent gates (objective)
1. **Design system critique** — `/critique` + `/audit` after CSS generation, before designer sees it
2. **Build quality loop** — `/craft` iterates visually until production-grade, then `/audit` scores 0-20 per dimension
   - P0-P1 issues: fixed automatically by running the recommended command
   - P2-P3 issues: presented to designer alongside final output
