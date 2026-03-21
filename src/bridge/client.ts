// SupaSidebar MCP — Local bridge client
//
// TRUST: This client ONLY communicates with 127.0.0.1 (localhost).
// The host is hardcoded and cannot be changed via environment variables,
// command-line arguments, or any other configuration. This is intentional.
// The SupaSidebar app runs a local HTTP server that this client talks to.
// No data ever leaves your machine through this MCP server.

import type { BridgeClient, Space, Link, Folder, Tag, BrowserTab, RecentItem, ToggleResult, Setting, Shortcut, ActionResult } from "./types.js";

// Hardcoded. Not configurable. This is a trust decision.
const BRIDGE_HOST = "127.0.0.1";
const BRIDGE_PORT = 9847;
const BASE_URL = `http://${BRIDGE_HOST}:${BRIDGE_PORT}/api/v1`;

const APP_NOT_RUNNING =
  "SupaSidebar is not running or its local API is not enabled. " +
  "Please open SupaSidebar and ensure the MCP bridge is turned on in Preferences.";

async function request<T>(
  path: string,
  params?: Record<string, string>,
  method: "GET" | "POST" | "PUT" = "GET",
  body?: Record<string, unknown>
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, value);
    }
  }

  const fetchOptions: RequestInit = { method };
  if (body) {
    fetchOptions.headers = { "Content-Type": "application/json" };
    fetchOptions.body = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), fetchOptions);
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).cause
      ? ((err as NodeJS.ErrnoException).cause as NodeJS.ErrnoException).code
      : undefined;
    if (code === "ECONNREFUSED" || code === "ECONNRESET") {
      throw new Error(APP_NOT_RUNNING);
    }
    throw new Error(`Failed to connect to SupaSidebar: ${(err as Error).message}`);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`SupaSidebar API error (${response.status}): ${body || response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export function createBridgeClient(): BridgeClient {
  return {
    async getSpaces(): Promise<Space[]> {
      return request<Space[]>("/spaces");
    },

    async getLinks(spaceId: string, folderId?: string): Promise<Link[]> {
      const params: Record<string, string> = {};
      if (folderId) params.folderId = folderId;
      return request<Link[]>(`/spaces/${spaceId}/links`, params);
    },

    async search(query: string, limit?: number): Promise<Link[]> {
      const params: Record<string, string> = { q: query };
      if (limit) params.limit = String(limit);
      return request<Link[]>("/search", params);
    },

    async getFolders(spaceId: string): Promise<Folder[]> {
      return request<Folder[]>(`/spaces/${spaceId}/folders`);
    },

    async getTags(): Promise<Tag[]> {
      return request<Tag[]>("/tags");
    },

    async getLiveTabs(browser?: string): Promise<BrowserTab[]> {
      const params: Record<string, string> = {};
      if (browser) params.browser = browser;
      return request<BrowserTab[]>("/tabs", params);
    },

    async getRecent(limit?: number): Promise<RecentItem[]> {
      const params: Record<string, string> = {};
      if (limit) params.limit = String(limit);
      return request<RecentItem[]>("/recent", params);
    },

    async toggleSidebar(): Promise<ToggleResult> {
      return request<ToggleResult>("/actions/toggle-sidebar", undefined, "POST");
    },

    async getSettings(category?: string): Promise<Setting[]> {
      const params: Record<string, string> = {};
      if (category) params.category = category;
      return request<Setting[]>("/settings", params);
    },

    async updateSetting(key: string, value: boolean | string | number): Promise<ActionResult> {
      return request<ActionResult>("/settings", undefined, "PUT", { key, value });
    },

    async getShortcuts(): Promise<Shortcut[]> {
      return request<Shortcut[]>("/shortcuts");
    },

    async updateShortcut(name: string, key: string, modifiers: string[]): Promise<ActionResult> {
      return request<ActionResult>(`/shortcuts/${name}`, undefined, "PUT", { key, modifiers });
    },

    async clearShortcut(name: string): Promise<ActionResult> {
      return request<ActionResult>(`/shortcuts/${name}`, undefined, "PUT", { clear: true });
    },

    async switchSpace(spaceId: string): Promise<ActionResult> {
      return request<ActionResult>("/actions/switch-space", undefined, "POST", { spaceId });
    },

    async openPreferences(tab?: string): Promise<ActionResult> {
      return request<ActionResult>("/actions/open-preferences", undefined, "POST", tab ? { tab } : {});
    },
  };
}
