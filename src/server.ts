import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { BridgeClient } from "./bridge/types.js";
import { handleListSpaces } from "./tools/spaces.js";
import { handleListLinks, handleSearch } from "./tools/links.js";
import { handleListFolders } from "./tools/folders.js";
import { handleListTags } from "./tools/tags.js";
import { handleGetLiveTabs } from "./tools/tabs.js";
import { handleListRecent } from "./tools/recent.js";
import { handleToggleSidebar, handleLaunchSidebar, handleSwitchSpace, handleOpenPreferences, handleToggleCommandPanel, handleGetVisibility } from "./tools/actions.js";
import { handleGetSettings, handleGetOneSetting, handleUpdateSetting, handleEnableFeature } from "./tools/settings.js";
import { handleGetShortcuts, handleUpdateShortcut, handleClearShortcut } from "./tools/shortcuts.js";
import { handleGetGuide } from "./tools/guide.js";
import { handleOpenLink, handleWebSearch, handleListSearchShortcuts, handleAddSearchShortcut, handleRemoveSearchShortcut } from "./tools/browser.js";

export function createServer(client: BridgeClient): McpServer {
  const server = new McpServer({
    name: "supasidebar",
    version: "0.2.0",
  });

  // --- Guide (call first to understand what's available) ---

  server.tool(
    "guide",
    "Get a complete guide to SupaSidebar's MCP capabilities. Shows all available tools, what they do, common user requests mapped to tool calls, setting categories, and feature presets. Call this first when you're unsure which tool to use.",
    {},
    async () => {
      return { content: [{ type: "text", text: handleGetGuide() }] };
    }
  );

  // --- Read-only tools (Phase 1) ---

  server.tool(
    "list_spaces",
    "List all spaces in SupaSidebar. Spaces are top-level collections that organize your links.",
    {},
    async () => {
      try {
        const text = await handleListSpaces(client);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  server.tool(
    "list_links",
    "List links in a specific space or folder. Returns link names, URLs, tags, and notes.",
    {
      spaceId: z.string().describe("The space ID to list links from. Get IDs from list_spaces."),
      folderId: z.string().optional().describe("Optional folder ID to filter links. Get IDs from list_folders."),
    },
    async ({ spaceId, folderId }) => {
      try {
        const text = await handleListLinks(client, spaceId, folderId);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  server.tool(
    "search",
    "Search across all links in SupaSidebar by name, URL, notes, or tags. Uses fuzzy matching.",
    {
      query: z.string().describe("Search query — matches against link names, URLs, notes, and tags."),
      limit: z.number().optional().describe("Max results to return (default: 20)."),
    },
    async ({ query, limit }) => {
      try {
        const text = await handleSearch(client, query, limit);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  server.tool(
    "list_folders",
    "List folders in a space. Folders organize links hierarchically within a space.",
    {
      spaceId: z.string().describe("The space ID to list folders from."),
    },
    async ({ spaceId }) => {
      try {
        const text = await handleListFolders(client, spaceId);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  server.tool(
    "list_tags",
    "List all tags used across your links, sorted by usage count.",
    {},
    async () => {
      try {
        const text = await handleListTags(client);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  server.tool(
    "get_live_tabs",
    "Get currently open browser tabs. Can filter by browser (Arc, Chrome, Safari, Firefox, Edge, Brave, etc).",
    {
      browser: z.string().optional().describe("Filter tabs by browser name, e.g. 'Arc', 'Chrome', 'Safari'."),
    },
    async ({ browser }) => {
      try {
        const text = await handleGetLiveTabs(client, browser);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  server.tool(
    "list_recent",
    "List recently opened links, ordered by most recent first.",
    {
      limit: z.number().optional().describe("Max results to return (default: 10)."),
    },
    async ({ limit }) => {
      try {
        const text = await handleListRecent(client, limit);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  // --- Action tools ---

  server.tool(
    "get_visibility",
    "Check whether the sidebar and command panel are currently visible, without changing their state. Use this instead of toggling just to check.",
    {},
    async () => {
      try {
        const text = await handleGetVisibility(client);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  server.tool(
    "toggle_sidebar",
    "Toggle SupaSidebar visibility (show/hide). Returns the new visibility state.",
    {},
    async () => {
      try {
        const text = await handleToggleSidebar(client);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  server.tool(
    "launch_sidebar",
    "Launch the SupaSidebar app if it's not already running. Uses macOS 'open -a' command.",
    {},
    async () => {
      try {
        const text = await handleLaunchSidebar();
        return { content: [{ type: "text", text }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  server.tool(
    "toggle_command_panel",
    "Toggle the SupaSidebar command panel (search/command palette). Opens it if closed, closes it if open.",
    {},
    async () => {
      try {
        const text = await handleToggleCommandPanel(client);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  server.tool(
    "switch_space",
    "Switch to a different space. Spaces organize your links into separate workspaces. Get space IDs from list_spaces.",
    {
      spaceId: z.string().describe("The space ID to switch to. Get IDs from list_spaces."),
    },
    async ({ spaceId }) => {
      try {
        const text = await handleSwitchSpace(client, spaceId);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  server.tool(
    "open_preferences",
    "Open the SupaSidebar Preferences window, optionally jumping to a specific tab. Useful when the user wants to see or adjust settings visually.",
    {
      tab: z.string().optional().describe("Preferences tab to open: general, sidebar, mouseTriggers, shortcuts, spaces, liveTabs, voice, aiTags, importExport, commandPanel, airTrafficControl, refer, about"),
    },
    async ({ tab }) => {
      try {
        const text = await handleOpenPreferences(client, tab);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  // --- Settings tools (Phase 2) ---

  server.tool(
    "get_settings",
    "Get SupaSidebar settings. With no arguments: returns all 40+ settings grouped by category. With 'key': returns a single setting by exact key or natural-language alias (e.g. 'compact mode', 'smart attach', 'atc'). With 'category': filters to one group.",
    {
      key: z.string().optional().describe("A specific setting key (e.g. 'isCompactMode') or natural-language alias (e.g. 'compact mode', 'smart attach'). Returns just that one setting with full detail."),
      category: z.string().optional().describe("Filter by category: sidebar, appearance, spaces, liveTabs, display, search, links, airTrafficControl, analytics, mcpBridge"),
    },
    async ({ key, category }) => {
      try {
        const text = key
          ? await handleGetOneSetting(client, key)
          : await handleGetSettings(client, category);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  server.tool(
    "update_setting",
    "Change a SupaSidebar setting. Use get_settings first to see available settings and their current values. Boolean settings use true/false, string settings use the documented options.",
    {
      key: z.string().describe("The setting key to update (e.g. 'isCompactMode', 'autoTileWindows'). Use get_settings to see all keys."),
      value: z.union([z.boolean(), z.string(), z.number()]).describe("The new value. Booleans for toggles, strings for mode selections, numbers for numeric settings."),
    },
    async ({ key, value }) => {
      try {
        const text = await handleUpdateSetting(client, key, value);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  server.tool(
    "enable_feature",
    "Enable a named feature preset that configures multiple settings at once. Presets: 'Smart Attach' (auto-show with browser), 'Independent Mode' (always visible), 'Space Isolation' (separate tabs per space), 'Minimal Sidebar' (compact and clean), 'Full Featured' (everything on). Use get_settings to see all presets.",
    {
      feature: z.string().describe("Feature name or alias, e.g. 'Smart Attach', 'minimal', 'space isolation', 'independent mode', 'full featured'."),
    },
    async ({ feature }) => {
      try {
        const text = await handleEnableFeature(client, feature);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  // --- Shortcut tools (Phase 2) ---

  server.tool(
    "get_shortcuts",
    "List all configurable keyboard shortcuts with their current key bindings. Shows the shortcut name (used for updates), display string, title, and description.",
    {},
    async () => {
      try {
        const text = await handleGetShortcuts(client);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  server.tool(
    "update_shortcut",
    "Change a keyboard shortcut binding. Requires at least one modifier key. Use get_shortcuts to see available shortcut names.",
    {
      name: z.string().describe("The shortcut name (e.g. 'toggleSidebar', 'saveCurrentPage'). Get names from get_shortcuts."),
      key: z.string().describe("The key to bind (e.g. 'space', 's', 'k', 'f1', 'left'). Valid: a-z, 0-9, space, return, tab, escape, delete, left, right, up, down, f1-f12."),
      modifiers: z.array(z.string()).describe("Modifier keys (at least one required). Valid: 'command', 'shift', 'option', 'control'. Aliases: 'cmd', 'ctrl', 'opt', 'alt'."),
    },
    async ({ name, key, modifiers }) => {
      try {
        const text = await handleUpdateShortcut(client, name, key, modifiers);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  server.tool(
    "clear_shortcut",
    "Remove a keyboard shortcut binding so it no longer has a key combination assigned.",
    {
      name: z.string().describe("The shortcut name to clear (e.g. 'toggleSidebar'). Get names from get_shortcuts."),
    },
    async ({ name }) => {
      try {
        const text = await handleClearShortcut(client, name);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  // --- Browser & Search tools ---

  server.tool(
    "open_link",
    "Open a URL in a specific browser or the default browser. Supports 14 browsers: Safari, Chrome, Firefox, Edge, Arc, Brave, Vivaldi, Dia, Comet, Orion, Zen, Atlas, Wavebox, Helium.",
    {
      url: z.string().describe("The URL to open (e.g. 'https://github.com')."),
      browser: z.string().optional().describe("Browser to open in (e.g. 'Chrome', 'Arc', 'Safari'). Omit for default browser."),
    },
    async ({ url, browser }) => {
      try {
        const text = await handleOpenLink(client, url, browser);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  server.tool(
    "web_search",
    "Search the web using a search engine or custom website shortcut. Built-in engines: Google, Bing, DuckDuckGo, Yahoo, Perplexity. Custom shortcuts let you search specific sites (e.g. YouTube, Reddit, GitHub). Use list_search_shortcuts to see all available.",
    {
      query: z.string().describe("The search query."),
      engine: z.string().optional().describe("Search engine or shortcut keyword (e.g. 'google', 'perplexity', 'yo' for YouTube, 'reddit'). Defaults to user's configured default engine."),
      browser: z.string().optional().describe("Browser to open results in. Omit for default browser."),
    },
    async ({ query, engine, browser }) => {
      try {
        const text = await handleWebSearch(client, query, engine, browser);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  server.tool(
    "list_search_shortcuts",
    "List all available search engines and custom website search shortcuts. Shows built-in engines (Google, Bing, etc.) and user-created shortcuts (YouTube, Reddit, etc.) with their keywords for use with web_search.",
    {},
    async () => {
      try {
        const text = await handleListSearchShortcuts(client);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  server.tool(
    "add_search_shortcut",
    "Add a custom website search shortcut so you can search a specific site via web_search. The searchURL should be the site's search URL with the query parameter at the end (e.g. 'https://www.youtube.com/results?search_query=').",
    {
      keyword: z.string().describe("Short keyword to trigger this shortcut (e.g. 'gh' for GitHub, 'so' for Stack Overflow). Used as: web_search engine='gh' query='...'"),
      name: z.string().describe("Display name for the shortcut (e.g. 'GitHub', 'Stack Overflow')."),
      searchURL: z.string().describe("The search URL base. The query will be appended to this. Example: 'https://github.com/search?q=' or 'https://stackoverflow.com/search?q='"),
    },
    async ({ keyword, name, searchURL }) => {
      try {
        const text = await handleAddSearchShortcut(client, keyword, name, searchURL);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  server.tool(
    "remove_search_shortcut",
    "Remove a custom website search shortcut by its keyword or ID.",
    {
      keyword: z.string().describe("The shortcut keyword to remove (e.g. 'yo', 'reddit'). Can also be the UUID of the shortcut."),
    },
    async ({ keyword }) => {
      try {
        const text = await handleRemoveSearchShortcut(client, keyword);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        return { content: [{ type: "text", text: (err as Error).message }], isError: true };
      }
    }
  );

  return server;
}
