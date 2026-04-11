# Stardust

A skill-based pipeline for creating AEM Edge Delivery Services websites from brand guidelines through generated experiences.

## Skills

| Skill | Purpose |
|-------|---------|
| `/stardust` | Navigator — assess project state, recommend next step |
| `/stardust:brand` | Extract brand from guidelines → visual brand board |
| `/stardust:design-system` | Translate brand tokens → EDS CSS |
| `/stardust:experience` | Briefing + wireframe → visual page blueprints |
| `/stardust:build` | Map wireframes → EDS blocks + generate pages |
| `/stardust:refine` | Designer-driven refinement + publish |

## Dependencies

Requires these peer plugins:
- [superpowers](https://github.com/anthropics/claude-code-plugins) — process methodology
- [impeccable](https://impeccable.style/) (v2+) — design methodology
- [aem-edge-delivery-services](https://github.com/adobe/skills) — EDS block development
- [eds-site-builder](https://github.com/paolomoz/skills) — brand extraction, CSS generation, content pipeline

## Pipeline

```
Brand → Design System → Experience Design → Build → Refine
```

Each stage is independently invocable. The navigator (`/stardust`) guides non-technical users through the flow. Experts invoke stages directly.

## Artifacts

All pipeline state lives under `stardust/` in your project root. EDS artifacts go to their standard paths (`styles/`, `blocks/`, `drafts/`).
