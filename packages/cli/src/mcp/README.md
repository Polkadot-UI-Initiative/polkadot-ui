# Web3 UI MCP Server

This directory contains the Model Context Protocol (MCP) server implementation
for the Web3 UI CLI. The MCP server exposes all CLI commands as tools that can
be used by AI assistants and other MCP clients.

## Overview

The MCP server provides AI assistants with the ability to:

- Add Polkadot UI components to projects
- Initialize new projects with Polkadot UI setup
- List available components from the registry
- Manage telemetry settings

## Available Tools

### `add_component`

Adds a Polkadot UI component to your project.

**Parameters:**

- `component` (string, required): The component name to add
- `dev` (boolean, optional): Use development registry
- `verbose` (boolean, optional): Show detailed output
- `force` (boolean, optional): Force installation even if files exist
- `interactive` (boolean, optional): Show detailed prompts for configuration

### `init_project`

Initializes a new project with Polkadot UI components.

**Parameters:**

- `dev` (boolean, optional): Use development registry
- `verbose` (boolean, optional): Show detailed output
- `force` (boolean, optional): Force installation even if files exist
- `interactive` (boolean, optional): Show detailed prompts for configuration

### `list_components`

Lists all available Polkadot UI components from the registry.

**Parameters:**

- `dev` (boolean, optional): Use development registry
- `verbose` (boolean, optional): Show detailed output

### `manage_telemetry`

Manages telemetry settings and displays privacy information.

**Parameters:**

- `action` (enum, optional): Telemetry action - "status", "enable", "disable",
  or "info"
- `dev` (boolean, optional): Use development registry
- `verbose` (boolean, optional): Show detailed output

## Usage with Claude Desktop

Add the following configuration to your Claude Desktop config file
(`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "web3ui": {
      "command": "npx",
      "args": ["@web3/cli", "web3ui-mcp"]
    }
  }
}
```

Alternatively, if you have the package installed globally:

```json
{
  "mcpServers": {
    "web3ui": {
      "command": "web3ui-mcp"
    }
  }
}
```

## Usage with Other MCP Clients

The server uses stdio transport and can be connected to any MCP client that
supports this transport method.

Example with the MCP TypeScript client:

```typescript
import { MCPClient } from "mcp-client";

const client = new MCPClient({
  name: "Web3 UI Client",
  version: "1.0.0",
});

await client.connect({
  type: "stdio",
  command: "web3ui-mcp",
});

// Add a component
const result = await client.callTool({
  name: "add_component",
  arguments: {
    component: "wallet-button",
    verbose: true,
  },
});
```

## Development

To run the MCP server directly:

```bash
# Build the project first
npm run build

# Run the MCP server
npm run dev:mcp
```

Or use the binary directly:

```bash
./bin/dot-ui-mcp.mjs
```

## Error Handling

The MCP server includes comprehensive error handling:

- Invalid tool names return `MethodNotFound` errors
- Command execution failures are caught and returned as error responses
- Telemetry is properly cleaned up after each command execution
- Process signals (SIGINT) are handled gracefully

## Integration with Existing CLI

The MCP server uses the same command classes as the regular CLI:

- `AddCommand` for component installation
- `InitCommand` for project initialization
- `ListCommand` for listing components
- `TelemetryCommand` for telemetry management

This ensures consistency between the CLI and MCP interfaces while allowing AI
assistants to perform the same operations through the protocol.
