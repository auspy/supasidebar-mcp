import type { BridgeClient, Link } from "../bridge/types.js";

function formatLink(link: Link): string {
  const parts = [`${link.isPinned ? "[pinned] " : ""}${link.name}`];
  parts.push(`  ${link.url}`);
  if (link.tags.length > 0) parts.push(`  tags: ${link.tags.join(", ")}`);
  if (link.notes) parts.push(`  notes: ${link.notes}`);
  return parts.join("\n");
}

export async function handleListLinks(
  client: BridgeClient,
  spaceId: string,
  folderId?: string
): Promise<string> {
  const links = await client.getLinks(spaceId, folderId);

  if (links.length === 0) {
    const where = folderId ? "this folder" : "this space";
    return `No links in ${where}.`;
  }

  const formatted = links.map(formatLink);
  return `Found ${links.length} link${links.length === 1 ? "" : "s"}:\n\n${formatted.join("\n\n")}`;
}

export async function handleSearch(
  client: BridgeClient,
  query: string,
  limit?: number
): Promise<string> {
  const results = await client.search(query, limit);

  if (results.length === 0) {
    return `No links found matching "${query}".`;
  }

  const formatted = results.map(
    (link, i) => `${i + 1}. ${formatLink(link)}\n   space: ${link.spaceId}`
  );

  return `Found ${results.length} result${results.length === 1 ? "" : "s"} for "${query}":\n\n${formatted.join("\n\n")}`;
}
