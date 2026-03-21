// SupaSidebar MCP — AI-facing guide
// This returns a structured overview of what the MCP can do,
// so any AI knows exactly which tool to call for any user request.

export function handleGetGuide(): string {
  return `SupaSidebar MCP — Capability Guide

SupaSidebar is a macOS sidebar launcher for quick access to links, apps, files, and browser tabs.
It organizes everything into Spaces (workspaces) with Folders and Tags.

═══════════════════════════════════════════
 WHAT YOU CAN DO — Tool Reference
═══════════════════════════════════════════

📂 DATA (read-only)
  list_spaces         → See all spaces (workspaces) with link/folder counts
  list_links          → See links in a space or folder
  list_folders        → See folder hierarchy in a space
  list_tags           → See all tags sorted by usage
  search              → Fuzzy search links by name, URL, notes, or tags
  get_live_tabs       → See currently open browser tabs (filter by browser)
  list_recent         → See recently opened links

⚙️ SETTINGS (read + write)
  get_settings        → See all 40+ settings with values, descriptions, and aliases
  update_setting      → Change any individual setting by key
  enable_feature      → Apply a named preset that sets multiple settings at once

  Feature presets:
    "Smart Attach"     → Sidebar auto-appears with browser, fills screen alongside it
    "Independent Mode" → Sidebar always visible, ignores app switching
    "Space Isolation"  → Full tab isolation between spaces (save/close/restore)
    "Minimal Sidebar"  → Compact mode, no counts, no recents, no hover icons
    "Full Featured"    → Everything on (live tabs, recents, counts, AI tags, etc.)

⌨️ SHORTCUTS (read + write)
  get_shortcuts       → See all keyboard shortcuts with current bindings
  update_shortcut     → Change a shortcut (key + modifiers)
  clear_shortcut      → Remove a shortcut binding

🎯 ACTIONS
  toggle_sidebar      → Show/hide the sidebar
  launch_sidebar      → Start SupaSidebar if not running
  switch_space        → Navigate to a different space
  open_preferences    → Open Preferences window (optionally to a specific tab)

═══════════════════════════════════════════
 COMMON USER REQUESTS → WHAT TO DO
═══════════════════════════════════════════

"Turn on compact mode"
  → update_setting key="isCompactMode" value=true

"Make sidebar appear automatically with my browser"
  → enable_feature feature="Smart Attach"

"Change the toggle shortcut to Cmd+Shift+S"
  → update_shortcut name="toggleSidebar" key="s" modifiers=["command","shift"]

"Show me what's in my Work space"
  → list_spaces (to get the ID) → list_links spaceId="..."

"Switch to my Research space"
  → list_spaces (to get the ID) → switch_space spaceId="..."

"What browser tabs do I have open?"
  → get_live_tabs

"Find my GitHub links"
  → search query="github"

"I want separate tabs for each space"
  → enable_feature feature="Space Isolation"

"Make the sidebar less cluttered"
  → enable_feature feature="Minimal Sidebar"

"Open the shortcuts settings"
  → open_preferences tab="shortcuts"

"What features does SupaSidebar have?"
  → get_settings (returns all features grouped by category)

"Disable analytics"
  → update_setting key="analyticsEnabled" value=false

═══════════════════════════════════════════
 SETTING CATEGORIES
═══════════════════════════════════════════

  sidebar          — Position, Smart Attach, tiling, floating button, overlap
  appearance       — Opacity, space color tint
  spaces           — Navigation, tab save/restore, profile switching
  liveTabs         — Live tab display, background sync
  display          — Item counts, folder icons, recents, browser icons
  search           — Command panel suggestions, search engine
  links            — Opening behavior, AI tags, pinned item shortcuts
  airTrafficControl — Auto-route links to spaces by URL patterns
  analytics        — Usage tracking
  mcpBridge        — AI assistant connection (this)

Use get_settings with a category to focus: get_settings category="sidebar"

═══════════════════════════════════════════
 TIPS
═══════════════════════════════════════════

• Settings that depend on other settings have a "requires" note.
  Example: autoTileWindows requires browserAutoVisibilityEnabled.
  Use enable_feature to set related settings together.

• Each setting has aliases (natural-language names) visible in get_settings.
  "Smart Attach", "auto show", "browser attach" all map to browserAutoVisibilityEnabled.

• Shortcuts need at least one modifier (command, shift, option, control).
  Use get_shortcuts to see the "name" field needed for update_shortcut.

• Space IDs are UUIDs. Always call list_spaces first to get them.`;
}
