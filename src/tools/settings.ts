import type { BridgeClient, Setting } from "../bridge/types.js";

// Human-readable descriptions, aliases, options, and relationships for each setting.
// The `aliases` field lets AIs map natural-language feature names to the right key.
// The `requires` field shows which settings depend on each other.
interface SettingMeta {
  description: string;
  aliases: string[];
  options?: string[];
  requires?: string[];
  note?: string;
}

const settingsMeta: Record<string, SettingMeta> = {
  // ── Sidebar ──
  isLeftSide: {
    description: "Sidebar on left (true) or right (false) side of screen",
    aliases: ["sidebar position", "sidebar side", "left side", "right side", "move sidebar"],
  },
  isDraggable: {
    description: "Allow dragging sidebar to reposition",
    aliases: ["drag sidebar", "draggable", "move sidebar position"],
  },
  isResizable: {
    description: "Allow resizing sidebar width by dragging the edge",
    aliases: ["resize sidebar", "sidebar width", "resizable"],
  },
  isCompactMode: {
    description: "Compact mode — narrower sidebar with smaller icons, ideal for small screens",
    aliases: ["compact mode", "compact", "narrow sidebar", "small sidebar", "mini mode"],
  },
  browserAutoVisibilityEnabled: {
    description: "Smart Attach — sidebar auto-shows when a browser is in focus and hides when you switch to other apps",
    aliases: ["smart attach", "auto show", "auto hide", "auto visibility", "browser attach", "show with browser"],
  },
  smartAttachFillScreen: {
    description: "When Smart Attach shows the sidebar, browser fills the remaining screen space",
    aliases: ["fill screen", "smart attach fill", "browser fill"],
    requires: ["browserAutoVisibilityEnabled"],
  },
  autoTileWindows: {
    description: "Auto-tile browser windows alongside sidebar. 'smart' tiles only the active profile's windows, 'all' tiles every browser window",
    aliases: ["auto tile", "tile windows", "tiling", "window tiling", "arrange windows"],
    options: ["off", "smart", "all"],
    requires: ["browserAutoVisibilityEnabled"],
  },
  sidebarHideBehavior: {
    description: "When sidebar hides: 'fill' expands browser to fill the freed space, 'restore' returns browser to its original size",
    aliases: ["hide behavior", "sidebar hide", "browser restore"],
    options: ["fill", "restore"],
  },
  keepSidebarVisibleWithAllApps: {
    description: "Keep sidebar visible even when non-browser apps are in focus (overrides Smart Attach's hide-on-switch behavior)",
    aliases: ["always visible", "show with all apps", "persistent sidebar", "keep visible"],
  },
  showSidebarOnFinder: {
    description: "Show sidebar when Finder is the active app",
    aliases: ["show on finder", "finder sidebar", "sidebar with finder"],
  },
  browserWindowAdjustmentMode: {
    description: "How sidebar adjusts browser windows: 'none' = no adjustment, 'minimal' = nudge to avoid overlap, 'fill' = resize to fill alongside sidebar",
    aliases: ["browser adjustment", "window adjustment", "browser resize"],
    options: ["none", "minimal", "fill"],
  },
  floatingButtonEnabled: {
    description: "Show a floating trigger button on the screen edge that toggles the sidebar when clicked",
    aliases: ["floating button", "trigger button", "edge button", "sidebar button"],
  },
  preventBrowserOverlap: {
    description: "Prevent browser windows from overlapping the sidebar area",
    aliases: ["prevent overlap", "no overlap", "browser overlap"],
  },
  smartSideSwitch: {
    description: "Automatically move sidebar to the other side when cursor approaches the opposite screen edge",
    aliases: ["smart side switch", "auto switch side", "follow cursor"],
  },

  // ── Appearance ──
  opacityOnFocusChange: {
    description: "Make sidebar semi-transparent when it loses focus, fully opaque when focused",
    aliases: ["opacity", "transparent", "fade", "dim when unfocused", "transparency"],
  },
  spaceColorTintEnabled: {
    description: "Tint the sidebar background with the active space's color for visual context",
    aliases: ["space color", "color tint", "tinted sidebar", "space tint"],
  },
  spaceColorTintOpacity: {
    description: "How strong the space color tint is (0.0 = invisible, 1.0 = fully colored)",
    aliases: ["tint opacity", "tint strength", "color intensity"],
    requires: ["spaceColorTintEnabled"],
  },

  // ── Spaces ──
  spaceNavigationEnabled: {
    description: "Enable keyboard shortcuts and gestures for navigating between spaces",
    aliases: ["space navigation", "space shortcuts", "navigate spaces"],
  },
  spaceNavigationNumberShortcutsEnabled: {
    description: "Cmd+Ctrl+1 through 9 to jump directly to a space by its position",
    aliases: ["space number shortcuts", "cmd ctrl numbers", "quick switch spaces"],
    requires: ["spaceNavigationEnabled"],
  },
  saveTabsOnSpaceSwitch: {
    description: "Automatically save all open browser tabs when switching to another space (so they can be restored later)",
    aliases: ["save tabs", "remember tabs", "tab memory", "save on switch"],
  },
  tabRestoreBehavior: {
    description: "When switching back to a space that has saved tabs: 'ask' = prompt user, 'always' = auto-restore, 'never' = don't restore",
    aliases: ["restore tabs", "tab restore", "reopen tabs"],
    options: ["ask", "always", "never"],
  },
  spaceSwitchSuggestionBehavior: {
    description: "When a browser profile that's linked to a space becomes active: 'ask' = suggest switching, 'always' = auto-switch, 'never' = ignore",
    aliases: ["space suggestion", "auto switch space", "profile space suggestion"],
    options: ["ask", "always", "never"],
  },
  closeTabsOnSpaceChange: {
    description: "Close all current browser tabs when switching to a different space (use with saveTabsOnSpaceSwitch for full isolation)",
    aliases: ["close tabs on switch", "clear tabs", "tab isolation"],
  },
  autoLaunchBrowserOnProfileSpace: {
    description: "When switching to a space linked to a browser profile, automatically launch that browser if not running",
    aliases: ["auto launch browser", "launch on switch", "start browser"],
  },
  naturalSwipeDirection: {
    description: "Swipe direction for space navigation: true = natural/reversed (like trackpad scrolling), false = traditional",
    aliases: ["swipe direction", "natural swipe", "trackpad direction"],
  },

  // ── Live Tabs ──
  showLiveTabs: {
    description: "Show a real-time list of currently open browser tabs in the sidebar",
    aliases: ["live tabs", "show tabs", "open tabs", "browser tabs", "tab list"],
  },
  backgroundTabSync: {
    description: "Keep syncing browser tabs in the background even when sidebar is hidden (uses more resources but tabs are instantly ready)",
    aliases: ["background sync", "tab sync", "always sync tabs"],
    requires: ["showLiveTabs"],
  },

  // ── Display ──
  showItemCounts: {
    description: "Show the number of links inside each folder next to its name",
    aliases: ["item counts", "link counts", "folder counts", "show counts"],
  },
  useFolderIconsForExpansion: {
    description: "Click folder icons to expand/collapse instead of dedicated chevron arrows",
    aliases: ["folder icons", "expand icons", "folder click"],
  },
  showBrowserIconsOnHover: {
    description: "When hovering over a link, show icons to open it in different browsers",
    aliases: ["browser icons", "hover icons", "open in browser", "browser picker"],
  },
  recentsEnabled: {
    description: "Show a 'Recently Opened' section at the top of the sidebar",
    aliases: ["recents", "recent links", "recently opened", "show recents"],
  },
  recentsDisplayLimit: {
    description: "Maximum number of recent links shown (e.g. 5, 10, 20)",
    aliases: ["recents limit", "max recents", "recent count"],
    requires: ["recentsEnabled"],
  },

  // ── Search & Command Panel ──
  webSearchSuggestionsEnabled: {
    description: "Show web search suggestions from your search engine as you type in the command panel",
    aliases: ["search suggestions", "web suggestions", "autocomplete", "command panel suggestions"],
  },
  defaultSearchEngine: {
    description: "Search engine used for web searches from the command panel (e.g. google, duckduckgo, bing)",
    aliases: ["search engine", "default search", "web search engine"],
  },

  // ── Links ──
  linkOpeningBehavior: {
    description: "How links open when clicked — in the default browser, the browser they were saved from, etc.",
    aliases: ["link behavior", "open links", "click behavior", "link opening"],
  },
  autoTagLinksEnabled: {
    description: "Use on-device AI to automatically suggest tags when saving new links",
    aliases: ["ai tags", "auto tag", "smart tags", "ai tagging", "auto suggest tags"],
  },
  pinnedItemNumberShortcutsEnabled: {
    description: "Cmd+Option+1 through 9 to open pinned items by their position",
    aliases: ["pinned shortcuts", "pin number shortcuts", "quick open pins"],
  },

  // ── Air Traffic Control ──
  atcEnabled: {
    description: "Air Traffic Control — automatically route newly saved links to the right space based on URL pattern rules you define",
    aliases: ["air traffic control", "atc", "auto route", "url routing", "auto organize", "smart routing"],
  },

  // ── Analytics ──
  analyticsEnabled: {
    description: "Send anonymous usage analytics to help improve SupaSidebar",
    aliases: ["analytics", "usage data", "telemetry", "tracking"],
  },

  // ── MCP Bridge ──
  mcpBridgeEnabled: {
    description: "Enable the MCP bridge server for AI assistant integration (this is the connection you're using right now)",
    aliases: ["mcp bridge", "ai bridge", "mcp server", "ai integration"],
    note: "Disabling this will disconnect AI assistants from SupaSidebar",
  },
};

// ── Features: multi-setting presets that map a single user intent to multiple settings ──

interface FeaturePreset {
  name: string;
  description: string;
  aliases: string[];
  settings: Record<string, boolean | string | number>;
}

const featurePresets: FeaturePreset[] = [
  {
    name: "Smart Attach",
    description: "Sidebar auto-appears with browsers and fills the screen alongside them",
    aliases: ["smart attach", "auto show", "browser attach", "auto visibility"],
    settings: {
      browserAutoVisibilityEnabled: true,
      smartAttachFillScreen: true,
      autoTileWindows: "smart",
    },
  },
  {
    name: "Independent Mode",
    description: "Sidebar stays visible regardless of which app is active, no auto-show/hide",
    aliases: ["independent mode", "always visible", "standalone", "persistent"],
    settings: {
      browserAutoVisibilityEnabled: false,
      keepSidebarVisibleWithAllApps: true,
    },
  },
  {
    name: "Space Isolation",
    description: "Full tab isolation between spaces — saves tabs on switch, closes old ones, restores on return",
    aliases: ["space isolation", "tab isolation", "isolated spaces", "separate tabs per space"],
    settings: {
      saveTabsOnSpaceSwitch: true,
      closeTabsOnSpaceChange: true,
      tabRestoreBehavior: "always",
    },
  },
  {
    name: "Minimal Sidebar",
    description: "Compact mode with no counts, no recents, no hover icons — just links",
    aliases: ["minimal", "clean sidebar", "simple sidebar", "distraction free"],
    settings: {
      isCompactMode: true,
      showItemCounts: false,
      recentsEnabled: false,
      showBrowserIconsOnHover: false,
    },
  },
  {
    name: "Full Featured",
    description: "Everything visible — recents, live tabs, item counts, browser icons, AI tags",
    aliases: ["full featured", "everything on", "all features", "maximize"],
    settings: {
      showLiveTabs: true,
      recentsEnabled: true,
      showItemCounts: true,
      showBrowserIconsOnHover: true,
      autoTagLinksEnabled: true,
      isCompactMode: false,
    },
  },
];

// ── Tool handlers ──

export async function handleGetSettings(client: BridgeClient, category?: string): Promise<string> {
  const settings = await client.getSettings(category);

  if (settings.length === 0) {
    return category
      ? `No settings found in category "${category}". Valid categories: sidebar, appearance, spaces, liveTabs, display, search, links, airTrafficControl, analytics, mcpBridge`
      : "No settings found.";
  }

  // Group by category
  const grouped = new Map<string, Setting[]>();
  for (const s of settings) {
    const group = grouped.get(s.category) ?? [];
    group.push(s);
    grouped.set(s.category, group);
  }

  const categoryLabels: Record<string, string> = {
    sidebar: "Sidebar",
    appearance: "Appearance",
    spaces: "Spaces",
    liveTabs: "Live Tabs",
    display: "Display",
    search: "Search & Command Panel",
    links: "Links",
    airTrafficControl: "Air Traffic Control",
    analytics: "Analytics",
    mcpBridge: "MCP Bridge",
  };

  const sections: string[] = [];
  for (const [cat, items] of grouped) {
    const label = categoryLabels[cat] ?? cat;
    const lines = items.map((s) => {
      const meta = settingsMeta[s.key];
      const desc = meta?.description ?? "";
      const opts = meta?.options ? `  [${meta.options.join(" | ")}]` : "";
      const aliases = meta?.aliases.length ? `  aka: ${meta.aliases.slice(0, 3).join(", ")}` : "";
      const deps = meta?.requires?.length ? `  (requires: ${meta.requires.join(", ")})` : "";
      return `  ${s.key}: ${JSON.stringify(s.value)}${opts}\n    ${desc}${aliases}${deps}`;
    });
    sections.push(`${label}:\n${lines.join("\n")}`);
  }

  // Add feature presets section
  const presetLines = featurePresets.map((p) => {
    const keys = Object.entries(p.settings).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(", ");
    return `  ${p.name}: ${p.description}\n    Sets: ${keys}`;
  });

  return [
    `SupaSidebar Settings (${settings.length} total):`,
    "",
    sections.join("\n\n"),
    "",
    "Feature Presets (use enable_feature to apply):",
    presetLines.join("\n"),
    "",
    "To change a setting: use update_setting with key and value.",
    "To apply a preset: use enable_feature with the preset name.",
  ].join("\n");
}

export async function handleUpdateSetting(
  client: BridgeClient,
  key: string,
  value: boolean | string | number
): Promise<string> {
  const result = await client.updateSetting(key, value);
  if (!result.ok) {
    throw new Error(result.error ?? `Failed to update setting "${key}"`);
  }
  const meta = settingsMeta[key];
  const desc = meta ? `\n${meta.description}` : "";
  const opts = meta?.options ? `\nValid options: ${meta.options.join(", ")}` : "";
  const deps = meta?.requires?.length ? `\nNote: this setting depends on: ${meta.requires.join(", ")}` : "";
  return `Updated "${key}" to ${JSON.stringify(value)}.${desc}${opts}${deps}`;
}

export async function handleEnableFeature(
  client: BridgeClient,
  featureName: string
): Promise<string> {
  const nameLower = featureName.toLowerCase();

  // Match by name or alias
  const preset = featurePresets.find(
    (p) => p.name.toLowerCase() === nameLower || p.aliases.some((a) => a === nameLower)
  );

  if (!preset) {
    const available = featurePresets.map((p) => `  ${p.name} — ${p.description} (aliases: ${p.aliases.join(", ")})`);
    return `Unknown feature "${featureName}". Available presets:\n${available.join("\n")}`;
  }

  const results: string[] = [];
  for (const [key, value] of Object.entries(preset.settings)) {
    const r = await client.updateSetting(key, value);
    if (r.ok) {
      results.push(`  ${key} → ${JSON.stringify(value)}`);
    } else {
      results.push(`  ${key} → FAILED: ${r.error}`);
    }
  }

  return `Enabled "${preset.name}": ${preset.description}\n\nSettings applied:\n${results.join("\n")}`;
}

export function resolveSettingKey(userInput: string): string | null {
  const inputLower = userInput.toLowerCase();

  // Direct key match
  if (settingsMeta[userInput]) return userInput;

  // Alias match
  for (const [key, meta] of Object.entries(settingsMeta)) {
    if (meta.aliases.some((a) => a === inputLower || inputLower.includes(a))) {
      return key;
    }
  }

  return null;
}
