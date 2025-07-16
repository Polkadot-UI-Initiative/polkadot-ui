import inquirer from "inquirer";
import ora from "ora";
import execa from "execa";
import path from "path";
import type { CliOptions, ProjectSetupConfig } from "../types/index.js";
import { logger } from "../utils/logger.js";
import { ProjectDetector } from "../utils/project-detector.js";

export class InitCommand {
  private projectDetector: ProjectDetector;

  constructor(private options: CliOptions) {
    this.projectDetector = new ProjectDetector();
  }

  /**
   * Main init command execution
   */
  async execute(): Promise<void> {
    logger.info("Initializing new project...");
    await this.initializeProject();
    // Explicitly return to ensure the function completes
    return;
  }

  /**
   * Internal initialization method that can be called from other commands
   */
  async initializeProject(): Promise<void> {
    const setupConfig = await this.promptProjectSetup();
    await this.createProject(setupConfig);
    await this.initializeShadcn(setupConfig);

    logger.success("Project initialized successfully!");
    logger.info("You can now run 'dot-ui add <component>' to add components.");
  }

  /**
   * Interactive project setup prompts
   */
  private async promptProjectSetup(): Promise<ProjectSetupConfig> {
    const currentDir = path.basename(process.cwd());

    // If --yes flag is used, return defaults
    if (this.options.yes) {
      return {
        projectName: currentDir,
        framework: "nextjs",
        useTypeScript: true,
        useESLint: true,
        useTailwind: true,
        useSrcDirectory: false,
        useAppRouter: true,
        useTurbopack: false,
        importAlias: "@/*",
        polkadotLibrary: "papi",
      };
    }

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: "What is your project named?",
        default: currentDir,
        validate: (input: string) => {
          if (!input.trim()) return "Project name cannot be empty";
          return true;
        },
      },
      {
        type: "list",
        name: "framework",
        message: "Which framework would you like to use?",
        choices: [
          { name: "Next.js (recommended)", value: "nextjs" },
          { name: "Vite + React", value: "vite" },
        ],
        default: "nextjs",
      },
      {
        type: "confirm",
        name: "useSrcDirectory",
        message: "Would you like your code inside a `src/` directory?",
        default: false,
        when: (answers: any) => answers.framework === "nextjs",
      },
      {
        type: "confirm",
        name: "useAppRouter",
        message: "Would you like to use App Router? (recommended)",
        default: true,
        when: (answers: any) => answers.framework === "nextjs",
      },
      {
        type: "confirm",
        name: "useTurbopack",
        message: "Would you like to use Turbopack for `next dev`?",
        default: false,
        when: (answers: any) => answers.framework === "nextjs",
      },
      {
        type: "confirm",
        name: "customizeImportAlias",
        message:
          "Would you like to customize the import alias (`@/*` by default)?",
        default: false,
        when: (answers: any) => answers.framework === "nextjs",
      },
      {
        type: "input",
        name: "importAlias",
        message: "What import alias would you like configured?",
        default: "@/*",
        when: (answers: any) => answers.customizeImportAlias,
        validate: (input: string) => {
          if (!input.trim()) return "Import alias cannot be empty";
          if (!input.includes("*")) return "Import alias must include *";
          return true;
        },
      },
      {
        type: "list",
        name: "polkadotLibrary",
        message: "Which Polkadot API library would you like to use?",
        choices: [
          { name: "Polkadot API (papi)", value: "papi" },
          { name: "Dedot - experimental", value: "dedot" },
        ],
        default: "papi",
      },
    ]);

    return {
      projectName: answers.projectName,
      framework: answers.framework,
      useTypeScript: true, // Always enabled
      useESLint: true, // Always enabled
      useTailwind: true, // Always enabled
      useSrcDirectory: answers.useSrcDirectory || false,
      useAppRouter: answers.useAppRouter || false,
      useTurbopack: answers.useTurbopack || false,
      importAlias: answers.importAlias || "@/*",
      polkadotLibrary: answers.polkadotLibrary,
    };
  }

  /**
   * Create a new project based on user configuration
   */
  private async createProject(config: ProjectSetupConfig): Promise<void> {
    const spinner = ora(`Creating ${config.framework} project...`).start();

    try {
      if (config.framework === "nextjs") {
        await this.createNextJsProject(config);
      } else {
        await this.createViteProject(config);
      }

      spinner.succeed(`${config.framework} project created successfully`);
    } catch (error) {
      spinner.fail("Failed to create project");
      throw error;
    }
  }

  /**
   * Create Next.js project
   */
  private async createNextJsProject(config: ProjectSetupConfig): Promise<void> {
    const args = [
      "create-next-app@latest",
      ".",
      "--yes",
      config.useTypeScript ? "--typescript" : "--js",
      config.useESLint ? "--eslint" : "--no-eslint",
      config.useTailwind ? "--tailwind" : "--no-tailwind",
      config.useSrcDirectory ? "--src-dir" : "--no-src-dir",
      config.useAppRouter ? "--app" : "--no-app",
      config.useTurbopack ? "--turbo" : "--no-turbo",
      `--import-alias=${config.importAlias}`,
    ];

    // Get package manager run command
    const runCommand = await this.projectDetector.getPackageManagerRunCommand();
    const [executable, ...baseArgs] = runCommand.split(" ");

    await execa(executable, [...baseArgs, ...args], {
      stdio: "inherit",
      detached: false,
      cleanup: true,
      killSignal: "SIGTERM",
      timeout: 300000, // 5 minutes timeout for project creation
    });
  }

  /**
   * Create Vite project
   */
  private async createViteProject(config: ProjectSetupConfig): Promise<void> {
    // Get package manager run command
    const runCommand = await this.projectDetector.getPackageManagerRunCommand();
    const [executable, ...baseArgs] = runCommand.split(" ");

    // Choose between template mode (--yes flag) or interactive mode
    if (this.options.yes) {
      // Use React TypeScript template directly (no prompts)
      await execa(
        executable,
        [...baseArgs, "create-vite@latest", ".", "--template", "react-ts"],
        {
          stdio: "inherit",
          detached: false,
          cleanup: true,
          killSignal: "SIGTERM",
          timeout: 300000, // 5 minutes timeout
        }
      );
    } else {
      // Use native create-vite flow (shows React preselected, TypeScript variant available)
      await execa(executable, [...baseArgs, "create-vite@latest", "."], {
        stdio: "inherit",
        detached: false,
        cleanup: true,
        killSignal: "SIGTERM",
        timeout: 300000, // 5 minutes timeout
      });
    }

    // Install additional dependencies based on configuration
    const installCommand =
      await this.projectDetector.getPackageManagerInstallCommand();
    const devDeps = [];

    if (config.useESLint) {
      devDeps.push(
        "eslint",
        "@typescript-eslint/eslint-plugin",
        "@typescript-eslint/parser"
      );
    }

    if (config.useTailwind) {
      // Use Tailwind CSS v4 with Vite plugin
      devDeps.push("tailwindcss", "@tailwindcss/vite");
    }

    if (devDeps.length > 0) {
      await execa.command(`${installCommand} -D ${devDeps.join(" ")}`, {
        stdio: "inherit",
        detached: false,
        cleanup: true,
        killSignal: "SIGTERM",
        timeout: 300000, // 5 minutes timeout
      });
    }

    // Configure project files
    await this.configureViteProject(config);
  }

  /**
   * Configure Vite project files
   */
  private async configureViteProject(
    config: ProjectSetupConfig
  ): Promise<void> {
    const fs = await import("fs/promises");
    const path = await import("path");

    // Configure Vite config
    if (config.useTailwind) {
      await this.updateViteConfig(config);
    }

    // Configure TypeScript paths
    if (config.useTypeScript) {
      await this.updateTsConfig(config);
    }

    // Configure Tailwind CSS
    if (config.useTailwind) {
      await this.updateViteCSS(config);
    }
  }

  /**
   * Update vite.config.ts for Tailwind CSS v4
   */
  private async updateViteConfig(config: ProjectSetupConfig): Promise<void> {
    const fs = await import("fs/promises");
    const configFile = config.useTypeScript
      ? "vite.config.ts"
      : "vite.config.js";

    // Extract the alias prefix (e.g., "@" from "@/*")
    const aliasPrefix = config.importAlias.replace("/*", "");
    // For Vite, shadcn installs components in the root directory, so alias should point to root
    const resolveDir = ".";

    const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "${aliasPrefix}": path.resolve(__dirname, "${resolveDir}"),
    },
  },
})
`;

    await fs.writeFile(configFile, viteConfig);
  }

  /**
   * Update tsconfig.json for import alias
   */
  private async updateTsConfig(config: ProjectSetupConfig): Promise<void> {
    const fs = await import("fs/promises");

    try {
      const tsconfigContent = await fs.readFile("tsconfig.json", "utf-8");
      const tsconfig = JSON.parse(tsconfigContent);

      // Add baseUrl and paths for import alias
      tsconfig.compilerOptions = tsconfig.compilerOptions || {};
      tsconfig.compilerOptions.baseUrl = ".";
      tsconfig.compilerOptions.paths = {
        [config.importAlias]: ["./*"], // For Vite, shadcn installs at root level
      };

      await fs.writeFile("tsconfig.json", JSON.stringify(tsconfig, null, 2));
    } catch (error) {
      logger.warning("Failed to update tsconfig.json for import alias");
    }
  }

  /**
   * Update CSS file for Tailwind CSS v4
   */
  private async updateViteCSS(config: ProjectSetupConfig): Promise<void> {
    const fs = await import("fs/promises");
    const cssFile = "src/index.css"; // Vite always uses src/index.css regardless of useSrcDirectory

    const tailwindCSS = `@import "tailwindcss";
`;

    try {
      await fs.writeFile(cssFile, tailwindCSS);
    } catch (error) {
      logger.warning("Failed to update CSS file for Tailwind CSS");
    }
  }

  /**
   * Initialize shadcn/ui in the project
   */
  private async initializeShadcn(config: ProjectSetupConfig): Promise<void> {
    const spinner = ora("Initializing shadcn/ui...").start();

    try {
      // Get package manager run command
      const runCommand =
        await this.projectDetector.getPackageManagerRunCommand();
      const [executable, ...baseArgs] = runCommand.split(" ");

      // Determine shadcn version based on Tailwind version (assume v4 for new projects)
      const shadcnVersion = "shadcn@canary";

      const shadcnArgs = [shadcnVersion, "init"];

      // Add explicit defaults when using --yes flag
      if (this.options.yes) {
        shadcnArgs.push("--yes");
        shadcnArgs.push("--base-color", "neutral");
        shadcnArgs.push("--css-variables");
        if (config.useSrcDirectory) {
          shadcnArgs.push("--src-dir");
        } else {
          shadcnArgs.push("--no-src-dir");
        }
      }

      await execa(executable, [...baseArgs, ...shadcnArgs], {
        stdio: "inherit",
        detached: false,
        cleanup: true,
        killSignal: "SIGTERM",
        timeout: 120000, // 2 minutes timeout
      });

      spinner.succeed("shadcn/ui initialized successfully");
    } catch (error) {
      spinner.fail("Failed to initialize shadcn/ui");
      logger.warning("You may need to run 'npx shadcn@canary init' manually");
      logger.warning("This is required before adding components");
    }
  }
}
