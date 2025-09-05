import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "polkadot-ui",
    version: "0.7.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

async function loadRegistry(
  registryType: "papi" | "dedot" | "default" = "papi",
  dev: boolean = false
): Promise<any> {
  try {
    const baseUrl = dev 
      ? "http://localhost:3000" 
      : "https://dot-ui.com";
    
    let registryFile: string;
    switch (registryType) {
      case "papi":
        registryFile = "registry-papi.json";
        break;
      case "dedot":
        registryFile = "registry-dedot.json";
        break;
      case "default":
      default:
        registryFile = "registry.json";
        break;
    }

    const registryUrl = `${baseUrl}/${registryFile}`;
    const response = await fetch(registryUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch registry: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to load ${registryType} registry:`, error);
    throw new Error(`Unable to load ${registryType} component registry`);
  }
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "add_component",
        description: "Add a Polkadot UI component to your project",
        inputSchema: {
          type: "object",
          properties: {
            component: {
              type: "string",
              description: "The component name to add",
            },
            registryType: {
              type: "string",
              enum: ["papi", "dedot", "default"],
              description: "Registry type to use (papi, dedot, or default)",
            },
            dev: {
              type: "boolean",
              description: "Use development registry",
            },
            verbose: {
              type: "boolean",
              description: "Show detailed output",
            },
            force: {
              type: "boolean",
              description: "Force installation even if files exist",
            },
            interactive: {
              type: "boolean",
              description: "Show detailed prompts for configuration",
            },
          },
          required: ["component"],
        },
      },
      {
        name: "list_components",
        description: "List all available Polkadot UI components",
        inputSchema: {
          type: "object",
          properties: {
            registryType: {
              type: "string",
              enum: ["papi", "dedot", "default"],
              description: "Registry type to use (papi, dedot, or default)",
            },
            dev: {
              type: "boolean",
              description: "Use development registry",
            },
            verbose: {
              type: "boolean",
              description: "Show detailed output",
            },
          },
        },
      },
      {
        name: "init_project",
        description: "Initialize a new project with Polkadot UI components",
        inputSchema: {
          type: "object",
          properties: {
            registryType: {
              type: "string",
              enum: ["papi", "dedot", "default"],
              description: "Registry type to use (papi, dedot, or default)",
            },
            dev: {
              type: "boolean",
              description: "Use development registry",
            },
            verbose: {
              type: "boolean",
              description: "Show detailed output",
            },
            force: {
              type: "boolean",
              description: "Force installation even if files exist",
            },
            interactive: {
              type: "boolean",
              description: "Show detailed prompts for configuration",
            },
          },
        },
      },
      {
        name: "manage_telemetry",
        description: "Manage telemetry settings and display privacy information",
        inputSchema: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["status", "enable", "disable", "info"],
              description: "Telemetry action to perform",
            },
            dev: {
              type: "boolean",
              description: "Use development registry",
            },
            verbose: {
              type: "boolean",
              description: "Show detailed output",
            },
          },
        },
                },
          {
            name: "cli_help",
            description: "Show all available CLI commands and their descriptions",
            inputSchema: {
              type: "object",
              properties: {
                verbose: {
                  type: "boolean",
                  description: "Show detailed command information",
                },
              },
            },
          },
        ],
      };
    });

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "add_component": {
        const { component, registryType = "papi", dev = false, force = false, interactive = false } = args as {
          component: string;
          registryType?: "papi" | "dedot" | "default";
          dev?: boolean;
          force?: boolean;
          interactive?: boolean;
        };
        
        const registry = await loadRegistry(registryType, dev);
        const componentDetails = registry.items.find((item: any) => item.name === component);

        if (!componentDetails) {
          const availableComponents = registry.items
            .map((item: any) => `• ${item.name}: ${item.description}`)
            .join("\n");

          return {
            content: [
              {
                type: "text",
                text: `❌ Component "${component}" not found in registry.\n\nAvailable components:\n${availableComponents}`,
              },
            ],
          };
        }

        const installInstructions = [
          `# Installing ${componentDetails.title}`,
          "",
          componentDetails.description,
          "",
          "## Dependencies",
          ...componentDetails.dependencies.map((dep: string) => `- ${dep}`),
          "",
          "## Registry Dependencies",
          ...componentDetails.registryDependencies.map((dep: string) => `- ${dep}`),
          "",
          "## Files",
          ...componentDetails.files.map(
            (file: any) => `- ${file.path} (${file.type})`
          ),
          "",
          "## Installation Command",
          "```bash",
          `npx polkadot-ui add ${component}${dev ? " --dev" : ""}${force ? " --force" : ""}${!interactive ? " --no-interactive" : ""}`,
          "```",
          "",
          "## Manual Installation",
          "You can also manually copy the files from the registry to your project.",
        ].join("\n");

        return {
          content: [
            {
              type: "text",
              text: installInstructions,
            },
          ],
        };
      }

      case "list_components": {
        const { registryType = "papi", dev = false, verbose = false } = args as {
          registryType?: "papi" | "dedot" | "default";
          dev?: boolean;
          verbose?: boolean;
        };
        
        const registry = await loadRegistry(registryType, dev);

        const componentList = [
          `# Available Components (${registry.items.length} total)`,
          "",
          ...registry.items.map((item: any) => {
            if (verbose) {
              return [
                `## ${item.name}`,
                item.description,
                "",
                "**Dependencies:**",
                ...item.dependencies.map((dep: string) => `- ${dep}`),
                "",
                "**Registry Dependencies:**",
                ...item.registryDependencies.map((dep: string) => `- ${dep}`),
                "",
              ].join("\n");
            } else {
              return `• **${item.name}**: ${item.description}`;
            }
          }),
          "",
          "## Usage",
          "Add a component to your project:",
          "```bash",
          "npx polkadot-ui add <component-name>",
          "```",
          "",
          `**Registry Source:** ${dev ? "Development" : "Production"}`,
          `**Homepage:** ${registry.homepage}`,
        ].join("\n");

        return {
          content: [
            {
              type: "text",
              text: componentList,
            },
          ],
        };
      }

      case "init_project": {
        const { registryType = "papi", dev = false, force = false, interactive = false } = args as {
          registryType?: "papi" | "dedot" | "default";
          dev?: boolean;
          force?: boolean;
          interactive?: boolean;
        };
        
        const registry = await loadRegistry(registryType, dev);

        const initInstructions = [
          "# Initialize Polkadot UI Project",
          "",
          "To initialize a new project with Polkadot UI components, run:",
          "",
          "```bash",
          `npx polkadot-ui init${dev ? " --dev" : ""}${force ? " --force" : ""}${!interactive ? " --no-interactive" : ""}`,
          "```",
          "",
          "## What this does:",
          "- Creates a new project structure",
          "- Installs required dependencies",
          "- Sets up Polkadot API configuration",
          "- Adds base UI components",
          "- Configures TypeScript and styling",
          "",
          `## Available Components (${registry.items.length} total):`,
          ...registry.items.map(
            (item: any) => `- **${item.name}**: ${item.description}`
          ),
          "",
          "## Next Steps:",
          "1. Run the init command above",
          "2. Follow the interactive prompts",
          "3. Add components with `npx polkadot-ui add <component-name>`",
          "4. Start building your Polkadot application!",
          "",
          `**Registry:** ${dev ? "Development" : "Production"} (${registry.homepage})`,
        ].join("\n");

        return {
          content: [
            {
              type: "text",
              text: initInstructions,
            },
          ],
        };
      }

      case "manage_telemetry": {
        const { action = "status", dev = false } = args as {
          action?: "status" | "enable" | "disable" | "info";
          dev?: boolean;
        };
        
        const telemetryInfo = [
          "# Polkadot UI Telemetry Information",
          "",
          "## Privacy First Approach",
          "Polka UI collects minimal, anonymous usage data to improve the CLI experience.",
          "",
          "## What we collect:",
          "- Command usage patterns (add, init, list)",
          "- Component installation success/failure rates",
          "- Error types (without personal data)",
          "- Project type detection (Next.js, Vite, etc.)",
          "",
          "## What we DO NOT collect:",
          "- Personal information",
          "- Code content",
          "- File paths or names",
          "- IP addresses",
          "- Any identifying information",
          "",
          "## Telemetry Controls:",
          "```bash",
          "npx polkadot-ui telemetry status   # Check current status",
          "npx polkadot-ui telemetry enable   # Enable telemetry",
          "npx polkadot-ui telemetry disable  # Disable telemetry",
          "npx polkadot-ui telemetry info     # Show this information",
          "```",
          "",
          `**Current Action:** ${action}`,
          `**Environment:** ${dev ? "Development" : "Production"}`,
          "",
          "## Opt-out Options:",
          "- Set environment variable: `DOT_UI_DISABLE_TELEMETRY=1`",
          "- Run: `npx polkadot-ui telemetry disable`",
          "- Telemetry is automatically disabled in CI environments",
        ].join("\n");

        return {
          content: [
            {
              type: "text",
              text: telemetryInfo,
            },
          ],
        };
      }

      case "cli_help": {
        const { verbose = false } = args as {
          verbose?: boolean;
        };
        
        const cliCommands = [
          "# Polkadot UI CLI Commands",
          "",
          "## Available Commands:",
          "",
          "### `add <component>`",
          "Add a component to your project",
          "```bash",
          "npx polkadot-ui add address-input",
          "npx polkadot-ui add connect-wallet --dev",
          "```",
          "",
          "### `init`",
          "Initialize a new project with Polkadot UI components",
          "```bash",
          "npx polkadot-ui init",
          "npx polkadot-ui init --dev --force",
          "```",
          "",
          "### `list`",
          "List all available components",
          "```bash",
          "npx polkadot-ui list",
          "npx polkadot-ui list --dev --verbose",
          "```",
          "",
          "### `telemetry [action]`",
          "Manage telemetry settings and view privacy information",
          "```bash",
          "npx polkadot-ui telemetry status",
          "npx polkadot-ui telemetry enable",
          "npx polkadot-ui telemetry disable",
          "npx polkadot-ui telemetry info",
          "```",
          "",
          "### `mcp`",
          "Start the MCP server for Cursor integration",
          "```bash",
          "npx polkadot-ui mcp",
          "```",
          "",
          "### `help`",
          "Show help information",
          "```bash",
          "npx polkadot-ui help",
          "```",
          "",
          "## Global Options:",
          "- `--dev`: Use development registry (localhost:3000)",
          "- `--verbose`: Show detailed output",
          "- `--force`: Force installation even if files exist",
          "- `--interactive`: Show detailed prompts for configuration",
          "",
          "## Examples:",
          "```bash",
          "# Add a component",
          "npx polkadot-ui add address-input",
          "",
          "# Initialize project with development registry",
          "npx polkadot-ui init --dev",
          "",
          "# List components with verbose output",
          "npx polkadot-ui list --verbose",
          "",
          "# Check telemetry status",
          "npx polkadot-ui telemetry status",
          "```",
        ].join("\n");

        return {
          content: [
            {
              type: "text",
              text: cliCommands,
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: "text",
              text: `❌ Unknown tool: ${name}`,
            },
          ],
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `❌ Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`,
        },
      ],
    };
  }
});

// Start the server
console.error("Starting MCP server...");
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("MCP server connected successfully");

// Keep the server alive
process.on('SIGINT', () => {
  console.error("MCP server shutting down...");
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error("MCP server shutting down...");
  process.exit(0);
});

export default server;
