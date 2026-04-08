import type { BridgeClient } from "../bridge/types.js";

export async function handleCreateSpace(
  client: BridgeClient,
  name: string,
  color?: string,
  icon?: string
): Promise<string> {
  const result = await client.createSpace(name, color, icon);
  if (!result.ok) throw new Error(result.error ?? "Failed to create space");
  return `Space created: "${result.name as string}" (id: ${result.id as string})`;
}

export async function handleCreateFolder(
  client: BridgeClient,
  name: string,
  spaceId: string,
  parentFolderId?: string
): Promise<string> {
  const result = await client.createFolder(name, spaceId, parentFolderId);
  if (!result.ok) throw new Error(result.error ?? "Failed to create folder");
  return `Folder created: "${result.name as string}" in space ${result.spaceId as string} (id: ${result.id as string})`;
}

export async function handleAddLink(
  client: BridgeClient,
  url: string,
  spaceId: string,
  name?: string,
  folderId?: string,
  notes?: string
): Promise<string> {
  const result = await client.addLink(url, spaceId, name, folderId, notes);
  if (!result.ok) throw new Error(result.error ?? "Failed to add link");
  const parts = [
    `Link added: "${result.name as string}"`,
    `  url: ${result.url as string}`,
    `  id: ${result.id as string}`,
  ];
  if (folderId) parts.push(`  folder: ${folderId}`);
  return parts.join("\n");
}

export async function handleMoveLink(
  client: BridgeClient,
  linkId: string,
  targetSpaceId?: string,
  targetFolderId?: string | null
): Promise<string> {
  const result = await client.moveLink(linkId, targetSpaceId, targetFolderId);
  if (!result.ok) throw new Error(result.error ?? "Failed to move link");
  const parts = [`Link moved (id: ${linkId})`];
  if (result.newSpaceId) parts.push(`  space: ${result.newSpaceId as string}`);
  const folderVal = result.newFolderId;
  parts.push(`  folder: ${folderVal ? (folderVal as string) : "unfiled"}`);
  return parts.join("\n");
}
