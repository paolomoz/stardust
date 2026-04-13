see @AGENTS.md

## Updating the Stardust Plugin

After making changes to skill files in `stardust-plugin/`, clear the plugin cache so Claude Code picks up the new version:

```bash
rm -rf ~/.claude/plugins/cache/stardust/
```

Then restart Claude Code. It will re-read from the local `stardust-plugin/` directory.

## Tracking Future Features

When a future feature, improvement, or gap is surfaced during a conversation, check whether it's already tracked as a GitHub issue on `paolomoz/stardust` (`gh issue list --search "<keywords>"`). If not, open one with `gh issue create` and report the issue number back. Don't let future-work ideas live only in conversation.