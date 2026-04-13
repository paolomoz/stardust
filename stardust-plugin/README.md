# Stardust

A skill-based pipeline for creating AEM Edge Delivery Services websites from brand guidelines through generated experiences.

## Skills

| Skill | Purpose |
|-------|---------|
**Design phase (EDS-agnostic):**

| `/stardust` | Navigator — assess project state, recommend next step |
| `/stardust:brand` | Extract brand from guidelines → visual brand board |
| `/stardust:briefings` | Capture page intent (standalone — no brand dependency) |
| `/stardust:wireframes` | Optional — grey structural wireframes from briefings |
| `/stardust:design` | Branded, high-fidelity HTML designs (iterated in the browser) |

**EDS phase (implementation):**

| `/stardust:eds-design` | Derive EDS CSS from approved designs + brand |
| `/stardust:eds-build` | Map designs → EDS blocks + generate pages |
| `/stardust:eds-refine` | Designer-driven refinement + publish |

Brand and briefings are independent — run either first, or both in parallel. Wireframes are optional.

## Dependencies

Requires these peer plugins:
- [superpowers](https://github.com/anthropics/claude-code-plugins) — process methodology
- [impeccable](https://impeccable.style/) (v2+) — design methodology
- [aem-edge-delivery-services](https://github.com/adobe/skills) — EDS block development
- [eds-site-builder](https://github.com/paolomoz/skills) — brand extraction, CSS generation, content pipeline

## Pipeline

```
       ┌─ brand ──────────────────────────┐
start ─┤                                   ├─→ design → eds-design → eds-build → eds-refine
       └─ briefings → (wireframes?) ──────┘
                        optional
```

Brand and briefings are independent — run either first, or both in parallel. Wireframes are an optional grey structural pass; users can skip straight to `design`. Each stage is independently invocable. The navigator (`/stardust`) guides non-technical users through the flow. Experts invoke stages directly.

## Artifacts

All pipeline state lives under `stardust/` in your project root. EDS artifacts go to their standard paths (`styles/`, `blocks/`, `drafts/`).
