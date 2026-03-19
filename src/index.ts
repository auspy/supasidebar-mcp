#!/usr/bin/env node

// SupaSidebar MCP Server
//
// This server lets AI assistants interact with your SupaSidebar data.
// It communicates ONLY with localhost (127.0.0.1:9847) — no data leaves your machine.
//
// Usage:
//   supasidebar-mcp          Connect to the running SupaSidebar app
//   supasidebar-mcp --mock   Use mock data for testing (no app needed)

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";
import { createBridgeClient } from "./bridge/client.js";
import { createMockClient } from "./bridge/mock.js";

const useMock =
  process.argv.includes("--mock") || process.env.SUPASIDEBAR_MCP_MOCK === "1";

const client = useMock ? createMockClient() : createBridgeClient();
const server = createServer(client);

const transport = new StdioServerTransport();
await server.connect(transport);
