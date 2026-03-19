import type { BridgeClient, Folder } from "../bridge/types.js";

function renderTree(folders: Folder[], indent = 0): string {
  const lines: string[] = [];
  for (const folder of folders) {
    const prefix = indent > 0 ? "  ".repeat(indent) + "└─ " : "";
    lines.push(`${prefix}${folder.name}  [${folder.linkCount} links]  (id: ${folder.id})`);
    if (folder.children.length > 0) {
      lines.push(renderTree(folder.children, indent + 1));
    }
  }
  return lines.join("\n");
}

export async function handleListFolders(client: BridgeClient, spaceId: string): Promise<string> {
  const folders = await client.getFolders(spaceId);

  if (folders.length === 0) {
    return "No folders in this space.";
  }

  const tree = renderTree(folders);
  return `Found ${folders.length} folder${folders.length === 1 ? "" : "s"}:\n\n${tree}`;
}
