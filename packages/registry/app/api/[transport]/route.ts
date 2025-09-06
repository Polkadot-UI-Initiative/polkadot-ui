import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

interface RegistryComponent {
  name: string;
  title: string;
  description: string;
  dependencies: string[];
  registryDependencies: string[];
  files: Array<{
    path: string;
    type: string;
    target?: string;
  }>;
}

interface Registry {
  name: string;
  homepage: string;
  items: RegistryComponent[];
}

type RegistryType = "papi" | "dedot" | "default";

// Helper function to get the base path for registry files
function getRegistryBasePath(): string {
  // Use environment variable if available
  if (process.env.REGISTRY_BASE_PATH) {
    return process.env.REGISTRY_BASE_PATH;
  }

  // Fallback to directory containing this file
  const currentFileUrl = import.meta.url;
  const currentFilePath = fileURLToPath(currentFileUrl);
  const currentDir = dirname(currentFilePath);

  // Navigate to the registry root (assuming this file is in app/api/mcp/)
  return path.resolve(currentDir, "../../../");
}

// Helper function to load registry data
async function loadRegistry(
  registryType: RegistryType = "papi",
  dev: boolean = false
): Promise<Registry> {
  try {
    // Construct filename based on registry type
    const getRegistryFilename = (type: RegistryType): string => {
      switch (type) {
        case "papi":
          return "registry-papi.json";
        case "dedot":
          return "registry-dedot.json";
        case "default":
          return "registry.json";
        default:
          return "registry-papi.json"; // fallback to papi
      }
    };

    const filename = getRegistryFilename(registryType);
    let registryContent: string;

    if (dev) {
      // Development: Read from filesystem
      const basePath = getRegistryBasePath();
      const registryPath = path.join(basePath, filename);
      registryContent = await fs.readFile(registryPath, "utf-8");
    } else {
      // Production: Fetch from static URL (Vercel serves these from root)
      const registryUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}/${filename}`
        : `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/${filename}`;

      const response = await fetch(registryUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch registry: ${response.status} ${response.statusText}`
        );
      }
      registryContent = await response.text();
    }

    return JSON.parse(registryContent) as Registry;
  } catch (error) {
    console.error(`Failed to load ${registryType} registry:`, error);
    throw new Error(`Unable to load ${registryType} component registry`);
  }
}

// Helper function to get component details
async function getComponentDetails(
  componentName: string,
  registryType: RegistryType = "papi",
  dev: boolean = false
): Promise<RegistryComponent | null> {
  const registry = await loadRegistry(registryType, dev);
  return registry.items.find((item) => item.name === componentName) || null;
}

const handler = createMcpHandler(
  (server) => {
    // Add Component Tool
    server.tool(
      "add_component",
      "Add a Polkadot UI component to your project. This tool will add the component to your project and install the required dependencies. To make it work, the component needs to be wrapped in a PolkadotProvider or the component with provider must be used.",
      {
        component: z.string().describe("The component name to add"),
        registryType: z
          .enum(["papi", "dedot", "default"])
          .optional()
          .describe("Registry type to use (papi, dedot, or default)"),
        dev: z.boolean().optional().describe("Use development registry"),
        verbose: z.boolean().optional().describe("Show detailed output"),
        force: z
          .boolean()
          .optional()
          .describe("Force installation even if files exist"),
        interactive: z
          .boolean()
          .optional()
          .describe("Show detailed prompts for configuration"),
      },
      async ({
        component,
        registryType = "papi",
        dev = false,
        force = false,
        interactive = false,
      }) => {
        try {
          // Get component details
          const componentDetails = await getComponentDetails(
            component,
            registryType,
            dev
          );

          if (!componentDetails) {
            const registry = await loadRegistry(registryType, dev);
            const availableComponents = registry.items
              .map((item) => `• ${item.name}: ${item.description}`)
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

          // Return installation instructions
          const installInstructions = [
            `# Installing ${componentDetails.title}`,
            "",
            componentDetails.description,
            "",
            "## Dependencies",
            ...componentDetails.dependencies.map((dep) => `- ${dep}`),
            "",
            "## Registry Dependencies",
            ...componentDetails.registryDependencies.map((dep) => `- ${dep}`),
            "",
            "## Files",
            ...componentDetails.files.map(
              (file) => `- ${file.path} (${file.type})`
            ),
            "",
            "## Installation Command",
            "```bash",
            `npx polkadot-ui@latest add ${component}${dev ? " --dev" : ""}${force ? " --force" : ""}${!interactive ? " --no-interactive" : ""}`,
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
      }
    );

    // List Components Tool
    server.tool(
      "list_components",
      "List all available Polkadot UI components",
      {
        registryType: z
          .enum(["papi", "dedot", "default"])
          .optional()
          .describe("Registry type to use (papi, dedot, or default)"),
        dev: z.boolean().optional().describe("Use development registry"),
        verbose: z.boolean().optional().describe("Show detailed output"),
      },
      async ({ registryType = "papi", dev = false, verbose = false }) => {
        try {
          const registry = await loadRegistry(registryType, dev);

          const componentList = [
            `# Available Components (${registry.items.length} total)`,
            "",
            ...registry.items.map((item) => {
              if (verbose) {
                return [
                  `## ${item.name}`,
                  item.description,
                  "",
                  "**Dependencies:**",
                  ...item.dependencies.map((dep) => `- ${dep}`),
                  "",
                  "**Registry Dependencies:**",
                  ...item.registryDependencies.map((dep) => `- ${dep}`),
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
            "npx polkadot-ui@latest add <component-name>",
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
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `❌ Error loading components: ${error instanceof Error ? error.message : "Unknown error occurred"}`,
              },
            ],
          };
        }
      }
    );

    // Init Project Tool
    server.tool(
      "init_project",
      "Initialize a new project with Polkadot UI components",
      {
        registryType: z
          .enum(["papi", "dedot", "default"])
          .optional()
          .describe("Registry type to use (papi, dedot, or default)"),
        dev: z.boolean().optional().describe("Use development registry"),
        verbose: z.boolean().optional().describe("Show detailed output"),
        force: z
          .boolean()
          .optional()
          .describe("Force installation even if files exist"),
        interactive: z
          .boolean()
          .optional()
          .describe("Show detailed prompts for configuration"),
      },
      async ({
        registryType = "dedot",
        dev = false,
        force = false,
        interactive = false,
      }) => {
        try {
          const registry = await loadRegistry(registryType, dev);

          const initInstructions = [
            "# Initialize Polkadot UI Project",
            "",
            "To initialize a new project with Polkadot UI components, run:",
            "",
            "```bash",
            `npx polkadot-ui@latest init${dev ? " --dev" : ""}${force ? " --force" : ""}${!interactive ? " --no-interactive" : ""}`,
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
              (item) => `- **${item.name}**: ${item.description}`
            ),
            "",
            "## Next Steps:",
            "1. Run the init command above",
            "2. Follow the interactive prompts",
            "3. Add components with `npx polkadot-ui@latest add <component-name>`",
            "4. Wrap the component in a PolkadotProvider or the component with provider must be used.",
            "5. Start building your Polkadot application!",
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
      }
    );

    // Manage Telemetry Tool
    server.tool(
      "manage_telemetry",
      "Manage telemetry settings and display privacy information",
      {
        action: z
          .enum(["status", "enable", "disable", "info"])
          .optional()
          .describe("Telemetry action to perform"),
        dev: z.boolean().optional().describe("Use development registry"),
        verbose: z.boolean().optional().describe("Show detailed output"),
      },
      async ({ action = "status", dev = false }) => {
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
          "npx polkadot-ui@latest telemetry status   # Check current status",
          "npx polkadot-ui@latest telemetry enable   # Enable telemetry",
          "npx polkadot-ui@latest telemetry disable  # Disable telemetry",
          "npx polkadot-ui@latest telemetry info     # Show this information",
          "```",
          "",
          `**Current Action:** ${action}`,
          `**Environment:** ${dev ? "Development" : "Production"}`,
          "",
          "## Opt-out Options:",
          "- Set environment variable: `DOT_UI_DISABLE_TELEMETRY=1`",
          "- Run: `npx polkadot-ui@latest telemetry disable`",
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
    );

    // Add resources for registry data
    server.resource(
      "Component Registry",
      "polkadot://registry/components",
      {
        description: "Available Polkadot UI components",
        mimeType: "application/json",
      },
      async () => {
        const registry = await loadRegistry("dedot", false);
        return {
          contents: [
            {
              uri: "polkadot://registry/components",
              mimeType: "application/json",
              text: JSON.stringify(registry, null, 2),
            },
          ],
        };
      }
    );

    server.resource(
      "Development Component Registry",
      "polkadot://registry/components/dev",
      {
        description: "Available Polkadot UI components (development)",
        mimeType: "application/json",
      },
      async () => {
        const registry = await loadRegistry("papi", true);
        return {
          contents: [
            {
              uri: "polkadot://registry/components/dev",
              mimeType: "application/json",
              text: JSON.stringify(registry, null, 2),
            },
          ],
        };
      }
    );
  },
  {
    capabilities: {
      tools: {
        add_component: {
          description: "Add a Polkadot UI component to your project",
          parameters: z.object({
            component: z.string().describe("The component name to add"),
            registryType: z
              .enum(["papi", "dedot", "default"])
              .optional()
              .describe("Registry type to use (papi, dedot, or default)"),
            dev: z.boolean().optional().describe("Use development registry"),
            verbose: z.boolean().optional().describe("Show detailed output"),
            force: z
              .boolean()
              .optional()
              .describe("Force installation even if files exist"),
            interactive: z
              .boolean()
              .optional()
              .describe("Show detailed prompts for configuration"),
          }),
        },
        list_components: {
          description: "List all available Polkadot UI components",
          parameters: z.object({
            registryType: z
              .enum(["papi", "dedot", "default"])
              .optional()
              .describe("Registry type to use (papi, dedot, or default)"),
            dev: z.boolean().optional().describe("Use development registry"),
            verbose: z.boolean().optional().describe("Show detailed output"),
          }),
        },
        init_project: {
          description: "Initialize a new project with Polkadot UI components",
          parameters: z.object({
            registryType: z
              .enum(["papi", "dedot", "default"])
              .optional()
              .describe("Registry type to use (papi, dedot, or default)"),
            dev: z.boolean().optional().describe("Use development registry"),
            verbose: z.boolean().optional().describe("Show detailed output"),
            force: z
              .boolean()
              .optional()
              .describe("Force installation even if files exist"),
            interactive: z
              .boolean()
              .optional()
              .describe("Show detailed prompts for configuration"),
          }),
        },
        manage_telemetry: {
          description:
            "Manage telemetry settings and display privacy information",
          parameters: z.object({
            action: z
              .enum(["status", "enable", "disable", "info"])
              .optional()
              .describe("Telemetry action to perform"),
            dev: z.boolean().optional().describe("Use development registry"),
            verbose: z.boolean().optional().describe("Show detailed output"),
          }),
        },
      },
    },
  },
  {
    // Handler options
    redisUrl: process.env.REDIS_URL,
    basePath: "/api",
    maxDuration: 500,
    verboseLogs: true,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
