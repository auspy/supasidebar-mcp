// SupaSidebar MCP — API contract types
// These mirror the Core Data entities in the SupaSidebar Swift app.
// The Swift-side local HTTP server must return data matching these interfaces.

export interface Space {
  id: string;
  name: string;
  color: string;
  icon: string;
  linkCount: number;
  folderCount: number;
  order: number;
}

export interface Link {
  id: string;
  name: string;
  url: string;
  type: "web" | "app" | "file";
  tags: string[];
  notes: string;
  folderId: string | null;
  spaceId: string;
  isPinned: boolean;
  createdAt: string;
  lastOpenedAt: string | null;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  spaceId: string;
  linkCount: number;
  children: Folder[];
  order: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  usageCount: number;
}

export interface BrowserTab {
  title: string;
  url: string;
  browser: string;
  isActive: boolean;
  windowId: number;
}

export interface RecentItem {
  linkId: string;
  name: string;
  url: string;
  openedAt: string;
  spaceId: string;
  spaceName: string;
}

export interface ToggleResult {
  ok: boolean;
  visible: boolean;
  error?: string;
}

export interface Setting {
  key: string;
  value: boolean | string | number;
  type: "bool" | "string" | "number";
  category: string;
}

export interface Shortcut {
  name: string;
  title: string;
  description: string;
  category: string;
  key: string | null;
  modifiers: string[];
  displayString: string;
}

export interface ActionResult {
  ok: boolean;
  error?: string;
  [key: string]: unknown;
}

export interface SearchShortcut {
  type: "engine" | "shortcut";
  name: string;
  keyword: string;
  searchURL: string;
  id?: string;
}

export interface BridgeClient {
  getSpaces(): Promise<Space[]>;
  getLinks(spaceId: string, folderId?: string): Promise<Link[]>;
  search(query: string, limit?: number): Promise<Link[]>;
  getFolders(spaceId: string): Promise<Folder[]>;
  getTags(): Promise<Tag[]>;
  getLiveTabs(browser?: string): Promise<BrowserTab[]>;
  getRecent(limit?: number): Promise<RecentItem[]>;
  toggleSidebar(): Promise<ToggleResult>;
  // Phase 2: Settings & configuration
  getSettings(category?: string): Promise<Setting[]>;
  updateSetting(key: string, value: boolean | string | number): Promise<ActionResult>;
  getShortcuts(): Promise<Shortcut[]>;
  updateShortcut(name: string, key: string, modifiers: string[]): Promise<ActionResult>;
  clearShortcut(name: string): Promise<ActionResult>;
  switchSpace(spaceId: string): Promise<ActionResult>;
  openPreferences(tab?: string): Promise<ActionResult>;
  toggleCommandPanel(): Promise<ToggleResult>;
  getVisibility(): Promise<{ sidebar: boolean; commandPanel: boolean }>;
  openLink(url: string, browser?: string): Promise<ActionResult>;
  webSearch(query: string, engine?: string, browser?: string): Promise<ActionResult>;
  listSearchShortcuts(): Promise<SearchShortcut[]>;
  addSearchShortcut(keyword: string, name: string, searchURL: string): Promise<ActionResult>;
  removeSearchShortcut(keywordOrId: string): Promise<ActionResult>;
}
