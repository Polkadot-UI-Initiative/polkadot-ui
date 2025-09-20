import ora from "ora";
import chalk from "chalk";
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
      console.log(registryInfo);

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
      const detectedLibrary = await this.registry.getDetectedLibrary();

      if (detectedLibrary && detectedLibrary !== "none") {
        // Project has specific library - show only relevant components
        const components = await this.registry.getAvailableComponents();

        spinner.succeed(
          `Found ${components.length} components for ${detectedLibrary.toUpperCase()}`
        );

        if (components.length === 0) {
          logger.warning(`No components found for ${detectedLibrary}`);
          return;
        }

        logger.showComponentList(components);
        logger.info(
          `Showing components for detected library: ${detectedLibrary.toUpperCase()}`
        );

        // Show registry info for single library mode
        this.showRegistryInfo(false);
      } else {
        // No specific library detected - show all components with library indicators
        const [papiComponents, dedotComponents] = await Promise.all([
          this.registry.getAvailableComponentsForLibrary("papi"),
          this.registry.getAvailableComponentsForLibrary("dedot"),
        ]);

        const totalComponents = this.mergeComponentsByLibrary(
          papiComponents,
          dedotComponents
        );

        spinner.succeed(
          `Found ${totalComponents.length} components (across PAPI & Dedot)`
        );

        if (totalComponents.length === 0) {
          logger.warning("No components found in any registry");
          return;
        }

        this.showEnhancedComponentList(totalComponents);
        logger.info(
          "No specific Polkadot library detected - showing all available components"
        );

        // Show registry info for enhanced mode (both registries)
        this.showRegistryInfo(true);
      }
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
  private async showRegistryInfo(
    showBothRegistries: boolean = false
  ): Promise<void> {
    logger.section("Registry Information:");

    if (showBothRegistries) {
      // Show both registries when displaying enhanced list
      const baseUrl = this.registry.getBaseUrl();

      logger.detail(`PAPI Registry: ${baseUrl}/registry-papi.json`, true);
      logger.detail(`Dedot Registry: ${baseUrl}/registry-dedot.json`, true);
    } else {
      // Show single registry info (current behavior)
      const registryInfo = await this.registry.getRegistryInfo();
      logger.detail(`Source: ${registryInfo.url}`, true);
    }

    if (this.options.dev) {
      logger.detail("Environment: Development", true);
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
      logger.command("cd polkadot-ui");
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
      logger.command("polkadot-ui list --dev");
    }
  }

  /**
   * Merge components from both libraries and add library support information
   */
  private mergeComponentsByLibrary(
    papiComponents: Array<{ name: string; title: string; description: string }>,
    dedotComponents: Array<{ name: string; title: string; description: string }>
  ): Array<{
    name: string;
    title: string;
    description: string;
    libraries: ("papi" | "dedot")[];
  }> {
    const componentMap = new Map<
      string,
      {
        name: string;
        title: string;
        description: string;
        libraries: ("papi" | "dedot")[];
      }
    >();

    // Add PAPI components
    papiComponents.forEach((component) => {
      componentMap.set(component.name, {
        ...component,
        libraries: ["papi"],
      });
    });

    // Add or merge Dedot components
    dedotComponents.forEach((component) => {
      const existing = componentMap.get(component.name);
      if (existing) {
        existing.libraries.push("dedot");
      } else {
        componentMap.set(component.name, {
          ...component,
          libraries: ["dedot"],
        });
      }
    });

    return Array.from(componentMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  /**
   * Show component list with library support indicators
   */
  private showEnhancedComponentList(
    components: Array<{
      name: string;
      title: string;
      description: string;
      libraries: ("papi" | "dedot")[];
    }>
  ): void {
    logger.section("Available Components:");
    logger.newline();

    components.forEach((component) => {
      const libraryBadges = component.libraries
        .map((lib) => {
          if (lib === "papi") {
            return chalk.blue.bold("PAPI");
          } else {
            return chalk.magenta.bold("Dedot");
          }
        })
        .join(chalk.gray(" + "));

      console.log(
        `${chalk.green("●")} ${chalk.white.bold(component.name)} ${chalk.gray("[")}${libraryBadges}${chalk.gray("]")}`
      );
      console.log(`  ${chalk.gray(component.description)}`);
      logger.newline();
    });

    logger.subsection("Usage:");
    logger.command("polkadot-ui add <component-name>");
    logger.detail(
      "The CLI will automatically detect or prompt for the library type when adding components"
    );
    logger.newline();

    // Add legend for library badges
    logger.subsection("Library Support:");
    console.log(`  ${chalk.blue("PAPI")} - Components using polkadot-api`);
    console.log(`  ${chalk.magenta("Dedot")} - Components using dedot`);
    logger.newline();
  }
}

/**
 * Factory function to create list command instance
 */
export function createListCommand(options: CliOptions): ListCommand {
  return new ListCommand(options);
}
