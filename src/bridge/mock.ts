// SupaSidebar MCP — Mock data layer
// Used for testing the MCP server without the SupaSidebar app running.
// Activate with: --mock flag or SUPASIDEBAR_MCP_MOCK=1 env var.

import type { BridgeClient, Space, Link, Folder, Tag, BrowserTab, RecentItem } from "./types.js";

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
  };
}
