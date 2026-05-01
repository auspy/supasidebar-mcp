import type { BridgeClient, ATCRuleInput } from "../bridge/types.js";

export async function handleListATCRules(client: BridgeClient): Promise<string> {
  const rules = await client.listATCRules();
  if (rules.length === 0) {
    return "No ATC rules configured.\nUse add_atc_rule to create your first routing rule.";
  }
  const lines = rules.map((r, i) => {
    const status = r.isEnabled ? "enabled" : "disabled";
    const pattern = r.urlPattern ? `"${r.urlPattern}" (${r.matchType})` : "(match all)";
    let routing = "";
    if (r.routeType === "save") {
      routing = r.targetSpaceID ? `-> save to space ${r.targetSpaceID}` : "-> save (no target space)";
      if (r.sourceBrowserName) routing += ` [from ${r.sourceBrowserName}]`;
    } else {
      const browser = r.openInBrowserName ?? "default browser";
      const profile = r.openInProfileName ? ` (${r.openInProfileName} profile)` : "";
      routing = `-> open in ${browser}${profile}`;
      if (r.sourceSpaceID) routing += ` [in space ${r.sourceSpaceID}]`;
    }
    return `${i + 1}. [${r.routeType.toUpperCase()}] "${r.name}" - ${pattern} ${routing} (${status})\n   id: ${r.id}`;
  });
  return `ATC Rules (${rules.length}, evaluated top-to-bottom, first match wins):\n\n${lines.join("\n\n")}`;
}

export async function handleAddATCRule(client: BridgeClient, input: ATCRuleInput): Promise<string> {
  const result = await client.addATCRule(input);
  if (!result.ok) throw new Error(result.error ?? "Failed to add ATC rule");

  // Fetch current rules to show priority context
  const rules = await client.listATCRules();
  const position = rules.findIndex(r => r.id === result.id) + 1;
  const total = rules.length;

  let response = `ATC rule created: "${result.name as string}" (id: ${result.id as string})\nPosition: ${position} of ${total} (evaluated top-to-bottom, first match wins)`;

  if (total > 1) {
    const otherRules = rules
      .filter(r => r.id !== result.id && r.isEnabled)
      .map((r, i) => `  ${i + 1}. [${r.routeType.toUpperCase()}] "${r.name}" - "${r.urlPattern}" (${r.matchType})`)
      .join("\n");
    response += `\n\nOther active rules:\n${otherRules}`;
    response += `\n\nNote: This rule was added at the top (highest priority). If it is broad, it may shadow more specific rules below. Consider using reorder_atc_rules if needed.`;
  }

  return response;
}

export async function handleUpdateATCRule(
  client: BridgeClient,
  id: string,
  updates: Partial<ATCRuleInput>
): Promise<string> {
  const result = await client.updateATCRule(id, updates);
  if (!result.ok) throw new Error(result.error ?? "Failed to update ATC rule");
  return `ATC rule updated: "${result.name as string}" (id: ${id})`;
}

export async function handleDeleteATCRule(client: BridgeClient, id: string): Promise<string> {
  const result = await client.deleteATCRule(id);
  if (!result.ok) throw new Error(result.error ?? "Failed to delete ATC rule");
  return `ATC rule deleted (id: ${id})`;
}

export async function handleReorderATCRules(client: BridgeClient, orderedIds: string[]): Promise<string> {
  const result = await client.reorderATCRules(orderedIds);
  if (!result.ok) throw new Error(result.error ?? "Failed to reorder ATC rules");
  return `ATC rules reordered (${result.count as number} rules)`;
}

export async function handleListBrowserProfiles(client: BridgeClient): Promise<string> {
  const profiles = await client.listBrowserProfiles();
  if (profiles.length === 0) {
    return "No browser profiles discovered. Browser profiles are cached when SupaSidebar discovers them.\nTry opening Preferences to trigger discovery.";
  }
  const byBrowser: Record<string, typeof profiles> = {};
  for (const p of profiles) {
    (byBrowser[p.browserName] ??= []).push(p);
  }
  const lines: string[] = [];
  for (const [browser, bProfiles] of Object.entries(byBrowser)) {
    lines.push(`${browser}:`);
    for (const p of bProfiles) {
      const level = p.isBrowserLevel ? " (browser-level)" : "";
      lines.push(`  - "${p.name}"${level} -> id: ${p.id}`);
    }
  }
  return `Browser profiles:\n\n${lines.join("\n")}\n\nUse the profile id in add_atc_rule or update_atc_rule as openInProfileID.`;
}

export async function handleListInstalledBrowsers(client: BridgeClient): Promise<string> {
  const browsers = await client.listInstalledBrowsers();
  if (browsers.length === 0) {
    return "No supported browsers detected on this machine.";
  }
  const lines = browsers.map((b) => {
    const tags: string[] = [];
    if (b.isDefault) tags.push("default");
    if (b.isRunning) tags.push("running");
    const tagSuffix = tags.length > 0 ? `  [${tags.join(", ")}]` : "";
    return `  - ${b.name}${tagSuffix}`;
  });
  return [
    `${browsers.length} browser${browsers.length === 1 ? "" : "s"} installed on this machine:`,
    "",
    lines.join("\n"),
    "",
    "Pass exactly the `name` value (e.g. \"Brave\", \"Arc\") to open_link's `browser` parameter. Browsers not in this list are NOT installed and will fail.",
  ].join("\n");
}
