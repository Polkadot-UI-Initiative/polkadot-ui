import chalk from "chalk";

export class Logger {
  private verbose: boolean;

  constructor(verbose: boolean = false) {
    this.verbose = verbose;
  }

  /**
   * General information message
   */
  info(message: string) {
    console.log(`${chalk.blue("ℹ")} ${chalk.white(message)}`);
  }

  /**
   * Detailed information (shown only in verbose mode or when explicitly called)
   */
  detail(message: string, force: boolean = false) {
    if (this.verbose || force) {
      console.log(chalk.gray(`i ${message}`));
    }
  }

  /**
   * Success message
   */
  success(message: string) {
    console.log(`${chalk.green("✔")} ${chalk.white(message)}`);
  }

  /**
   * Final success message (more prominent)
   */
  finalSuccess(message: string) {
    console.log(`${chalk.green("✔")} ${chalk.green.bold(message)}`);
  }

  /**
   * Error message
   */
  error(message: string) {
    console.log(`${chalk.red("✗")} ${chalk.white(message)}`);
  }

  /**
   * Warning message
   */
  warning(message: string) {
    console.log(`${chalk.yellow("⚠")} ${chalk.white(message)}`);
  }

  /**
   * Step indicator
   */
  step(step: number, total: number, message: string) {
    console.log(`${chalk.cyan(`[${step}/${total}]`)} ${chalk.white(message)}`);
  }

  /**
   * Command suggestion
   */
  command(command: string) {
    console.log(`${chalk.gray("$")} ${chalk.cyan(command)}`);
  }

  /**
   * Code block
   */
  code(code: string) {
    console.log(chalk.white(code));
  }

  /**
   * Section header
   */
  section(title: string) {
    console.log(`\n${chalk.blue.bold(title)}`);
  }

  /**
   * Subsection header
   */
  subsection(title: string) {
    console.log(`\n${chalk.yellow(title)}`);
  }

  /**
   * Empty line
   */
  newline() {
    console.log();
  }

  /**
   * Show project guidance when no React project is found
   */
  showProjectGuidance() {
    this.newline();
    this.error("No package.json found in current directory");
    this.info("To use dot-ui, you need a React or Next.js project.");
    this.subsection("Create a new project:");

    this.info("📦 Next.js project (recommended):");
    this.command("npx create-next-app@latest my-polkadot-app");
    this.command("cd my-polkadot-app");
    this.newline();

    this.info("📦 Vite + React project:");
    this.command(
      "npm create vite@latest my-polkadot-app -- --template react-ts"
    );
    this.command("cd my-polkadot-app");
    this.command("npm install");
    this.newline();

    this.info("📦 Create React App project:");
    this.command("npx create-react-app my-polkadot-app --template typescript");
    this.command("cd my-polkadot-app");
    this.newline();

    this.info("Then run dot-ui commands from inside your project directory.");
  }

  /**
   * Show React project requirements
   */
  showReactRequirements() {
    this.newline();
    this.error("This doesn't appear to be a React project");
    this.info("dot-ui requires a React-based project.");
    this.subsection("Supported frameworks:");
    this.detail("• Next.js", true);
    this.detail("• Vite + React", true);
    this.detail("• Create React App", true);
    this.newline();

    this.subsection("To create a new React project:");
    this.command("npx create-next-app@latest my-polkadot-app");
    this.command("cd my-polkadot-app");
    this.command("dot-ui add <component-name>");
  }

  /**
   * Show validation errors
   */
  showValidationErrors(errors: string[], warnings: string[]) {
    if (errors.length > 0) {
      this.newline();
      errors.forEach((error) => this.error(error));
    }

    if (warnings.length > 0) {
      this.newline();
      warnings.forEach((warning) => this.warning(warning));
    }
  }

  /**
   * Show next steps after component installation
   */
  showNextSteps(componentName: string, hasPolkadotSetup: boolean = false) {
    this.section("🎉 Component installed successfully!");

    this.subsection("Next steps:");
    this.detail("1. Import the component in your project and use it:", true);
    this.code(
      `import { ${componentName} } from '@/components/${componentName}'`
    );
    this.code(`<${componentName} />`);
    this.newline();

    if (hasPolkadotSetup) {
      this.detail("2. Make sure to wrap your app with PolkadotProvider:", true);
      this.code(
        `import { PolkadotProvider } from '@/providers/polkadot-provider'`
      );
      this.code(``);
      this.code(`function App() {`);
      this.code(`  return (`);
      this.code(`    <PolkadotProvider>`);
      this.code(`      <YourApp />`);
      this.code(`    </PolkadotProvider>`);
      this.code(`  )`);
      this.code(`}`);
      this.newline();
    }

    this.detail("Happy coding with Polkadot! 🚀");
  }

  /**
   * Show available components in a formatted list
   */
  showComponentList(
    components: Array<{ name: string; title: string; description: string }>
  ) {
    this.section("Available Components:");
    this.newline();

    components.forEach((component) => {
      console.log(`${chalk.green("●")} ${chalk.white.bold(component.name)}`);
      console.log(`  ${chalk.gray(component.description)}`);
      this.newline();
    });

    this.subsection("Usage:");
    this.command("dot-ui add <component-name>");
    this.newline();
  }
}

// Default logger instance
export const logger = new Logger();

// Factory function for creating loggers with specific config
export function createLogger(verbose: boolean = false): Logger {
  return new Logger(verbose);
}
