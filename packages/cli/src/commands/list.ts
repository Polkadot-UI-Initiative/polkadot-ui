import ora from "ora";
import { Registry } from "../utils/registry.js";
import { logger } from "../utils/logger.js";
import { CliOptions } from "../types/index.js";

export class ListCommand {
  private options: CliOptions;
  private registry: Registry;

  constructor(options: CliOptions) {
    this.options = options;
    this.registry = new Registry(options.dev);
  }

  /**
   * Main list command execution
   */
  async execute(): Promise<void> {
    try {
      await this.validateRegistryConnection();
      await this.showComponentList();
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      process.exit(1);
    }
  }

  /**
   * Validate registry connection
   */
  private async validateRegistryConnection(): Promise<void> {
    const spinner = ora("Connecting to registry...").start();

    try {
      const registryInfo = await this.registry.getRegistryInfo();

      if (!registryInfo.isConnected) {
        spinner.fail("Registry connection failed");
        logger.error(`Cannot connect to registry: ${registryInfo.url}`);
        if (registryInfo.error) {
          logger.detail(registryInfo.error);
        }

        // Show helpful guidance for connection issues
        this.showConnectionGuidance(registryInfo.url);
        throw new Error("Registry connection failed");
      }

      spinner.succeed(
        `Connected to registry (${registryInfo.componentCount} components available)`
      );

      if (this.options.dev) {
        logger.detail("Using development registry");
      }
    } catch (error) {
      spinner.fail("Registry connection failed");
      throw error;
    }
  }

  /**
   * Show available components
   */
  private async showComponentList(): Promise<void> {
    const spinner = ora("Fetching components...").start();

    try {
      const components = await this.registry.getAvailableComponents();

      spinner.succeed(`Found ${components.length} components`);

      if (components.length === 0) {
        logger.warning("No components found in registry");
        return;
      }

      // Show component list
      logger.showComponentList(components);

      // Show registry info
      this.showRegistryInfo();
    } catch (error) {
      spinner.fail("Failed to fetch components");
      throw new Error(
        `Failed to fetch components: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Show registry information
   */
  private showRegistryInfo(): void {
    const registryUrl = this.options.dev
      ? "http://localhost:3000"
      : "https://polkadot-ui-registry.vercel.app";

    logger.section("Registry Information:");
    logger.detail(`Source: ${registryUrl}`, true);

    if (this.options.dev) {
      logger.detail("Environment: Development", true);
      logger.info("Make sure the registry server is running on localhost:3000");
    } else {
      logger.detail("Environment: Production", true);
    }
  }

  /**
   * Show connection guidance when registry is unreachable
   */
  private showConnectionGuidance(registryUrl: string): void {
    logger.newline();

    if (registryUrl.includes("localhost")) {
      logger.subsection("Development Registry Issues:");
      logger.info("Make sure the registry development server is running:");
      logger.command("cd registry-template-v4");
      logger.command("pnpm dev");
      logger.newline();
      logger.info("The server should be accessible at http://localhost:3000");
      logger.info(
        "You can test it by opening http://localhost:3000/registry.json in your browser"
      );
    } else {
      logger.subsection("Network Issues:");
      logger.info("Check your internet connection and try again.");
      logger.info("You can also try using the development registry:");
      logger.command("dot-ui list --dev");
    }
  }
}

/**
 * Factory function to create list command instance
 */
export function createListCommand(options: CliOptions): ListCommand {
  return new ListCommand(options);
}
