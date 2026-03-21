import type { BridgeClient } from "../bridge/types.js";

export async function handleGetShortcuts(client: BridgeClient): Promise<string> {
  const shortcuts = await client.getShortcuts();

  if (shortcuts.length === 0) {
    return "No keyboard shortcuts configured.";
  }

  // Group by category
  const grouped = new Map<string, typeof shortcuts>();
  for (const s of shortcuts) {
    const group = grouped.get(s.category) ?? [];
    group.push(s);
    grouped.set(s.category, group);
  }

  const categoryLabels: Record<string, string> = {
    global: "Global Shortcuts",
    browser: "Browser & Finder Shortcuts",
    pinnedItems: "Pinned Item Shortcuts",
  };

  const sections: string[] = [];
  for (const [cat, items] of grouped) {
    const label = categoryLabels[cat] ?? cat;
    const lines = items.map((s) => {
      const binding = s.displayString.padEnd(14);
      return `  ${binding} ${s.title}\n${"".padEnd(16)}${s.description}  (name: ${s.name})`;
    });
    sections.push(`${label}:\n${lines.join("\n")}`);
  }

  const validKeys = "a-z, 0-9, space, return, tab, escape, delete, left, right, up, down, f1-f12";
  const validMods = "command, shift, option, control";

  return [
    `Keyboard Shortcuts (${shortcuts.length} configurable):`,
    "",
    sections.join("\n\n"),
    "",
    `To update a shortcut: use update_shortcut with name, key, and modifiers.`,
    `  Valid keys: ${validKeys}`,
    `  Valid modifiers: ${validMods}`,
    `To remove a shortcut: use clear_shortcut with the name.`,
  ].join("\n");
}

export async function handleUpdateShortcut(
  client: BridgeClient,
  name: string,
  key: string,
  modifiers: string[]
): Promise<string> {
  const result = await client.updateShortcut(name, key, modifiers);
  if (!result.ok) {
    throw new Error(result.error ?? `Failed to update shortcut "${name}"`);
  }
  return `Updated shortcut "${name}" to ${result.displayString}.`;
}

export async function handleClearShortcut(
  client: BridgeClient,
  name: string
): Promise<string> {
  const result = await client.clearShortcut(name);
  if (!result.ok) {
    throw new Error(result.error ?? `Failed to clear shortcut "${name}"`);
  }
  return `Cleared shortcut "${name}". It no longer has a key binding.`;
}
