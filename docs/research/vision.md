# Project Vision

## Goal

Design a skill-based flow for creating AEM Edge Delivery Services websites driven by brand guidelines and business requirements. The user works in an AI agent (SLICC or Claude Code), installs skills, and follows an opinionated pipeline from brand definition through to published experiences.

## The Pipeline

```
1. Brand Guidelines        → .impeccable.md + BrandProfile JSON + brand tokens
   (use existing or define)

2. Wireframes              → Page structure, section hierarchy, content flow
   (informed by brand)

3. Design System           → CSS custom properties, font selections, spacing scale, component patterns
   (from brand + wireframes)

4. Blocks                  → EDS block implementations (JS + CSS)
   (content-driven dev)

5. Experiences             → Full pages with real content, images, copy
   (from briefings or generated briefings)
```

## Constraints

### Must Be EDS
- The output is always an AEM Edge Delivery Services website
- Starting point is an EDS boilerplate project (this repo)
- Follows EDS conventions: blocks, sections, three-phase loading, content authoring
- Content lives in DA (Document Authoring) or Google Docs/SharePoint

### Skill-Based
- The flow is composed of skills the user installs and invokes
- Skills work in both SLICC and Claude Code (compatible skill format)
- Each step in the pipeline maps to one or more skill invocations
- Skills can be used independently or as part of the full pipeline

### SLICC-Primary, Claude Code Fallback
- Primary target agent: SLICC (browser-native, can see/interact with pages)
- Fallback: Claude Code (file-based, dev server + Playwright for visual verification)
- Skills discovered via SLICC's three-tier system: native > .agents > .claude
- Handoff support: Claude Code can hand off browser tasks to SLICC

### Opinionated Design Quality
- Impeccable skills enforce anti-slop design throughout
- No generic AI aesthetics (Inter font, purple gradients, card grids)
- Every design choice must be intentional and traceable to brand
- Quality gates at each pipeline stage (critique, audit)

## Key Design Principles

### 1. Content-First
Content structure is defined before code. Block implementations serve authored content, not the other way around. This is the core EDS principle and must be preserved.

### 2. Brand-Driven
Every visual and copy decision traces back to brand guidelines. The pipeline doesn't produce generic websites — it produces branded experiences.

### 3. Author-Friendly
The output must be easy for content authors to work with in DA/Docs/SharePoint. Block content models should be simple (max 4 cells/row), use semantic formatting, and have smart defaults.

### 4. Progressive Refinement
Each pipeline stage can be iterated independently. You can re-run brand extraction without rebuilding blocks. You can add pages without redesigning the system. The pipeline is a sequence of checkpoints, not a monolith.

### 5. Show Don't Tell
Every stage produces visible output that can be inspected in a browser. SLICC's browser context makes this natural — the agent can see what it built.

## Open Questions for Brainstorming

1. **Wireframe format**: What does a "wireframe" look like in this context? Static HTML? Markdown with layout annotations? Figma import? Section/block descriptions?

2. **Design system representation**: How should the design system be stored? `.impeccable.md` + `styles.css` tokens? A separate `design-system/` directory? Figma token sync?

3. **Briefing format**: What does a "briefing" contain? How much is brand-specific vs page-specific? Who writes briefings — the user, or can the agent generate them from business requirements?

4. **Skill granularity**: How many skills? One mega-orchestrator (like eds-website-builder's 12 phases) or many small composable skills? Where's the right balance?

5. **SLICC vs Claude Code divergence**: Where do the workflows necessarily differ? SLICC can see the page; Claude Code can run Playwright. What capabilities should skills assume?

6. **Existing skill reuse**: Which existing skills can be used as-is vs need adaptation vs need replacement? The Adobe CDD pipeline, impeccable skills, and eds-site-builder skills are all candidates.

7. **Content generation**: Should pages be generated one-shot (generative-page-pipeline) or iteratively (conversational-page-builder)? Or both, depending on context?

8. **Image generation**: When in the pipeline do images get generated? Before blocks (so blocks can reference them) or during page generation?
