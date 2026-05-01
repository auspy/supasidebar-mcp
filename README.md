# SupaSidebar MCP Server

Let AI assistants interact with your [SupaSidebar](https://supasidebar.com) bookmarks, spaces, tabs, and more.

Works with Claude Code, Claude Desktop, Cursor, VS Code Copilot, and any MCP-compatible client.

**Docs**: [docs.supasidebar.com/features/mcp](https://docs.supasidebar.com/features/mcp)

## How it works

```
AI Client --stdio--> MCP Server --localhost:9847--> SupaSidebar App
(Claude,              (this package,                 (your Mac,
 Cursor)               open source)                   your data)
```

The MCP server is a thin bridge. It translates AI tool calls into local HTTP requests to the SupaSidebar app running on your Mac. Your data never leaves your machine.

## Trust & Privacy

1. **Zero network requests** - communicates only with `127.0.0.1` (localhost). The host is hardcoded and cannot be changed.
2. **Zero data storage** - no files written, no databases, no caches.
3. **Zero telemetry** - no analytics, no tracking, no usage reporting.
4. **One runtime dependency** - `@modelcontextprotocol/sdk` (the protocol library).

**Don't trust us - read the code.** The bridge client is ~60 lines in [`src/bridge/client.ts`](src/bridge/client.ts).

## Setup

### Claude Code

```bash
claude mcp add supasidebar -- npx -y supasidebar-mcp
```

### Claude Desktop

Add to `claude_desktop_config.json` (**Claude > Settings > Developer > Edit Config**):

```json
{
  "mcpServers": {
    "supasidebar": {
      "command": "npx",
      "args": ["-y", "supasidebar-mcp"]
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "supasidebar": {
      "command": "npx",
      "args": ["-y", "supasidebar-mcp"]
    }
  }
}
```

> **Troubleshooting:** If you see "Failed to spawn process", you likely use a Node version manager (fnm, nvm, volta). Replace the command with `"/bin/zsh"` and args with `["-lc", "npx -y supasidebar-mcp"]` to load your shell profile.

## Available tools (35)

### Browse and search

| Tool | Description |
|------|-------------|
| `search` | Fuzzy search across all links by name, URL, notes, or tags |
| `list_spaces` | List all spaces |
| `list_links` | List links in a space or folder |
| `list_folders` | List folders in a space |
| `list_recent` | List recently opened links |
| `list_tags` | List all tags with usage counts |
| `get_live_tabs` | Get currently open browser tabs, optionally filtered by browser |
| `list_browser_profiles` | List browser profiles across all supported browsers |

### Create and organize

| Tool | Description |
|------|-------------|
| `add_link` | Save a new link (auto-fetches page title if name is omitted) |
| `create_space` | Create a new space |
| `create_folder` | Create a folder inside a space |
| `move_link` | Move a link to a different space or folder |

### Actions

| Tool | Description |
|------|-------------|
| `open_link` | Open a URL in a specific browser or the default |
| `switch_space` | Switch to a different space |
| `toggle_sidebar` | Show or hide the sidebar |
| `toggle_command_panel` | Open or close the command panel |
| `launch_sidebar` | Start SupaSidebar if it's not running |
| `get_visibility` | Check if sidebar and command panel are visible |
| `web_search` | Search the web using Google, DuckDuckGo, Perplexity, or custom shortcuts |

### Settings and shortcuts

| Tool | Description |
|------|-------------|
| `get_settings` | View all settings grouped by category |
| `update_setting` | Change any setting |
| `enable_feature` | Apply a preset (Smart Attach, Independent Mode, Minimal Sidebar, etc.) |
| `open_preferences` | Open Preferences, optionally to a specific tab |
| `get_shortcuts` | List all keyboard shortcuts |
| `update_shortcut` | Change a shortcut binding |
| `clear_shortcut` | Remove a shortcut binding |

### Custom web search shortcuts

| Tool | Description |
|------|-------------|
| `list_search_shortcuts` | List all search engines and custom shortcuts |
| `add_search_shortcut` | Create a custom search shortcut |
| `remove_search_shortcut` | Delete a custom shortcut |

### Air Traffic Control

| Tool | Description |
|------|-------------|
| `list_atc_rules` | List URL routing rules |
| `add_atc_rule` | Create a URL routing rule |
| `update_atc_rule` | Update an existing rule |
| `delete_atc_rule` | Delete a rule |
| `reorder_atc_rules` | Reorder rules by priority |

### Guide

| Tool | Description |
|------|-------------|
| `guide` | Get a complete guide to all MCP capabilities and feature presets |

## Development

```bash
npm install
npm run build

# Run with mock data (no SupaSidebar app needed)
npx tsx src/index.ts --mock
```

## License

MIT
