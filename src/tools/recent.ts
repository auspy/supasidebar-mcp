import type { BridgeClient } from "../bridge/types.js";

export interface ListRecentArgs {
  limit?: number;
  offset?: number;
  since?: string;
  until?: string;
  day?: string;
}

export async function handleListRecent(client: BridgeClient, args: ListRecentArgs = {}): Promise<string> {
  const { limit, offset, since, until } = resolveDateRange(args);

  const items = await client.getRecent({ limit, offset, since, until });

  const filterDescription = describeFilter({ limit, offset, since, until });

  if (items.length === 0) {
    return `No recently opened links${filterDescription ? ` (${filterDescription})` : ""}.`;
  }

  const lines = items.map((item) => {
    const date = new Date(item.openedAt);
    const relative = formatRelativeTime(date);
    const exact = date.toISOString().slice(0, 16).replace("T", " ");
    return `${item.name}  (${item.spaceName})\n  ${item.url}\n  opened ${relative}  [${exact}Z]`;
  });

  const header = `${items.length} recently opened link${items.length === 1 ? "" : "s"}${filterDescription ? ` (${filterDescription})` : ""}:`;

  const tip = items.length === (limit ?? 50)
    ? `\n\nResults capped at ${limit ?? 50}. To see more: increase \`limit\`, page with \`offset\`, or narrow with \`since\`/\`until\` (or \`day\`).`
    : "";

  return `${header}\n\n${lines.join("\n\n")}${tip}`;
}

function resolveDateRange(args: ListRecentArgs): {
  limit?: number;
  offset?: number;
  since?: string;
  until?: string;
} {
  let { since, until, day, limit, offset } = args;

  if (day) {
    const dayStart = parseDayToken(day);
    if (dayStart) {
      const next = new Date(dayStart.getTime() + 86_400_000);
      since = since ?? dayStart.toISOString();
      until = until ?? next.toISOString();
    }
  } else {
    if (since) {
      const d = parseDayToken(since) ?? new Date(since);
      if (!Number.isNaN(d.getTime())) since = d.toISOString();
    }
    if (until) {
      const d = parseDayToken(until);
      if (d) {
        // Bare date → end of that day (start of next)
        until = new Date(d.getTime() + 86_400_000).toISOString();
      } else {
        const parsed = new Date(until);
        if (!Number.isNaN(parsed.getTime())) until = parsed.toISOString();
      }
    }
  }

  return { limit, offset, since, until };
}

// Accepts: "today", "yesterday", or YYYY-MM-DD. Returns local-midnight Date.
function parseDayToken(input: string): Date | null {
  const trimmed = input.trim().toLowerCase();
  const now = new Date();
  if (trimmed === "today") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (trimmed === "yesterday") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function describeFilter(opts: { limit?: number; offset?: number; since?: string; until?: string }): string {
  const parts: string[] = [];
  if (opts.since) parts.push(`since ${opts.since}`);
  if (opts.until) parts.push(`until ${opts.until}`);
  if (opts.offset) parts.push(`offset ${opts.offset}`);
  if (opts.limit) parts.push(`limit ${opts.limit}`);
  return parts.join(", ");
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
