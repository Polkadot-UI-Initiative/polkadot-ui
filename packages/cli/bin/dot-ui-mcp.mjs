#!/usr/bin/env node

// Import and run the MCP server
import("../dist/mcp/index.js")
  .then(({ MCPServer }) => {
    const server = new MCPServer();
    server.run().catch(console.error);
  })
  .catch(console.error);
