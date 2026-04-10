# SLICC Architecture Reference

Source: /Users/paolo/playground/slicc

## What Is SLICC

**Self-Licking Ice Cream Cone** — a browser-native AI agent platform that runs inside the browser and controls the browser it runs in.

- Browser-native, not browser-adjacent
- Multi-runtime: Chrome extension (side panel), CLI-launched standalone app, Electron overlay
- Full shell environment (just-bash 2.11.7 WASM, 78+ Unix commands)
- Real browser automation (CDP)
- Virtual filesystem (IndexedDB-backed VFS)
- Multi-agent delegation via isolated "scoops"
- Skill-based extensibility

## Ice Cream Vocabulary

| Term | Technical Meaning |
|------|-------------------|
| **Cone** | Main agent — orchestrates scoops, has full filesystem access |
| **Scoops** | Isolated sub-agents with own `/scoops/{name}/` sandbox, conversation, shell |
| **Licks** | External events — webhooks and cron tasks that wake up scoops |
| **Floats** | Runtime environments — CLI, extension, Electron, cloud |
| **Tray** | Multi-float session — coordinated across browsers |
| **Sprinkles** | Interactive `.shtml` UI panels |

## Architecture

### Three-Layer Extension Design

```
┌─────────────────────────────────┐
│ Side Panel (UI)                 │
│ Chat, Terminal, Files, Memory   │
└──────────────┬──────────────────┘
               │ chrome.runtime messages
┌──────────────▼──────────────────┐
│ Service Worker (Relay)          │
│ Routes panel ↔ offscreen        │
│ Proxies CDP via chrome.debugger │
└──────────────┬──────────────────┘
               │ chrome.runtime messages
┌──────────────▼──────────────────┐
│ Offscreen Document (Engine)     │
│ Agent orchestrator, VFS, shell  │
│ Persists to IndexedDB           │
└─────────────────────────────────┘
```

### Layer Stack

```
Virtual Filesystem (VirtualFS/IndexedDB)
    ↓
Virtual Shell (just-bash WASM) + Git (isomorphic-git)
    ↓
CDP (Chrome DevTools Protocol)
    ↓
Tools (bash, read_file, write_file, edit_file, scoop management)
    ↓
Core Agent (pi-agent-core + pi-ai)
    ↓
Scoops Orchestrator (cone + isolated scoops)
    ↓
UI (vanilla TypeScript)
```

## Tools Available to Agents

### File Tools
- `read_file(path, offset?, limit?)` — read with optional line ranges
- `write_file(path, content)` — create/overwrite
- `edit_file(path, edits)` — precise edits with line numbers

### Bash Tool
- `bash(command)` — full Unix pipeline support
- 78+ commands: grep, sed, awk, find, jq, tar, curl, git, node, python3
- Custom: zip, unzip, sqlite3, convert (ImageMagick), pdftk, playwright-cli, serve, open

### Scoop Management (cone only)
- `scoop_scoop(name)` — create
- `feed_scoop(name, instruction)` — give work
- `drop_scoop(name)` — delete
- `list_scoops()` — enumerate

### Messaging
- `send_message(to_scoop, content)` — inter-scoop
- `update_global_memory(key, value)` — shared KV store

### Browser Automation (via bash)
- `playwright-cli snapshot` — page accessibility tree + refs
- `playwright-cli click <ref>` — click by ref
- `playwright-cli screenshot` — capture page
- `playwright-cli cookie-set/delete` — manage cookies
- `playwright-cli open URL`, `playwright-cli tab-new`

## Skills System

### Three-Tier Discovery
1. **Native** (`/workspace/skills/`) — install-managed by SLICC
2. **agents** (`.agents/skills/*/SKILL.md`) — Claude Code skills
3. **claude** (`.claude/skills/*/SKILL.md`) — Claude skills

Priority: native > agents > claude (shadowed skills noted)

### How Skills Load
1. `ScoopContext.init()` calls `loadSkills()`
2. Scans all three directories recursively for SKILL.md
3. Reads headers (first 100 lines) into system prompt
4. Full content available when agent calls `read_file /path/to/SKILL.md`

### Installation Commands
- `skill list` — show available
- `skill install <name>` — copy to `/workspace/skills/{name}/`
- `skill uninstall <name>` — remove
- `upskill` — install from GitHub/ClawHub

## Handoffs (Agent-to-Agent)

Claude Code can hand off work to SLICC via special URLs:

```json
{
  "instruction": "Continue this in SLICC",
  "title": "Verify signup flow",
  "urls": ["http://localhost:3000/signup"],
  "context": "Local agent already changed the validation",
  "acceptanceCriteria": ["Form renders", "Submit works"],
  "notes": "Use current browser session"
}
```

Encoded as: `https://www.sliccy.ai/handoff#<base64url-json>`

Helper script: `.agents/skills/slicc-handoff/scripts/slicc-handoff`

## Key Strength for This Project

SLICC can see localhost pages directly in the browser without needing Playwright scripts. When building/testing EDS blocks, the agent can:
1. Run `serve` to serve the project
2. Navigate to the page in a browser tab
3. Use `playwright-cli snapshot/screenshot` to inspect
4. Make changes and see them immediately

This makes the design iteration loop (build → see → critique → refine) much tighter than in Claude Code.

## Default Bundled Skills

In `/workspace/skills/`:
- `playwright-cli/` — browser automation guidance
- `sprinkles/` — UI panel creation
- `scoop-management/` — delegation patterns
- `skill-authoring/` — how to write skills + shell scripts + licks
- `automation/` — webhooks & cron
- `inline-widgets/` — inline HTML in chat
- `welcome/` — onboarding

## Key Source Files

| File | Purpose |
|------|---------|
| `packages/vfs-root/shared/CLAUDE.md` | Agent system prompt (bundled) |
| `packages/webapp/src/skills/discover.ts` | Skill discovery engine |
| `packages/webapp/src/skills/catalog.ts` | Multi-source discovery |
| `packages/webapp/src/scoops/orchestrator.ts` | Cone + scoops orchestration |
| `packages/webapp/src/scoops/scoop-context.ts` | Individual scoop instance |
| `docs/architecture.md` | Detailed subsystem maps |
| `docs/shell-reference.md` | Shell commands reference |
| `docs/tools-reference.md` | Tools reference |
