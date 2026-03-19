import type { BridgeClient } from "../bridge/types.js";

export async function handleGetLiveTabs(client: BridgeClient, browser?: string): Promise<string> {
  const tabs = await client.getLiveTabs(browser);

  if (tabs.length === 0) {
    const which = browser ? ` in ${browser}` : "";
    return `No open tabs found${which}.`;
  }

  // Group by browser
  const byBrowser = new Map<string, typeof tabs>();
  for (const tab of tabs) {
    const group = byBrowser.get(tab.browser) ?? [];
    group.push(tab);
    byBrowser.set(tab.browser, group);
  }

  const sections: string[] = [];
  for (const [browserName, browserTabs] of byBrowser) {
    const lines = browserTabs.map(
      (t) => `  ${t.isActive ? "▶" : " "} ${t.title}\n    ${t.url}`
    );
    sections.push(`${browserName} (${browserTabs.length} tab${browserTabs.length === 1 ? "" : "s"}):\n${lines.join("\n")}`);
  }

  return `${tabs.length} open tab${tabs.length === 1 ? "" : "s"}:\n\n${sections.join("\n\n")}`;
}
