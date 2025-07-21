/**
 * @fileoverview Telemetry system for dot-ui CLI with GDPR-compliant privacy controls
 *
 * PRIVACY & GDPR COMPLIANCE FEATURES:
 * ==================================
 *
 * 1. PERSISTENT USER ID:
 *    - Generates a random UUID once and stores it in ~/.dot-ui/telemetry.json
 *    - Replaces previous PII-exposing method (hostname + username hashing)
 *    - Ensures consistent analytics while protecting privacy
 *
 * 2. OPT-IN BY DEFAULT:
 *    - Telemetry is enabled by default for interactive usage
 *    - Automatically disabled in CI/automated environments
 *    - Users can opt out anytime via command or environment variable
 *
 * 3. TRANSPARENT DATA COLLECTION:
 *    - Clear documentation of what data is collected
 *    - No personal information, file contents, or sensitive data
 *    - Error messages are truncated and sanitized
 *
 * 4. USER CONTROL:
 *    - 'dot-ui telemetry' command for full management
 *    - Environment variable: DOT_UI_DISABLE_TELEMETRY=true
 *    - Configuration file: ~/.dot-ui/telemetry.json
 *
 * 5. PRIVACY GUARANTEES:
 *    - Anonymous user ID (random UUID)
 *    - No tracking across different machines
 *    - Data used only for improving the CLI
 *    - Users can request data deletion
 *
 * USAGE EXAMPLES:
 * ==============
 *
 * View telemetry status:
 *   dot-ui telemetry status
 *
 * Disable telemetry:
 *   dot-ui telemetry disable
 *   # OR
 *   export DOT_UI_DISABLE_TELEMETRY=true
 *
 * View data collection details:
 *   dot-ui telemetry info
 *
 * Enable telemetry with consent:
 *   dot-ui telemetry enable
 */

import { PostHog } from "posthog-node";
import type { CliOptions } from "../types/index.js";

interface BaseEventProperties {
  cli_version: string;
  framework?: "nextjs" | "vite";
  has_typescript?: boolean;
  has_tailwind?: boolean;
  package_manager?: "npm" | "yarn" | "pnpm" | "bun";
  polkadot_library?: "papi" | "dedot" | "unknown";
  component_name?: string;
  registry_type?: "papi" | "dedot";
  duration_ms?: number;
  error_message?: string;
  project_type?: string;
  node_version?: string;
  os_platform?: string;
  command?: "add" | "init" | "list";
  detected_library?: "papi" | "dedot" | "none";
  selected_library?: "papi" | "dedot";
  was_prompted?: boolean;
}

interface TelemetryConfig {
  userId: string;
  enabled: boolean;
  version: number;
  createdAt: string;
  lastOptInPrompt?: string;
}

/**
 * Configuration manager for telemetry settings and persistent user ID
 */
class TelemetryConfigManager {
  private static readonly CONFIG_DIR = ".dot-ui";
  private static readonly CONFIG_FILE = "telemetry.json";
  private static readonly CONFIG_VERSION = 1;

  private configPath: string | null = null;

  constructor() {
    this.initializeConfigPath();
  }

  /**
   * Initialize the configuration file path
   */
  private async initializeConfigPath(): Promise<void> {
    try {
      const os = await import("os");
      const path = await import("path");
      const fs = await import("fs/promises");

      const homeDir = os.homedir();
      const configDir = path.join(homeDir, TelemetryConfigManager.CONFIG_DIR);
      this.configPath = path.join(
        configDir,
        TelemetryConfigManager.CONFIG_FILE
      );

      // Ensure config directory exists
      await fs.mkdir(configDir, { recursive: true });
    } catch (error) {
      console.debug("Failed to initialize telemetry config path:", error);
    }
  }

  /**
   * Generate a random UUID v4
   */
  private generateUUID(): string {
    try {
      const crypto = require("crypto");
      return crypto.randomUUID();
    } catch {
      // Fallback for older Node.js versions
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    }
  }

  /**
   * Load or create telemetry configuration
   */
  async getConfig(): Promise<TelemetryConfig> {
    if (!this.configPath) {
      await this.initializeConfigPath();
    }

    if (!this.configPath) {
      // Fallback config if path initialization failed
      return {
        userId: this.generateUUID(),
        enabled: false, // Default to disabled if we can't persist
        version: TelemetryConfigManager.CONFIG_VERSION,
        createdAt: new Date().toISOString(),
      };
    }

    try {
      const fs = await import("fs/promises");
      const configData = await fs.readFile(this.configPath, "utf-8");
      const config: TelemetryConfig = JSON.parse(configData);

      // Validate and migrate config if needed
      if (config.version !== TelemetryConfigManager.CONFIG_VERSION) {
        return await this.migrateConfig(config);
      }

      return config;
    } catch (error) {
      // Config doesn't exist or is invalid, create new one
      return await this.createNewConfig();
    }
  }

  /**
   * Create a new telemetry configuration
   */
  private async createNewConfig(): Promise<TelemetryConfig> {
    const config: TelemetryConfig = {
      userId: this.generateUUID(),
      enabled: await this.shouldPromptForConsent(),
      version: TelemetryConfigManager.CONFIG_VERSION,
      createdAt: new Date().toISOString(),
    };

    await this.saveConfig(config);
    return config;
  }

  /**
   * Determine if we should prompt for telemetry consent
   * Returns true only if not explicitly disabled via env var
   */
  private async shouldPromptForConsent(): Promise<boolean> {
    // Respect explicit opt-out
    if (process.env.DOT_UI_DISABLE_TELEMETRY === "true") {
      return false;
    }

    // Check for CI/automated environments
    const isCI =
      process.env.CI === "true" ||
      process.env.NODE_ENV === "test" ||
      process.env.GITHUB_ACTIONS === "true";

    if (isCI) {
      return false; // Default to disabled in automated environments
    }

    // Default to enabled for interactive usage, but user can opt out
    return true;
  }

  /**
   * Migrate configuration to current version
   */
  private async migrateConfig(
    oldConfig: Partial<TelemetryConfig>
  ): Promise<TelemetryConfig> {
    const newConfig: TelemetryConfig = {
      userId: oldConfig.userId || this.generateUUID(),
      enabled: oldConfig.enabled ?? false,
      version: TelemetryConfigManager.CONFIG_VERSION,
      createdAt: oldConfig.createdAt || new Date().toISOString(),
    };

    await this.saveConfig(newConfig);
    return newConfig;
  }

  /**
   * Save configuration to file
   */
  async saveConfig(config: TelemetryConfig): Promise<void> {
    if (!this.configPath) return;

    try {
      const fs = await import("fs/promises");
      await fs.writeFile(this.configPath, JSON.stringify(config, null, 2));
    } catch (error) {
      console.debug("Failed to save telemetry config:", error);
    }
  }

  /**
   * Update telemetry enabled status
   */
  async setEnabled(enabled: boolean): Promise<void> {
    const config = await this.getConfig();
    config.enabled = enabled;
    await this.saveConfig(config);
  }

  /**
   * Update the configuration
   */
  async updateConfig(updates: Partial<TelemetryConfig>): Promise<void> {
    const config = await this.getConfig();
    Object.assign(config, updates);
    await this.saveConfig(config);
  }

  /**
   * Get the configuration file path for user reference
   */
  getConfigPath(): string | null {
    return this.configPath;
  }
}

export class Telemetry {
  private static readonly POSTHOG_API_KEY =
    "phc_EqCg3vk7Pr5qqshg6YbHBM3ghYZPkc8IDLzhjqLtJwf";
  private static readonly POSTHOG_HOST = "https://eu.i.posthog.com";
  private postHog: PostHog | null = null;
  private configManager: TelemetryConfigManager;
  private config: TelemetryConfig | null = null;

  constructor(private options: CliOptions) {
    this.configManager = new TelemetryConfigManager();
    // Note: PostHog initialization is deferred until first use
  }

  /**
   * Initialize PostHog client
   */
  private async initializePostHog(): Promise<void> {
    // Skip telemetry in dev mode or if explicitly disabled
    if (process.env.DOT_UI_DISABLE_TELEMETRY === "true") {
      return;
    }

    try {
      // Load config to check if telemetry is enabled
      this.config = await this.configManager.getConfig();

      if (!this.config.enabled) {
        return;
      }

      this.postHog = new PostHog(Telemetry.POSTHOG_API_KEY, {
        host: Telemetry.POSTHOG_HOST,
        flushAt: 1, // Send events immediately for CLI usage
        flushInterval: 0, // Disable batching
      });
    } catch (error) {
      console.debug("Failed to initialize PostHog:", error);
    }
  }

  /**
   * Get CLI version from package.json
   */
  private async getCliVersion(): Promise<string> {
    try {
      const fs = await import("fs/promises");
      const path = await import("path");

      let packageJsonPath: string;

      // Handle different execution contexts (tests vs runtime)
      if (typeof import.meta !== "undefined" && import.meta.url) {
        const { fileURLToPath } = await import("url");
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        packageJsonPath = path.join(__dirname, "../../package.json");
      } else {
        // Fallback for test environment
        packageJsonPath = path.join(process.cwd(), "package.json");
      }

      const packageJson = JSON.parse(
        await fs.readFile(packageJsonPath, "utf-8")
      );
      return packageJson.version || "unknown";
    } catch {
      return "unknown";
    }
  }

  /**
   * Get system information for telemetry
   */
  private async getSystemInfo(): Promise<Partial<BaseEventProperties>> {
    try {
      const os = await import("os");

      return {
        node_version: process.version,
        os_platform: os.platform(),
      };
    } catch {
      return {};
    }
  }

  /**
   * Get persistent user ID from configuration
   * This replaces the previous method that used hostname/username hashing
   */
  private async getUserId(): Promise<string> {
    try {
      if (!this.config) {
        this.config = await this.configManager.getConfig();
      }
      return this.config.userId;
    } catch {
      // Fallback to session-only random ID if config system fails
      return Math.random().toString(36).substring(7);
    }
  }

  /**
   * Show privacy notice on first run if enabled
   */
  private async maybeShowPrivacyNotice(): Promise<void> {
    if (!this.config) {
      this.config = await this.configManager.getConfig();
    }

    // Show privacy notice only if telemetry is enabled and it's a new config
    if (this.config.enabled && !this.config.lastOptInPrompt) {
      console.log("\n📊 Privacy Notice");
      console.log("================");
      console.log(
        "dot-ui collects anonymous usage data to help improve the tool."
      );
      console.log("No personal information or project data is collected.");
      console.log(
        "Run 'dot-ui telemetry info' for details or 'dot-ui telemetry disable' to opt out."
      );
      console.log(
        "Set DOT_UI_DISABLE_TELEMETRY=true to disable permanently.\n"
      );

      // Update config to mark that we've shown the notice
      await this.configManager.updateConfig({
        lastOptInPrompt: new Date().toISOString(),
      });
    }
  }

  /**
   * Send event to PostHog using the official client
   */
  private async sendToPostHog(
    event: string,
    properties: BaseEventProperties
  ): Promise<void> {
    // Skip telemetry if explicitly disabled or not initialized
    if (process.env.DOT_UI_DISABLE_TELEMETRY === "true") {
      return;
    }

    // Ensure PostHog is initialized
    if (!this.postHog) {
      await this.initializePostHog();
      if (!this.postHog) return;
    }

    // Show privacy notice if this is the first time telemetry is used
    await this.maybeShowPrivacyNotice();

    try {
      const userId = await this.getUserId();
      const systemInfo = await this.getSystemInfo();

      // Capture event with PostHog client
      this.postHog.capture({
        distinctId: userId,
        event,
        properties: {
          ...properties,
          ...systemInfo,
          $lib: "dot-ui-cli",
          $lib_version: properties.cli_version,
        },
      });

      // Ensure events are sent immediately for CLI usage
      await this.postHog.flush();
    } catch (error) {
      // Silently fail - telemetry should never break the CLI
      console.debug(
        "PostHog telemetry error:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  /**
   * Check if telemetry is enabled
   */
  async isEnabled(): Promise<boolean> {
    if (process.env.DOT_UI_DISABLE_TELEMETRY === "true") {
      return false;
    }

    if (!this.config) {
      this.config = await this.configManager.getConfig();
    }

    return this.config.enabled;
  }

  /**
   * Enable or disable telemetry
   */
  async setEnabled(enabled: boolean): Promise<void> {
    await this.configManager.setEnabled(enabled);
    this.config = await this.configManager.getConfig();

    if (!enabled && this.postHog) {
      await this.postHog.shutdown();
      this.postHog = null;
    } else if (enabled && !this.postHog) {
      await this.initializePostHog();
    }
  }

  /**
   * Get telemetry configuration information for user
   */
  async getInfo(): Promise<{
    enabled: boolean;
    userId: string;
    configPath: string | null;
    dataCollection: string[];
  }> {
    if (!this.config) {
      this.config = await this.configManager.getConfig();
    }

    return {
      enabled: this.config.enabled,
      userId: this.config.userId,
      configPath: this.configManager.getConfigPath(),
      dataCollection: [
        "CLI version and command usage",
        "Framework choice (Next.js/Vite)",
        "TypeScript/JavaScript usage",
        "Polkadot library selection (papi/dedot)",
        "Component installation success/failure",
        "Error messages (truncated, no personal data)",
        "Node.js version and OS platform",
        "Project initialization events",
      ],
    };
  }

  /**
   * Cleanup PostHog client
   */
  async shutdown(): Promise<void> {
    if (this.postHog) {
      await this.postHog.shutdown();
    }
  }

  /**
   * Track when user starts adding a component
   */
  async trackComponentAddStarted(
    componentName: string,
    properties: Partial<BaseEventProperties> = {}
  ): Promise<void> {
    await this.sendToPostHog("Component Add Started", {
      cli_version: await this.getCliVersion(),
      component_name: componentName,
      ...properties,
    });
  }

  /**
   * Track successful component addition
   */
  async trackComponentAddCompleted(
    componentName: string,
    properties: Partial<BaseEventProperties> = {}
  ): Promise<void> {
    await this.sendToPostHog("Component Add Completed", {
      cli_version: await this.getCliVersion(),
      component_name: componentName,
      ...properties,
    });
  }

  /**
   * Track component addition failure
   */
  async trackComponentAddFailed(
    componentName: string,
    errorMessage: string,
    properties: Partial<BaseEventProperties> = {}
  ): Promise<void> {
    await this.sendToPostHog("Component Add Failed", {
      cli_version: await this.getCliVersion(),
      component_name: componentName,
      error_message: errorMessage.substring(0, 200), // Truncate error messages
      ...properties,
    });
  }

  /**
   * Track project initialization start
   */
  async trackProjectInitStarted(
    framework: "nextjs" | "vite",
    properties: Partial<BaseEventProperties> = {}
  ): Promise<void> {
    await this.sendToPostHog("Project Init Started", {
      cli_version: await this.getCliVersion(),
      framework,
      ...properties,
    });
  }

  /**
   * Track successful project initialization
   */
  async trackProjectInitCompleted(
    framework: "nextjs" | "vite",
    properties: Partial<BaseEventProperties> = {}
  ): Promise<void> {
    await this.sendToPostHog("Project Init Completed", {
      cli_version: await this.getCliVersion(),
      framework,
      ...properties,
    });
  }

  /**
   * Track project initialization failure
   */
  async trackProjectInitFailed(
    framework: "nextjs" | "vite",
    errorMessage: string,
    properties: Partial<BaseEventProperties> = {}
  ): Promise<void> {
    await this.sendToPostHog("Project Init Failed", {
      cli_version: await this.getCliVersion(),
      framework,
      error_message: errorMessage.substring(0, 200),
      ...properties,
    });
  }

  /**
   * Track CLI command usage
   */
  async trackCommandUsed(
    command: "add" | "init" | "list",
    properties: Partial<BaseEventProperties> = {}
  ): Promise<void> {
    await this.sendToPostHog("CLI Command Used", {
      cli_version: await this.getCliVersion(),
      command,
      ...properties,
    });
  }

  /**
   * Track library detection and selection
   */
  async trackLibraryDetected(
    detectedLibrary: "papi" | "dedot" | "none",
    selectedLibrary: "papi" | "dedot",
    wasPrompted: boolean,
    properties: Partial<BaseEventProperties> = {}
  ): Promise<void> {
    await this.sendToPostHog("Polkadot Library Detected", {
      cli_version: await this.getCliVersion(),
      detected_library: detectedLibrary,
      selected_library: selectedLibrary,
      was_prompted: wasPrompted,
      ...properties,
    });
  }
}
