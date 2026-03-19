# SupaSidebar MCP Server

Let AI assistants interact with your [SupaSidebar](https://supasidebar.com) bookmarks, spaces, tabs, and more.

Works with Claude Code, Cursor, VS Code Copilot, and any MCP-compatible client.

## Trust & Privacy

This MCP server:

1. **Makes zero network requests** — communicates only with `127.0.0.1` (localhost). The host is hardcoded and cannot be changed.
2. **Stores zero data** — no files written, no databases, no caches.
3. **Has zero telemetry** — no analytics, no tracking, no usage reporting.
4. **Has zero logging** — nothing written to disk.
5. **Has one runtime dependency** — `@modelcontextprotocol/sdk` (the protocol library).

**Don't trust us — read the code.** The bridge client is ~60 lines in [`src/bridge/client.ts`](src/bridge/client.ts). The entire server is under 500 lines of TypeScript.

## How It Works

```
AI Client ──stdio──▸ MCP Server ──localhost:9847──▸ SupaSidebar App
(Claude,              (this repo,                    (your Mac,
 Cursor)               open source)                   your data)
```

The MCP server is a thin bridge. It translates AI tool calls into local HTTP requests to the SupaSidebar app running on your Mac. Your data never leaves your machine.

## Installation

### Claude Code

```bash
claude mcp add supasidebar -- npx supasidebar-mcp
```

### Cursor / VS Code

Add to your MCP settings (`.cursor/mcp.json` or `.vscode/mcp.json`):

```json
{
  "servers": {
    "supasidebar": {
      "command": "npx",
      "args": ["supasidebar-mcp"]
    }
  }
}
```

### Global install

```bash
npm install -g supasidebar-mcp
```

## Available Tools

| Tool | Description |
|------|-------------|
| `list_spaces` | List all spaces (top-level collections) |
| `list_links` | List links in a space or folder |
| `search` | Fuzzy search across all links by name, URL, notes, or tags |
| `list_folders` | List folder hierarchy in a space |
| `list_tags` | List all tags with usage counts |
| `get_live_tabs` | Get currently open browser tabs (filter by browser) |
| `list_recent` | List recently opened links |

## Examples

Once configured, ask your AI assistant:

- *"What spaces do I have in SupaSidebar?"*
- *"Find my bookmarks about Kubernetes"*
- *"What tabs do I have open in Arc?"*
- *"Show me the links in my Work space"*
- *"What did I open recently?"*

## Development

```bash
# Install dependencies
npm install

# Run in mock mode (no SupaSidebar app needed)
SUPASIDEBAR_MCP_MOCK=1 npx tsx src/index.ts

# Or
npx tsx src/index.ts --mock

# Build
npm run build
```

### Mock Mode

Pass `--mock` or set `SUPASIDEBAR_MCP_MOCK=1` to use built-in sample data. Useful for development and testing without the SupaSidebar app running.

## API Contract

The SupaSidebar app exposes a local HTTP server on `127.0.0.1:9847`. The MCP server calls these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/spaces` | GET | List all spaces |
| `/api/v1/spaces/:id/links` | GET | List links in a space |
| `/api/v1/spaces/:id/folders` | GET | List folders in a space |
| `/api/v1/search?q=...` | GET | Search links |
| `/api/v1/tags` | GET | List all tags |
| `/api/v1/tabs` | GET | Get live browser tabs |
| `/api/v1/recent` | GET | Recently opened links |

## Roadmap

- **Phase 1** (current): Read-only tools — query spaces, links, folders, tags, tabs
- **Phase 2**: Write tools — create links, folders, spaces; add tags; move items
- **Phase 3**: Smart actions — save tabs to space, open links in browsers, AI-powered organization

## License

MIT
