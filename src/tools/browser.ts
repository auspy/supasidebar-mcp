import type { BridgeClient } from "../bridge/types.js";

const BROWSERS = [
  "Safari", "Chrome", "Firefox", "Edge", "Arc", "Brave",
  "Vivaldi", "Dia", "Comet", "Orion", "Zen", "Atlas", "Wavebox", "Helium",
];

export async function handleOpenLink(client: BridgeClient, url: string, browser?: string): Promise<string> {
  const result = await client.openLink(url, browser);
  if (!result.ok) {
    throw new Error(result.error ?? `Failed to open ${url}`);
  }
  const where = result.browser === "default" ? "default browser" : result.browser;
  return `Opened ${url} in ${where}.`;
}

export async function handleWebSearch(
  client: BridgeClient,
  query: string,
  engine?: string,
  browser?: string
): Promise<string> {
  const result = await client.webSearch(query, engine, browser);
  if (!result.ok) {
    throw new Error(result.error ?? `Failed to search for "${query}"`);
  }
  const where = result.browser === "default" ? "default browser" : result.browser;
  return `Searched "${query}" on ${result.engine} in ${where}.\nURL: ${result.url}`;
}

export async function handleListSearchShortcuts(client: BridgeClient): Promise<string> {
  const items = await client.listSearchShortcuts();

  const engines = items.filter((i) => i.type === "engine");
  const shortcuts = items.filter((i) => i.type === "shortcut");

  const engineLines = engines.map((e) => `  ${e.keyword.padEnd(14)} ${e.name}`);
  const shortcutLines = shortcuts.map((s) => `  ${s.keyword.padEnd(14)} ${s.name}\n${"".padEnd(16)}${s.searchURL}`);

  const parts = [
    `Built-in Search Engines (${engines.length}):`,
    engineLines.join("\n"),
    "",
    `Custom Website Shortcuts (${shortcuts.length}):`,
    shortcuts.length > 0 ? shortcutLines.join("\n") : "  (none — use add_search_shortcut to create one)",
    "",
    `Use with web_search: engine="youtube" or engine="yo"`,
    `Available browsers: ${BROWSERS.join(", ")}`,
  ];

  return parts.join("\n");
}

export async function handleAddSearchShortcut(
  client: BridgeClient,
  keyword: string,
  name: string,
  searchURL: string
): Promise<string> {
  const result = await client.addSearchShortcut(keyword, name, searchURL);
  if (!result.ok) {
    throw new Error(result.error ?? `Failed to add shortcut "${keyword}"`);
  }
  return `Added search shortcut "${keyword}" → ${name}\nSearch URL: ${searchURL}\n\nNow use: web_search query="..." engine="${keyword}"`;
}

export async function handleRemoveSearchShortcut(
  client: BridgeClient,
  keywordOrId: string
): Promise<string> {
  const result = await client.removeSearchShortcut(keywordOrId);
  if (!result.ok) {
    throw new Error(result.error ?? `Failed to remove shortcut "${keywordOrId}"`);
  }
  return `Removed search shortcut "${keywordOrId}".`;
}
