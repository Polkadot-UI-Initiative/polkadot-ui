import ora from "ora";
import execa from "execa";
import inquirer from "inquirer";
import path from "path";
import { ProjectDetector } from "../utils/project-detector.js";
import { PolkadotDetector } from "../utils/polkadot-detector.js";
import {
  Registry,
  isValidComponentName,
  formatComponentName,
} from "../utils/registry.js";
import { logger } from "../utils/logger.js";
import {
  CliOptions,
  ComponentInfo,
  ProjectStructure,
  PolkadotApiConfig,
} from "../types/index.js";
import { InitCommand } from "./init.js";

export class AddCommand {
  private options: CliOptions;
  private registry: Registry;
  private projectDetector: ProjectDetector;
  private polkadotDetector: PolkadotDetector;

  constructor(options: CliOptions) {
    this.options = options;
    this.registry = new Registry(options.dev);
    this.projectDetector = new ProjectDetector();
    this.polkadotDetector = new PolkadotDetector();
  }

  /**
   * Main add command execution
   */
  async execute(componentName: string): Promise<void> {
    try {
      logger.detail("🚀 Starting add command execution...", true);

      // Step 1: Validate component name
      logger.detail("📝 Step 1: Validating component name...", true);
      if (!this.validateComponentName(componentName)) {
        return;
      }

      // Step 2: Validate project setup
      logger.detail("🔧 Step 2: Validating project setup...", true);
      const projectStructure = await this.validateProjectSetup();
      if (!projectStructure) {
        logger.detail("❌ Project setup validation failed, exiting", true);
        return;
      }
      logger.detail("✅ Project setup validation completed", true);

      // Step 3: Check component availability
      logger.detail("🔍 Step 3: Checking component availability...", true);
      const componentInfo = await this.validateComponentAvailability(
        componentName
      );
      if (!componentInfo) {
        logger.detail("❌ Component availability check failed, exiting", true);
        return;
      }
      logger.detail("✅ Component availability check completed", true);

      // Step 4: Detect Polkadot API setup
      logger.detail("🔗 Step 4: Detecting Polkadot API setup...", true);
      const polkadotConfig = await this.detectPolkadotSetup(componentInfo);
      logger.detail("✅ Polkadot API setup detection completed", true);

      // Step 5: Install component
      logger.detail("📦 Step 5: Installing component...", true);
      await this.installComponent(
        componentInfo,
        projectStructure,
        polkadotConfig
      );
      logger.detail("✅ Component installation completed", true);

      // Step 6: Show next steps
      logger.detail("🎉 Step 6: Showing completion message...", true);
      this.showCompletionMessage(componentInfo, polkadotConfig);
      logger.detail("✅ Add command completed successfully", true);
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      logger.detail(
        "If the issue persists, please check the project setup manually"
      );
      process.exit(1);
    }
  }

  /**
   * Step 1: Validate component name format
   */
  private validateComponentName(componentName: string): boolean {
    if (!componentName) {
      logger.error("Component name is required");
      logger.info("Usage: dot-ui add <component-name>");
      return false;
    }

    if (!isValidComponentName(componentName)) {
      logger.error(`Invalid component name: ${componentName}`);
      logger.info(
        "Component names should be kebab-case (e.g., block-number, user-profile)"
      );
      return false;
    }

    return true;
  }

  /**
   * Step 2: Validate project setup (package.json, React, framework)
   */
  private async validateProjectSetup(): Promise<ProjectStructure | null> {
    const spinner = ora("Validating project setup...").start();

    try {
      // Check if package.json exists
      if (!(await this.projectDetector.hasPackageJson())) {
        spinner.stop();

        // Ask user if they want to create a new project (or auto-yes if --yes flag)
        let shouldCreateProject = true;

        if (!this.options.yes) {
          const result = await inquirer.prompt([
            {
              type: "confirm",
              name: "shouldCreateProject",
              message:
                "No project found. Would you like to create a new project?",
              default: true,
            },
          ]);
          shouldCreateProject = result.shouldCreateProject;
        }

        if (!shouldCreateProject) {
          logger.showProjectGuidance();
          return null;
        }

        // Run init command to set up the project
        const initCommand = new InitCommand(this.options);
        logger.detail("🔄 Running init command...", true);

        // Add process exit handler to detect unexpected termination
        const exitHandler = (code: number) => {
          logger.error(
            `🚨 PROCESS EXITING with code ${code} during init command!`
          );
          logger.error(
            "This is the root cause - init command is causing process to exit"
          );
        };

        process.on("exit", exitHandler);

        // Use internal method instead of full execute to avoid process management issues
        const initPromise = initCommand.initializeProject();
        const timeoutPromise = new Promise<void>((_, reject) => {
          setTimeout(() => {
            reject(new Error("Init command timed out after 30 seconds"));
          }, 30 * 1000); // 30 seconds timeout for testing
        });

        try {
          await Promise.race([initPromise, timeoutPromise]);
        } catch (error) {
          if (error instanceof Error && error.message.includes("timed out")) {
            logger.error(
              "Init command appears to be hanging - this is the root cause!"
            );
            logger.info(
              "The init command is not returning control to the add command"
            );
            return null;
          }
          throw error;
        } finally {
          // Remove the exit handler
          process.off("exit", exitHandler);
        }

        logger.detail(
          "✅ Init command completed, continuing with add...",
          true
        );

        // Add immediate confirmation that we're past the init command
        logger.info(
          "🎯 CRITICAL: Init command has returned control to add command!"
        );

        // Wait a moment for file system to sync
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Return the project structure after creation
        try {
          logger.detail("🔍 Detecting project structure after init...", true);
          const structure = await this.projectDetector.detectProjectStructure();
          logger.success(
            "Project setup completed, continuing with component installation..."
          );
          return structure;
        } catch (structureError) {
          logger.error(
            "Failed to detect project structure after initialization"
          );
          logger.detail(
            structureError instanceof Error
              ? structureError.message
              : "Unknown error detecting project structure"
          );
          logger.info(
            "Please run the command again or check your project setup"
          );
          return null;
        }
      }

      // Check if it's a React project
      if (!(await this.projectDetector.hasReact())) {
        spinner.stop();
        logger.showReactRequirements();
        return null;
      }

      // Validate complete project structure
      const validation = await this.projectDetector.validateProject();

      if (!validation.isValid) {
        spinner.stop();
        logger.showValidationErrors(validation.errors, validation.warnings);
        return null;
      }

      // Get project structure
      const structure = await this.projectDetector.detectProjectStructure();

      // Show detected project info in success message
      const projectType = structure.isNextJs
        ? "Next.js"
        : structure.isVite
        ? "Vite"
        : structure.isCRA
        ? "Create React App"
        : "Unknown";

      spinner.succeed(
        `${projectType} project detected${
          structure.hasTypeScript ? " with TypeScript" : ""
        } (${structure.packageManager})`
      );

      // Show warnings if any
      if (validation.warnings.length > 0) {
        logger.showValidationErrors([], validation.warnings);
      }

      return structure;
    } catch (error) {
      spinner.fail("Project validation failed");
      logger.error(
        error instanceof Error ? error.message : "Unknown validation error"
      );
      return null;
    }
  }

  /**
   * Step 3: Check component availability
   */
  private async validateComponentAvailability(
    componentName: string
  ): Promise<ComponentInfo | null> {
    const spinner = ora("Checking component availability...").start();

    try {
      // Check registry connection
      const registryInfo = await this.registry.getRegistryInfo();

      if (!registryInfo.isConnected) {
        spinner.fail("Registry connection failed");
        logger.error(`Cannot connect to registry: ${registryInfo.url}`);
        if (this.options.dev) {
          logger.detail(
            "Make sure your local registry server is running on localhost:3000"
          );
        }
        if (registryInfo.error) {
          logger.detail(registryInfo.error);
        }
        return null;
      }

      // Fetch component
      const componentInfo = await this.registry.fetchComponent(componentName);

      if (!componentInfo) {
        spinner.fail("Component not found");
        logger.error(`Component "${componentName}" not found in registry`);

        // Suggest similar components
        await this.suggestSimilarComponents(componentName);
        return null;
      }

      spinner.succeed(`Component "${componentInfo.title}" found`);
      logger.detail(componentInfo.description);

      return componentInfo;
    } catch (error) {
      spinner.fail("Component check failed");
      throw error;
    }
  }

  /**
   * Step 4: Detect Polkadot API setup
   */
  private async detectPolkadotSetup(
    componentInfo: ComponentInfo
  ): Promise<PolkadotApiConfig> {
    const spinner = ora("Detecting Polkadot API setup...").start();

    try {
      const polkadotConfig = await this.polkadotDetector.getPolkadotApiConfig();

      // Check if component requires Polkadot API
      const requiresPolkadot = this.requiresPolkadotApi(componentInfo);

      logger.detail(
        `Component requiresPolkadotApi: ${componentInfo.requiresPolkadotApi}`
      );
      logger.detail(
        `Component dependencies: ${JSON.stringify(componentInfo.dependencies)}`
      );
      logger.detail(`requiresPolkadot final: ${requiresPolkadot}`);

      if (!requiresPolkadot) {
        spinner.succeed("No Polkadot API setup required");
        return polkadotConfig;
      }

      // Component requires Polkadot API - check current setup
      const library = await this.polkadotDetector.detectPolkadotLibrary();

      if (library === "none") {
        spinner.succeed("Polkadot API setup will be configured");
        logger.info(
          "This component requires Polkadot API - it will be set up automatically"
        );
      } else if (library === "papi") {
        if (polkadotConfig.hasExistingConfig) {
          spinner.succeed(
            `Polkadot API (papi) detected with ${polkadotConfig.existingChains.length} chains`
          );
          logger.detail(
            `Existing chains: ${polkadotConfig.existingChains.join(", ")}`
          );
        } else {
          spinner.succeed(
            "Polkadot API (papi) detected - configuration will be added"
          );
        }
      } else if (library === "dedot") {
        spinner.succeed("Dedot detected - will use existing setup");
      }

      return polkadotConfig;
    } catch (error) {
      spinner.fail("Polkadot detection failed");
      throw error;
    }
  }

  /**
   * Step 5: Install component
   */
  private async installComponent(
    componentInfo: ComponentInfo,
    projectStructure: ProjectStructure,
    polkadotConfig: PolkadotApiConfig
  ): Promise<void> {
    // Install component using shadcn CLI (handles component files and registryDependencies automatically)
    await this.installComponentWithShadcn(componentInfo.name);

    // Debug component info
    logger.detail(`=== COMPONENT DEBUG INFO ===`);
    logger.detail(`Component name: ${componentInfo.name}`);
    logger.detail(`Component type: ${componentInfo.type}`);
    logger.detail(`Component title: ${componentInfo.title}`);
    logger.detail(
      `Component dependencies: ${JSON.stringify(componentInfo.dependencies)}`
    );
    logger.detail(
      `Component requiresPolkadotApi: ${componentInfo.requiresPolkadotApi}`
    );
    logger.detail(
      `Component registryDependencies: ${JSON.stringify(
        componentInfo.registryDependencies
      )}`
    );

    // Check if component requires Polkadot API
    const requiresPolkadot = this.requiresPolkadotApi(componentInfo);

    logger.detail(`requiresPolkadot final: ${requiresPolkadot}`);
    logger.detail(`=== END COMPONENT DEBUG ===`);

    // Setup Polkadot API if needed (shadcn already installed dependencies)
    if (requiresPolkadot) {
      logger.info(`Component requires Polkadot API setup`);
      logger.detail("Dependencies already installed by shadcn");

      // Setup Polkadot API
      await this.setupPolkadotApi(
        componentInfo,
        projectStructure,
        polkadotConfig
      );
    } else {
      logger.info("Component does not require Polkadot API setup");
      logger.detail(
        `Reason: No polkadot-api dependency found and requiresPolkadotApi flag is false`
      );
    }
  }

  /**
   * Install component using shadcn CLI
   */
  private async installComponentWithShadcn(
    componentName: string
  ): Promise<void> {
    const spinner = ora("Installing component with shadcn...").start();

    try {
      // Check if shadcn is initialized (components.json exists)
      const fs = await import("fs/promises");
      const componentsJsonExists = await fs
        .access("components.json")
        .then(() => true)
        .catch(() => false);

      if (!componentsJsonExists) {
        spinner.text = "Initializing shadcn/ui...";
        await this.initializeShadcn();
      }

      // Determine shadcn version based on Tailwind version
      const tailwindVersion = await this.projectDetector.getTailwindVersion();
      const shadcnVersion =
        tailwindVersion === 4 ? "shadcn@canary" : "shadcn@latest";

      // Build component URL
      const registryInfo = await this.registry.getRegistryInfo();
      const componentUrl = `${registryInfo.url}/r/${componentName}.json`;

      // Get package manager runner command
      const runCommand =
        await this.projectDetector.getPackageManagerRunCommand();

      logger.detail(`Using ${shadcnVersion} to install from ${componentUrl}`);

      // Stop spinner before interactive prompts
      spinner.stop();

      logger.info(
        `Running: ${runCommand} ${shadcnVersion} add ${componentUrl}`
      );

      // Parse the run command to get the executable and args
      const [executable, ...baseArgs] = runCommand.split(" ");
      const shadcnArgs = [shadcnVersion, "add", componentUrl];

      // Add --yes flag if specified
      if (this.options.yes) {
        shadcnArgs.push("--yes");
      }

      await execa(executable, [...baseArgs, ...shadcnArgs], {
        stdio: "inherit",
      });

      logger.success("Component installed successfully");
    } catch (error) {
      logger.error("Failed to install component with shadcn");
      throw new Error(
        `Failed to install component: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Initialize shadcn/ui in the current project
   */
  private async initializeShadcn(): Promise<void> {
    try {
      // Get package manager run command
      const runCommand =
        await this.projectDetector.getPackageManagerRunCommand();
      const [executable, ...baseArgs] = runCommand.split(" ");

      // Determine shadcn version based on Tailwind version
      const tailwindVersion = await this.projectDetector.getTailwindVersion();
      const shadcnVersion =
        tailwindVersion === 4 ? "shadcn@canary" : "shadcn@latest";

      const shadcnArgs = [shadcnVersion, "init"];

      // Add explicit defaults when using --yes flag
      if (this.options.yes) {
        shadcnArgs.push("--yes");
        shadcnArgs.push("--base-color", "neutral");
        shadcnArgs.push("--css-variables");
        // For add command, we need to detect if src directory is used
        const projectStructure =
          await this.projectDetector.detectProjectStructure();
        if (projectStructure.srcDir && projectStructure.srcDir !== ".") {
          shadcnArgs.push("--src-dir");
        } else {
          shadcnArgs.push("--no-src-dir");
        }
      }

      await execa(executable, [...baseArgs, ...shadcnArgs], {
        stdio: "inherit",
      });

      logger.success("shadcn/ui initialized successfully");
    } catch (error) {
      logger.warning("Failed to initialize shadcn/ui");
      logger.warning("You may need to run 'npx shadcn@canary init' manually");
      throw error;
    }
  }

  /**
   * Install Polkadot API dependencies
   */
  private async installPolkadotDependencies(): Promise<void> {
    const spinner = ora("Installing Polkadot API dependencies...").start();

    try {
      // Get package manager install command
      const installCommand =
        await this.projectDetector.getPackageManagerInstallCommand();
      const command = `${installCommand} polkadot-api`;

      logger.info(`Running: ${command}`);
      await execa.command(command, {
        stdio: "inherit",
      });

      spinner.succeed("Polkadot API dependencies installed");
    } catch (error) {
      spinner.fail("Failed to install Polkadot API dependencies");
      throw new Error(
        `Failed to install Polkadot dependencies: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Setup Polkadot API configuration
   */
  private async setupPolkadotApi(
    componentInfo: ComponentInfo,
    projectStructure: ProjectStructure,
    polkadotConfig: PolkadotApiConfig
  ): Promise<void> {
    logger.info("Setting up Polkadot API...");

    try {
      // Determine required chains based on dev/prod mode
      const defaultChains = this.options.dev
        ? ["paseo_asset_hub", "paseo"]
        : ["polkadot"];

      logger.detail(`Required chains: ${defaultChains.join(", ")}`);

      // Simple approach: always install required chains (papi handles duplicates gracefully)
      await this.installMissingChains(defaultChains);

      logger.success("Polkadot API configured");
    } catch (error) {
      logger.error("Polkadot API setup failed");
      throw new Error(
        `Failed to setup Polkadot API: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Check if component requires Polkadot API setup
   */
  private requiresPolkadotApi(componentInfo: ComponentInfo): boolean {
    const hasPolkadotDependency =
      componentInfo.dependencies?.includes("polkadot-api") || false;
    const requiresPolkadotFromFlag = Boolean(componentInfo.requiresPolkadotApi);
    return requiresPolkadotFromFlag || hasPolkadotDependency;
  }

  /**
   * Install missing papi chains and generate types
   */
  private async installMissingChains(chains: string[]): Promise<void> {
    const chainDisplayName =
      chains.length > 1 ? `${chains.length} chains` : chains[0];
    const spinner = ora(`Adding ${chainDisplayName} metadata...`).start();

    try {
      // Add each chain with increased memory limit
      for (const chain of chains) {
        spinner.text = `Adding ${chain} metadata...`;
        try {
          // Use local papi binary (installed via polkadot-api package)
          await execa("node_modules/.bin/papi", ["add", chain, "-n", chain], {
            stdio: "pipe", // Use pipe to avoid interaction issues
            env: {
              ...process.env,
              NODE_OPTIONS: "--max-old-space-size=8192", // Increase memory limit to 8GB
            },
          });
        } catch (chainError) {
          // Check if it's a memory error
          const errorMessage =
            chainError instanceof Error
              ? chainError.message
              : String(chainError);
          if (
            errorMessage.includes("out of memory") ||
            errorMessage.includes("JS heap out of memory")
          ) {
            spinner.fail(`Failed to install ${chain} - insufficient memory`);
            logger.warning(
              `Memory limit exceeded while processing ${chain} metadata`
            );
            logger.info("Try one of these solutions:");
            logger.detail("1. Increase your system memory", true);
            logger.detail("2. Use a smaller chain set", true);
            logger.detail("3. Install chains manually one by one", true);
            logger.newline();
            logger.info("Manual installation command:");
            logger.code(
              `NODE_OPTIONS="--max-old-space-size=8192" node_modules/.bin/papi add ${chain} -n ${chain}`
            );
            throw new Error(`Memory limit exceeded for chain ${chain}`);
          }
          throw chainError;
        }
      }

      spinner.text = "Generating Polkadot API types...";

      // Generate types for all chains with increased memory
      await execa("node_modules/.bin/papi", [], {
        stdio: "pipe", // Use pipe to avoid interaction issues
        env: {
          ...process.env,
          NODE_OPTIONS: "--max-old-space-size=8192", // Increase memory limit to 8GB
        },
      });

      spinner.succeed(`${chainDisplayName} metadata and types generated`);
    } catch (error) {
      spinner.fail("Failed to install chains");
      logger.error(
        `papi error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw new Error(
        `Failed to install papi chains: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Show completion message and next steps
   */
  private showCompletionMessage(
    componentInfo: ComponentInfo,
    polkadotConfig: PolkadotApiConfig
  ): void {
    const formattedName = formatComponentName(componentInfo.name);
    const hasPolkadotSetup = this.requiresPolkadotApi(componentInfo);

    logger.showNextSteps(formattedName, hasPolkadotSetup);
  }

  /**
   * Suggest similar components when component not found
   */
  private async suggestSimilarComponents(componentName: string): Promise<void> {
    try {
      const similarComponents = await this.registry.searchComponents(
        componentName
      );

      if (similarComponents.length > 0) {
        logger.info("Did you mean one of these?");
        similarComponents.slice(0, 3).forEach((component) => {
          logger.detail(`• ${component.name} - ${component.description}`);
        });
      } else {
        logger.info("To see all available components, run: dot-ui list");
      }
    } catch {
      // Ignore errors in suggestions
    }
  }
}
