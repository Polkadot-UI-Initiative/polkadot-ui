#!/usr/bin/env node

import { Command } from "commander";
import { AddCommand } from "./commands/add.js";
import { InitCommand } from "./commands/init.js";
import { ListCommand } from "./commands/list.js";
import { TelemetryCommand } from "./commands/telemetry.js";
import { logger } from "./utils/logger.js";
import { CliOptions } from "./types/index.js";

const program = new Command();

program
  .name("polkadot-ui")
  .description(
    "CLI for installing Polkadot UI components with automatic API setup"
  )
  .version("0.1.0");

program
  .option("--dev", "Use development registry (localhost:3000)")
  .option("--verbose", "Show detailed output")
  .option("--force", "Force installation even if files exist")
  // Both flags supported: --interactive and --no-interactive
  // If neither provided, we auto-detect based on TTY/CI
  .option("--interactive", "Force interactive prompts")
  .option("--no-interactive", "Disable interactive prompts");

function resolveInteractive(cmd: Command): boolean {
  const opts = cmd.opts();
  if (typeof opts.interactive === "boolean") return opts.interactive;
  // Auto-detect: interactive when TTY and not CI
  return Boolean(process.stdout.isTTY && !process.env.CI);
}

program
  .command("add")
  .description("Add a component to your project")
  .argument("<component>", "Component name to install")
  .action(async (componentName: string) => {
    const options: CliOptions = {
      dev: program.opts().dev,
      verbose: program.opts().verbose,
      force: program.opts().force,
      interactive: resolveInteractive(program),
    };

    const addCommand = new AddCommand(options);
    try {
      await addCommand.execute(componentName);
    } finally {
      // Ensure telemetry is properly flushed
      await (addCommand as any).telemetry?.shutdown?.();
    }
  });

program
  .command("init")
  .description("Initialize a new project with Polkadot UI components")
  .action(async () => {
    const options: CliOptions = {
      dev: program.opts().dev,
      verbose: program.opts().verbose,
      force: program.opts().force,
      interactive: resolveInteractive(program),
    };

    const initCommand = new InitCommand(options);
    try {
      await initCommand.execute();
    } finally {
      // Ensure telemetry is properly flushed
      await (initCommand as any).telemetry?.shutdown?.();
    }
  });

program
  .command("list")
  .description("List all available components")
  .action(async () => {
    const options: CliOptions = {
      dev: program.opts().dev,
      verbose: program.opts().verbose,
      force: program.opts().force,
      interactive: resolveInteractive(program),
    };

    const listCommand = new ListCommand(options);
    try {
      await listCommand.execute();
    } finally {
      // Ensure telemetry is properly flushed (ListCommand doesn't have telemetry)
      await (listCommand as any).telemetry?.shutdown?.();
    }
  });

program
  .command("telemetry")
  .description("Manage telemetry settings and view privacy information")
  .argument("[action]", "Action to perform: status, enable, disable, info")
  .action(async (action) => {
    const options: CliOptions = {
      dev: program.opts().dev,
      verbose: program.opts().verbose,
      force: program.opts().force,
      interactive: resolveInteractive(program),
    };

    const telemetryCommand = new TelemetryCommand(options);
    try {
      await telemetryCommand.execute(action);
    } finally {
      // Telemetry command handles its own shutdown
    }
  });

// program
//   .command("mcp")
//   .description("Start the MCP server for Cursor integration")
//   .action(async () => {
//     const { default: mcpServer } = await import("./mcp/index.js");
//   });

program
  .command("help")
  .description("Show help information")
  .action(() => {
    program.help();
  });

program.exitOverride((err) => {
  if (err.exitCode === 0) {
    process.exit(0);
  }

  if (err.code === "commander.unknownCommand") {
    logger.error(`Unknown command: ${err.message.split("'")[1]}`);
    logger.info('Run "polkadot-ui help" to see available commands');
    process.exit(1);
  }

  if (err.code === "commander.missingArgument") {
    logger.error(err.message);
    logger.info('Run "polkadot-ui help" to see command usage');
    process.exit(1);
  }

  logger.error(err.message);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  logger.error("Unexpected error occurred:");
  logger.error(error.message);
  if (program.opts().verbose) {
    console.error(error.stack);
  }
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection:");
  logger.error(reason instanceof Error ? reason.message : String(reason));
  if (program.opts().verbose && reason instanceof Error) {
    console.error(reason.stack);
  }
  process.exit(1);
});

if (process.argv.length <= 2) {
  program.help();
}

program.parse(process.argv);
