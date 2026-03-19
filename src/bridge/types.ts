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

export interface BridgeClient {
  getSpaces(): Promise<Space[]>;
  getLinks(spaceId: string, folderId?: string): Promise<Link[]>;
  search(query: string, limit?: number): Promise<Link[]>;
  getFolders(spaceId: string): Promise<Folder[]>;
  getTags(): Promise<Tag[]>;
  getLiveTabs(browser?: string): Promise<BrowserTab[]>;
  getRecent(limit?: number): Promise<RecentItem[]>;
}
