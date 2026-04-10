# Design Flow Research

Research gathered 2026-04-10 to inform the design of a skill-based pipeline for creating AEM Edge Delivery Services websites from brand guidelines through to generated experiences.

## Vision

Build a skill-based flow where a user can:

1. **Brand** — Use existing guidelines (PDF/URL/corebook) or define new ones
2. **Wireframes** — Define page structure and layout informed by brand
3. **Design System** — Create/extract a design system (tokens, components, patterns)
4. **Blocks** — Build EDS blocks implementing the design system (content-driven development)
5. **Experiences** — Generate pages from briefings (or create briefings first), populating blocks with real content, images, and copy

Orchestrated through skills, working in both SLICC and Claude Code. Primary target agent: SLICC (fallback: Claude Code).

## Research Index

| Document | Contents |
|----------|----------|
| [vision.md](vision.md) | Full project vision, constraints, and design principles |
| [skills-landscape.md](skills-landscape.md) | Complete inventory of all available skills across all plugins |
| [slicc-architecture.md](slicc-architecture.md) | SLICC agent platform: architecture, tools, skills, handoffs |
| [prior-art.md](prior-art.md) | Lessons from SLICC website build + Gabriel's demo |
| [brand-guidelines-anatomy.md](brand-guidelines-anatomy.md) | What brand guidelines contain (Vitamix case study) |
| [pipeline-analysis.md](pipeline-analysis.md) | Existing pipelines: eds-website-builder, impeccable, Adobe CDD |
| [boilerplate-baseline.md](boilerplate-baseline.md) | Starting project state and what needs to change |

## Source References

| Resource | Location | Type |
|----------|----------|------|
| Adobe AEM skills | https://github.com/adobe/skills/tree/main/skills/aem | GitHub |
| SLICC source | /Users/paolo/playground/slicc | Local repo |
| Vitamix brand guidelines | https://my.corebook.io/vitamixguidelines | Web (JS-rendered) |
| SLICC website design journal | /Users/paolo/playground/ai-ecoverse/slicc-website/design/design-journal.md | Local file |
| SLICC website EDS migration journal | /Users/paolo/playground/ai-ecoverse/slicc-website/design/eds-migration-journal.md | Local file |
| SLICC website superpowers docs | /Users/paolo/playground/ai-ecoverse/slicc-website/docs/superpowers/ | Local dir |
| Gabriel's demo video | /Users/paolo/Desktop/ema-design-publish-summit-page.mp4 | Local video |
| Gabriel's demo frames | /tmp/ema-frames/ and /tmp/ema-detail/ | Extracted frames |
| Impeccable plugin (v2.1.0) | /Users/paolo/.claude/plugins/cache/impeccable/impeccable/2.1.0 | Installed plugin |
| Frontend-design plugin | /Users/paolo/.claude/plugins/cache/claude-plugins-official/frontend-design/ | Installed plugin |
| Superpowers plugin (v5.0.7) | /Users/paolo/.claude/plugins/cache/claude-plugins-official/superpowers/ | Installed plugin |
| EDS Site Builder plugin | /Users/paolo/.claude/plugins/cache/paolomoz-skills/eds-site-builder/ | Installed plugin |
| Sumi plugin | /Users/paolo/.claude/plugins/cache/paolomoz-skills/sumi/ | Installed plugin |
| Adobe EDS skills plugin (v1.0.0) | /Users/paolo/.claude/plugins/cache/adobe-skills/aem-edge-delivery-services/1.0.0 | Installed plugin |
| Impeccable website | https://impeccable.style/ | Web |
