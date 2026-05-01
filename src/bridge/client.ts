// SupaSidebar MCP — Local bridge client
//
// TRUST: This client ONLY communicates with 127.0.0.1 (localhost).
// The host is hardcoded and cannot be changed via environment variables,
// command-line arguments, or any other configuration. This is intentional.
// The SupaSidebar app runs a local HTTP server that this client talks to.
// No data ever leaves your machine through this MCP server.

import type { BridgeClient, Space, Link, Folder, Tag, BrowserTab, RecentItem, ToggleResult, Setting, Shortcut, ActionResult, SearchShortcut, ATCRule, ATCRuleInput, BrowserProfile, InstalledBrowser } from "./types.js";

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
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
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
    // Swift handlers return {"error": "..."} on 4xx/5xx — surface the inner
    // message directly so the LLM sees the specific reason ("Brave is not
    // installed...") instead of "API error (400): {\"error\":\"...\"}".
    let detail = body || response.statusText;
    if (body) {
      try {
        const parsed = JSON.parse(body);
        if (parsed && typeof parsed === "object" && typeof parsed.error === "string") {
          detail = parsed.error;
        }
      } catch {
        // body wasn't JSON — fall through to raw text
      }
    }
    throw new Error(`SupaSidebar (${response.status}): ${detail}`);
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

    async getRecent(opts?: { limit?: number; offset?: number; since?: string; until?: string }): Promise<RecentItem[]> {
      const params: Record<string, string> = {};
      if (opts?.limit !== undefined) params.limit = String(opts.limit);
      if (opts?.offset !== undefined) params.offset = String(opts.offset);
      if (opts?.since) params.since = opts.since;
      if (opts?.until) params.until = opts.until;
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

    async toggleCommandPanel(): Promise<ToggleResult> {
      return request<ToggleResult>("/actions/toggle-command-panel", undefined, "POST");
    },

    async getVisibility() {
      return request<{ sidebar: boolean; commandPanel: boolean }>("/visibility");
    },

    async openLink(url: string, browser?: string, profileId?: string): Promise<ActionResult> {
      const body: Record<string, unknown> = { url };
      if (browser) body.browser = browser;
      if (profileId) body.profileId = profileId;
      return request<ActionResult>("/actions/open-link", undefined, "POST", body);
    },

    async webSearch(query: string, engine?: string, browser?: string): Promise<ActionResult> {
      const body: Record<string, unknown> = { query };
      if (engine) body.engine = engine;
      if (browser) body.browser = browser;
      return request<ActionResult>("/actions/web-search", undefined, "POST", body);
    },

    async listSearchShortcuts(): Promise<SearchShortcut[]> {
      return request<SearchShortcut[]>("/search-shortcuts");
    },

    async addSearchShortcut(keyword: string, name: string, searchURL: string): Promise<ActionResult> {
      return request<ActionResult>("/search-shortcuts", undefined, "POST", { keyword, name, searchURL });
    },

    async removeSearchShortcut(keywordOrId: string): Promise<ActionResult> {
      // Try as UUID first, then as keyword
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(keywordOrId);
      const body = isUUID ? { id: keywordOrId } : { keyword: keywordOrId };
      return request<ActionResult>("/search-shortcuts/remove", undefined, "POST", body);
    },

    async createSpace(name: string, color?: string, icon?: string): Promise<ActionResult> {
      const body: Record<string, unknown> = { name };
      if (color) body.color = color;
      if (icon) body.icon = icon;
      return request<ActionResult>("/spaces", undefined, "POST", body);
    },

    async createFolder(name: string, spaceId: string, parentFolderId?: string): Promise<ActionResult> {
      const body: Record<string, unknown> = { name, spaceId };
      if (parentFolderId) body.parentFolderId = parentFolderId;
      return request<ActionResult>("/folders", undefined, "POST", body);
    },

    async addLink(url: string, spaceId: string, name?: string, folderId?: string, notes?: string): Promise<ActionResult> {
      const body: Record<string, unknown> = { url, spaceId };
      if (name) body.name = name;
      if (folderId) body.folderId = folderId;
      if (notes) body.notes = notes;
      return request<ActionResult>("/links", undefined, "POST", body);
    },

    async moveLink(linkId: string, targetSpaceId?: string, targetFolderId?: string | null): Promise<ActionResult> {
      const body: Record<string, unknown> = { linkId };
      if (targetSpaceId !== undefined) body.targetSpaceId = targetSpaceId;
      if (targetFolderId !== undefined) body.targetFolderId = targetFolderId;
      return request<ActionResult>("/links/move", undefined, "POST", body);
    },

    async listATCRules(): Promise<ATCRule[]> {
      return request<ATCRule[]>("/atc/rules");
    },

    async addATCRule(rule: ATCRuleInput): Promise<ActionResult> {
      return request<ActionResult>("/atc/rules", undefined, "POST", rule as unknown as Record<string, unknown>);
    },

    async updateATCRule(id: string, updates: Partial<ATCRuleInput>): Promise<ActionResult> {
      return request<ActionResult>(`/atc/rules/${id}`, undefined, "PUT", updates as unknown as Record<string, unknown>);
    },

    async deleteATCRule(id: string): Promise<ActionResult> {
      return request<ActionResult>(`/atc/rules/${id}`, undefined, "DELETE");
    },

    async reorderATCRules(orderedIds: string[]): Promise<ActionResult> {
      return request<ActionResult>("/atc/rules/reorder", undefined, "POST", { orderedIds });
    },

    async listBrowserProfiles(): Promise<BrowserProfile[]> {
      return request<BrowserProfile[]>("/browser-profiles");
    },

    async listInstalledBrowsers(): Promise<InstalledBrowser[]> {
      return request<InstalledBrowser[]>("/installed-browsers");
    },
  };
}
