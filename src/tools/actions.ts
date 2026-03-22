import type { BridgeClient } from "../bridge/types.js";
import { exec } from "node:child_process";

export async function handleToggleSidebar(client: BridgeClient): Promise<string> {
  const result = await client.toggleSidebar();
  if (!result.ok) {
    throw new Error(result.error ?? "Failed to toggle sidebar");
  }
  return result.visible ? "Sidebar is now visible." : "Sidebar is now hidden.";
}

export async function handleLaunchSidebar(): Promise<string> {
  return new Promise((resolve, reject) => {
    exec("open -a SupaSidebar", (error) => {
      if (error) {
        reject(new Error(`Failed to launch SupaSidebar: ${error.message}`));
      } else {
        resolve("SupaSidebar launched.");
      }
    });
  });
}

export async function handleGetVisibility(client: BridgeClient): Promise<string> {
  const state = await client.getVisibility();
  const lines = [
    `Sidebar: ${state.sidebar ? "visible" : "hidden"}`,
    `Command Panel: ${state.commandPanel ? "visible" : "hidden"}`,
  ];
  return lines.join("\n");
}

export async function handleToggleCommandPanel(client: BridgeClient): Promise<string> {
  const result = await client.toggleCommandPanel();
  if (!result.ok) {
    throw new Error(result.error ?? "Failed to toggle command panel");
  }
  return result.visible ? "Command panel is now visible." : "Command panel is now hidden.";
}

export async function handleSwitchSpace(client: BridgeClient, spaceId: string): Promise<string> {
  const result = await client.switchSpace(spaceId);
  if (!result.ok) {
    throw new Error(result.error ?? `Failed to switch to space "${spaceId}"`);
  }
  return `Switched to space ${spaceId}. Use list_spaces to see all available spaces.`;
}

const VALID_TABS = [
  "general", "sidebar", "mouseTriggers", "shortcuts", "spaces", "liveTabs",
  "voice", "aiTags", "importExport", "commandPanel", "airTrafficControl",
  "refer", "about"
];

export async function handleOpenPreferences(client: BridgeClient, tab?: string): Promise<string> {
  const result = await client.openPreferences(tab);
  if (!result.ok) {
    throw new Error(result.error ?? "Failed to open preferences");
  }
  return `Opened SupaSidebar Preferences${tab ? ` → ${tab}` : ""}.\nValid tabs: ${VALID_TABS.join(", ")}`;
}
