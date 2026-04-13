# Stardust Soft-Gates Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the four non-EDS stardust skills (`brand`, `briefings`, `wireframes`, `design`) from a rigid, hard-gated chain into a soft-gated spine where every skill is independently runnable, missing upstream artifacts are synthesized with inline provenance (no separate log file), and every skill starts with the same pre-flight (disk scan → state report → one prompt → proceed).

**Architecture:** Extract a shared `_shared/preflight.md` and `_shared/skill-contract.md` reference that all four SKILL.md files link to. Replace every "stop, run X first" block with a pre-flight + synthesis fallback. Make briefing the sole owner of copy (design honors `# Copy` verbatim, synthesizes + stamps a provenance comment when absent, and writes back only on explicit user request). Leave the three EDS skills (`eds-design`, `eds-build`, `eds-refine`) untouched — they stay strict and get iterated separately.

**Tech Stack:** Claude Code plugin skills (Markdown `SKILL.md` + reference docs). No code, no test runner — "tests" are manual smoke invocations after clearing the plugin cache.

---

## File Structure

**Create:**
- `stardust-plugin/skills/_shared/preflight.md` — the pre-flight procedure (scan → report → prompt → proceed)
- `stardust-plugin/skills/_shared/skill-contract.md` — the needs / produces / if missing convention + provenance-comment rules

**Modify:**
- `stardust-plugin/skills/brand/SKILL.md`
- `stardust-plugin/skills/briefings/SKILL.md`
- `stardust-plugin/skills/wireframes/SKILL.md`
- `stardust-plugin/skills/design/SKILL.md`
- `stardust-plugin/skills/stardust/SKILL.md` (navigator — reflect soft-gate model, drop any "stop first" phrasing)

**Untouched:** `eds-design/`, `eds-build/`, `eds-refine/`.

---

## Conventions (referenced by every task)

**Needs / Produces / If missing block** — a fenced section in every refactored SKILL.md:

```markdown
## Contract

**Needs (reads if present):**
- `stardust/brand-profile.json`
- `stardust/briefings/{page}.md`
- `stardust/wireframes/{page}.html`

**Produces:**
- `stardust/designs/{page}.html`

**If missing:**
- No brand-profile.json → synthesize a neutral brand shape (mono palette, system fonts, straight voice); stamp provenance in the design's `<head>`.
- No briefing → prompt the user for a one-line page intent; synthesize the rest; stamp provenance.
- No `# Copy` in briefing → generate on-brand copy; stamp provenance per section.
```

**Provenance comment** — a single HTML/Markdown comment at the top of any synthesized artifact:

```html
<!-- stardust:provenance
  generated_by: design
  date: 2026-04-13
  synthesized_inputs:
    - brand-profile.json (missing — neutral defaults used)
    - briefings/home.md #Copy (missing — copy generated on-brand)
  note: these values are placeholders. Edit the artifact or re-run the upstream skill to replace them.
-->
```

**Explicit writeback** — design never auto-writes to briefing. Only when the user says "save this copy to the briefing" does the skill perform a single, targeted writeback.

---

## Task 1: Shared references

**Files:**
- Create: `stardust-plugin/skills/_shared/preflight.md`
- Create: `stardust-plugin/skills/_shared/skill-contract.md`

- [ ] **Step 1: Write `_shared/preflight.md`**

Content:

````markdown
# Pre-Flight

Every non-EDS stardust skill starts by running this procedure. The goal is:
**nothing blocks, but nothing happens silently.**

## Procedure

1. **Scan disk** — check for the upstream artifacts listed in this skill's `## Contract` → **Needs**.
2. **Report state** — print a one-line summary to the user:

   ```
   stardust state:
     brand       ✓ extracted 2026-04-12
     briefings   ✓ 1 page (stardust.md — intent only, no #Copy)
     wireframes  ✗ not yet
     designs     ✗ not yet
   ```

3. **Flag consequences of gaps** — one line per missing input, naming what will be synthesized:

   ```
   gaps for /stardust:design:
     - no wireframe → structure will be shaped from the briefing
     - briefing has no #Copy → copy will be generated on-brand
   ```

4. **Offer one escape hatch** — a single prompt with a sensible default:

   ```
   Proceed with design, or jump upstream first (brand / briefings / wireframes)?
   [default: proceed]
   ```

   - Empty response, "proceed", "go", "yes" → run the skill.
   - Any upstream name → stop and tell the user to invoke `/stardust:<name>`. Do not auto-chain.

## Rules

- Do not ask more than one question in pre-flight. If the user wants a wizard, they can run `/stardust`.
- Never block. If a gap exists and the user chooses "proceed", the skill synthesizes a stand-in and stamps provenance (see `skill-contract.md`).
- Report state before doing any other work — including before asking anything else.
````

- [ ] **Step 2: Write `_shared/skill-contract.md`**

Content:

````markdown
# Skill Contract

Every non-EDS stardust skill declares three things in a `## Contract` section:

- **Needs** — upstream artifacts the skill reads *if present*. Never required.
- **Produces** — the single artifact (or folder) the user will edit directly after.
- **If missing** — what the skill synthesizes when a Need is absent, plus where provenance is recorded.

## Provenance

When a skill synthesizes any input, it stamps a provenance block at the top of
the produced artifact. No separate log file.

### HTML artifacts

```html
<!-- stardust:provenance
  generated_by: design
  date: 2026-04-13
  synthesized_inputs:
    - brand-profile.json (missing — neutral defaults used)
    - briefings/home.md #Copy (missing — copy generated on-brand)
  note: these values are placeholders. Edit the artifact or re-run the upstream skill to replace them.
-->
```

Place as the first child of `<head>`.

### Markdown artifacts

```markdown
<!-- stardust:provenance
  generated_by: briefings
  date: 2026-04-13
  synthesized_inputs:
    - user prompt: "landing page for stardust"
  note: structured from a one-line prompt. Edit freely.
-->
```

Place as the first line of the file, above frontmatter.

### JSON artifacts

A `"_provenance"` key at the top of the object:

```json
{
  "_provenance": {
    "generated_by": "brand",
    "date": "2026-04-13",
    "synthesized_inputs": ["user conversation (no URL or PDF supplied)"],
    "note": "neutral defaults used. Replace by re-running /stardust:brand with a URL or PDF."
  },
  "name": "Untitled",
  ...
}
```

## Writeback

Skills never automatically write to upstream artifacts. If the user asks
("also save this headline to the briefing"), the skill performs a single,
targeted writeback and reports what it changed. That is the only
cross-artifact write allowed.

## One artifact per skill

A new skill is justified only if its artifact earns its own iteration loop.
If an output is edited jointly with another artifact or never edited on its
own, fold it into an existing skill instead of creating a new one.
````

- [ ] **Step 3: Commit**

```bash
git add stardust-plugin/skills/_shared/preflight.md stardust-plugin/skills/_shared/skill-contract.md
git commit -m "feat(stardust-plugin): add shared preflight and skill-contract references"
```

---

## Task 2: Refactor `/stardust:brand`

**Files:**
- Modify: `stardust-plugin/skills/brand/SKILL.md`

- [ ] **Step 1: Replace the `## MANDATORY PREPARATION` block**

Find:

```markdown
## MANDATORY PREPARATION

This skill is part of the stardust pipeline. Check for `.impeccable.md` — if it exists, read it for existing design context. If it doesn't exist, this skill will create it.
```

Replace with:

```markdown
## Pre-flight

Run the procedure in [`../_shared/preflight.md`](../_shared/preflight.md) first.
`.impeccable.md` is optional input; if absent this skill may create it.

## Contract

**Needs (reads if present):**
- Brand URL, PDF, or conversational description from the user
- `.impeccable.md` (design personality, if any)

**Produces:**
- `stardust/brand-profile.json`
- `stardust/brand-board.html`
- `.impeccable.md` (created or updated)

**If missing:**
- No URL/PDF/description → ask the user one conversational prompt ("tell me about the brand in a sentence"), synthesize a neutral brand-profile shape (system fonts, mono palette, straight voice), and stamp provenance per [`../_shared/skill-contract.md`](../_shared/skill-contract.md).
- No `.impeccable.md` → create a minimal one and stamp provenance at the top.
```

- [ ] **Step 2: Remove any residual "stop and tell the user" language**

Search the file for phrases like "stop and tell the user", "Run `/stardust:` first", "If missing, halt", and rewrite so failure modes are synthesis, not halt. If no such phrases remain, continue.

- [ ] **Step 3: Add the provenance requirement to the output description**

At the end of the section that describes writing `stardust/brand-profile.json`, add:

```markdown
If any input was synthesized (no URL/PDF/description), add a `"_provenance"` key at the top of the JSON per [`../_shared/skill-contract.md`](../_shared/skill-contract.md).
```

- [ ] **Step 4: Commit**

```bash
git add stardust-plugin/skills/brand/SKILL.md
git commit -m "refactor(stardust/brand): soft-gate preflight + contract + provenance"
```

---

## Task 3: Refactor `/stardust:briefings`

**Files:**
- Modify: `stardust-plugin/skills/briefings/SKILL.md`

- [ ] **Step 1: Replace the `## MANDATORY PREPARATION` block**

Find:

```markdown
## MANDATORY PREPARATION

Read `.impeccable.md` if it exists — it informs tone when drafting with the user. It is **not required**: briefings can be authored before any brand or design-personality work.

Do **not** block on `stardust/brand-profile.json`. Briefings are intentionally independent from brand extraction — either can happen first, or they can run in parallel. The downstream wireframes stage is where brand and briefings finally meet.
```

Replace with:

```markdown
## Pre-flight

Run the procedure in [`../_shared/preflight.md`](../_shared/preflight.md) first.

## Contract

**Needs (reads if present):**
- User description of pages to plan
- `.impeccable.md` (tone hints)
- `stardust/brand-profile.json` (voice; not required)

**Produces:**
- `stardust/briefings/_site.md` (multi-page only)
- `stardust/briefings/{page}.md` (one per page; **sole source of truth for page copy**)

**If missing:**
- No input at all → ask the user which pages they need and start with the most important one.
- No brand-profile.json → briefings still proceed; tone defaults to neutral-technical.

## Copy Ownership

Briefings own page copy. If the user wants final words baked in, put them in
`# Copy` per section. Design will use those strings verbatim and will never
rewrite them. Briefings without `# Copy` are valid — downstream skills
synthesize on-brand copy and stamp provenance.
```

- [ ] **Step 2: Sweep for blocking language**

Find every "stop" / "halt" / "required" / "must exist first" in this file and either delete or soften to "reads if present" or "synthesized if absent". If none, continue.

- [ ] **Step 3: Add provenance note to synthesized briefings**

Locate the section that writes `stardust/briefings/{page}.md` and add:

```markdown
If the briefing was synthesized from a one-line prompt (not authored in a full conversation), stamp a provenance comment at the top of the file per [`../_shared/skill-contract.md`](../_shared/skill-contract.md).
```

- [ ] **Step 4: Commit**

```bash
git add stardust-plugin/skills/briefings/SKILL.md
git commit -m "refactor(stardust/briefings): soft-gate preflight + copy ownership"
```

---

## Task 4: Refactor `/stardust:wireframes`

**Files:**
- Modify: `stardust-plugin/skills/wireframes/SKILL.md`

- [ ] **Step 1: Replace the `## MANDATORY PREPARATION` block**

Find:

```markdown
## MANDATORY PREPARATION

1. Read `stardust/briefings/` — at least one `{page}.md` must exist. If none, stop and tell the user: "Wireframes need at least one briefing. Run `/stardust:briefings` first."
2. Do **not** require or read `stardust/brand-profile.json`. Wireframes at this stage are intentionally pre-brand.
3. Read `.impeccable.md` if it exists — informs tone when drafting section intents.
```

Replace with:

```markdown
## Pre-flight

Run the procedure in [`../_shared/preflight.md`](../_shared/preflight.md) first.

## Contract

**Needs (reads if present):**
- `stardust/briefings/{page}.md` (one or more)
- `.impeccable.md` (tone for annotations)

**Produces:**
- `stardust/wireframes/{page}.html` (grey, annotated)

**If missing:**
- No briefings → prompt the user for a one-line page intent, synthesize a minimal briefing, stamp provenance on both the briefing and the wireframe, and proceed.
- No `.impeccable.md` → annotations use neutral-technical tone.
- Brand is intentionally not read at this stage.
```

- [ ] **Step 2: Sweep for blocking language**

Replace any "stop and tell the user" pattern for missing briefings with the synthesis fallback described above. If none remain, continue.

- [ ] **Step 3: Add provenance note to synthesized wireframes**

Locate the section that writes `stardust/wireframes/{page}.html` and add:

```markdown
If the upstream briefing was synthesized (provenance comment present, or generated during this pre-flight), carry forward a provenance block on the wireframe per [`../_shared/skill-contract.md`](../_shared/skill-contract.md).
```

- [ ] **Step 4: Commit**

```bash
git add stardust-plugin/skills/wireframes/SKILL.md
git commit -m "refactor(stardust/wireframes): soft-gate preflight + synthesis fallback"
```

---

## Task 5: Refactor `/stardust:design`

**Files:**
- Modify: `stardust-plugin/skills/design/SKILL.md`

- [ ] **Step 1: Replace the `## MANDATORY PREPARATION` block**

Find:

```markdown
## MANDATORY PREPARATION

1. Read `stardust/brand-profile.json`. If missing, stop and tell the user: "Design needs a brand. Run `/stardust:brand` first."
2. Read `stardust/briefings/` — at least one `{page}.md` must exist. If none, stop and tell the user: "Design needs at least one briefing. Run `/stardust:briefings` first."
3. Read `stardust/wireframes/` if it exists — use approved grey wireframes as the **structural blueprint**. If wireframes don't exist, derive structure from the briefing directly (with `/impeccable shape`).
4. Read `.impeccable.md` — it's the taste filter for every visual judgment on this stage.
```

Replace with:

```markdown
## Pre-flight

Run the procedure in [`../_shared/preflight.md`](../_shared/preflight.md) first.

## Contract

**Needs (reads if present):**
- `stardust/brand-profile.json`
- `stardust/briefings/{page}.md` (including optional `# Copy` and `# Imagery`)
- `stardust/wireframes/{page}.html`
- `.impeccable.md`

**Produces:**
- `stardust/designs/{page}.html` (self-contained, branded, desktop fidelity)

**If missing:**
- No brand-profile.json → synthesize a neutral brand shape (system-ui fonts, mono palette, straight voice). Stamp provenance in the design's `<head>`.
- No briefing → prompt the user for a one-line page intent; synthesize a minimal briefing (in memory only, unless the user says "save it"); stamp provenance.
- Briefing has no `# Copy` → generate on-brand copy following `brand-profile.json` voice rules and `.impeccable.md`. Stamp provenance per section.
- No wireframe → shape structure from the briefing directly.
- No `.impeccable.md` → use brand-profile defaults only.

## Copy Ownership

The briefing is the source of truth for copy.

- If a section has `# Copy` in the briefing, use those strings **verbatim**. Never rewrite.
- If a section has no `# Copy`, generate on-brand copy and record provenance (per-section, in the `<head>` provenance block — e.g. `hero.headline: synthesized`).
- **Never auto-write generated copy back to the briefing.** If the user asks ("also save this to the briefing") perform a single, targeted writeback and report what changed.
```

- [ ] **Step 2: Sweep for blocking language**

Find any remaining "stop and tell the user" / "must exist first" / "required before proceeding" patterns and rewrite as synthesis fallbacks. If none remain, continue.

- [ ] **Step 3: Update Phase 1 to reflect the copy contract**

Find Phase 1 step 2:

```markdown
2. Re-read the briefing's `# Copy` section (if present) — use those strings verbatim. For sections without `# Copy`, generate on-brand copy following `brand-profile.json` voice rules and `.impeccable.md` principles.
```

Replace with:

```markdown
2. For each section, check the briefing's `# Copy`:
   - Present → use **verbatim**. Do not rewrite under any feedback loop unless the user explicitly says to change the words in the briefing.
   - Absent → generate on-brand copy; add the slot to the design's provenance block (e.g. `hero.headline: synthesized`).
   - Never write generated copy back to the briefing automatically. Offer: "Want me to also save these lines to the briefing?" after the first render — act only on explicit confirmation.
```

- [ ] **Step 4: Add provenance requirement to Phase 2 (Render)**

At the end of the Phase 2 render rules (after the `:root` block rule), add:

```markdown
- **Provenance block** — if any input was synthesized (brand, briefing, wireframe, or any `# Copy` slot), include a `<!-- stardust:provenance ... -->` comment as the first child of `<head>` per [`../_shared/skill-contract.md`](../_shared/skill-contract.md). List each synthesized input and, for copy, each synthesized slot.
```

- [ ] **Step 5: Commit**

```bash
git add stardust-plugin/skills/design/SKILL.md
git commit -m "refactor(stardust/design): soft-gate preflight + strict copy ownership"
```

---

## Task 6: Update `/stardust` navigator

**Files:**
- Modify: `stardust-plugin/skills/stardust/SKILL.md`

- [ ] **Step 1: Soften recommendation language**

Read the file end-to-end and rewrite any phrasing that implies "you must X before Y" into "recommended next: X — or jump to Y and X will be synthesized." The navigator's role is to recommend, never to gate.

Specifically: any recommendation that currently reads like "Run `/stardust:brand` **first**" should become "Run `/stardust:brand` next (recommended) — or skip to any other skill and its inputs will be synthesized with provenance."

- [ ] **Step 2: Add a short section explaining the soft-gate model**

Add this section after "Step 1: Read Project State":

```markdown
## Soft-Gate Model

The non-EDS skills (`brand`, `briefings`, `wireframes`, `design`) never block
on missing inputs. If a user invokes any of them with gaps upstream, the skill
synthesizes plausible defaults and stamps a provenance comment on the produced
artifact. You recommend the ideal next step, but the user is free to skip
around — they will see the provenance notes when they open the artifacts.

The EDS skills (`eds-design`, `eds-build`, `eds-refine`) stay strict and do
require their inputs. Your recommendations for those still gate.
```

- [ ] **Step 3: Commit**

```bash
git add stardust-plugin/skills/stardust/SKILL.md
git commit -m "refactor(stardust): navigator reflects soft-gate model"
```

---

## Task 7: Clear plugin cache and smoke-test

**Files:** none written.

- [ ] **Step 1: Clear the plugin cache**

```bash
rm -rf ~/.claude/plugins/cache/stardust/
```

Expected: directory removed. No output on success.

- [ ] **Step 2: Tell the user to restart Claude Code**

The cache is re-hydrated from the local `stardust-plugin/` on next launch. Restart now.

- [ ] **Step 3: Smoke test each refactored skill**

For each of `brand`, `briefings`, `wireframes`, `design`, invoke the skill in a scratch project (or the current one). Verify:

1. The skill prints the pre-flight state summary before doing anything else.
2. The skill asks at most one question.
3. With an upstream artifact deliberately absent, the skill synthesizes and stamps a provenance block in the produced artifact.
4. No "stop and tell the user" behavior fires.

If any skill still blocks, return to the relevant task and fix.

- [ ] **Step 4: Smoke test the orchestrator**

Invoke `/stardust`. Verify:

1. It reports project state.
2. Recommendations never read as hard gates for the non-EDS skills.
3. EDS-skill recommendations still gate.

- [ ] **Step 5: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix(stardust-plugin): smoke-test findings"
```

---

## Self-Review

**Spec coverage:**
- Soft gates replacing hard gates → Tasks 2–5.
- Uniform `needs / produces / if missing` contract → Task 1 (convention) + Tasks 2–5 (applied).
- Shared pre-flight reference → Task 1 + linked from Tasks 2–5.
- No separate `assumptions.md` — inline provenance instead → Task 1 (convention) + Tasks 2–5 (applied).
- No automatic writeback; explicit on request → Task 5 (design, the only skill tempted to writeback).
- Briefing owns copy; design honors `# Copy` verbatim → Task 3 + Task 5.
- `/stardust` orchestrator reflects the model → Task 6.
- Scope limited to brand/briefings/wireframes/design → EDS skills explicitly untouched.
- Smoke tests ensure the refactor actually changes behavior → Task 7.

**Placeholder scan:** every step has concrete content (the before/after markdown blocks, the exact file paths, the exact git commands). No TBD / "add appropriate" / "similar to Task N".

**Type consistency:** the three artifact names (`_shared/preflight.md`, `_shared/skill-contract.md`, the `## Contract` section in each skill) are used consistently across tasks. The provenance-block schema is defined once in Task 1 and referenced by link in every downstream task.
