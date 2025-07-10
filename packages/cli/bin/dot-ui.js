#!/usr/bin/env node

const { Command } = require("commander");
const chalk = require("chalk");
const ora = require("ora");
const execa = require("execa");
const fs = require("fs").promises;
const path = require("path");

const program = new Command();

// Registry URL based on environment
let REGISTRY_URL = "https://polkadot-ui-registry.vercel.app";

// Utility functions for consistent output formatting
function info(message) {
  console.log(`${chalk.blue("ℹ")} ${chalk.white(message)}`);
}

function detail(message) {
  console.log(`${chalk.gray("i")} ${chalk.gray(message)}`);
}

function success(message) {
  console.log(`${chalk.green("✔")} ${chalk.white(message)}`);
}

function error(message) {
  console.log(`${chalk.red("✗")} ${chalk.white(message)}`);
}

function finalSuccess(message) {
  console.log(`${chalk.green("✔")} ${chalk.white(message)}`);
}

// Check if project uses Tailwind
async function getTailwindVersion() {
  const packageJson = JSON.parse(await fs.readFile("package.json", "utf-8"));
  const tailwindVersion =
    packageJson.dependencies?.tailwindcss ||
    packageJson.devDependencies?.tailwindcss;

  if (!tailwindVersion) {
    throw new Error("Tailwind CSS not found in package.json");
  }

  if (tailwindVersion && tailwindVersion.includes("4")) {
    return 4;
  }
  return 3;
}

// Detect project type and structure
async function detectProjectStructure() {
  try {
    // Check if package.json exists
    let packageJson;
    try {
      packageJson = JSON.parse(await fs.readFile("package.json", "utf-8"));
    } catch (error) {
      if (error.code === "ENOENT") {
        // package.json doesn't exist - provide helpful guidance
        console.log(
          chalk.red("\n✖ No package.json found in current directory")
        );
        console.log(
          chalk.cyan("\nTo use dot-ui, you need a React or Next.js project.")
        );
        console.log(chalk.cyan("Here's how to create one:\n"));

        console.log(
          chalk.yellow("📦 Create a new Next.js project (recommended):")
        );
        console.log(chalk.gray("  npx create-next-app@latest my-polkadot-app"));
        console.log(chalk.gray("  cd my-polkadot-app\n"));

        console.log(chalk.yellow("📦 Or create a new Vite + React project:"));
        console.log(
          chalk.gray(
            "  npm create vite@latest my-polkadot-app -- --template react-ts"
          )
        );
        console.log(chalk.gray("  cd my-polkadot-app"));
        console.log(chalk.gray("  npm install\n"));

        console.log(
          chalk.yellow("📦 Or create a new Create React App project:")
        );
        console.log(
          chalk.gray(
            "  npx create-react-app my-polkadot-app --template typescript"
          )
        );
        console.log(chalk.gray("  cd my-polkadot-app\n"));

        console.log(
          chalk.cyan(
            "Then run polkadot-ui commands from inside your project directory."
          )
        );

        throw new Error("No React/Next.js project found");
      }
      throw error;
    }

    // Check if it's a React project
    const hasReact =
      packageJson.dependencies?.react || packageJson.devDependencies?.react;
    if (!hasReact) {
      console.log(chalk.red("\n✖ This doesn't appear to be a React project"));
      console.log(chalk.cyan("\ndot-ui requires a React-based project."));
      console.log(chalk.cyan("Supported frameworks:"));
      console.log(chalk.gray("  • Next.js"));
      console.log(chalk.gray("  • Vite + React"));
      console.log(chalk.gray("  • Create React App\n"));

      console.log(chalk.yellow("To create a new React project:"));
      console.log(chalk.gray("  npx create-next-app@latest my-polkadot-app"));
      console.log(chalk.gray("  cd my-polkadot-app"));
      console.log(chalk.gray("  dot-ui add <component-name>\n"));

      throw new Error("Not a React project");
    }

    // Detect project type
    const isNextJs =
      packageJson.dependencies?.next || packageJson.devDependencies?.next;
    const isVite =
      packageJson.devDependencies?.vite || packageJson.dependencies?.vite;
    const isCRA = packageJson.dependencies?.["react-scripts"];

    // Determine component directory
    let componentDir = "components";
    let srcDir = "";

    if (isVite || isCRA) {
      // Vite and CRA typically use src/ directory
      srcDir = "src";
      componentDir = "src/components";

      // Check if src directory exists
      try {
        await fs.access("src");
      } catch {
        throw new Error(
          "src/ directory not found. Please ensure this is a properly set up React project."
        );
      }
    }

    return {
      isNextJs: !!isNextJs,
      isVite: !!isVite,
      isCRA: !!isCRA,
      srcDir,
      componentDir,
      hookDir: srcDir ? `${srcDir}/hooks` : "hooks",
      providerDir: srcDir ? `${srcDir}/providers` : "providers",
      registryDir: "registry/polkadot-ui", // For registry template structure
      hasTypeScript: !!(
        packageJson.devDependencies?.typescript ||
        packageJson.dependencies?.typescript
      ),
    };
  } catch (error) {
    throw new Error(`Project validation failed: ${error.message}`);
  }
}

async function validateProject() {
  const spinner = ora("Validating project structure...").start();

  try {
    const structure = await detectProjectStructure();
    spinner.succeed("Project structure validated");
    return structure;
  } catch (error) {
    spinner.stop(); // Stop spinner without showing failure message

    // Don't repeat the error message if we already provided helpful guidance
    if (
      !error.message.includes("No React/Next.js project found") &&
      !error.message.includes("Not a React project")
    ) {
      console.log(chalk.red(`\n✖ ${error.message}`));
    }

    process.exit(1);
  }
}

// Check existing papi configuration
async function checkExistingPapiConfig() {
  try {
    const configPath = ".papi/polkadot-api.json";
    await fs.access(configPath);
    const config = JSON.parse(await fs.readFile(configPath, "utf-8"));
    const existingChains = Object.keys(config.entries || {});
    return existingChains.length > 0 ? existingChains : null;
  } catch {
    return null;
  }
}

async function updatePolkadotConfig(chainName, structure) {
  try {
    const configPath = "polkadot-config.ts"; // Config file is installed at project root
    const configExists = await fs
      .access(configPath)
      .then(() => true)
      .catch(() => false);

    if (!configExists) {
      console.log(chalk.yellow("⚠ Polkadot config not found, skipping update"));
      return;
    }

    let content = await fs.readFile(configPath, "utf-8");

    // Check if the chain is already imported
    const importRegex = new RegExp(
      `import.*${chainName}.*from.*@polkadot-api/descriptors`
    );
    if (importRegex.test(content)) {
      console.log(chalk.gray(`Chain ${chainName} already imported`));
      return;
    }

    // Add the import for the new chain
    const descriptorImportRegex =
      /import { ([^}]+) } from "@polkadot-api\/descriptors";/;
    if (descriptorImportRegex.test(content)) {
      content = content.replace(descriptorImportRegex, (match, imports) => {
        const importList = imports.split(",").map((imp) => imp.trim());
        if (!importList.includes(chainName)) {
          importList.push(chainName);
        }
        return `import { ${importList.join(
          ", "
        )} } from "@polkadot-api/descriptors";`;
      });
    }

    // Add the chain configuration if it doesn't exist
    const chainConfigRegex = new RegExp(`${chainName}:\\s*{`);
    if (!chainConfigRegex.test(content)) {
      // Find the chains object and add the new chain
      const chainsRegex = /(chains:\s*{\s*)/;
      if (chainsRegex.test(content)) {
        const isTestnet =
          chainName.includes("testnet") ||
          chainName.includes("paseo") ||
          chainName.includes("rococo") ||
          chainName.includes("westend");
        const displayName = chainName
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

        // Get default endpoint for common chains
        const endpoints = {
          polkadot: "wss://polkadot-rpc.publicnode.com",
          kusama: "wss://kusama-rpc.polkadot.io",
          westend: "wss://westend-rpc.polkadot.io",
          rococo: "wss://rococo-rpc.polkadot.io",
          asset_hub_polkadot: "wss://polkadot-asset-hub-rpc.polkadot.io",
          asset_hub_kusama: "wss://kusama-asset-hub-rpc.polkadot.io",
          paseo_asset_hub: "wss://sys.ibp.network/asset-hub-paseo",
          paseo: "wss://sys.ibp.network/paseo",
        };

        const endpoint =
          endpoints[chainName] || `wss://${chainName}.polkadot.io`;

        const chainConfig = `    ${chainName}: {
      descriptor: ${chainName},
      endpoint: "${endpoint}",
      displayName: "${displayName}",
      isTestnet: ${isTestnet},
    },`;

        content = content.replace(chainsRegex, `$1${chainConfig}\n`);
      }
    }

    await fs.writeFile(configPath, content);
    console.log(
      chalk.green(`✔ Updated Polkadot config with "${chainName}" chain`)
    );
  } catch (error) {
    console.error(chalk.yellow(`⚠ Failed to update config: ${error.message}`));
  }
}

// Parse polkadot-config.ts to extract referenced chains
async function parseConfigChains() {
  try {
    const configPath = "polkadot-config.ts";
    const configExists = await fs
      .access(configPath)
      .then(() => true)
      .catch(() => false);

    if (!configExists) {
      return [];
    }

    const content = await fs.readFile(configPath, "utf-8");

    // Extract chains from the import statement
    const importMatch = content.match(
      /import\s*{\s*([^}]+)\s*}\s*from\s*["']@polkadot-api\/descriptors["']/
    );
    if (importMatch) {
      return importMatch[1]
        .split(",")
        .map((chain) => chain.trim())
        .filter((chain) => chain.length > 0);
    }

    return [];
  } catch (error) {
    console.error(chalk.yellow(`⚠ Failed to parse config: ${error.message}`));
    return [];
  }
}

async function installMissingChains(chains) {
  const chainDisplayName =
    chains.length > 1 ? `${chains.length} chains` : chains[0];
  const spinner = ora(`Adding ${chainDisplayName} metadata...`).start();

  try {
    // Add each chain
    for (const chain of chains) {
      spinner.text = `Adding ${chain} metadata...`;
      await execa("pnpm", ["papi", "add", chain, "-n", chain], {
        stdio: "pipe",
      });
    }

    spinner.text = "Generating Polkadot API types...";

    // Generate types for all chains
    await execa("pnpm", ["papi"], {
      stdio: "pipe",
    });

    spinner.succeed(`${chainDisplayName} metadata and types generated`);
  } catch (error) {
    spinner.fail("Failed to install chains");
    console.error(chalk.red("Error:"), error.message);
    throw error;
  }
}

// Setup polkadot-api with proper chain detection
async function setupPolkadotApi(componentInfo, structure) {
  console.log(chalk.white("Setting up Polkadot API..."));

  // First, check what chains are referenced in existing config
  const configChains = await parseConfigChains();
  const existingPapiChains = await checkExistingPapiConfig();

  // Determine what chains we need
  const defaultChains = ["paseo_asset_hub", "paseo"];
  const requiredChains = [...new Set([...configChains, ...defaultChains])]; // Remove duplicates

  detail(`Required chains: ${requiredChains.join(", ")}`);

  if (existingPapiChains && existingPapiChains.length > 0) {
    success(`Found existing Polkadot chains: ${existingPapiChains.join(", ")}`);

    // Check if we need to add any missing chains
    const missingChains = requiredChains.filter(
      (chain) => !existingPapiChains.includes(chain)
    );

    if (missingChains.length > 0) {
      detail(`Installing chains: ${missingChains.join(", ")}`);
      await installMissingChains(missingChains);
    } else {
      success("All required chains are already installed");
    }

    return true;
  }

  // No existing setup, install all required chains
  detail(`Installing chains: ${requiredChains.join(", ")}`);
  await installMissingChains(requiredChains);
}

async function installComponent(componentName) {
  info(`Installing ${componentName} component...`);

  try {
    // Validate project structure
    const structure = await validateProject();

    // Get component info from registry
    const componentUrl = `${REGISTRY_URL}/r/${componentName}.json`;

    // Determine shadcn command based on Tailwind version
    const tailwindVersion = await getTailwindVersion();
    const shadcnCmd = "shadcn@canary";

    detail(`Detected Tailwind CSS v${tailwindVersion}`);

    // Install component with shadcn
    const spinner = ora("Installing component with shadcn...").start();

    try {
      spinner.stop(); // Stop spinner before interactive prompts
      await execa("npx", [shadcnCmd, "add", componentUrl], {
        stdio: "inherit", // Show shadcn prompts for user interaction
      });
      success("Component installed successfully");
    } catch (error) {
      error("Failed to install component with shadcn");
      throw error;
    }

    // Check if this is a Polkadot component
    const needsSetup = await needsPolkadotSetup(componentName);
    if (needsSetup) {
      await setupPolkadotApi(null, structure);
    }

    finalSuccess(
      `${componentName} component installed successfully${
        needsSetup ? " with Polkadot API setup" : ""
      }!`
    );

    if (needsSetup) {
      console.log(chalk.white("\nNext steps:"));
      console.log(chalk.white("1. Wrap your app with the PolkadotProvider:"));
      console.log(
        chalk.white("   // In your app/layout.tsx or pages/_app.tsx")
      );
      console.log(
        chalk.white(
          "   import { PolkadotProvider } from '@/providers/polkadot-provider';"
        )
      );
      console.log(
        chalk.white("   <PolkadotProvider>{children}</PolkadotProvider>")
      );
      console.log(chalk.white(""));
      console.log(
        chalk.white("2. Import and use the component in your pages:")
      );
      console.log(
        chalk.white(
          `   import { ${componentName
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join("")} } from '@/components/${componentName}';`
        )
      );
    } else {
      console.log(chalk.white("\nNext steps:"));
      console.log(
        chalk.white("1. Import and use the component in your pages:")
      );
      console.log(
        chalk.white(
          `   import { ${componentName
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join("")} } from '@/components/${componentName}';`
        )
      );
    }
  } catch (error) {
    // Error handling is done in validateProject(), just exit
    if (
      !error.message.includes("No React/Next.js project found") &&
      !error.message.includes("Not a React project")
    ) {
      console.error(chalk.red("Failed to install component:"), error.message);
    }
    process.exit(1);
  }
}

async function needsPolkadotSetup(componentName) {
  try {
    const response = await fetch(`${REGISTRY_URL}/r/${componentName}.json`);
    if (!response.ok) return false;

    const registry = await response.json();
    // Check if it requires polkadot-api or has polkadot-api in dependencies
    return (
      registry.requiresPolkadotApi === true ||
      registry.dependencies?.includes("polkadot-api")
    );
  } catch {
    return false;
  }
}

async function listComponents() {
  const spinner = ora("Fetching available components...").start();

  try {
    const response = await fetch(`${REGISTRY_URL}/registry.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch registry: ${response.statusText}`);
    }

    const registry = await response.json();
    spinner.succeed("Components loaded");

    console.log(chalk.green("\nAvailable Polkadot UI Components:\n"));

    // Handle the actual registry format with items array
    const items = registry.items || [];

    if (items.length === 0) {
      console.log(chalk.yellow("No components found in registry."));
      return;
    }

    // Group items by type or show all
    const polkadotComponents = items.filter((item) => item.requiresPolkadotApi);
    const regularComponents = items.filter((item) => !item.requiresPolkadotApi);

    if (polkadotComponents.length > 0) {
      console.log(chalk.cyan("Polkadot Components:"));
      polkadotComponents.forEach((item) => {
        const description = item.description || "No description available";
        console.log(chalk.gray(`  * ${item.name} - ${description}`));
      });
      console.log();
    }

    if (regularComponents.length > 0) {
      console.log(chalk.cyan("Other Components:"));
      regularComponents.forEach((item) => {
        const description = item.description || "No description available";
        console.log(chalk.gray(`  * ${item.name} - ${description}`));
      });
      console.log();
    }

    console.log(chalk.yellow("Usage:"));
    console.log(chalk.gray("  dot-ui add <component-name>"));
    console.log(
      chalk.gray(
        "  dot-ui add <component-name> --dev  # Use localhost registry"
      )
    );
  } catch (error) {
    spinner.fail("Failed to fetch components");
    console.error(chalk.red("Error:"), error.message);
    process.exit(1);
  }
}

// Set up CLI commands
program
  .name("dot-ui")
  .description(
    "CLI for installing Polkadot UI components with automatic API setup"
  )
  .version("0.1.0");

program
  .command("list")
  .description("List all available components")
  .option("--dev", "Use local development registry")
  .action((options) => {
    if (options.dev) {
      REGISTRY_URL = "http://localhost:3000";
      info("Using development registry at localhost:3000");
    }
    listComponents();
  });

program
  .command("add")
  .description("Add a component to your project")
  .argument("<component>", "Component name to install")
  .option("--dev", "Use local development registry")
  .action((component, options) => {
    if (options.dev) {
      REGISTRY_URL = "http://localhost:3000";
      info("Using development registry at localhost:3000");
    }
    installComponent(component);
  });

program.parse();
