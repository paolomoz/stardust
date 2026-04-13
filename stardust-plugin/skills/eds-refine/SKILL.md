---
name: eds-refine
description: "Designer-driven refinement and publishing of built EDS pages. Translates natural designer feedback (bolder, quieter, delight, animate, polish, colorize, typeset, distill, arrange, harden, audit) into the matching impeccable commands, runs verification against wireframe intent, and handles the Document Authoring (DA) content pipeline plus preview/production deployment. Use after /stardust:eds-build is complete, when the designer wants to polish, audit, lint, or publish existing EDS pages and blocks, when the user gives refinement feedback on a built page (e.g. 'make this bolder', 'too busy', 'add some delight', 'the colors feel off', 'typography needs work'), when they ask for PageSpeed/accessibility/linting fixes, or when they want to push content to DA or publish to preview/production."
---

# EDS Refine

Iterative refinement driven by designer feedback, plus publishing to DA and preview/production environments.

## MANDATORY PREPARATION

1. Check that generated pages exist in `drafts/`. If not, tell the user to run `/stardust:eds-build` first.
2. Read `.impeccable.md` for design context.
3. Start the AEM dev server if not running: `npx -y @adobe/aem-cli up --no-open`

---

## Refinement Loop

This stage is **iterative**. The designer reviews pages and gives feedback until satisfied.

### Feedback Vocabulary

Map designer feedback to impeccable commands:

| Designer says | Run | What it does |
|---|---|---|
| "Make this bolder/more dramatic" | `/impeccable bolder` | Increase visual weight, contrast, size |
| "Too loud/busy/overwhelming" | `/impeccable quieter` | Reduce visual noise, simplify |
| "Add some personality/delight" | `/impeccable delight` | Add micro-interactions, visual surprises |
| "Add animations/transitions" | `/impeccable animate` | Add meaningful motion |
| "Polish this/make it perfect" | `/impeccable polish` | Final refinement pass |
| "Check accessibility" | `/impeccable audit` | Run 5-dimension quality audit |
| "Fix the responsive layout" | `/impeccable harden` | Fix edge cases and responsive issues |
| "The colors feel off" | `/impeccable colorize` | Refine color application |
| "Typography needs work" | `/impeccable typeset` | Refine type hierarchy and spacing |
| "Simplify this section" | `/impeccable distill` | Reduce to essentials |
| "This layout doesn't work" | `/impeccable arrange` | Restructure spatial layout |

If the feedback doesn't map to a specific command, apply the changes directly and run `/impeccable critique` to verify the result.

### Refinement Process

1. Ask: "What would you like to change? You can point to specific sections or give overall direction."
2. Map feedback to the appropriate impeccable command(s)
3. Run the command against the relevant page/section
4. Show the result: "Changes applied. Refresh http://localhost:3000/drafts/{page} to see the update."
5. Ask: "How does that look? Anything else?"
6. Repeat until designer is satisfied

**Without a headless browser:** When Playwright/Puppeteer is not available, impeccable commands that depend on screenshots (`/craft`, `/critique` with visual mode) won't have visual feedback. In this case, focus on code-level refinement: run `npm run lint`, verify CSS custom properties are used consistently, check responsive breakpoints exist, and review HTML structure. Suggest the designer open pages in their browser and provide feedback directly.

### Verification

Before publishing, run `/verification` (from superpowers) to check that final pages match the approved wireframe intent:
- Do all wireframe sections have corresponding rendered sections?
- Does the visual hierarchy match the wireframe's proportions?
- Are the CTAs from the briefing present and prominent?

Run `/code-review` (from superpowers) on any new or modified blocks to check code quality before shipping.

## Publishing

When the designer is ready to publish:

### Option A: DA Content Pipeline

1. Use `da-content-pipeline` (from eds-site-builder) to push content to Document Authoring
2. This converts `drafts/*.html` into DA-editable content that authors can maintain
3. Confirm: "Content pushed to DA. Authors can now edit pages in Google Docs/Word."

### Option B: Git + Preview

1. Commit all changes (blocks, styles, drafts)
2. Push to a feature branch
3. Construct preview URL: `https://{branch}--{repo}--{owner}.aem.page/`
4. Run `pagespeed-audit` (from eds-site-builder) against the preview URL
   - Target: score of 100
   - Fix any performance issues before proceeding
5. Tell designer: "Preview is live at {URL}. Review and let me know when ready for a PR."

### Option C: Both

Run DA pipeline first, then git push for code changes. Content lives in DA, presentation lives in the repo.

## Artifacts Written

| File | Description |
|------|-------------|
| Modified `blocks/` and `styles/` | Refinement changes |
| DA content | Pushed to Document Authoring (if chosen) |
| Git branch + preview URL | Deployed for review (if chosen) |
