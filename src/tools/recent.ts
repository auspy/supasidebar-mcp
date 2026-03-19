import type { BridgeClient } from "../bridge/types.js";

export async function handleListRecent(client: BridgeClient, limit?: number): Promise<string> {
  const items = await client.getRecent(limit);

  if (items.length === 0) {
    return "No recently opened links.";
  }

  const lines = items.map((item) => {
    const date = new Date(item.openedAt);
    const relative = formatRelativeTime(date);
    return `${item.name}  (${item.spaceName})\n  ${item.url}\n  opened ${relative}`;
  });

  return `${items.length} recently opened link${items.length === 1 ? "" : "s"}:\n\n${lines.join("\n\n")}`;
}

function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
