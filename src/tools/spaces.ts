import type { BridgeClient } from "../bridge/types.js";

export async function handleListSpaces(client: BridgeClient): Promise<string> {
  const spaces = await client.getSpaces();

  if (spaces.length === 0) {
    return "No spaces found. Create a space in SupaSidebar to get started.";
  }

  const lines = spaces.map(
    (s) => `${s.icon} ${s.name}  [${s.linkCount} links, ${s.folderCount} folders]  (id: ${s.id})`
  );

  return `Found ${spaces.length} space${spaces.length === 1 ? "" : "s"}:\n\n${lines.join("\n")}`;
}
