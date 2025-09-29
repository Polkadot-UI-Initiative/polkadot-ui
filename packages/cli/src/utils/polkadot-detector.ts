import fs from "fs/promises";
import path from "path";
import {
  PolkadotApiConfig,
  PolkadotLibrary,
  PackageJson,
} from "../types/index.js";

export class PolkadotDetector {
  private cwd: string;
  private _packageJsonCache: PackageJson | null | undefined = undefined;

  constructor(cwd: string = process.cwd()) {
    this.cwd = cwd;
  }

  /**
   * Clear the package.json cache (useful for testing)
   */
  clearCache(): void {
    this._packageJsonCache = undefined;
  }

  /**
   * Read and parse package.json (cached)
   */
  private async getPackageJson(): Promise<PackageJson | null> {
    if (this._packageJsonCache !== undefined) {
      return this._packageJsonCache;
    }

    try {
      const packageJsonPath = path.join(this.cwd, "package.json");
      const content = await fs.readFile(packageJsonPath, "utf-8");
      this._packageJsonCache = JSON.parse(content);
      return this._packageJsonCache!; // We know it's not undefined here
    } catch {
      this._packageJsonCache = null;
      return null;
    }
  }

  /**
   * Check if polkadot-api (papi) is installed
   */
  async hasPapi(): Promise<boolean> {
    const packageJson = await this.getPackageJson();
    if (!packageJson) return false;

    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    return Boolean(deps["polkadot-api"]) || Boolean(deps["@reactive-dot/core"]);
  }

  /**
   * Check if dedot is installed
   */
  async hasDedot(): Promise<boolean> {
    const packageJson = await this.getPackageJson();
    if (!packageJson) return false;

    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    return Boolean(deps["dedot"]) || Boolean(deps["typink"]);
  }

  /**
   * Detect which Polkadot library is being used
   */
  async detectPolkadotLibrary(): Promise<PolkadotLibrary> {
    const hasPapi = await this.hasPapi();
    const hasDedot = await this.hasDedot();

    if (hasPapi) return "papi";
    if (hasDedot) return "dedot";
    return "none";
  }

  /**
   * Check if .papi directory exists
   */
  async hasPapiConfig(): Promise<boolean> {
    try {
      const papiPath = path.join(this.cwd, ".papi");
      const stat = await fs.stat(papiPath);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * Get existing papi configuration
   */
  async getPapiConfig(): Promise<{ chains: string[] } | null> {
    try {
      const configPath = path.join(this.cwd, ".papi", "polkadot-api.json");
      const content = await fs.readFile(configPath, "utf-8");
      const config = JSON.parse(content);

      const chains = Object.keys(config.entries || {});
      return { chains };
    } catch {
      return null;
    }
  }

  /**
   * Check if polkadot-config.ts exists
   */
  async hasPolkadotConfig(): Promise<boolean> {
    try {
      await fs.access(path.join(this.cwd, "polkadot-config.ts"));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if @polkadot-api/descriptors is installed
   */
  async hasDescriptors(): Promise<boolean> {
    const packageJson = await this.getPackageJson();
    if (!packageJson) return false;

    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    return Boolean(deps["@polkadot-api/descriptors"]);
  }

  /**
   * Check if @dedot/chaintypes is installed
   */
  async hasChainTypes(): Promise<boolean> {
    const packageJson = await this.getPackageJson();
    if (!packageJson) return false;

    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    return Boolean(deps["@dedot/chaintypes"]);
  }

  /**
   * Get comprehensive Polkadot API configuration status
   */
  async getPolkadotApiConfig(): Promise<PolkadotApiConfig> {
    const hasPapi = await this.hasPapi();
    const hasDedot = await this.hasDedot();
    const hasConfig = await this.hasPapiConfig();

    let existingChains: string[] = [];

    if (hasConfig) {
      const config = await this.getPapiConfig();
      existingChains = config?.chains || [];
    }

    return {
      hasExistingConfig: hasConfig,
      existingChains,
      hasPapi,
      hasDedot,
    };
  }

  /**
   * Check if the project needs Polkadot API setup for a component
   */
  async needsPolkadotSetup(): Promise<boolean> {
    const library = await this.detectPolkadotLibrary();

    // If no Polkadot library is installed, setup is needed
    if (library === "none") return true;

    // If using papi, check if proper configuration exists
    if (library === "papi") {
      const hasConfig = await this.hasPapiConfig();
      const hasDescriptors = await this.hasDescriptors();
      return !hasConfig || !hasDescriptors;
    }

    // For dedot, basic installation is sufficient for now
    return false;
  }

  /**
   * Get recommended setup steps based on current configuration
   */
  async getRecommendedSetup(): Promise<{
    needsInstall: boolean;
    needsConfig: boolean;
    recommendedLibrary: PolkadotLibrary;
    existingLibrary: PolkadotLibrary;
  }> {
    const existingLibrary = await this.detectPolkadotLibrary();
    const needsSetup = await this.needsPolkadotSetup();

    if (!needsSetup) {
      return {
        needsInstall: false,
        needsConfig: false,
        recommendedLibrary: "none",
        existingLibrary,
      };
    }

    // If no library is installed, recommend papi
    if (existingLibrary === "none") {
      return {
        needsInstall: true,
        needsConfig: true,
        recommendedLibrary: "papi",
        existingLibrary,
      };
    }

    // If papi is installed but not configured
    if (existingLibrary === "papi") {
      const hasConfig = await this.hasPapiConfig();
      const hasDescriptors = await this.hasDescriptors();

      return {
        needsInstall: !hasDescriptors,
        needsConfig: !hasConfig,
        recommendedLibrary: "papi",
        existingLibrary,
      };
    }

    // If dedot is installed, use it (minimal setup needed)
    return {
      needsInstall: false,
      needsConfig: false,
      recommendedLibrary: "dedot",
      existingLibrary,
    };
  }

  /**
   * Prompt user to select a Polkadot library when none is detected
   */
  async promptForLibrarySelection(
    options: {
      skipPrompt?: boolean;
      defaultLibrary?: "papi" | "dedot";
    } = {}
  ): Promise<"papi" | "dedot"> {
    const { skipPrompt = false, defaultLibrary = "papi" } = options;

    // If skipPrompt is true (e.g., --yes flag), return default
    if (skipPrompt) {
      return defaultLibrary;
    }

    const inquirer = await import("inquirer");
    const { polkadotLibrary } = await inquirer.default.prompt([
      {
        type: "list",
        name: "polkadotLibrary",
        message: "Which Polkadot API library would you like to use?",
        choices: [
          {
            name: "Polkadot API (papi)",
            value: "papi",
          },
          {
            name: "Dedot",
            value: "dedot",
          },
        ],
        default: defaultLibrary,
      },
    ]);

    return polkadotLibrary;
  }
}
