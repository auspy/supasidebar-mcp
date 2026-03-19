import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { BridgeClient } from "./bridge/types.js";
import { handleListSpaces } from "./tools/spaces.js";
import { handleListLinks, handleSearch } from "./tools/links.js";
import { handleListFolders } from "./tools/folders.js";
import { handleListTags } from "./tools/tags.js";
import { handleGetLiveTabs } from "./tools/tabs.js";
import { handleListRecent } from "./tools/recent.js";

export function createServer(client: BridgeClient): McpServer {
  const server = new McpServer({
    name: "supasidebar",
    version: "0.1.0",
  });

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

  return server;
}
