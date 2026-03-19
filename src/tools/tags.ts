import type { BridgeClient } from "../bridge/types.js";

export async function handleListTags(client: BridgeClient): Promise<string> {
  const tags = await client.getTags();

  if (tags.length === 0) {
    return "No tags found. Add tags to your links in SupaSidebar.";
  }

  const lines = tags
    .sort((a, b) => b.usageCount - a.usageCount)
    .map((t) => `${t.name}  (${t.usageCount} link${t.usageCount === 1 ? "" : "s"})`);

  return `Found ${tags.length} tag${tags.length === 1 ? "" : "s"}:\n\n${lines.join("\n")}`;
}
