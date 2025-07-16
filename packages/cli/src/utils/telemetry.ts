import type { CliOptions } from "../types/index.js";

interface TelemetryEvent {
  event:
    | "install_start"
    | "install_success"
    | "install_error"
    | "init_start"
    | "init_success";
  component?: string;
  framework?: "nextjs" | "vite";
  version: string;
  timestamp: number;
  error?: string;
  metadata?: {
    hasTypeScript?: boolean;
    hasTailwind?: boolean;
    packageManager?: string;
    duration?: number;
  };
}

export class Telemetry {
  private static readonly TELEMETRY_URL = "https://dot-ui.com/api/telemetry";

  constructor(private options: CliOptions) {}

  /**
   * Get CLI version from package.json
   */
  private async getCliVersion(): Promise<string> {
    try {
      const fs = await import("fs/promises");
      const path = await import("path");
      const { fileURLToPath } = await import("url");

      // Get the directory of this module
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      // Read package.json from the CLI package root
      const packageJsonPath = path.join(__dirname, "../../package.json");
      const packageJson = JSON.parse(
        await fs.readFile(packageJsonPath, "utf-8")
      );
      return packageJson.version || "unknown";
    } catch {
      return "unknown";
    }
  }

  /**
   * Send telemetry event (fails silently if disabled or errors)
   */
  async sendEvent(
    eventData: Omit<TelemetryEvent, "version" | "timestamp">
  ): Promise<void> {
    // Skip telemetry in dev mode or if explicitly disabled
    if (this.options.dev || process.env.POLKA_UI_DISABLE_TELEMETRY === "true") {
      return;
    }

    try {
      const event: TelemetryEvent = {
        ...eventData,
        version: await this.getCliVersion(),
        timestamp: Date.now(),
      };

      // Use AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(Telemetry.TELEMETRY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": `polka-ui-cli/${event.version}`,
        },
        body: JSON.stringify(event),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Don't throw on HTTP errors, just log for debugging
      if (!response.ok) {
        console.debug(`Telemetry failed: ${response.status}`);
      }
    } catch (error) {
      // Silently fail - telemetry should never break the CLI
      console.debug(
        "Telemetry error:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  /**
   * Track component installation start
   */
  async trackInstallStart(
    component: string,
    framework?: "nextjs" | "vite"
  ): Promise<void> {
    await this.sendEvent({
      event: "install_start",
      component,
      framework,
    });
  }

  /**
   * Track successful component installation
   */
  async trackInstallSuccess(
    component: string,
    framework: "nextjs" | "vite",
    metadata: {
      hasTypeScript?: boolean;
      hasTailwind?: boolean;
      packageManager?: string;
      duration?: number;
    }
  ): Promise<void> {
    await this.sendEvent({
      event: "install_success",
      component,
      framework,
      metadata,
    });
  }

  /**
   * Track installation error
   */
  async trackInstallError(
    component: string,
    error: string,
    framework?: "nextjs" | "vite"
  ): Promise<void> {
    await this.sendEvent({
      event: "install_error",
      component,
      framework,
      error: error.substring(0, 200), // Truncate error messages
    });
  }

  /**
   * Track project initialization start
   */
  async trackInitStart(framework: "nextjs" | "vite"): Promise<void> {
    await this.sendEvent({
      event: "init_start",
      framework,
    });
  }

  /**
   * Track successful project initialization
   */
  async trackInitSuccess(
    framework: "nextjs" | "vite",
    metadata: {
      hasTypeScript?: boolean;
      hasTailwind?: boolean;
      packageManager?: string;
      duration?: number;
    }
  ): Promise<void> {
    await this.sendEvent({
      event: "init_success",
      framework,
      metadata,
    });
  }
}
