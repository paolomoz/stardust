# Skills Landscape

Complete inventory of all installed skills relevant to the design flow, organized by function.

## Plugin Inventory

| Plugin | Source | Version | Scope |
|--------|--------|---------|-------|
| impeccable | https://github.com/pbakaus/impeccable | 2.1.0 | Design quality |
| aem-edge-delivery-services | https://github.com/adobe/skills | 1.0.0 | EDS development |
| eds-site-builder | paolomoz-skills | 9484df7ce647 | Full site pipeline |
| sumi | paolomoz-skills | 9484df7ce647 | Infographic generation |
| frontend-design | claude-plugins-official | latest | Design foundations |
| superpowers | claude-plugins-official | 5.0.7 | Workflow orchestration |
| playground | claude-plugins-official | latest | Prototyping |
| spectrum-2 | paolomoz-private | 0.1.0 | Adobe Spectrum design |
| testing | paolomoz-skills | 9484df7ce647 | Testing utilities |

---

## Skills by Pipeline Stage

### Stage 1: Brand Definition

| Skill | Plugin | What It Does |
|-------|--------|-------------|
| `/impeccable teach` | impeccable | Interactive interview producing `.impeccable.md` design context (audience, brand personality, aesthetic direction, principles) |
| `/impeccable` (craft mode) | impeccable | Shape-then-build workflow combining design discovery with implementation |
| `brand-extractor` | eds-site-builder | Extracts BrandProfile JSON from URL/name/description using multi-tier AI analysis (Claude + web search fallback). Output: name, industry, tone[], values[], audience, colorPalette[], typography, personality, positioning, visualStyle, confidence |
| `brand-css-generator` | eds-site-builder | Converts BrandProfile → CSS custom properties with WCAG AA enforcement. Two modes: lightweight `:root` overrides or full per-block CSS files |
| `design-system-extractor` | eds-site-builder | Reverse-engineers CSS tokens from live website via Puppeteer: colors, typography (h1-h6), buttons, layout, spacing, shadows, fonts |

### Stage 2: Wireframing / Design Planning

| Skill | Plugin | What It Does |
|-------|--------|-------------|
| `/shape` | impeccable | UX planning before code. Discovery interview → design brief (feature summary, primary action, design direction, layout strategy, key states, interaction model, content requirements) |
| `analyze-and-plan` | adobe-eds | Creates acceptance criteria and requirements from task descriptions/designs |
| `identify-page-structure` | adobe-eds | Analyzes webpage structure to map section boundaries and content sequences |
| `page-decomposition` | adobe-eds | Breaks sections into internal structure using neutral descriptions |

### Stage 3: Design System

| Skill | Plugin | What It Does |
|-------|--------|-------------|
| `/extract` | impeccable | Pulls reusable components and design tokens from implemented code (3+ uses threshold) |
| `/typeset` | impeccable | Rebuilds typography hierarchy, font choice, sizing scale, readability |
| `/colorize` | impeccable | Refines color palette and theming |
| `brand-css-generator` | eds-site-builder | Generates CSS custom properties from brand profile |
| `figma-token-sync` | eds-site-builder | Bidirectional sync between CSS custom properties and Figma variables |

### Stage 4: Block Development

| Skill | Plugin | What It Does |
|-------|--------|-------------|
| `content-driven-development` | adobe-eds | **Main orchestrator**: 8-step workflow (dev server → analyze → model → test content → implement → lint → validate → ship) |
| `content-modeling` | adobe-eds | Designs author-friendly table structures. 4 canonical models: standalone, collection, configuration, auto-blocked. Max 4 cells/row |
| `building-blocks` | adobe-eds | Implements JS decoration + CSS styling. References block-collection-and-party for patterns |
| `testing-blocks` | adobe-eds | Validates via linting + mandatory browser testing at 3 viewports (375/768/1200px) |
| `block-collection-and-party` | adobe-eds | Searches Adobe's vetted Block Collection and community Block Party for reference implementations |
| `find-test-content` | adobe-eds | Locates existing content pages containing a specific block |
| `code-review` | adobe-eds | Reviews code quality, performance, visuals (multi-viewport screenshots), security |

### Stage 5: Experience Generation

| Skill | Plugin | What It Does |
|-------|--------|-------------|
| `generative-page-pipeline` | eds-site-builder | One-shot page generation: query → intent classification (Cerebras 8B) → block plan (Claude Opus) → parallel content (Cerebras 120B) → parallel images (fal.ai) → DA persist. 12-30 seconds total |
| `conversational-page-builder` | eds-site-builder | Interactive multi-turn agent loop with 16 tools for iterative page creation/refinement. Three phases: analyze requirements → design selection → generate + refine |
| `da-content-pipeline` | eds-site-builder | Converts .plain.html → DA table format and uploads with IMS auth. Handles batch uploads with rate limiting |
| `ai-image-generator` | eds-site-builder | Multi-provider image generation (fal.ai FLUX, Vertex AI Imagen, Gemini) with embedding-based caching and R2 storage |
| `eds-website-builder` | eds-site-builder | **Full 12-phase orchestrator**: project setup → brand analysis → design foundation → content planning → block dev → image gen → content authoring → DA integration → UE integration → testing → deployment |

### Quality Gates (Cross-Cutting)

| Skill | Plugin | What It Does |
|-------|--------|-------------|
| `/critique` | impeccable | Parallel LLM design review + automated anti-pattern detection. Nielsen's 10 heuristics scored 0-4. Persona-based testing (5 predefined personas). Combined report with P0-P3 severity |
| `/audit` | impeccable | Technical quality scan across 5 dimensions: accessibility, performance, theming, responsive, anti-patterns. Scored 0-4 each, total /20 |
| `/harden` | impeccable | Production readiness: text/data extremes, error scenarios, i18n, onboarding, device/context |
| `/polish` | impeccable | Final refinement pass |
| `/simplify` | superpowers | Review changed code for reuse, quality, efficiency |

### Refinement (Iterative Improvement)

| Skill | Plugin | What It Does |
|-------|--------|-------------|
| `/animate` | impeccable | Add/refine motion design |
| `/bolder` | impeccable | Push design in a more daring direction |
| `/quieter` | impeccable | Pull design toward restraint and calm |
| `/delight` | impeccable | Add moments of delight and micro-interactions |
| `/adapt` | impeccable | Responsive adaptation |
| `/clarify` | impeccable | Rewrite confusing UI text |
| `/distill` | impeccable | Reduce complexity |
| `/optimize` | impeccable | Performance optimization |

### Workflow Orchestration

| Skill | Plugin | What It Does |
|-------|--------|-------------|
| `brainstorm` | superpowers | Structured brainstorming for design decisions |
| `write-plan` | superpowers | Create implementation plans |
| `execute-plan` | superpowers | Execute plans step by step |
| `dispatching-parallel-agents` | superpowers | Spawn parallel work |
| `verification-before-completion` | superpowers | Final verification checklist |
| `requesting-code-review` | superpowers | Request code review from agent |

### Audit & Analysis

| Skill | Plugin | What It Does |
|-------|--------|-------------|
| `site-auditor` | eds-site-builder | Cross-reference indexes, sitemaps, nav for 11 gap categories |
| `pagespeed-audit` | eds-site-builder | Aggregate Core Web Vitals from RUM + PageSpeed Insights |
| `accessibility-auditor` | eds-site-builder | WCAG 2.1 AA compliance + brand voice enforcement |
| `block-detector` | eds-site-builder | Detect and catalog content blocks on pages via Puppeteer |
| `content-graph` | eds-site-builder | Build semantic content graphs with centrality metrics |
| `screenshot-capture` | eds-site-builder | Full-page and viewport screenshots with overlay removal |

---

## Skill Compatibility: SLICC vs Claude Code

| Capability | SLICC | Claude Code |
|------------|-------|-------------|
| Skill discovery | Native + .agents + .claude dirs | .claude dir only |
| Skill invocation | `read_file SKILL.md` + follow | `/skill-name` or `Skill` tool |
| Browser interaction | Direct CDP (playwright-cli, screenshot, click) | Playwright via npm/MCP |
| File operations | VFS (IndexedDB-backed) | Real filesystem |
| Shell | WASM shell (78+ commands) | Real shell (zsh/bash) |
| Dev server | Can run `serve` or access localhost | Can run `aem up` |
| Multi-agent | Scoops (isolated sub-agents) | Agent tool (subagents) |
| Visual verification | See page directly in browser tab | Playwright screenshots |
| Handoff | Accepts handoff URLs from Claude Code | Can generate handoff URLs |

### Key Divergences for Skill Design

1. **File paths**: SLICC uses VFS paths (`/workspace/...`), Claude Code uses real paths. Skills should use relative paths where possible.
2. **Browser access**: SLICC has CDP natively; Claude Code needs Playwright scripts. Skills needing visual verification should provide both paths.
3. **Package management**: SLICC has no npm; Claude Code has full npm. Skills should not depend on npm install during execution.
4. **Persistence**: SLICC uses IndexedDB; Claude Code uses filesystem. Both support file read/write.
5. **Skill format**: Both read `SKILL.md` files. The format is compatible. Skills can work in both with minimal adaptation.
