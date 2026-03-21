// SupaSidebar MCP — Mock data layer
// Used for testing the MCP server without the SupaSidebar app running.
// Activate with: --mock flag or SUPASIDEBAR_MCP_MOCK=1 env var.

import type { BridgeClient, Space, Link, Folder, Tag, BrowserTab, RecentItem, ToggleResult, Setting, Shortcut, ActionResult } from "./types.js";

const spaces: Space[] = [
  { id: "sp-1", name: "Work", color: "#3B82F6", icon: "briefcase", linkCount: 5, folderCount: 2, order: 0 },
  { id: "sp-2", name: "Personal", color: "#10B981", icon: "heart", linkCount: 3, folderCount: 1, order: 1 },
  { id: "sp-3", name: "Research", color: "#8B5CF6", icon: "book", linkCount: 4, folderCount: 2, order: 2 },
];

const links: Link[] = [
  { id: "lk-1", name: "GitHub Dashboard", url: "https://github.com", type: "web", tags: ["dev", "daily"], notes: "Main dashboard", folderId: "fd-1", spaceId: "sp-1", isPinned: true, createdAt: "2025-01-15T10:00:00Z", lastOpenedAt: "2026-03-19T09:00:00Z" },
  { id: "lk-2", name: "Linear Issues", url: "https://linear.app", type: "web", tags: ["dev", "tasks"], notes: "", folderId: "fd-1", spaceId: "sp-1", isPinned: false, createdAt: "2025-02-01T08:00:00Z", lastOpenedAt: "2026-03-18T14:00:00Z" },
  { id: "lk-3", name: "Figma Project", url: "https://figma.com/file/abc123", type: "web", tags: ["design"], notes: "Main app redesign", folderId: "fd-2", spaceId: "sp-1", isPinned: true, createdAt: "2025-03-10T11:00:00Z", lastOpenedAt: "2026-03-17T16:00:00Z" },
  { id: "lk-4", name: "Vercel Dashboard", url: "https://vercel.com/dashboard", type: "web", tags: ["dev", "deploy"], notes: "", folderId: null, spaceId: "sp-1", isPinned: false, createdAt: "2025-01-20T09:00:00Z", lastOpenedAt: "2026-03-19T08:30:00Z" },
  { id: "lk-5", name: "Notion Docs", url: "https://notion.so/workspace", type: "web", tags: ["docs"], notes: "Team wiki", folderId: null, spaceId: "sp-1", isPinned: false, createdAt: "2025-04-01T10:00:00Z", lastOpenedAt: null },
  { id: "lk-6", name: "YouTube Music", url: "https://music.youtube.com", type: "web", tags: ["music"], notes: "", folderId: null, spaceId: "sp-2", isPinned: true, createdAt: "2025-05-01T12:00:00Z", lastOpenedAt: "2026-03-19T07:00:00Z" },
  { id: "lk-7", name: "Recipe Collection", url: "https://cooking.nytimes.com/saved", type: "web", tags: ["cooking"], notes: "Saved recipes", folderId: "fd-3", spaceId: "sp-2", isPinned: false, createdAt: "2025-06-15T14:00:00Z", lastOpenedAt: "2026-03-16T19:00:00Z" },
  { id: "lk-8", name: "Kindle Library", url: "https://read.amazon.com", type: "web", tags: ["reading"], notes: "", folderId: null, spaceId: "sp-2", isPinned: false, createdAt: "2025-07-01T08:00:00Z", lastOpenedAt: null },
  { id: "lk-9", name: "MCP Specification", url: "https://spec.modelcontextprotocol.io", type: "web", tags: ["ai", "protocol"], notes: "Model Context Protocol spec", folderId: "fd-4", spaceId: "sp-3", isPinned: true, createdAt: "2025-11-01T10:00:00Z", lastOpenedAt: "2026-03-19T10:00:00Z" },
  { id: "lk-10", name: "Swift Concurrency Guide", url: "https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html", type: "web", tags: ["swift", "docs"], notes: "async/await patterns", folderId: "fd-5", spaceId: "sp-3", isPinned: false, createdAt: "2025-09-20T11:00:00Z", lastOpenedAt: "2026-03-15T13:00:00Z" },
  { id: "lk-11", name: "ArXiv - Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762", type: "web", tags: ["ai", "papers"], notes: "Transformer paper", folderId: "fd-4", spaceId: "sp-3", isPinned: false, createdAt: "2025-08-10T09:00:00Z", lastOpenedAt: null },
  { id: "lk-12", name: "Core Data Best Practices", url: "https://developer.apple.com/documentation/coredata", type: "web", tags: ["swift", "docs"], notes: "", folderId: "fd-5", spaceId: "sp-3", isPinned: false, createdAt: "2025-10-05T15:00:00Z", lastOpenedAt: "2026-03-14T10:00:00Z" },
];

const folders: Folder[] = [
  { id: "fd-1", name: "Dev Tools", parentId: null, spaceId: "sp-1", linkCount: 2, children: [], order: 0 },
  { id: "fd-2", name: "Design", parentId: null, spaceId: "sp-1", linkCount: 1, children: [], order: 1 },
  { id: "fd-3", name: "Recipes", parentId: null, spaceId: "sp-2", linkCount: 1, children: [], order: 0 },
  { id: "fd-4", name: "AI & ML", parentId: null, spaceId: "sp-3", linkCount: 2, children: [], order: 0 },
  { id: "fd-5", name: "Apple Dev", parentId: null, spaceId: "sp-3", linkCount: 2, children: [], order: 1 },
];

const tags: Tag[] = [
  { id: "tg-1", name: "dev", color: "#3B82F6", usageCount: 3 },
  { id: "tg-2", name: "ai", color: "#8B5CF6", usageCount: 2 },
  { id: "tg-3", name: "swift", color: "#F97316", usageCount: 2 },
  { id: "tg-4", name: "docs", color: "#6B7280", usageCount: 3 },
  { id: "tg-5", name: "design", color: "#EC4899", usageCount: 1 },
];

const browserTabs: BrowserTab[] = [
  { title: "GitHub - supasidebar/mcp-server", url: "https://github.com/supasidebar/mcp-server", browser: "Arc", isActive: true, windowId: 1 },
  { title: "MCP Specification", url: "https://spec.modelcontextprotocol.io", browser: "Arc", isActive: false, windowId: 1 },
  { title: "TypeScript Docs", url: "https://www.typescriptlang.org/docs/", browser: "Arc", isActive: false, windowId: 1 },
  { title: "Stack Overflow - node fetch", url: "https://stackoverflow.com/questions/123456", browser: "Chrome", isActive: true, windowId: 2 },
  { title: "Apple Developer Documentation", url: "https://developer.apple.com/documentation", browser: "Safari", isActive: true, windowId: 3 },
];

const recentItems: RecentItem[] = [
  { linkId: "lk-1", name: "GitHub Dashboard", url: "https://github.com", openedAt: "2026-03-19T09:00:00Z", spaceId: "sp-1", spaceName: "Work" },
  { linkId: "lk-4", name: "Vercel Dashboard", url: "https://vercel.com/dashboard", openedAt: "2026-03-19T08:30:00Z", spaceId: "sp-1", spaceName: "Work" },
  { linkId: "lk-9", name: "MCP Specification", url: "https://spec.modelcontextprotocol.io", openedAt: "2026-03-19T10:00:00Z", spaceId: "sp-3", spaceName: "Research" },
  { linkId: "lk-6", name: "YouTube Music", url: "https://music.youtube.com", openedAt: "2026-03-19T07:00:00Z", spaceId: "sp-2", spaceName: "Personal" },
];

// Mock settings with realistic defaults
const mockSettingsState = new Map<string, boolean | string | number>([
  ["isLeftSide", true],
  ["isDraggable", true],
  ["isResizable", true],
  ["isCompactMode", false],
  ["browserAutoVisibilityEnabled", true],
  ["smartAttachFillScreen", true],
  ["autoTileWindows", "smart"],
  ["sidebarHideBehavior", "fill"],
  ["keepSidebarVisibleWithAllApps", false],
  ["showSidebarOnFinder", false],
  ["browserWindowAdjustmentMode", "fill"],
  ["floatingButtonEnabled", false],
  ["preventBrowserOverlap", true],
  ["smartSideSwitch", false],
  ["opacityOnFocusChange", false],
  ["spaceColorTintEnabled", true],
  ["spaceColorTintOpacity", 0.15],
  ["spaceNavigationEnabled", true],
  ["spaceNavigationNumberShortcutsEnabled", true],
  ["saveTabsOnSpaceSwitch", false],
  ["tabRestoreBehavior", "ask"],
  ["spaceSwitchSuggestionBehavior", "ask"],
  ["closeTabsOnSpaceChange", false],
  ["autoLaunchBrowserOnProfileSpace", false],
  ["naturalSwipeDirection", true],
  ["showLiveTabs", true],
  ["backgroundTabSync", false],
  ["showItemCounts", true],
  ["useFolderIconsForExpansion", false],
  ["showBrowserIconsOnHover", true],
  ["recentsEnabled", true],
  ["recentsDisplayLimit", 5],
  ["webSearchSuggestionsEnabled", true],
  ["defaultSearchEngine", "google"],
  ["linkOpeningBehavior", "default"],
  ["autoTagLinksEnabled", false],
  ["pinnedItemNumberShortcutsEnabled", true],
  ["atcEnabled", false],
  ["analyticsEnabled", true],
  ["mcpBridgeEnabled", true],
]);

const settingTypes: Record<string, "bool" | "string" | "number"> = {
  isLeftSide: "bool", isDraggable: "bool", isResizable: "bool", isCompactMode: "bool",
  browserAutoVisibilityEnabled: "bool", smartAttachFillScreen: "bool", autoTileWindows: "string",
  sidebarHideBehavior: "string", keepSidebarVisibleWithAllApps: "bool", showSidebarOnFinder: "bool",
  browserWindowAdjustmentMode: "string", floatingButtonEnabled: "bool", preventBrowserOverlap: "bool",
  smartSideSwitch: "bool", opacityOnFocusChange: "bool", spaceColorTintEnabled: "bool",
  spaceColorTintOpacity: "number", spaceNavigationEnabled: "bool",
  spaceNavigationNumberShortcutsEnabled: "bool", saveTabsOnSpaceSwitch: "bool",
  tabRestoreBehavior: "string", spaceSwitchSuggestionBehavior: "string",
  closeTabsOnSpaceChange: "bool", autoLaunchBrowserOnProfileSpace: "bool",
  naturalSwipeDirection: "bool", showLiveTabs: "bool", backgroundTabSync: "bool",
  showItemCounts: "bool", useFolderIconsForExpansion: "bool", showBrowserIconsOnHover: "bool",
  recentsEnabled: "bool", recentsDisplayLimit: "number", webSearchSuggestionsEnabled: "bool",
  defaultSearchEngine: "string", linkOpeningBehavior: "string", autoTagLinksEnabled: "bool",
  pinnedItemNumberShortcutsEnabled: "bool", atcEnabled: "bool", analyticsEnabled: "bool",
  mcpBridgeEnabled: "bool",
};

const settingCategories: Record<string, string> = {
  isLeftSide: "sidebar", isDraggable: "sidebar", isResizable: "sidebar", isCompactMode: "sidebar",
  browserAutoVisibilityEnabled: "sidebar", smartAttachFillScreen: "sidebar", autoTileWindows: "sidebar",
  sidebarHideBehavior: "sidebar", keepSidebarVisibleWithAllApps: "sidebar", showSidebarOnFinder: "sidebar",
  browserWindowAdjustmentMode: "sidebar", floatingButtonEnabled: "sidebar", preventBrowserOverlap: "sidebar",
  smartSideSwitch: "sidebar", opacityOnFocusChange: "appearance", spaceColorTintEnabled: "appearance",
  spaceColorTintOpacity: "appearance", spaceNavigationEnabled: "spaces",
  spaceNavigationNumberShortcutsEnabled: "spaces", saveTabsOnSpaceSwitch: "spaces",
  tabRestoreBehavior: "spaces", spaceSwitchSuggestionBehavior: "spaces",
  closeTabsOnSpaceChange: "spaces", autoLaunchBrowserOnProfileSpace: "spaces",
  naturalSwipeDirection: "spaces", showLiveTabs: "liveTabs", backgroundTabSync: "liveTabs",
  showItemCounts: "display", useFolderIconsForExpansion: "display", showBrowserIconsOnHover: "display",
  recentsEnabled: "display", recentsDisplayLimit: "display", webSearchSuggestionsEnabled: "search",
  defaultSearchEngine: "search", linkOpeningBehavior: "links", autoTagLinksEnabled: "links",
  pinnedItemNumberShortcutsEnabled: "links", atcEnabled: "airTrafficControl",
  analyticsEnabled: "analytics", mcpBridgeEnabled: "mcpBridge",
};

const mockShortcuts: Shortcut[] = [
  { name: "toggleSidebar", title: "Toggle Sidebar", description: "Show or hide the main sidebar", category: "global", key: "space", modifiers: ["command", "shift"], displayString: "⇧⌘Space" },
  { name: "focusSidebar", title: "Focus Sidebar", description: "Bring sidebar into focus", category: "global", key: "f", modifiers: ["command", "control"], displayString: "⌃⌘F" },
  { name: "toggleCommandPanel", title: "Open Command Panel", description: "Quick access to search and commands", category: "global", key: "k", modifiers: ["command", "control"], displayString: "⌃⌘K" },
  { name: "toggleFollowActiveSpace", title: "Pin Sidebar", description: "Pin sidebar to follow you across all desktop spaces", category: "global", key: "p", modifiers: ["command", "control"], displayString: "⌃⌘P" },
  { name: "toggleSidebarSide", title: "Toggle Sidebar Side", description: "Switch sidebar between left and right sides", category: "global", key: "l", modifiers: ["command", "control"], displayString: "⌃⌘L" },
  { name: "toggleFillScreen", title: "Toggle Fill Screen", description: "Toggle browser fill screen mode", category: "global", key: "f", modifiers: ["command", "option"], displayString: "⌥⌘F" },
  { name: "saveCurrentPage", title: "Smart Save", description: "Save current page from browser or add files from Finder", category: "browser", key: "s", modifiers: ["command", "control"], displayString: "⌃⌘S" },
  { name: "copyCurrentURL", title: "Smart Copy", description: "Copy URL from browsers or file paths from Finder", category: "browser", key: "c", modifiers: ["command", "control"], displayString: "⌃⌘C" },
  { name: "addFinderFolder", title: "Add Current Folder", description: "Add current Finder folder to sidebar", category: "browser", key: "a", modifiers: ["command", "option"], displayString: "⌥⌘A" },
  { name: "saveAllBrowserTabs", title: "Save All Browser Tabs", description: "Save all open browser tabs to a new folder", category: "browser", key: "t", modifiers: ["command", "control"], displayString: "⌃⌘T" },
  { name: "openCurrentTabInOtherBrowser", title: "Open Tab in Other Browser", description: "Open the current browser tab in a different browser", category: "browser", key: "b", modifiers: ["command", "control"], displayString: "⌃⌘B" },
];

let mockSidebarVisible = false;

function fuzzyMatch(text: string, query: string): boolean {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  return lower.includes(q) || q.split(" ").every((word) => lower.includes(word));
}

export function createMockClient(): BridgeClient {
  return {
    async getSpaces() {
      return spaces;
    },

    async getLinks(spaceId: string, folderId?: string) {
      let results = links.filter((l) => l.spaceId === spaceId);
      if (folderId) results = results.filter((l) => l.folderId === folderId);
      return results;
    },

    async search(query: string, limit = 20) {
      return links
        .filter((l) => fuzzyMatch(l.name, query) || fuzzyMatch(l.url, query) || fuzzyMatch(l.notes, query) || l.tags.some((t) => fuzzyMatch(t, query)))
        .slice(0, limit);
    },

    async getFolders(spaceId: string) {
      return folders.filter((f) => f.spaceId === spaceId);
    },

    async getTags() {
      return tags;
    },

    async getLiveTabs(browser?: string) {
      if (browser) return browserTabs.filter((t) => t.browser.toLowerCase() === browser.toLowerCase());
      return browserTabs;
    },

    async getRecent(limit = 10) {
      return recentItems.slice(0, limit);
    },

    async toggleSidebar(): Promise<ToggleResult> {
      mockSidebarVisible = !mockSidebarVisible;
      return { ok: true, visible: mockSidebarVisible };
    },

    async getSettings(category?: string): Promise<Setting[]> {
      const settings: Setting[] = [];
      for (const [key, value] of mockSettingsState) {
        const cat = settingCategories[key] ?? "other";
        if (category && cat !== category) continue;
        settings.push({ key, value, type: settingTypes[key] ?? "string", category: cat });
      }
      return settings;
    },

    async updateSetting(key: string, value: boolean | string | number): Promise<ActionResult> {
      if (!mockSettingsState.has(key)) {
        return { ok: false, error: `Unknown setting: ${key}` };
      }
      mockSettingsState.set(key, value);
      return { ok: true, key, value };
    },

    async getShortcuts(): Promise<Shortcut[]> {
      return mockShortcuts;
    },

    async updateShortcut(name: string, key: string, modifiers: string[]): Promise<ActionResult> {
      const shortcut = mockShortcuts.find((s) => s.name === name);
      if (!shortcut) return { ok: false, error: `Unknown shortcut: ${name}` };
      shortcut.key = key;
      shortcut.modifiers = modifiers;
      const modSymbols = modifiers.map((m) => ({ command: "⌘", shift: "⇧", option: "⌥", control: "⌃" })[m] ?? m);
      shortcut.displayString = modSymbols.join("") + key.charAt(0).toUpperCase() + key.slice(1);
      return { ok: true, name, displayString: shortcut.displayString };
    },

    async clearShortcut(name: string): Promise<ActionResult> {
      const shortcut = mockShortcuts.find((s) => s.name === name);
      if (!shortcut) return { ok: false, error: `Unknown shortcut: ${name}` };
      shortcut.key = null;
      shortcut.modifiers = [];
      shortcut.displayString = "Not set";
      return { ok: true, name, displayString: "Not set" };
    },

    async switchSpace(spaceId: string): Promise<ActionResult> {
      const space = spaces.find((s) => s.id === spaceId);
      if (!space) return { ok: false, error: `Space not found: ${spaceId}` };
      return { ok: true, spaceId };
    },

    async openPreferences(tab?: string): Promise<ActionResult> {
      return { ok: true, tab: tab ?? "general" };
    },
  };
}
