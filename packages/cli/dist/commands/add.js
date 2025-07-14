import ora from "ora";
import execa from "execa";
import { ProjectDetector } from "../utils/project-detector.js";
import { PolkadotDetector } from "../utils/polkadot-detector.js";
import { Registry, isValidComponentName, formatComponentName, } from "../utils/registry.js";
import { logger } from "../utils/logger.js";
export class AddCommand {
    options;
    registry;
    projectDetector;
    polkadotDetector;
    constructor(options) {
        this.options = options;
        this.registry = new Registry(options.dev);
        this.projectDetector = new ProjectDetector();
        this.polkadotDetector = new PolkadotDetector();
    }
    /**
     * Main add command execution
     */
    async execute(componentName) {
        try {
            // Step 1: Validate component name
            if (!this.validateComponentName(componentName)) {
                return;
            }
            // Step 2: Validate project setup
            const projectStructure = await this.validateProjectSetup();
            if (!projectStructure) {
                return;
            }
            // Step 3: Check component availability
            const componentInfo = await this.validateComponentAvailability(componentName);
            if (!componentInfo) {
                return;
            }
            // Step 4: Detect Polkadot API setup
            const polkadotConfig = await this.detectPolkadotSetup(componentInfo);
            // Step 5: Install component
            await this.installComponent(componentInfo, projectStructure, polkadotConfig);
            // Step 6: Show next steps
            this.showCompletionMessage(componentInfo, polkadotConfig);
        }
        catch (error) {
            logger.error(error instanceof Error ? error.message : "An unexpected error occurred");
            process.exit(1);
        }
    }
    /**
     * Step 1: Validate component name format
     */
    validateComponentName(componentName) {
        if (!componentName) {
            logger.error("Component name is required");
            logger.info("Usage: dot-ui add <component-name>");
            return false;
        }
        if (!isValidComponentName(componentName)) {
            logger.error(`Invalid component name: ${componentName}`);
            logger.info("Component names should be kebab-case (e.g., block-number, user-profile)");
            return false;
        }
        return true;
    }
    /**
     * Step 2: Validate project setup (package.json, React, framework)
     */
    async validateProjectSetup() {
        const spinner = ora("Validating project setup...").start();
        try {
            // Check if package.json exists
            if (!(await this.projectDetector.hasPackageJson())) {
                spinner.stop();
                logger.showProjectGuidance();
                return null;
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
            spinner.succeed(`${projectType} project detected${structure.hasTypeScript ? " with TypeScript" : ""}`);
            // Show warnings if any
            if (validation.warnings.length > 0) {
                logger.showValidationErrors([], validation.warnings);
            }
            return structure;
        }
        catch (error) {
            spinner.fail("Project validation failed");
            throw error;
        }
    }
    /**
     * Step 3: Check component availability
     */
    async validateComponentAvailability(componentName) {
        const spinner = ora("Checking component availability...").start();
        try {
            // Check registry connection
            const registryInfo = await this.registry.getRegistryInfo();
            if (!registryInfo.isConnected) {
                spinner.fail("Registry connection failed");
                logger.error(`Cannot connect to registry: ${registryInfo.url}`);
                if (this.options.dev) {
                    logger.detail("Make sure your local registry server is running on localhost:3000");
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
        }
        catch (error) {
            spinner.fail("Component check failed");
            throw error;
        }
    }
    /**
     * Step 4: Detect Polkadot API setup
     */
    async detectPolkadotSetup(componentInfo) {
        const spinner = ora("Detecting Polkadot API setup...").start();
        try {
            const polkadotConfig = await this.polkadotDetector.getPolkadotApiConfig();
            // Check if component requires Polkadot API
            const requiresPolkadot = Boolean(componentInfo.requiresPolkadotApi);
            logger.detail(`Component requiresPolkadotApi: ${componentInfo.requiresPolkadotApi}`);
            logger.detail(`requiresPolkadot boolean: ${requiresPolkadot}`);
            if (!requiresPolkadot) {
                spinner.succeed("No Polkadot API setup required");
                return polkadotConfig;
            }
            // Component requires Polkadot API - check current setup
            const library = await this.polkadotDetector.detectPolkadotLibrary();
            if (library === "none") {
                spinner.succeed("Polkadot API setup will be configured");
                logger.info("This component requires Polkadot API - it will be set up automatically");
            }
            else if (library === "papi") {
                if (polkadotConfig.hasExistingConfig) {
                    spinner.succeed(`Polkadot API (papi) detected with ${polkadotConfig.existingChains.length} chains`);
                    logger.detail(`Existing chains: ${polkadotConfig.existingChains.join(", ")}`);
                }
                else {
                    spinner.succeed("Polkadot API (papi) detected - configuration will be added");
                }
            }
            else if (library === "dedot") {
                spinner.succeed("Dedot detected - will use existing setup");
            }
            return polkadotConfig;
        }
        catch (error) {
            spinner.fail("Polkadot detection failed");
            throw error;
        }
    }
    /**
     * Step 5: Install component
     */
    async installComponent(componentInfo, projectStructure, polkadotConfig) {
        // Install component using shadcn CLI (handles component files and registryDependencies automatically)
        await this.installComponentWithShadcn(componentInfo.name);
        // Debug component info
        logger.detail(`=== COMPONENT DEBUG INFO ===`);
        logger.detail(`Component name: ${componentInfo.name}`);
        logger.detail(`Component type: ${componentInfo.type}`);
        logger.detail(`Component title: ${componentInfo.title}`);
        logger.detail(`Component dependencies: ${JSON.stringify(componentInfo.dependencies)}`);
        logger.detail(`Component requiresPolkadotApi: ${componentInfo.requiresPolkadotApi}`);
        logger.detail(`Component registryDependencies: ${JSON.stringify(componentInfo.registryDependencies)}`);
        // Check if component requires Polkadot API (use dependencies since requiresPolkadotApi gets stripped)
        const hasPolkadotDependency = componentInfo.dependencies?.includes("polkadot-api") || false;
        const requiresPolkadotFromFlag = Boolean(componentInfo.requiresPolkadotApi);
        const requiresPolkadot = requiresPolkadotFromFlag || hasPolkadotDependency;
        logger.detail(`hasPolkadotDependency: ${hasPolkadotDependency}`);
        logger.detail(`requiresPolkadotFromFlag: ${requiresPolkadotFromFlag}`);
        logger.detail(`requiresPolkadot final: ${requiresPolkadot}`);
        logger.detail(`=== END COMPONENT DEBUG ===`);
        // Install Polkadot API dependencies if needed
        if (requiresPolkadot) {
            logger.info(`Component requires Polkadot API setup`);
            logger.detail(`hasPapi: ${polkadotConfig.hasPapi}, hasDedot: ${polkadotConfig.hasDedot}`);
            if (!polkadotConfig.hasPapi && !polkadotConfig.hasDedot) {
                await this.installPolkadotDependencies();
            }
            else {
                logger.info("Polkadot API dependencies already installed");
            }
            // Setup Polkadot API
            await this.setupPolkadotApi(componentInfo, projectStructure, polkadotConfig);
        }
        else {
            logger.info("Component does not require Polkadot API setup");
            logger.detail(`Reason: hasPolkadotDependency=${hasPolkadotDependency}, requiresPolkadotFromFlag=${requiresPolkadotFromFlag}`);
        }
    }
    /**
     * Install component using shadcn CLI
     */
    async installComponentWithShadcn(componentName) {
        const spinner = ora("Installing component with shadcn...").start();
        try {
            // Determine shadcn version based on Tailwind version
            const tailwindVersion = await this.projectDetector.getTailwindVersion();
            const shadcnVersion = tailwindVersion === 4 ? "shadcn@canary" : "shadcn@latest";
            // Build component URL
            const registryInfo = await this.registry.getRegistryInfo();
            const componentUrl = `${registryInfo.url}/r/${componentName}.json`;
            logger.detail(`Using ${shadcnVersion} to install from ${componentUrl}`);
            // Stop spinner before interactive prompts
            spinner.stop();
            logger.info(`Running: npx ${shadcnVersion} add ${componentUrl}`);
            await execa("npx", [shadcnVersion, "add", componentUrl], {
                stdio: "inherit", // Show shadcn prompts for user interaction
            });
            logger.success("Component installed successfully");
        }
        catch (error) {
            logger.error("Failed to install component with shadcn");
            throw new Error(`Failed to install component: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    /**
     * Install Polkadot API dependencies
     */
    async installPolkadotDependencies() {
        const spinner = ora("Installing Polkadot API dependencies...").start();
        try {
            logger.info("Running: pnpm install polkadot-api @polkadot-api/descriptors");
            await execa.command("pnpm install polkadot-api @polkadot-api/descriptors", {
                stdio: "inherit",
            });
            spinner.succeed("Polkadot API dependencies installed");
        }
        catch (error) {
            spinner.fail("Failed to install Polkadot API dependencies");
            throw new Error(`Failed to install Polkadot dependencies: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    /**
     * Setup Polkadot API configuration
     */
    async setupPolkadotApi(componentInfo, projectStructure, polkadotConfig) {
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
        }
        catch (error) {
            logger.error("Polkadot API setup failed");
            throw new Error(`Failed to setup Polkadot API: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    /**
     * Install missing papi chains and generate types
     */
    async installMissingChains(chains) {
        const chainDisplayName = chains.length > 1 ? `${chains.length} chains` : chains[0];
        const spinner = ora(`Adding ${chainDisplayName} metadata...`).start();
        try {
            // Add each chain
            for (const chain of chains) {
                spinner.text = `Adding ${chain} metadata...`;
                await execa("pnpm", ["papi", "add", chain, "-n", chain], {
                    stdio: "pipe", // Use pipe to avoid interaction issues
                });
            }
            spinner.text = "Generating Polkadot API types...";
            // Generate types for all chains
            await execa("pnpm", ["papi"], {
                stdio: "pipe", // Use pipe to avoid interaction issues
            });
            spinner.succeed(`${chainDisplayName} metadata and types generated`);
        }
        catch (error) {
            spinner.fail("Failed to install chains");
            logger.error(`papi error: ${error instanceof Error ? error.message : "Unknown error"}`);
            throw new Error(`Failed to install papi chains: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    /**
     * Show completion message and next steps
     */
    showCompletionMessage(componentInfo, polkadotConfig) {
        const formattedName = formatComponentName(componentInfo.name);
        const hasPolkadotSetup = Boolean(componentInfo.requiresPolkadotApi);
        logger.showNextSteps(formattedName, hasPolkadotSetup);
    }
    /**
     * Suggest similar components when component not found
     */
    async suggestSimilarComponents(componentName) {
        try {
            const similarComponents = await this.registry.searchComponents(componentName);
            if (similarComponents.length > 0) {
                logger.info("Did you mean one of these?");
                similarComponents.slice(0, 3).forEach((component) => {
                    logger.detail(`• ${component.name} - ${component.description}`);
                });
            }
            else {
                logger.info("To see all available components, run: dot-ui list");
            }
        }
        catch {
            // Ignore errors in suggestions
        }
    }
}
