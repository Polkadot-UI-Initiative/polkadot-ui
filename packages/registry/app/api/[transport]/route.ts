import fs from "fs/promises";
import { createMcpHandler } from "mcp-handler";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

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

    // Helper to fetch from deployed/static URL (works in Vercel/serverless)
    const fetchFromUrl = async (): Promise<string> => {
      const registryUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}/${filename}`
        : `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/${filename}`;

      const response = await fetch(registryUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch registry: ${response.status} ${response.statusText}`
        );
      }
      return await response.text();
    };

    if (dev) {
      // Development: Prefer filesystem locally, but gracefully fall back to URL in serverless
      try {
        const basePath = getRegistryBasePath();
        const registryPath = path.join(basePath, filename);
        registryContent = await fs.readFile(registryPath, "utf-8");
      } catch (fsError) {
        // Fallback for environments where local files aren't packaged (e.g., Vercel)
        console.warn(
          `Dev registry file not found at filesystem, falling back to URL for ${filename}:`,
          fsError
        );
        registryContent = await fetchFromUrl();
      }
    } else {
      // Production: Fetch from static URL (Vercel serves these from root)
      registryContent = await fetchFromUrl();
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
      "Add a Polkadot UI component to your project. Specify registryType to choose the Polkadot library (default: papi). The CLI will prompt for the library when none is detected, before installing.",
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
      async ({ component, registryType = "papi", dev = false }) => {
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
            `npx polkadot-ui@latest add ${component}`,
            "```",
            "",
            "## Library Selection",
            "- Default library: papi",
            "- To target dedot via MCP, set input field `registryType` to `dedot`",
            "- The CLI will ask you to choose a library if none is detected, before installing",
            "",
            "Note: Run the CLI command without extra flags; it will guide you interactively if needed.",
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
      "List all available Polkadot UI components. Specify registryType to choose the Polkadot library (default: papi).",
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
            "## Library Selection",
            "- Default library: papi",
            "- To list components for a specific library via MCP, set input field `registryType` to `papi` or `dedot`",
            "- Agents should ask which library to use when uncertain",
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
      "Initialize a new project with Polkadot UI components. Specify registryType to choose the Polkadot library (default: papi).",
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
        interactive,
      }) => {
        try {
          const registry = await loadRegistry(registryType, dev);

          const interactiveFlag =
            typeof interactive === "boolean"
              ? interactive
                ? " --interactive"
                : " --no-interactive"
              : "";

          const initInstructions = [
            "# Initialize Polkadot UI Project",
            "",
            "To initialize a new project with Polkadot UI components, run:",
            "",
            "```bash",
            `npx polkadot-ui@latest init${dev ? " --dev" : ""}${force ? " --force" : ""}${interactiveFlag}`,
            "```",
            "",
            "Note: The CLI auto-detects interactivity (TTY/CI). Use --interactive or --no-interactive only to override.",
            "",
            "## What this does:",
            "- Creates a new project structure",
            "- Installs required dependencies",
            "- Sets up Polkadot API configuration",
            "- Adds base UI components",
            "- Configures TypeScript and styling",
            "",
            "## Library Selection",
            "- Default library: papi",
            "- To prefer dedot via MCP, set input field `registryType` to `dedot`",
            "- The CLI will ask for your library choice when none is detected, before installing",
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
      "Dedot Component Registry",
      "polkadot://registry/components/dedot",
      {
        description: "Available Polkadot UI components for dedot",
        mimeType: "application/json",
      },
      async () => {
        const registry = await loadRegistry("dedot", false);
        return {
          contents: [
            {
              uri: "polkadot://registry/components/dedot",
              mimeType: "application/json",
              text: JSON.stringify(registry, null, 2),
            },
          ],
        };
      }
    );

    server.resource(
      "Papi Component Registry",
      "polkadot://registry/components/papi",
      {
        description: "Available Polkadot UI components for papi",
        mimeType: "application/json",
      },
      async () => {
        const registry = await loadRegistry("papi", false);
        return {
          contents: [
            {
              uri: "polkadot://registry/components/papi",
              mimeType: "application/json",
              text: JSON.stringify(registry, null, 2),
            },
          ],
        };
      }
    );
  },
  {},
  {
    // Handler options
    redisUrl: process.env.REDIS_URL,
    basePath: "/api",
    maxDuration: 500,
    verboseLogs: true,
  }
);

export { handler as DELETE, handler as GET, handler as POST };
