import type { AutoCloseRuleInput, BridgeClient } from "../bridge/types.js";

export async function handleListAutoCloseRules(client: BridgeClient): Promise<string> {
  const rules = await client.listAutoCloseRules();
  if (rules.length === 0) {
    return "No Auto-Close Never Close rules configured.\nUse add_auto_close_rule to protect a domain or URL pattern.";
  }

  const lines = rules.map((rule, index) => (
    `${index + 1}. [${rule.matchMode.toUpperCase()}] ${rule.value}\n   id: ${rule.id}`
  ));

  return [
    `Never Close Rules (${rules.length}):`,
    "",
    lines.join("\n\n"),
    "",
    "Domain rules protect the site and its subdomains. Contains rules check the full URL.",
  ].join("\n");
}

export async function handleAddAutoCloseRule(
  client: BridgeClient,
  input: AutoCloseRuleInput
): Promise<string> {
  const result = await client.addAutoCloseRule(input);
  if (!result.ok) throw new Error(result.error ?? "Failed to add Never Close rule");
  return `Never Close rule created: [${result.matchMode as string}] ${result.value as string} (id: ${result.id as string})`;
}

export async function handleUpdateAutoCloseRule(
  client: BridgeClient,
  id: string,
  updates: Partial<AutoCloseRuleInput>
): Promise<string> {
  const result = await client.updateAutoCloseRule(id, updates);
  if (!result.ok) throw new Error(result.error ?? "Failed to update Never Close rule");
  return `Never Close rule updated: [${result.matchMode as string}] ${result.value as string} (id: ${id})`;
}

export async function handleDeleteAutoCloseRule(client: BridgeClient, id: string): Promise<string> {
  const result = await client.deleteAutoCloseRule(id);
  if (!result.ok) throw new Error(result.error ?? "Failed to delete Never Close rule");
  return `Never Close rule deleted (id: ${id})`;
}
