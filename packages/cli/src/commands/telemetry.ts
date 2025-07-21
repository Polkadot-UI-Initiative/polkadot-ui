import inquirer from "inquirer";
import { Telemetry } from "../utils/telemetry.js";
import type { CliOptions } from "../types/index.js";
import { createLogger, Logger } from "../utils/logger.js";

export class TelemetryCommand {
  private telemetry: Telemetry;
  private logger: Logger;

  constructor(private options: CliOptions) {
    this.logger = createLogger(options.verbose);
    this.telemetry = new Telemetry(options);
  }

  /**
   * Execute telemetry management command
   */
  async execute(
    action?: "status" | "enable" | "disable" | "info"
  ): Promise<void> {
    this.logger.detail(
      "🔒 TelemetryCommand.execute() - Starting telemetry management"
    );

    try {
      if (!action) {
        await this.showInteractiveMenu();
      } else {
        await this.executeAction(action);
      }
    } catch (error) {
      this.logger.error(
        `Telemetry command failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      await this.telemetry.shutdown();
    }
  }

  /**
   * Show interactive telemetry management menu
   */
  private async showInteractiveMenu(): Promise<void> {
    const telemetryInfo = await this.telemetry.getInfo();

    console.log("\n📊 Telemetry Settings");
    console.log("=====================");
    console.log(
      `Status: ${telemetryInfo.enabled ? "✅ Enabled" : "❌ Disabled"}`
    );
    console.log(`User ID: ${telemetryInfo.userId}`);
    console.log(`Config: ${telemetryInfo.configPath || "Not available"}`);

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: "📋 View data collection details", value: "info" },
          {
            name: `${telemetryInfo.enabled ? "❌ Disable" : "✅ Enable"} telemetry`,
            value: telemetryInfo.enabled ? "disable" : "enable",
          },
          { name: "📊 View current status", value: "status" },
          { name: "🚪 Exit", value: "exit" },
        ],
      },
    ]);

    if (action !== "exit") {
      await this.executeAction(action);
    }
  }

  /**
   * Execute specific telemetry action
   */
  private async executeAction(action: string): Promise<void> {
    switch (action) {
      case "status":
        await this.showStatus();
        break;
      case "enable":
        await this.enableTelemetry();
        break;
      case "disable":
        await this.disableTelemetry();
        break;
      case "info":
        await this.showDataCollectionInfo();
        break;
      default:
        this.logger.error(`Unknown action: ${action}`);
    }
  }

  /**
   * Show current telemetry status
   */
  private async showStatus(): Promise<void> {
    const telemetryInfo = await this.telemetry.getInfo();

    console.log("\n📊 Telemetry Status");
    console.log("==================");
    console.log(`Enabled: ${telemetryInfo.enabled ? "Yes" : "No"}`);
    console.log(`User ID: ${telemetryInfo.userId}`);
    console.log(`Config file: ${telemetryInfo.configPath || "Not available"}`);

    if (telemetryInfo.enabled) {
      console.log("\n💡 To disable telemetry:");
      console.log("  dot-ui telemetry disable");
      console.log(
        "  OR set environment variable: DOT_UI_DISABLE_TELEMETRY=true"
      );
    } else {
      console.log("\n💡 To enable telemetry:");
      console.log("  dot-ui telemetry enable");
    }
  }

  /**
   * Enable telemetry with user consent
   */
  private async enableTelemetry(): Promise<void> {
    // Show what data we collect before enabling
    await this.showDataCollectionInfo();

    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: "Do you consent to anonymous usage data collection?",
        default: false,
      },
    ]);

    if (confirm) {
      await this.telemetry.setEnabled(true);
      console.log("\n✅ Telemetry enabled");
      console.log("Thank you for helping improve dot-ui!");
      console.log("\n💡 You can disable telemetry anytime with:");
      console.log("  dot-ui telemetry disable");
      console.log(
        "  OR set environment variable: DOT_UI_DISABLE_TELEMETRY=true"
      );
    } else {
      console.log("\n❌ Telemetry remains disabled");
      console.log("You can enable it later with: dot-ui telemetry enable");
    }
  }

  /**
   * Disable telemetry
   */
  private async disableTelemetry(): Promise<void> {
    await this.telemetry.setEnabled(false);
    console.log("\n❌ Telemetry disabled");
    console.log("No usage data will be collected.");
    console.log("\n💡 You can re-enable telemetry anytime with:");
    console.log("  dot-ui telemetry enable");
  }

  /**
   * Show detailed information about data collection
   */
  private async showDataCollectionInfo(): Promise<void> {
    const telemetryInfo = await this.telemetry.getInfo();

    console.log("\n📋 Data Collection Information");
    console.log("=============================");
    console.log(
      "The dot-ui CLI collects anonymous usage data to help improve the tool."
    );
    console.log(
      "This data helps us understand how the CLI is used and where to focus development efforts.\n"
    );

    console.log("🔍 Data We Collect:");
    telemetryInfo.dataCollection.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item}`);
    });

    console.log("\n🔒 Privacy Guarantees:");
    console.log("  • No personal information (names, emails, file contents)");
    console.log("  • No sensitive project data or source code");
    console.log("  • Anonymous user ID (randomly generated UUID)");
    console.log("  • Error messages are truncated and sanitized");
    console.log("  • Data is used only for improving the CLI");

    console.log("\n⚖️ Your Rights (GDPR Compliant):");
    console.log("  • You can disable telemetry anytime");
    console.log("  • Data collection is opt-in by default");
    console.log("  • You can request data deletion");
    console.log("  • Full transparency about what data is collected");

    console.log("\n🛠️ Control Options:");
    console.log("  • Command: dot-ui telemetry disable");
    console.log("  • Environment variable: DOT_UI_DISABLE_TELEMETRY=true");
    console.log(
      `  • Config file: ${telemetryInfo.configPath || "~/.dot-ui/telemetry.json"}`
    );

    console.log("\n📧 Contact:");
    console.log(
      "  For questions about data collection or to request data deletion,"
    );
    console.log("  please visit: https://github.com/dot-ui/dot-ui/issues");
  }
}
