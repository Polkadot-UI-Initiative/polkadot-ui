import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock external modules used by InitCommand
vi.mock("inquirer", () => ({
  default: {
    prompt: vi.fn(),
  },
  __esModule: true,
}));
vi.mock("ora", () => {
  const spinner = {
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn(),
    fail: vi.fn(),
  };
  const ora = vi.fn(() => spinner);
  ora.prototype = spinner;
  return { default: ora, __esModule: true };
});
const execaDefault = vi.fn().mockResolvedValue({});
(execaDefault as any).command = vi.fn().mockResolvedValue({});
vi.mock("execa", () => ({
  default: execaDefault,
  command: (execaDefault as any).command,
  __esModule: true,
}));
vi.mock("fs/promises", () => {
  const api = {
    stat: vi.fn(),
    readdir: vi.fn(),
    mkdir: vi.fn(),
    writeFile: vi.fn(),
    readFile: vi.fn(),
  };
  return { default: api, ...api, __esModule: true };
});
vi.mock("path", async () => {
  const actual = await vi.importActual<any>("path");
  return { default: actual, ...actual, __esModule: true };
});

// Mocks for internal utils
const mockLogger = {
  detail: vi.fn(),
  info: vi.fn(),
  success: vi.fn(),
  warning: vi.fn(),
  error: vi.fn(),
  subsection: vi.fn(),
  code: vi.fn(),
  newline: vi.fn(),
};
vi.mock("../utils/logger.js", () => ({
  createLogger: vi.fn(() => mockLogger),
  Logger: vi.fn(),
  __esModule: true,
}));

const mockProjectDetector = {
  detectPackageManager: vi.fn().mockResolvedValue("npm"),
  getPackageManagerRunCommand: vi.fn().mockResolvedValue("npx --yes"),
  getPackageManagerInstallCommand: vi.fn().mockResolvedValue("npm install"),
  detectProjectStructure: vi.fn().mockResolvedValue({ srcDir: "src" }),
};
vi.mock("../utils/project-detector.js", () => ({
  ProjectDetector: vi.fn().mockImplementation(() => mockProjectDetector),
  __esModule: true,
}));

const mockTelemetry = {
  trackCommandUsed: vi.fn().mockResolvedValue(void 0),
  trackProjectInitStarted: vi.fn().mockResolvedValue(void 0),
  trackProjectInitCompleted: vi.fn().mockResolvedValue(void 0),
  maybeShowPrivacyNotice: vi.fn().mockResolvedValue(void 0),
};
vi.mock("../utils/telemetry.js", () => ({
  Telemetry: vi.fn().mockImplementation(() => mockTelemetry),
  __esModule: true,
}));

const mockPolkadotDetector = {
  promptForLibrarySelection: vi.fn().mockResolvedValue("papi" as const),
};
vi.mock("../utils/polkadot-detector.js", () => ({
  PolkadotDetector: vi.fn().mockImplementation(() => mockPolkadotDetector),
  __esModule: true,
}));

// Import after mocks
import inquirer from "inquirer";
import ora from "ora";
import execa from "execa";
import fs from "fs/promises";
import path from "path";
import { InitCommand } from "./init.js";

type ProjectSetupConfig = {
  projectName: string;
  framework: "nextjs" | "vite";
  useTypeScript: boolean;
  useESLint: boolean;
  useTailwind: boolean;
  useSrcDirectory: boolean;
  useAppRouter: boolean;
  useTurbopack: boolean;
  importAlias: string;
  polkadotLibrary: "papi" | "dedot";
};

const asAny = (v: unknown) => v as any;

describe("InitCommand", () => {
  const origCwd = process.cwd();
  const chdirSpy = vi.spyOn(process, "chdir");
  const exitSpy = vi.spyOn(process, "exit").mockImplementation(((code?: number) => { throw new Error("process.exit:" + code); }) as any);

  beforeEach(() => {
    vi.clearAllMocks();
    chdirSpy.mockClear();
    (inquirer as any).prompt.mockReset();
    mockProjectDetector.detectPackageManager.mockResolvedValue("npm");
    mockProjectDetector.getPackageManagerRunCommand.mockResolvedValue("npx --yes");
    mockProjectDetector.detectProjectStructure.mockResolvedValue({ srcDir: "src" });
    mockPolkadotDetector.promptForLibrarySelection.mockResolvedValue("papi");
    (fs.stat as any).mockReset();
    (fs.readdir as any).mockReset();
    (fs.mkdir as any).mockReset();
    (fs.writeFile as any).mockReset();
    (fs.readFile as any).mockReset();
    (execa as any).mockClear?.();
    (execa as any).command?.mockClear?.();
  });

  afterEach(() => {
    try { process.chdir(origCwd); } catch {}
  });

  const baseOptions = { verbose: false, dev: false, interactive: false };

  function cmd(context: "standalone" | "from-add" = "standalone") {
    return new InitCommand(baseOptions as any, context);
  }

  it("buildNextJsArgs returns correct flags for defaults", async () => {
    const c = cmd();
    const config: ProjectSetupConfig = {
      projectName: ".",
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
    const args = asAny(c).buildNextJsArgs(config) as string[];
    expect(args).toEqual([
      "create-next-app@latest",
      ".",
      "--yes",
      "--typescript",
      "--eslint",
      "--tailwind",
      "--no-src-dir",
      "--app",
      "--no-turbo",
      "--import-alias=@/*",
    ]);
  });

  it("buildNextJsArgs toggles flags when config booleans flip", async () => {
    const c = cmd();
    const config: ProjectSetupConfig = {
      projectName: ".",
      framework: "nextjs",
      useTypeScript: false,
      useESLint: false,
      useTailwind: false,
      useSrcDirectory: true,
      useAppRouter: false,
      useTurbopack: true,
      importAlias: "#/*",
      polkadotLibrary: "papi",
    };
    const args = asAny(c).buildNextJsArgs(config) as string[];
    expect(args).toEqual([
      "create-next-app@latest",
      ".",
      "--yes",
      "--js",
      "--no-eslint",
      "--no-tailwind",
      "--src-dir",
      "--no-app",
      "--turbo",
      "--import-alias=#/*",
    ]);
  });

  it("buildShadcnArgs includes defaults when non-interactive and toggles src-dir flag", async () => {
    const c = cmd();
    let args = asAny(c).buildShadcnArgs({ useSrcDirectory: true } as any, "shadcn@canary");
    expect(args).toEqual(["shadcn@canary", "init", "--yes", "--base-color", "neutral", "--css-variables", "--src-dir"]);

    args = asAny(c).buildShadcnArgs({ useSrcDirectory: false } as any, "shadcn@canary");
    expect(args).toEqual(["shadcn@canary", "init", "--yes", "--base-color", "neutral", "--css-variables", "--no-src-dir"]);
  });

  it("buildShadcnArgs omits fast flags when interactive", async () => {
    const c = new InitCommand({ ...baseOptions, interactive: true } as any);
    const args = asAny(c).buildShadcnArgs({ useSrcDirectory: true } as any, "shadcn@canary");
    expect(args).toEqual(["shadcn@canary", "init"]);
  });

  it("getPackageManagerCommand parses executable and args", async () => {
    mockProjectDetector.getPackageManagerRunCommand.mockResolvedValue("pnpm dlx");
    const c = cmd();
    const res = await asAny(c).getPackageManagerCommand();
    expect(res).toEqual({ executable: "pnpm", baseArgs: ["dlx"] });
  });

  describe("ensureProjectDirectory", () => {
    const cwd = "/home/user/work";
    beforeEach(() => {
      vi.spyOn(process, "cwd").mockReturnValue(cwd);
    });

    it("creates missing directory and chdir to it", async () => {
      (fs.stat as any).mockRejectedValue(Object.assign(new Error("no such file"), { code: "ENOENT" }));
      (fs.mkdir as any).mockResolvedValue(undefined);

      const c = cmd();
      await asAny(c).ensureProjectDirectory({ projectName: "newproj" } as any);

      const target = path.resolve(cwd, "newproj");
      expect(fs.mkdir).toHaveBeenCalledWith(target, { recursive: true });
      expect(chdirSpy).toHaveBeenCalledWith(target);
    });

    it("accepts empty existing directory and chdir to it", async () => {
      (fs.stat as any).mockResolvedValue({ isDirectory: () => true });
      (fs.readdir as any).mockResolvedValue([]);

      const c = cmd();
      await asAny(c).ensureProjectDirectory({ projectName: "." } as any);

      const target = path.resolve(cwd, ".");
      expect(fs.mkdir).not.toHaveBeenCalled();
      expect(chdirSpy).toHaveBeenCalledWith(target);
    });

    it("throws when existing directory is not empty", async () => {
      (fs.stat as any).mockResolvedValue({ isDirectory: () => true });
      (fs.readdir as any).mockResolvedValue(["file.txt"]);

      const c = cmd();
      await expect(asAny(c).ensureProjectDirectory({ projectName: "exists" } as any))
        .rejects.toThrow(/already exists and is not empty/);
      expect(chdirSpy).not.toHaveBeenCalled();
    });

    it("throws when path exists but is not a directory", async () => {
      (fs.stat as any).mockResolvedValue({ isDirectory: () => false });

      const c = cmd();
      await expect(asAny(c).ensureProjectDirectory({ projectName: "filePath" } as any))
        .rejects.toThrow(/is not a directory/);
      expect(chdirSpy).not.toHaveBeenCalled();
    });

    it("wraps unknown fs error with helpful message", async () => {
      (fs.stat as any).mockRejectedValue(new Error("EACCES: permission denied"));

      const c = cmd();
      await expect(asAny(c).ensureProjectDirectory({ projectName: "p" } as any))
        .rejects.toThrow(/Failed to access project directory: EACCES/);
    });
  });

  describe("configure and file updates", () => {
    it("updateViteConfig writes config with alias to srcDir", async () => {
      mockProjectDetector.detectProjectStructure.mockResolvedValue({ srcDir: "src" });
      const c = cmd();
      await asAny(c).updateViteConfig({
        useTypeScript: true,
        importAlias: "@/*",
      } as any);
      expect(fs.writeFile).toHaveBeenCalledTimes(1);
      const [file, content] = (fs.writeFile as any).mock.calls[0];
      expect(file).toBe("vite.config.ts");
      expect(String(content)).toContain('import tailwindcss from \'@tailwindcss/vite\'');
      expect(String(content)).toContain('"@": path.resolve(__dirname, "src")');
    });

    it("updateTsConfig adds baseUrl and paths and writes back", async () => {
      (fs.readFile as any).mockResolvedValueOnce(JSON.stringify({ compilerOptions: {} }, null, 2));
      const c = cmd();
      await asAny(c).updateTsConfig({ importAlias: "@/*" } as any);
      expect(fs.writeFile).toHaveBeenCalledWith(
        "tsconfig.json",
        expect.stringContaining('"paths": {\n        "@/*": [\n          "./*"\n        ]\n      }'),
      );
    });

    it("updateTsConfig warns and does not throw on read error", async () => {
      (fs.readFile as any).mockRejectedValueOnce(new Error("no tsconfig"));
      const c = cmd();
      await expect(asAny(c).updateTsConfig({ importAlias: "@/*" } as any)).resolves.toBeUndefined();
      expect(mockLogger.warning).toHaveBeenCalledWith("Failed to update tsconfig.json for import alias");
    });

    it("updateViteCSS writes tailwind import, warns on failure", async () => {
      const c = cmd();
      await asAny(c).updateViteCSS({} as any);
      expect(fs.writeFile).toHaveBeenCalledWith("src/index.css", '@import "tailwindcss";\n');

      (fs.writeFile as any).mockRejectedValueOnce(new Error("disk full"));
      await asAny(c).updateViteCSS({} as any);
      expect(mockLogger.warning).toHaveBeenCalledWith("Failed to update CSS file for Tailwind CSS");
    });
  });

  describe("installPolkadotLibrary", () => {
    it("installs papi via installPapiLibrary", async () => {
      const c = cmd();
      const papiSpy = vi.spyOn(asAny(c), "installPapiLibrary").mockResolvedValue();
      await asAny(c).installPolkadotLibrary({ polkadotLibrary: "papi" } as any);
      expect(papiSpy).toHaveBeenCalledWith("npm", "install");
    });

    it("installs dedot via installDedotLibrary and verifies", async () => {
      const c = cmd();
      const dedotSpy = vi.spyOn(asAny(c), "installDedotLibrary").mockResolvedValue();
      const verifySpy = vi.spyOn(asAny(c), "verifyDedotInstallation").mockResolvedValue();
      await asAny(c).installPolkadotLibrary({ polkadotLibrary: "dedot" } as any);
      expect(dedotSpy).toHaveBeenCalledWith("npm", "install");
      expect(verifySpy).toHaveBeenCalled();
    });

    it("propagates install error", async () => {
      const c = cmd();
      vi.spyOn(asAny(c), "installPapiLibrary").mockRejectedValue(new Error("timeout"));
      await expect(asAny(c).installPolkadotLibrary({ polkadotLibrary: "papi" } as any))
        .rejects.toThrow(/Failed to install polkadot-api: timeout/);
    });
  });

  describe("verifyDedotInstallation", () => {
    const pkg = {
      dependencies: { dedot: "^1.0.0" },
      devDependencies: { "@dedot/chaintypes": "^1.0.0" },
    };

    it("succeeds when both deps present", async () => {
      (fs.readFile as any).mockResolvedValueOnce(JSON.stringify(pkg));
      const c = cmd();
      await expect(asAny(c).verifyDedotInstallation()).resolves.toBeUndefined();
    });

    it("fails when missing any dependency", async () => {
      (fs.readFile as any).mockResolvedValueOnce(JSON.stringify({ dependencies: {}, devDependencies: {} }));
      const c = cmd();
      await expect(asAny(c).verifyDedotInstallation()).rejects.toThrow(/Dedot installation is incomplete/);
    });
  });

  describe("project creation flows", () => {
    it("createNextJsProject builds args and calls execa with run command", async () => {
      mockProjectDetector.getPackageManagerRunCommand.mockResolvedValue("pnpm dlx");
      const c = cmd();
      const execaSpy = execa as unknown as vi.Mock;
      await asAny(c).createNextJsProject({
        useTypeScript: true,
        useESLint: true,
        useTailwind: true,
        useSrcDirectory: false,
        useAppRouter: true,
        useTurbopack: false,
        importAlias: "@/*",
      } as any);
      expect(execaSpy).toHaveBeenCalled();
      const [exe, args, options] = (execaSpy as any).mock.calls[0];
      expect(exe).toBe("pnpm");
      expect(args[0]).toBe("dlx");
      expect(args).toContain("create-next-app@latest");
      expect(options).toMatchObject({ stdio: "pipe", timeout: 300000, env: expect.any(Object) });
    });

    it("createViteProject uses non-interactive fast path and configures", async () => {
      mockProjectDetector.getPackageManagerRunCommand.mockResolvedValue("npx --yes");
      const c = cmd();
      const installDepsSpy = vi.spyOn(asAny(c), "installViteDependencies").mockResolvedValue();
      const configureSpy = vi.spyOn(asAny(c), "configureViteProject").mockResolvedValue();

      await asAny(c).createViteProject({ framework: "vite", useTypeScript: true } as any);
      expect(execaDefault).toHaveBeenCalledWith("npx", ["--yes", "create-vite@latest", ".", "--template", "react-ts"], expect.any(Object));
      expect(installDepsSpy).toHaveBeenCalled();
      expect(configureSpy).toHaveBeenCalled();
    });

    it("createProject branches by framework and handles spinner success", async () => {
      const c = cmd();
      const ensureSpy = vi.spyOn(asAny(c), "ensureProjectDirectory").mockResolvedValue();
      const nextSpy = vi.spyOn(asAny(c), "createNextJsProject").mockResolvedValue();
      await asAny(c).createProject({ projectName: "x", framework: "nextjs" } as any);
      expect(ensureSpy).toHaveBeenCalled();
      expect(nextSpy).toHaveBeenCalled();
    });

    it("createProject throws wrapped error on failure", async () => {
      const c = cmd();
      vi.spyOn(asAny(c), "ensureProjectDirectory").mockResolvedValue();
      vi.spyOn(asAny(c), "createViteProject").mockRejectedValue(new Error("boom"));
      await expect(asAny(c).createProject({ framework: "vite" } as any))
        .rejects.toThrow(/Failed to create vite project: boom/);
    });
  });

  describe("runEssentialSetup", () => {
    it("prompts for project & framework and selects polkadot library", async () => {
      (inquirer as any).prompt.mockResolvedValue({ projectName: "my-app", framework: "vite" });
      mockPolkadotDetector.promptForLibrarySelection.mockResolvedValue("dedot");

      const c = cmd();
      const result = await asAny(c).runEssentialSetup("cwd-name");
      expect(result).toMatchObject({
        projectName: "my-app",
        framework: "vite",
        polkadotLibrary: "dedot",
        useTypeScript: true,
        useESLint: true,
        useTailwind: true,
        useSrcDirectory: false,
        useAppRouter: true,
        useTurbopack: false,
        importAlias: "@/*",
      });
    });
  });

  describe("execute end-to-end orchestration", () => {
    it("succeeds and sends telemetry and privacy notice", async () => {
      // stub internals to avoid heavy side effects
      const c = cmd();
      vi.spyOn(asAny(c), "promptProjectSetup").mockResolvedValue({
        projectName: ".",
        framework: "nextjs",
        useTypeScript: true,
        useESLint: true,
        useTailwind: true,
        useSrcDirectory: false,
        useAppRouter: true,
        useTurbopack: false,
        importAlias: "@/*",
        polkadotLibrary: "papi",
      } as ProjectSetupConfig);
      vi.spyOn(asAny(c), "createProject").mockResolvedValue();
      vi.spyOn(asAny(c), "installPolkadotLibrary").mockResolvedValue();
      vi.spyOn(asAny(c), "initializeShadcn").mockResolvedValue();
      vi.spyOn(asAny(c), "showSuccessMessage").mockImplementation(() => {});

      await expect(c.execute()).resolves.toBeUndefined();

      expect(mockTelemetry.trackCommandUsed).toHaveBeenCalledWith("init", expect.any(Object));
      expect(mockTelemetry.trackProjectInitStarted).toHaveBeenCalled();
      expect(mockTelemetry.trackProjectInitCompleted).toHaveBeenCalledWith("nextjs", expect.objectContaining({
        has_typescript: true,
        has_tailwind: true,
        package_manager: "npm",
        duration_ms: expect.any(Number),
      }));
      expect(mockTelemetry.maybeShowPrivacyNotice).toHaveBeenCalled();
    });

    it("handles failure path by delegating to error handler and exiting", async () => {
      const c = cmd();
      vi.spyOn(asAny(c), "promptProjectSetup").mockRejectedValue(new Error("network timeout"));
      const errorSpy = vi.spyOn(asAny(c), "handleInitializationError").mockResolvedValue();

      await c.execute();
      expect(errorSpy).toHaveBeenCalled();
    });
  });

  describe("handleInitializationError", () => {
    it("logs and shows recovery suggestions then exits(1)", async () => {
      const c = cmd();
      const recSpy = vi.spyOn(asAny(c), "showRecoverySuggestions").mockImplementation(() => {});
      await expect(asAny(c).handleInitializationError(new Error("ETIMEDOUT"))).rejects.toThrow(/process\.exit:1/);
      expect(recSpy).toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith("Project initialization failed");
    });
  });
});