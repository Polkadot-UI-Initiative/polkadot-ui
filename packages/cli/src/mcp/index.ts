#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { AddCommand } from "../commands/add.js";
import { InitCommand } from "../commands/init.js";
import { ListCommand } from "../commands/list.js";
import { TelemetryCommand } from "../commands/telemetry.js";
import { CliOptions } from "../types/index.js";
import { logger } from "../utils/logger.js";

// Define tool schemas
const AddComponentSchema = z.object({
  component: z.string().describe("The component name to add"),
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
});

const InitProjectSchema = z.object({
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
});

const ListComponentsSchema = z.object({
  dev: z.boolean().optional().describe("Use development registry"),
  verbose: z.boolean().optional().describe("Show detailed output"),
});

const TelemetrySchema = z.object({
  action: z
    .enum(["status", "enable", "disable", "info"])
    .optional()
    .describe("Telemetry action to perform"),
  dev: z.boolean().optional().describe("Use development registry"),
  verbose: z.boolean().optional().describe("Show detailed output"),
});

export class MCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "@web3/cli-mcp",
        version: "0.5.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "add_component",
            description: "Add a Polkadot UI component to your project",
            inputSchema: AddComponentSchema,
          },
          {
            name: "init_project",
            description: "Initialize a new project with Polkadot UI components",
            inputSchema: InitProjectSchema,
          },
          {
            name: "list_components",
            description: "List all available Polkadot UI components",
            inputSchema: ListComponentsSchema,
          },
          {
            name: "manage_telemetry",
            description:
              "Manage telemetry settings and view privacy information",
            inputSchema: TelemetrySchema,
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request: any) => {
        const { name, arguments: args } = request.params;

        try {
          switch (name) {
            case "add_component":
              return await this.handleAddComponent(
                args as z.infer<typeof AddComponentSchema>
              );

            case "init_project":
              return await this.handleInitProject(
                args as z.infer<typeof InitProjectSchema>
              );

            case "list_components":
              return await this.handleListComponents(
                args as z.infer<typeof ListComponentsSchema>
              );

            case "manage_telemetry":
              return await this.handleTelemetry(
                args as z.infer<typeof TelemetrySchema>
              );

            default:
              throw new McpError(
                ErrorCode.MethodNotFound,
                `Unknown tool: ${name}`
              );
          }
        } catch (error) {
          if (error instanceof McpError) {
            throw error;
          }

          const message =
            error instanceof Error ? error.message : String(error);
          throw new McpError(
            ErrorCode.InternalError,
            `Tool execution failed: ${message}`
          );
        }
      }
    );
  }

  private async handleAddComponent(args: z.infer<typeof AddComponentSchema>) {
    const options: CliOptions = {
      dev: args.dev ?? false,
      verbose: args.verbose ?? false,
      force: args.force ?? false,
      interactive: args.interactive ?? false,
    };

    const addCommand = new AddCommand(options);

    try {
      await addCommand.execute(args.component);

      return {
        content: [
          {
            type: "text" as const,
            text: `Successfully added component "${args.component}" to your project.`,
          },
        ],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text" as const,
            text: `Failed to add component "${args.component}": ${message}`,
          },
        ],
        isError: true,
      };
    } finally {
      // Ensure telemetry is properly flushed
      await (addCommand as any).telemetry?.shutdown?.();
    }
  }

  private async handleInitProject(args: z.infer<typeof InitProjectSchema>) {
    const options: CliOptions = {
      dev: args.dev ?? false,
      verbose: args.verbose ?? false,
      force: args.force ?? false,
      interactive: args.interactive ?? false,
    };

    const initCommand = new InitCommand(options);

    try {
      await initCommand.execute();

      return {
        content: [
          {
            type: "text" as const,
            text: "Successfully initialized project with Polkadot UI components.",
          },
        ],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text" as const,
            text: `Failed to initialize project: ${message}`,
          },
        ],
        isError: true,
      };
    } finally {
      // Ensure telemetry is properly flushed
      await (initCommand as any).telemetry?.shutdown?.();
    }
  }

  private async handleListComponents(
    args: z.infer<typeof ListComponentsSchema>
  ) {
    const options: CliOptions = {
      dev: args.dev ?? false,
      verbose: args.verbose ?? false,
      force: false,
      interactive: false,
    };

    const listCommand = new ListCommand(options);

    try {
      // Capture the output instead of letting it print to console
      const originalLog = console.log;
      const outputs: string[] = [];

      console.log = (...args: any[]) => {
        outputs.push(args.join(" "));
      };

      await listCommand.execute();

      // Restore console.log
      console.log = originalLog;

      return {
        content: [
          {
            type: "text" as const,
            text:
              outputs.length > 0
                ? outputs.join("\n")
                : "Available components listed successfully.",
          },
        ],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text" as const,
            text: `Failed to list components: ${message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleTelemetry(args: z.infer<typeof TelemetrySchema>) {
    const options: CliOptions = {
      dev: args.dev ?? false,
      verbose: args.verbose ?? false,
      force: false,
      interactive: false,
    };

    const telemetryCommand = new TelemetryCommand(options);

    try {
      // Capture the output instead of letting it print to console
      const originalLog = console.log;
      const outputs: string[] = [];

      console.log = (...args: any[]) => {
        outputs.push(args.join(" "));
      };

      await telemetryCommand.execute(args.action);

      // Restore console.log
      console.log = originalLog;

      return {
        content: [
          {
            type: "text" as const,
            text:
              outputs.length > 0
                ? outputs.join("\n")
                : `Telemetry command executed successfully.${args.action ? ` Action: ${args.action}` : ""}`,
          },
        ],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text" as const,
            text: `Failed to execute telemetry command: ${message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error: unknown) => {
      logger.error(
        `MCP Server error: ${error instanceof Error ? error.message : String(error)}`
      );
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    logger.info("Web3 UI MCP Server running on stdio");
  }
}

// Run the server if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new MCPServer();
  server.run().catch(console.error);
}
