# ============================================================================
#  Dockerfile — Glama.ai listing check ONLY. Not a functional deployment.
# ============================================================================
#
#  IMPORTANT: This image does NOT and CANNOT run SupaSidebar.
#
#  SupaSidebar is a native macOS app. It cannot run inside a Linux container,
#  so this image contains ONLY the MCP server (the Node.js bridge package).
#
#  What works in this container:
#    - The server starts.
#    - It answers MCP introspection (tools/list) — all 36 tools are declared
#      statically, so no app is needed to LIST them.
#
#  What does NOT work in this container (by design):
#    - Actually CALLING any tool. Every tool call reaches out to the
#      SupaSidebar app on the host at 127.0.0.1:9847. With no macOS app
#      present, calls fail with "Failed to connect to SupaSidebar".
#
#  To actually USE this MCP server, run it on macOS with the SupaSidebar app
#  installed and running:   brew install --cask supasidebar
#  (See README.md for client setup with Claude, Cursor, Codex, etc.)
#
#  Glama only builds + starts the server and checks that introspection responds,
#  which this image satisfies. It is not meant to be run in production.
# ============================================================================

FROM node:20-slim

LABEL org.opencontainers.image.title="supasidebar-mcp"
LABEL org.opencontainers.image.description="MCP server for the SupaSidebar macOS app. Requires macOS + the SupaSidebar app running on the host (127.0.0.1:9847); this container is for Glama introspection checks only and cannot execute tools."
LABEL org.opencontainers.image.source="https://github.com/auspy/supasidebar-mcp"

WORKDIR /app

# Install dependencies (dev deps included — needed for the TypeScript build)
COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund

# Build TypeScript -> dist/
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Print a clear notice at container start, then run the MCP server on stdio.
# (The notice goes to stderr so it never corrupts the stdio JSON-RPC stream.)
CMD sh -c 'echo "[supasidebar-mcp] NOTE: tool execution requires the SupaSidebar macOS app on the host (127.0.0.1:9847). This Linux container can start and answer introspection only." 1>&2; exec node dist/index.js'
