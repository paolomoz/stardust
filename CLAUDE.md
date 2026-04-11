see @AGENTS.md

## Updating the Stardust Plugin

After making changes to skill files in `stardust-plugin/`, clear the plugin cache so Claude Code picks up the new version:

```bash
rm -rf ~/.claude/plugins/cache/stardust/
```

Then restart Claude Code. It will re-read from the local `stardust-plugin/` directory.