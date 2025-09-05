/* 
Test suite for AddCommand.

Testing library/framework note:
- This suite is written for Vitest (vi.mock, describe/it/expect). If the repository uses Jest, replace vi with jest or ensure Vitest compatibility layer is present.

The tests mock external dependencies heavily to make AddCommand unit-testable.
*/

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Module under test
import { AddCommand } from "./add";

// Mocked external modules
vi.mock("ora", () => {
  const spinner = {
    start: vi.fn().mockReturnThis(),
    stop: vi.fn(),
    succeed: vi.fn(),
    fail: vi.fn(),
    text: "",
  };
  const ora = vi.fn(() => spinner);
  // For calls like ora("...").start()
  ora.default = (msg?: string) => {
    return {
      start: vi.fn().mockReturnThis(),
      stop: vi.fn(),
      succeed: vi.fn(),
      fail: vi.fn(),
      text: msg ?? "",
    };
  };
  return { default: ora };
});

vi.mock("inquirer", () => ({
  default: {
    prompt: vi.fn(),
  },
}));

vi.mock("execa", () => ({
  execa: vi.fn(),
  default: vi.fn(), // some codebases import default
}));

// fs/promises used in ensureShadcnInitialized
vi.mock("fs/promises", () => ({
  access: vi.fn(),
}));

// Mock logger with all used methods
vi.mock("../utils/logger", () => {
  const logger = {
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    detail: vi.fn(),
    code: vi.fn(),
    newline: vi.fn(),
    subsection: vi.fn(),
    success: vi.fn(),
    showReactRequirements: vi.fn(),
    showValidationErrors: vi.fn(),
    showProjectGuidance: vi.fn(),
    showNextSteps: vi.fn(),
  };
  return { logger, default: logger };
});

// Mock helper: isValidComponentName
vi.mock("../utils/validation", () => ({
  isValidComponentName: vi.fn((name: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)),
}));

// Mock classes constructed inside AddCommand
vi.mock("../services/registry", () => {
  class Registry {
    private connected = true;
    private url = "https://registry.example.com";
    private selected: "papi" | "dedot" | null = null;
    constructor(_dev?: boolean) {}
    async getRegistryInfo() {
      return { isConnected: this.connected, url: this.url };
    }
    async fetchComponent(name: string) {
      if (name === "unknown") return null;
      return {
        name,
        title: name.toUpperCase(),
        description: "A test component",
        dependencies: [],
      };
    }
    async searchComponents(_q: string) {
      return [{ name: "block-number", description: "Shows block number" }];
    }
    setSelectedLibrary(lib: any) {
      this.selected = lib;
    }
    getSelectedLibrary() {
      return this.selected;
    }
  }
  return { Registry };
});

vi.mock("../services/project-detector", () => {
  class ProjectDetector {
    async hasPackageJson() { return true; }
    async hasReact() { return true; }
    async validateProject() { return { isValid: true, errors: [], warnings: [] }; }
    async detectProjectStructure() {
      return {
        isNextJs: false,
        isVite: true,
        isCRA: false,
        hasTypeScript: true,
        packageManager: "pnpm",
        srcDir: "src",
      };
    }
    async getPackageManagerRunCommand() { return "pnpm dlx"; }
    async getTailwindVersion() { return 4; }
    async detectPackageManager() { return "pnpm"; }
  }
  return { ProjectDetector };
});

vi.mock("../services/polkadot-detector", () => {
  class PolkadotDetector {
    private lib: "papi" | "dedot" | "none" = "papi";
    setLibrary(lib: "papi" | "dedot" | "none") { this.lib = lib; }
    async getPolkadotApiConfig() { 
      return { hasExistingConfig: false, existingChains: [] }; 
    }
    async detectPolkadotLibrary() { return this.lib; }
    async promptForLibrarySelection(_opts: any) { return "papi"; }
    async hasDedot() { return this.lib === "dedot"; }
    async hasChainTypes() { return false; }
  }
  return { PolkadotDetector };
});

vi.mock("../services/telemetry", () => {
  class Telemetry {
    constructor(_opts: any) {}
    trackCommandUsed = vi.fn().mockResolvedValue(undefined);
    trackComponentAddStarted = vi.fn().mockResolvedValue(undefined);
    trackComponentAddCompleted = vi.fn().mockResolvedValue(undefined);
    trackComponentAddFailed = vi.fn().mockResolvedValue(undefined);
    trackLibraryDetected = vi.fn().mockResolvedValue(undefined);
    maybeShowPrivacyNotice = vi.fn().mockResolvedValue(undefined);
  }
  return { Telemetry };
});

// InitCommand used during handleMissingProject
vi.mock("./init", () => {
  class InitCommand {
    constructor(_opts: any, _from: string) {}
    async execute() { /* no-op */ }
  }
  return { InitCommand };
});

// Bring mocked items into scope for assertions
import inquirer from "inquirer";
import logger from "../utils/logger";
import { execa as execaNamed } from "execa";
import fs from "fs/promises";
import { isValidComponentName } from "../utils/validation";
import { ProjectDetector } from "../services/project-detector";
import { PolkadotDetector } from "../services/polkadot-detector";
import { Telemetry } from "../services/telemetry";

const execaMock = execaNamed as unknown as vi.Mock;

const makeCmd = (overrides: Partial<any> = {}) => {
  return new AddCommand({
    interactive: false,
    dev: false,
    verbose: false,
    ...overrides,
  } as any);
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2025-01-01T00:00:00Z")); // stable time
  vi.clearAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("AddCommand - validateComponentName guards via execute()", () => {
  it("returns early and logs usage when component name is missing", async () => {
    const cmd = makeCmd();
    await cmd.execute("" as any);

    expect(logger.error).toHaveBeenCalledWith("Component name is required");
    expect(logger.info).toHaveBeenCalledWith("Usage: polkadot-ui add <component-name>");
    // Should not proceed to telemetry or execa
    expect(execaMock).not.toHaveBeenCalled();
  });

  it("returns early for invalid kebab-case names", async () => {
    (isValidComponentName as vi.Mock).mockReturnValueOnce(false);
    const cmd = makeCmd();
    await cmd.execute("BlockNumber");

    expect(logger.error).toHaveBeenCalledWith("Invalid component name: BlockNumber");
    expect(execaMock).not.toHaveBeenCalled();
  });

  it("accepts valid kebab-case names", async () => {
    (isValidComponentName as vi.Mock).mockReturnValueOnce(true);
    const cmd = makeCmd();
    // To avoid deep path execution, stub ahead: make registry fetch fail to stop later
    execaMock.mockResolvedValue({ stdout: "" });
    const pd = new ProjectDetector();
    vi.spyOn(pd, "validateProject").mockResolvedValue({ isValid: true, errors: [], warnings: [] });
    await cmd.execute("block-number");
    // either proceeds further or early exits later; just ensure no initial validation errors
    expect(logger.error).not.toHaveBeenCalledWith(expect.stringContaining("Invalid component name"));
  });
});

describe("AddCommand - validateProjectSetup flows", () => {
  it("auto-creates project in fast mode when no package.json", async () => {
    const pd = new ProjectDetector();
    vi.spyOn(pd, "hasPackageJson").mockResolvedValueOnce(false);

    // monkey-patch instance detector used by AddCommand by mocking method on prototype
    vi.spyOn(ProjectDetector.prototype, "hasPackageJson").mockResolvedValueOnce(false);
    const structure = {
      isNextJs: false, isVite: true, isCRA: false,
      hasTypeScript: true, packageManager: "pnpm", srcDir: "src",
    };
    vi.spyOn(ProjectDetector.prototype, "detectProjectStructure").mockResolvedValue(structure as any);

    const cmd = makeCmd({ interactive: false });
    await cmd.execute("block-number");

    expect(logger.info).toHaveBeenCalledWith(
      "No project found. Creating new project automatically (fast mode)"
    );
    // After init, it should log success
    expect(logger.success).toHaveBeenCalledWith("Project initialized successfully");
  });

  it("shows React requirements if React not detected", async () => {
    vi.spyOn(ProjectDetector.prototype, "hasReact").mockResolvedValueOnce(false);
    const cmd = makeCmd();
    await cmd.execute("block-number");

    expect(logger.showReactRequirements).toHaveBeenCalled();
  });

  it("shows validation errors when project invalid", async () => {
    vi.spyOn(ProjectDetector.prototype, "validateProject")
      .mockResolvedValueOnce({ isValid: false, errors: ["err"], warnings: ["warn"] } as any);
    const cmd = makeCmd();
    await cmd.execute("block-number");

    expect(logger.showValidationErrors).toHaveBeenCalledWith(["err"], ["warn"]);
  });
});

describe("AddCommand - registry and component availability", () => {
  it("handles registry connection failure", async () => {
    // Make getRegistryInfo return disconnected
    vi.spyOn((AddCommand as any).prototype, "validateComponentAvailability");
    // Instead, mock Registry.getRegistryInfo via prototype injection:
    const regMod = await vi.importMock("../services/registry");
    // Override instance method on prototype used by AddCommand's internal instance:
    (regMod as any).Registry.prototype.getRegistryInfo = vi.fn().mockResolvedValue({
      isConnected: false,
      url: "https://registry.example.com",
      error: "timeout",
    });

    const cmd = makeCmd();
    await cmd.execute("block-number");

    expect(logger.error).toHaveBeenCalledWith(
      "Cannot connect to registry: https://registry.example.com"
    );
  });

  it("suggests similar components when not found", async () => {
    // fetchComponent returns null when name === "unknown" in our mock
    const cmd = makeCmd();
    await cmd.execute("unknown");

    expect(logger.error).toHaveBeenCalledWith('Component "unknown" not found in registry');
    expect(logger.subsection).toHaveBeenCalledWith("Did you mean one of these?");
  });
});

describe("AddCommand - success path telemetry and end-to-end skeleton", () => {
  it("tracks start and completion telemetry with computed fields", async () => {
    // Ensure component exists
    const cmd = makeCmd({ interactive: false });

    // Avoid real execa; provide benign resolves for shadcn and papi commands
    execaMock.mockResolvedValue({ stdout: "" });

    // Force polkadot library detection to 'papi' to avoid selection prompt
    vi.spyOn(PolkadotDetector.prototype, "detectPolkadotLibrary").mockResolvedValue("papi");

    await cmd.execute("block-number");

    // Start tracking
    expect((Telemetry as any).prototype.trackCommandUsed).toHaveBeenCalledWith(
      "add",
      expect.objectContaining({ framework: "vite", has_typescript: true })
    );
    expect((Telemetry as any).prototype.trackComponentAddStarted).toHaveBeenCalled();

    // Completion tracking
    expect((Telemetry as any).prototype.trackComponentAddCompleted).toHaveBeenCalledWith(
      "block-number",
      expect.objectContaining({ project_type: "vite", has_tailwind: true, polkadot_library: expect.any(String) })
    );

    // Privacy notice after success
    expect((Telemetry as any).prototype.maybeShowPrivacyNotice).toHaveBeenCalled();
  });
});

describe("AddCommand - Polkadot detection branches", () => {
  it('when library is "none", prompts for selection and sets registry selectedLibrary', async () => {
    vi.spyOn(PolkadotDetector.prototype, "detectPolkadotLibrary").mockResolvedValueOnce("none");
    vi.spyOn(PolkadotDetector.prototype, "promptForLibrarySelection").mockResolvedValueOnce("papi");

    const cmd = makeCmd();
    await cmd.execute("block-number");

    // Library selection telemetry
    expect((Telemetry as any).prototype.trackLibraryDetected).toHaveBeenCalledWith(
      "none",
      "papi",
      true
    );
  });

  it('when library is "dedot", performs dedot setup path', async () => {
    vi.spyOn(PolkadotDetector.prototype, "detectPolkadotLibrary").mockResolvedValueOnce("dedot");
    execaMock.mockResolvedValue({ stdout: "" });

    const cmd = makeCmd();
    await cmd.execute("block-number");

    // Dedot path logs
    expect(logger.info).toHaveBeenCalledWith("Dedot setup complete");
  });
});

describe("AddCommand - shadcn install/init", () => {
  it("initializes shadcn when components.json missing and uses canary with Tailwind v4", async () => {
    // components.json doesn't exist
    (fs.access as vi.Mock).mockRejectedValueOnce(Object.assign(new Error("no file"), { code: "ENOENT" }));
    execaMock.mockResolvedValue({ stdout: "" });

    const cmd = makeCmd({ interactive: false });
    await cmd.execute("block-number");

    // Expect execa invoked for shadcn init with @canary and --yes flags
    const calls = execaMock.mock.calls.map(c => c[1].join(" "));
    expect(calls.some(args => args.includes("shadcn@canary") && args.includes("init"))).toBe(true);
    expect(calls.some(args => args.includes("--yes"))).toBe(true);
  });

  it("uses --yes on shadcn add in fast mode and logs command", async () => {
    (fs.access as vi.Mock).mockResolvedValueOnce(true); // components.json exists; skip init
    execaMock.mockResolvedValue({ stdout: "" });

    const cmd = makeCmd({ interactive: false });
    await cmd.execute("block-number");

    const addCall = execaMock.mock.calls.find(c => c[1]?.includes("add"));
    expect(addCall).toBeTruthy();
    expect((addCall?.[1] as string[]).includes("--yes")).toBe(true);
  });
});

describe("AddCommand - papi chain install", () => {
  it("installs default chains when none configured and handles OOM gracefully", async () => {
    // Force papi path and trigger OOM on first chain
    vi.spyOn(PolkadotDetector.prototype, "detectPolkadotLibrary").mockResolvedValue("papi");
    vi.spyOn(PolkadotDetector.prototype, "getPolkadotApiConfig").mockResolvedValue({
      hasExistingConfig: false,
      existingChains: [],
    });

    // First papi add fails with OOM; handleChainInstallError should process and throw
    execaMock.mockImplementation((cmd: string, args?: string[]) => {
      const joined = [cmd, ...(args ?? [])].join(" ");
      if (joined.includes("papi add")) {
        const err = new Error("JS heap out of memory");
        return Promise.reject(err);
      }
      return Promise.resolve({ stdout: "" } as any);
    });

    const cmd = makeCmd();

    await expect(cmd.execute("block-number")).rejects.toThrow(/Memory limit exceeded/);

    expect(logger.subsection).toHaveBeenCalledWith("Memory error solutions:");
    expect(logger.code).toHaveBeenCalledWith(
      expect.stringContaining('NODE_OPTIONS="--max-old-space-size=8192"')
    );
  });
});

describe("AddCommand - error handling exits and telemetry", () => {
  it("tracks failure and exits with code 1 on thrown error", async () => {
    // Force early throw from registry fetch
    const regMod = await vi.importMock("../services/registry");
    (regMod as any).Registry.prototype.fetchComponent = vi.fn().mockRejectedValue(new Error("network fail"));

    const exitSpy = vi.spyOn(process, "exit").mockImplementationOnce(((code?: number) => {
      throw new Error(`process.exit:${code}`);
    }) as any);

    const cmd = makeCmd();

    await expect(cmd.execute("block-number")).rejects.toThrow(/process\.exit:1/);

    expect((Telemetry as any).prototype.trackComponentAddFailed).toHaveBeenCalledWith(
      "block-number",
      "Failed to check component availability: network fail"
    );
    expect(logger.subsection).toHaveBeenCalled(); // recovery section displayed
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});