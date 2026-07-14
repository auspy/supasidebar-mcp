# SupaSidebar MCP Server

Give your AI assistant local access to your current open tabs, saved bookmarks, and recently opened links across every browser on your Mac. Nothing leaves your device.

Works with Claude Code, Claude Desktop, Cursor, Codex, VS Code Copilot, and any MCP-compatible client.

> **New to SupaSidebar?** [SupaSidebar](https://supasidebar.com) is a free macOS app that brings an Arc-style sidebar to every browser - one place for your tabs, bookmarks, files, folders, and apps. This MCP server is the bridge that lets an AI agent drive it. You'll need the app installed and running (it's free to start), because every tool call runs locally against it.

**Docs**: [docs.supasidebar.com/features/mcp](https://docs.supasidebar.com/features/mcp)

## What you can do with it

Once it's connected, you talk to your AI assistant in plain language and it uses the tools below to act on your behalf. A few things people ask for:

**Tame open tabs**
> "What do I have open right now? Save everything about the Q3 launch into a new 'Launch' space and close the noise."

*(uses `get_live_tabs`, `create_space`, `add_link`)*

**Find that thing you saved**
> "Find the pricing page I bookmarked last week - I think it had 'billing' in the notes."

*(uses `search`, `list_recent`)*

**Organize without clicking**
> "My unfiled links are a mess. Group them into folders by topic and move them there."

*(uses `list_links`, `create_folder`, `move_link`)*

**Open things in the right place**
> "Open my three design links in Chrome's Work profile."

*(uses `list_browser_profiles`, `open_link`)*

**Automate routing once, forever**
> "From now on, always open figma.com links in my browser's Design profile, and save any URL from my company domain into the 'Work' space."

*(uses `add_atc_rule`)*

**Recall your day**
> "What did I open yesterday afternoon?"

*(uses `list_recent` with date filters)*

All 36 tools are listed [further down](#available-tools-36). Nothing leaves your Mac - see [Trust & Privacy](#trust--privacy).

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

## Prerequisites

You need **Node.js 18 or newer** (which provides `npx`). Check with:

```bash
node --version    # should print v18.x or higher
npx --version     # should print a version number, not "command not found"
```

If `npx` isn't found, install Node. Pick whichever you prefer:

- **With Homebrew** (easiest if you already have `brew`):
  ```bash
  brew install node
  ```
- **Without Homebrew** - download the LTS installer from [nodejs.org/en/download](https://nodejs.org/en/download) and run it. The macOS `.pkg` installer puts `node` and `npx` on your PATH automatically; just restart your terminal afterwards.

The SupaSidebar app must be running - the MCP server talks to its local bridge API at `127.0.0.1:9847`.

**Compatibility:** `supasidebar-mcp@0.2.3` requires **SupaSidebar app 0.17.2 or later**. Older app versions are missing bridge endpoints used by some of the 36 tools.

### macOS permissions

SupaSidebar needs two macOS permissions for the MCP tools to work end-to-end (especially anything touching browsers, tabs, or windows). Open the relevant pane in **System Settings → Privacy & Security**:

- **Accessibility** - required for window/sidebar control, global shortcuts, and tab management.
  Open: [Privacy & Security → Accessibility](x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility)
- **Automation** - required for browser integration (read live tabs, open URLs in specific browsers/profiles via AppleScript).
  Open: [Privacy & Security → Automation](x-apple.systempreferences:com.apple.preference.security?Privacy_Automation)

Make sure **SupaSidebar** is checked in both panes. If you grant a permission while the app is running, quit and relaunch SupaSidebar so it picks up the new permission.

## Setup

### Claude Code

The recommended way - register at user scope so it's available in every project:

```bash
claude mcp add -s user supasidebar -- npx -y supasidebar-mcp
```

Verify it registered:

```bash
claude mcp list
# expected: supasidebar    ✓ Connected
```

Inside a session, `/mcp` shows connected servers and tool counts.

> **Just for one project?** Drop `-s user`:
> ```bash
> claude mcp add supasidebar -- npx -y supasidebar-mcp
> ```

> **⚠️ Do not put MCP config in `~/.claude/settings.json`.** That file is for hooks, permissions, and env vars only - Claude Code silently ignores unknown keys there, so the server appears to "register" but no tools will load. The correct location is `~/.claude.json` under `mcpServers` (which `claude mcp add` writes to automatically).

> **Prefer to hand-edit?** Add to `~/.claude.json` (note: `.claude.json`, not `.claude/settings.json`):
> ```json
> {
>   "mcpServers": {
>     "supasidebar": {
>       "type": "stdio",
>       "command": "npx",
>       "args": ["-y", "supasidebar-mcp"]
>     }
>   }
> }
> ```
> Restart Claude Code after editing.

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

### Codex

1. Make sure Codex CLI is installed and SupaSidebar is running
2. Register the MCP server:
   ```bash
   codex mcp add supasidebar -- npx -y supasidebar-mcp
   ```
3. Verify with `codex mcp list` and `codex mcp get supasidebar`
4. Inside a Codex session, ask the agent to *"list every SupaSidebar tool you have access to - there should be at least 35"* to confirm all tools are wired up. Codex's `/mcp` panel sometimes under-reports, but the tools are still callable - see [Troubleshooting](#troubleshooting) below.

## Troubleshooting

**`npx: command not found` / `command failed: npx`**
You don't have Node installed. Either run `brew install node`, or download the LTS installer from [nodejs.org/en/download](https://nodejs.org/en/download) if you don't use Homebrew. Restart your terminal and AI client afterwards.

**Tools don't appear in Claude Code (`mcp__supasidebar__*` missing)**
- Run `claude mcp list` - if `supasidebar` isn't there, registration failed. Re-run the `claude mcp add` command above.
- Confirm config is in `~/.claude.json`, **not** `~/.claude/settings.json`.
- Restart Claude Code after any MCP change - servers are spawned once at session start.
- For verbose handshake logs: `claude --mcp-debug`.

**"Failed to connect to SupaSidebar" / `fetch failed`**
The MCP server can't reach the SupaSidebar app. Make sure SupaSidebar is running, then check the bridge:
```bash
curl http://127.0.0.1:9847/api/v1/health
# expected: {"app":"SupaSidebar","status":"ok",...}
```

**"Failed to spawn process" (Cursor / version managers)**
If you use a Node version manager (fnm, nvm, volta), the AI client may not see your shell PATH. Replace the command/args with:
```json
"command": "/bin/zsh",
"args": ["-lc", "npx -y supasidebar-mcp"]
```

**Codex's `/mcp` panel shows fewer tools than expected**
Known display bug ([openai/codex#17021](https://github.com/openai/codex/issues/17021)) - Codex CLI's `/mcp` view under-reports MCP tools, even though all of them are registered and callable. To verify what's actually available, ask the agent directly with a prompt like:

> List every SupaSidebar tool you have access to - there should be at least 35.

If Codex returns fewer, fall back to the MCP Inspector below for the ground truth.

**See exactly which tools are exposed**

Different clients show different views of MCP tools, and some (notably Codex) under-report what's actually registered. Use one of these to see the ground truth:

- **Inside Claude Code:** type `/mcp` - reliably lists each connected server and its tool count.
- **Inside Codex:** type `/mcp` (often under-reports - see entry above; prefer asking the agent or using the Inspector).
- **Universal - MCP Inspector** (works without any AI client; spins up a local web UI):
  ```bash
  npx @modelcontextprotocol/inspector npx -y supasidebar-mcp
  ```
  Open the printed URL in a browser, click "Connect", then "List Tools" - you'll see all 36 tools with their schemas and can test-call any of them. This is the fastest way to confirm whether a tool-count problem is in the server or in the client.

## Available tools (36)

### Browse and search

| Tool | Description |
|------|-------------|
| `search` | Fuzzy search across all links by name, URL, notes, or tags |
| `list_spaces` | List all spaces (top-level collections) |
| `list_links` | List links in a space or folder, with names, URLs, tags, and notes |
| `list_folders` | List folders inside a space |
| `list_recent` | Recently opened links - paginate with `limit`/`offset`, filter with `day`/`since`/`until` |
| `list_tags` | List all tags, sorted by usage count |
| `get_live_tabs` | Get currently open browser tabs, optionally filtered by browser |
| `list_browser_profiles` | List browser profiles discovered by SupaSidebar (for use with `open_link` and ATC rules) |
| `list_installed_browsers` | List browsers actually installed on this machine (call before `open_link` if unsure) |

### Create and organize

| Tool | Description |
|------|-------------|
| `add_link` | Save a new link (auto-fetches page title if `name` is omitted) |
| `create_space` | Create a new space |
| `create_folder` | Create a folder inside a space, optionally nested under a parent folder |
| `move_link` | Move a link to a different space or folder (pass `targetFolderId: null` for unfiled root) |

### Actions

| Tool | Description |
|------|-------------|
| `open_link` | Open a URL in a specific browser, browser profile, or the default browser |
| `switch_space` | Switch to a different space |
| `toggle_sidebar` | Show or hide the sidebar |
| `toggle_command_panel` | Open or close the command panel |
| `launch_sidebar` | Start SupaSidebar if it's not running |
| `get_visibility` | Check if sidebar and command panel are visible (without changing state) |
| `web_search` | Search the web using Google, Bing, DuckDuckGo, Yahoo, Perplexity, Brave, Kagi, or any custom shortcut |

### Settings and shortcuts

| Tool | Description |
|------|-------------|
| `get_settings` | Get all settings (grouped by category), or look up one setting by key or natural-language alias |
| `update_setting` | Change a setting (boolean, string, or number) |
| `enable_feature` | Apply a preset: Smart Attach, Independent Mode, Space Isolation, Minimal Sidebar, Full Featured |
| `open_preferences` | Open the Preferences window, optionally jumping to a specific tab |
| `get_shortcuts` | List all configurable keyboard shortcuts with current bindings |
| `update_shortcut` | Change a shortcut binding (requires at least one modifier) |
| `clear_shortcut` | Remove a shortcut binding |

### Custom web search shortcuts

| Tool | Description |
|------|-------------|
| `list_search_shortcuts` | List all search engines and custom shortcuts with their keywords |
| `add_search_shortcut` | Create a custom search shortcut for a specific site |
| `remove_search_shortcut` | Delete a custom shortcut by keyword or ID |

### Air Traffic Control

| Tool | Description |
|------|-------------|
| `list_atc_rules` | List all URL routing rules (evaluated top-to-bottom, first match wins) |
| `add_atc_rule` | Create a save rule (route saved links to a space) or open rule (open URLs in a specific browser/profile) |
| `update_atc_rule` | Update fields on an existing ATC rule |
| `delete_atc_rule` | Delete a rule by ID |
| `reorder_atc_rules` | Change rule priority order |

### Guide

| Tool | Description |
|------|-------------|
| `guide` | Get a complete guide to all MCP capabilities, common requests, setting categories, and feature presets. **Call this first if you're unsure which tool to use.** |

## License

MIT
