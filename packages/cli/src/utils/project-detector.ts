import fs from "fs/promises";
import path from "path";
import {
  PackageJson,
  ProjectStructure,
  ProjectType,
  ValidationResult,
} from "../types/index.js";

export class ProjectDetector {
  private cwd: string;

  constructor(cwd: string = process.cwd()) {
    this.cwd = cwd;
  }

  /**
   * Check if package.json exists in the current directory
   */
  async hasPackageJson(): Promise<boolean> {
    try {
      await fs.access(path.join(this.cwd, "package.json"));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Read and parse package.json
   */
  async getPackageJson(): Promise<PackageJson | null> {
    try {
      const packageJsonPath = path.join(this.cwd, "package.json");
      const content = await fs.readFile(packageJsonPath, "utf-8");
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  /**
   * Detect the project type (Next.js, Vite, CRA, etc.)
   */
  async detectProjectType(): Promise<ProjectType> {
    const packageJson = await this.getPackageJson();
    if (!packageJson) return "unknown";

    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    if (deps.next) return "nextjs";
    if (deps.vite) return "vite";
    if (deps["react-scripts"]) return "cra";

    return "unknown";
  }

  /**
   * Check if the project uses React
   */
  async hasReact(): Promise<boolean> {
    const packageJson = await this.getPackageJson();
    if (!packageJson) return false;

    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    return Boolean(deps.react);
  }

  /**
   * Check if the project uses TypeScript
   */
  async hasTypeScript(): Promise<boolean> {
    const packageJson = await this.getPackageJson();
    if (!packageJson) return false;

    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    return Boolean(deps.typescript);
  }

  /**
   * Check if src directory exists (common in Vite/CRA)
   */
  async hasSrcDirectory(): Promise<boolean> {
    try {
      const srcPath = path.join(this.cwd, "src");
      const stat = await fs.stat(srcPath);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * Detect which package manager is being used in the project
   */
  async detectPackageManager(): Promise<"npm" | "pnpm" | "yarn" | "bun"> {
    try {
      // Check for lockfiles in order of preference
      const lockfiles = [
        { file: "bun.lockb", manager: "bun" as const },
        { file: "pnpm-lock.yaml", manager: "pnpm" as const },
        { file: "yarn.lock", manager: "yarn" as const },
        { file: "package-lock.json", manager: "npm" as const },
      ];

      for (const { file, manager } of lockfiles) {
        try {
          await fs.access(path.join(this.cwd, file));
          return manager;
        } catch {
          continue;
        }
      }

      // If no lockfile found, default to pnpm
      return "pnpm";
    } catch {
      return "pnpm";
    }
  }

  /**
   * Get the package manager command for installing dependencies
   */
  async getPackageManagerInstallCommand(): Promise<string> {
    const packageManager = await this.detectPackageManager();

    switch (packageManager) {
      case "bun":
        return "bun install";
      case "pnpm":
        return "pnpm install";
      case "yarn":
        return "yarn add";
      case "npm":
        return "npm install";
      default:
        return "pnpm install";
    }
  }

  /**
   * Get the package manager command for running executables
   */
  async getPackageManagerRunCommand(): Promise<string> {
    const packageManager = await this.detectPackageManager();

    switch (packageManager) {
      case "bun":
        return "bun x";
      case "pnpm":
        return "pnpm dlx";
      case "yarn":
        return "yarn dlx";
      case "npm":
        return "npx";
      default:
        return "pnpm dlx";
    }
  }

  /**
   * Get Tailwind CSS version if installed
   */
  async getTailwindVersion(): Promise<number | null> {
    const packageJson = await this.getPackageJson();
    if (!packageJson) return null;

    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    const tailwindVersion = deps.tailwindcss;
    if (!tailwindVersion) return null;

    // Check if it's version 4
    if (tailwindVersion.includes("4")) return 4;
    return 3;
  }

  /**
   * Detect complete project structure
   */
  async detectProjectStructure(): Promise<ProjectStructure> {
    const projectType = await detectProjectType();
    const hasSrc = await this.hasSrcDirectory();
    const hasTS = await this.hasTypeScript();
    const packageManager = await this.detectPackageManager();

    let srcDir = "";
    let componentDir = "components";

    // For Vite and CRA, typically use src/ directory
    if ((projectType === "vite" || projectType === "cra") && hasSrc) {
      srcDir = "src";
      componentDir = "src/components";
    }

    return {
      isNextJs: projectType === "nextjs",
      isVite: projectType === "vite",
      isCRA: projectType === "cra",
      hasTypeScript: hasTS,
      packageManager,
      srcDir,
      componentDir,
      hookDir: srcDir ? `${srcDir}/hooks` : "hooks",
      providerDir: srcDir ? `${srcDir}/providers` : "providers",
      registryDir: "registry/polkadot-ui",
    };
  }

  /**
   * Validate that the current directory is a proper React project
   */
  async validateProject(): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if package.json exists
    if (!(await this.hasPackageJson())) {
      errors.push("No package.json found in current directory");
      errors.push("This tool requires a React or Next.js project");
      return { isValid: false, errors, warnings };
    }

    // Check if it's a React project
    if (!(await this.hasReact())) {
      errors.push("This does not appear to be a React project");
      errors.push(
        "dot-ui requires a React-based project (Next.js, Vite, or CRA)"
      );
      return { isValid: false, errors, warnings };
    }

    // Check project type
    const projectType = await this.detectProjectType();
    if (projectType === "unknown") {
      warnings.push("Could not detect project type - this may cause issues");
    }

    // Check if src directory exists for Vite/CRA projects
    if (
      (projectType === "vite" || projectType === "cra") &&
      !(await this.hasSrcDirectory())
    ) {
      errors.push(
        "src/ directory not found - this appears to be an incorrectly set up project"
      );
      return { isValid: false, errors, warnings };
    }

    // Check Tailwind CSS
    const tailwindVersion = await this.getTailwindVersion();
    if (!tailwindVersion) {
      warnings.push(
        "Tailwind CSS not found - components may not display correctly"
      );
    }

    return { isValid: true, errors, warnings };
  }
}

/**
 * Helper function to detect project type without instantiating the class
 */
export async function detectProjectType(): Promise<ProjectType> {
  const detector = new ProjectDetector();
  return detector.detectProjectType();
}
