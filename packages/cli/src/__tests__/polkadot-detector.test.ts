import fs from "fs/promises";
import path from "path";
import { PolkadotDetector } from "../utils/polkadot-detector";
import type {
  PolkadotLibrary,
  PolkadotApiConfig,
  PackageJson,
} from "../types/index";

// Mock fs.promises
jest.mock("fs/promises");
const mockFs = fs as jest.Mocked<typeof fs>;

// Helper functions for common mock patterns
function mockPackageJsonRead(
  packageJson: PackageJson | null,
  additionalFiles?: Record<string, any>
) {
  mockFs.readFile.mockImplementation((filePath: any) => {
    const pathStr = filePath.toString();
    if (pathStr.includes("package.json")) {
      if (packageJson === null) {
        return Promise.reject(new Error("ENOENT: no such file"));
      }
      return Promise.resolve(JSON.stringify(packageJson));
    }

    // Handle additional files (like polkadot-api.json)
    if (additionalFiles) {
      for (const [fileName, content] of Object.entries(additionalFiles)) {
        if (pathStr.includes(fileName)) {
          return Promise.resolve(JSON.stringify(content));
        }
      }
    }

    return Promise.reject(new Error("File not found"));
  });
}

function mockDirectoryExists(exists: boolean = true) {
  if (exists) {
    const mockStat = { isDirectory: () => true };
    mockFs.stat.mockResolvedValue(mockStat as any);
  } else {
    mockFs.stat.mockRejectedValue(new Error("ENOENT"));
  }
}

describe("PolkadotDetector", () => {
  let detector: PolkadotDetector;
  const mockCwd = "/test/project";

  beforeEach(() => {
    jest.clearAllMocks();
    // Create a completely new detector instance for each test
    detector = new PolkadotDetector(mockCwd);
    // Ensure the cache is completely cleared
    detector.clearCache();
  });

  describe("Package Detection", () => {
    describe("hasPapi", () => {
      it("should return true when polkadot-api is in dependencies", async () => {
        const mockPackageJson: PackageJson = {
          name: "test-project",
          dependencies: {
            "polkadot-api": "^1.14.1",
          },
        };
        mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));

        const result = await detector.hasPapi();

        expect(result).toBe(true);
        expect(mockFs.readFile).toHaveBeenCalledWith(
          path.join(mockCwd, "package.json"),
          "utf-8"
        );
      });

      it("should return true when polkadot-api is in devDependencies", async () => {
        const mockPackageJson: PackageJson = {
          name: "test-project",
          devDependencies: {
            "polkadot-api": "^1.0.0",
          },
        };
        mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));

        const result = await detector.hasPapi();

        expect(result).toBe(true);
      });

      it("should return false when polkadot-api is not installed", async () => {
        const mockPackageJson: PackageJson = {
          name: "test-project",
          dependencies: {
            react: "^18.0.0",
          },
        };
        mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));

        const result = await detector.hasPapi();

        expect(result).toBe(false);
      });

      it("should return false when package.json is not found", async () => {
        mockFs.readFile.mockRejectedValueOnce(new Error("ENOENT"));

        const result = await detector.hasPapi();

        expect(result).toBe(false);
      });
    });

    describe("hasDedot", () => {
      it("should return true when dedot is in dependencies", async () => {
        const mockPackageJson: PackageJson = {
          name: "test-project",
          dependencies: {
            dedot: "^1.0.0",
          },
        };
        mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));

        const result = await detector.hasDedot();

        expect(result).toBe(true);
      });

      it("should return true when dedot is in devDependencies", async () => {
        const mockPackageJson: PackageJson = {
          name: "test-project",
          devDependencies: {
            dedot: "^1.0.0",
          },
        };
        mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));

        const result = await detector.hasDedot();

        expect(result).toBe(true);
      });

      it("should return false when dedot is not installed", async () => {
        const mockPackageJson: PackageJson = {
          name: "test-project",
          dependencies: {
            react: "^18.0.0",
          },
        };
        mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));

        const result = await detector.hasDedot();

        expect(result).toBe(false);
      });
    });

    describe("hasDescriptors", () => {
      it("should return true when @polkadot-api/descriptors is installed", async () => {
        const mockPackageJson: PackageJson = {
          name: "test-project",
          dependencies: {
            "@polkadot-api/descriptors": "^1.0.0",
          },
        };
        mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));

        const result = await detector.hasDescriptors();

        expect(result).toBe(true);
      });

      it("should return false when @polkadot-api/descriptors is not installed", async () => {
        const mockPackageJson: PackageJson = {
          name: "test-project",
          dependencies: {
            "polkadot-api": "^1.0.0",
          },
        };
        mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));

        const result = await detector.hasDescriptors();

        expect(result).toBe(false);
      });
    });
  });

  describe("Library Detection", () => {
    describe("detectPolkadotLibrary", () => {
      it("should return 'papi' when polkadot-api is installed", async () => {
        const mockPackageJson: PackageJson = {
          name: "test-project",
          dependencies: {
            "polkadot-api": "^1.0.0",
          },
        };
        mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));

        const result = await detector.detectPolkadotLibrary();

        expect(result).toBe("papi");
      });

      it("should return 'dedot' when dedot is installed", async () => {
        const mockPackageJson: PackageJson = {
          name: "test-project",
          dependencies: {
            dedot: "^1.0.0",
          },
        };
        mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));

        const result = await detector.detectPolkadotLibrary();

        expect(result).toBe("dedot");
      });

      it("should return 'papi' when both are installed (papi takes precedence)", async () => {
        const mockPackageJson: PackageJson = {
          name: "test-project",
          dependencies: {
            "polkadot-api": "^1.0.0",
            dedot: "^1.0.0",
          },
        };
        mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));

        const result = await detector.detectPolkadotLibrary();

        expect(result).toBe("papi");
      });

      it("should return 'none' when neither is installed", async () => {
        const mockPackageJson: PackageJson = {
          name: "test-project",
          dependencies: {
            react: "^18.0.0",
          },
        };
        mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));

        const result = await detector.detectPolkadotLibrary();

        expect(result).toBe("none");
      });
    });
  });

  describe("Configuration Detection", () => {
    describe("hasPapiConfig", () => {
      it("should return true when .papi directory exists", async () => {
        const mockStat = { isDirectory: () => true };
        mockFs.stat.mockResolvedValueOnce(mockStat as any);

        const result = await detector.hasPapiConfig();

        expect(result).toBe(true);
        expect(mockFs.stat).toHaveBeenCalledWith(path.join(mockCwd, ".papi"));
      });

      it("should return false when .papi directory does not exist", async () => {
        mockFs.stat.mockRejectedValueOnce(new Error("ENOENT"));

        const result = await detector.hasPapiConfig();

        expect(result).toBe(false);
      });

      it("should return false when .papi exists but is not a directory", async () => {
        const mockStat = { isDirectory: () => false };
        mockFs.stat.mockResolvedValueOnce(mockStat as any);

        const result = await detector.hasPapiConfig();

        expect(result).toBe(false);
      });
    });

    describe("getPapiConfig", () => {
      it("should return chain configuration when .papi/polkadot-api.json exists", async () => {
        const mockConfig = {
          version: 0,
          descriptorPath: ".papi/descriptors",
          entries: {
            polkadot: {
              chain: "polkadot",
              metadata: ".papi/metadata/polkadot.scale",
              genesis:
                "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
              codeHash: "0x.....",
            },
          },
        };
        mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockConfig));

        const result = await detector.getPapiConfig();

        expect(result).toEqual({ chains: ["polkadot"] });
        expect(mockFs.readFile).toHaveBeenCalledWith(
          path.join(mockCwd, ".papi", "polkadot-api.json"),
          "utf-8"
        );
      });

      it("should return multiple chains when multiple entries exist", async () => {
        const mockConfig = {
          version: 0,
          descriptorPath: ".papi/descriptors",
          entries: {
            paseo_asset_hub: {
              chain: "paseo_asset_hub",
              metadata: ".papi/metadata/paseo_asset_hub.scale",
              genesis:
                "0xd6eec26135305a8ad257a20d003357284c8aa03d0bdb2b357ab0a22371e11ef2",
              codeHash:
                "0xb7f52ff9b4fb5124568a5b8cbfcebba2bc9318bcb5916b69457c10bc6a2d0ac5",
            },
            paseo: {
              chain: "paseo",
              metadata: ".papi/metadata/paseo.scale",
              genesis:
                "0x77afd6190f1554ad45fd0d31aee62aacc33c6db0ea801129acb813f913e0764f",
              codeHash:
                "0xcc4b027a0dbb5e0f389dd8418c41012d618290a22f84af8411c8fd20b2738304",
            },
          },
        };
        mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockConfig));

        const result = await detector.getPapiConfig();

        expect(result).toEqual({
          chains: ["paseo_asset_hub", "paseo"],
        });
      });

      it("should return null when .papi/polkadot-api.json does not exist", async () => {
        mockFs.readFile.mockRejectedValueOnce(new Error("ENOENT"));

        const result = await detector.getPapiConfig();

        expect(result).toBeNull();
      });

      it("should return empty chains when entries object is empty", async () => {
        const mockConfig = {
          version: 0,
          descriptorPath: ".papi/descriptors",
          entries: {},
        };
        mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockConfig));

        const result = await detector.getPapiConfig();

        expect(result).toEqual({ chains: [] });
      });

      it("should handle missing entries field gracefully", async () => {
        const mockConfig = {
          version: 0,
          descriptorPath: ".papi/descriptors",
          // no entries field
        };
        mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockConfig));

        const result = await detector.getPapiConfig();

        expect(result).toEqual({ chains: [] });
      });
    });

    describe("hasPolkadotConfig", () => {
      it("should return true when polkadot-config.ts exists", async () => {
        mockFs.access.mockResolvedValueOnce(undefined);

        const result = await detector.hasPolkadotConfig();

        expect(result).toBe(true);
        expect(mockFs.access).toHaveBeenCalledWith(
          path.join(mockCwd, "polkadot-config.ts")
        );
      });

      it("should return false when polkadot-config.ts does not exist", async () => {
        mockFs.access.mockRejectedValueOnce(new Error("ENOENT"));

        const result = await detector.hasPolkadotConfig();

        expect(result).toBe(false);
      });
    });
  });

  describe("Complete Configuration Analysis", () => {
    describe("getPolkadotApiConfig", () => {
      it("should return complete config with papi setup", async () => {
        // Mock papi installation
        const mockPackageJson = {
          dependencies: { "polkadot-api": "1.0.0" },
        };

        const mockConfig = {
          version: 0,
          descriptorPath: ".papi/descriptors",
          entries: {
            polkadot: {
              chain: "polkadot",
              metadata: ".papi/metadata/polkadot.scale",
            },
            paseo: {
              chain: "paseo",
              metadata: ".papi/metadata/paseo.scale",
            },
          },
        };

        // Mock package.json and config files
        mockPackageJsonRead(mockPackageJson, {
          "polkadot-api.json": mockConfig,
        });
        mockDirectoryExists(true);

        const result = await detector.getPolkadotApiConfig();

        expect(result).toEqual({
          hasExistingConfig: true,
          existingChains: ["polkadot", "paseo"],
          hasPapi: true,
          hasDedot: false,
        });
      });

      it("should return config with dedot setup", async () => {
        // Mock dedot installation
        const mockPackageJson = {
          dependencies: { dedot: "1.0.0" },
        };

        // Mock package.json, no .papi directory
        mockPackageJsonRead(mockPackageJson);
        mockDirectoryExists(false);

        const result = await detector.getPolkadotApiConfig();

        expect(result).toEqual({
          hasExistingConfig: false,
          existingChains: [],
          hasPapi: false,
          hasDedot: true,
        });
      });

      it("should return empty config when no polkadot libraries are installed", async () => {
        // Mock no polkadot libraries
        const mockPackageJson = {
          dependencies: { react: "18.0.0" },
        };

        // Mock package.json, no .papi directory
        mockPackageJsonRead(mockPackageJson);
        mockDirectoryExists(false);

        const result = await detector.getPolkadotApiConfig();

        expect(result).toEqual({
          hasExistingConfig: false,
          existingChains: [],
          hasPapi: false,
          hasDedot: false,
        });
      });
    });
  });

  describe("Setup Requirements", () => {
    describe("needsPolkadotSetup", () => {
      it("should return false when component does not require polkadot", async () => {
        const result = await detector.needsPolkadotSetup(false);

        expect(result).toBe(false);
      });

      it("should return true when no polkadot library is installed", async () => {
        const freshDetector = new PolkadotDetector(mockCwd);
        const mockPackageJson: PackageJson = {
          dependencies: { react: "^18.0.0" },
        };
        mockPackageJsonRead(mockPackageJson);

        const result = await freshDetector.needsPolkadotSetup(true);

        expect(result).toBe(true);
      });

      it("should return true when papi is installed but not configured", async () => {
        const freshDetector = new PolkadotDetector(mockCwd);
        const mockPackageJson: PackageJson = {
          dependencies: { "polkadot-api": "^1.0.0" },
        };
        mockPackageJsonRead(mockPackageJson);
        mockDirectoryExists(false);

        const result = await freshDetector.needsPolkadotSetup(true);

        expect(result).toBe(true);
      });

      it("should return false when papi is fully configured", async () => {
        const freshDetector = new PolkadotDetector(mockCwd);
        const mockPackageJson: PackageJson = {
          dependencies: {
            "polkadot-api": "^1.0.0",
            "@polkadot-api/descriptors": "^1.0.0",
          },
        };

        const mockConfig = {
          version: 0,
          descriptorPath: ".papi/descriptors",
          entries: {
            polkadot: {
              chain: "polkadot",
              metadata: ".papi/metadata/polkadot.scale",
            },
          },
        };

        mockPackageJsonRead(mockPackageJson, {
          "polkadot-api.json": mockConfig,
        });
        mockDirectoryExists(true);

        const result = await freshDetector.needsPolkadotSetup(true);

        expect(result).toBe(false);
      });

      it("should return false when dedot is installed", async () => {
        const freshDetector = new PolkadotDetector(mockCwd);
        const mockPackageJson: PackageJson = {
          dependencies: { dedot: "^1.0.0" },
        };
        mockPackageJsonRead(mockPackageJson);

        const result = await freshDetector.needsPolkadotSetup(true);

        expect(result).toBe(false);
      });
    });

    describe("getRecommendedSetup", () => {
      it("should recommend no setup when component doesn't require polkadot", async () => {
        const result = await detector.getRecommendedSetup(false);

        expect(result).toEqual({
          needsInstall: false,
          needsConfig: false,
          recommendedLibrary: "none",
          existingLibrary: expect.any(String),
        });
      });

      it("should recommend papi installation when no library is installed", async () => {
        const freshDetector = new PolkadotDetector(mockCwd);
        const mockPackageJson: PackageJson = {
          dependencies: { react: "^18.0.0" },
        };
        mockPackageJsonRead(mockPackageJson);

        const result = await freshDetector.getRecommendedSetup(true);

        expect(result).toEqual({
          needsInstall: true,
          needsConfig: true,
          recommendedLibrary: "papi",
          existingLibrary: "none",
        });
      });

      it("should recommend configuration when papi is installed but not configured", async () => {
        const freshDetector = new PolkadotDetector(mockCwd);
        const mockPackageJson: PackageJson = {
          dependencies: {
            "polkadot-api": "^1.0.0",
            "@polkadot-api/descriptors": "^1.0.0",
          },
        };
        mockPackageJsonRead(mockPackageJson);
        mockDirectoryExists(false);

        const result = await freshDetector.getRecommendedSetup(true);

        expect(result).toEqual({
          needsInstall: false,
          needsConfig: true,
          recommendedLibrary: "papi",
          existingLibrary: "papi",
        });
      });

      it("should recommend no setup when dedot is installed", async () => {
        const freshDetector = new PolkadotDetector(mockCwd);
        const mockPackageJson: PackageJson = {
          dependencies: { dedot: "^1.0.0" },
        };
        mockPackageJsonRead(mockPackageJson);

        const result = await freshDetector.getRecommendedSetup(true);

        expect(result).toEqual({
          needsInstall: false,
          needsConfig: false,
          recommendedLibrary: "dedot",
          existingLibrary: "dedot",
        });
      });

      it("should recommend no setup when papi is fully configured", async () => {
        const freshDetector = new PolkadotDetector(mockCwd);
        const mockPackageJson: PackageJson = {
          dependencies: {
            "polkadot-api": "^1.0.0",
            "@polkadot-api/descriptors": "^1.0.0",
          },
        };

        const mockConfig = {
          version: 0,
          descriptorPath: ".papi/descriptors",
          entries: {
            polkadot: {
              chain: "polkadot",
              metadata: ".papi/metadata/polkadot.scale",
            },
          },
        };

        mockPackageJsonRead(mockPackageJson, {
          "polkadot-api.json": mockConfig,
        });
        mockDirectoryExists(true);

        const result = await freshDetector.getRecommendedSetup(true);

        expect(result).toEqual({
          needsInstall: false,
          needsConfig: false,
          recommendedLibrary: "papi",
          existingLibrary: "papi",
        });
      });
    });
  });

  describe("Caching Optimization", () => {
    it("should only read package.json once even when multiple methods are called", async () => {
      // Create a fresh detector instance for this test
      const freshDetector = new PolkadotDetector(mockCwd);

      const mockPackageJson: PackageJson = {
        dependencies: { "polkadot-api": "^1.0.0", dedot: "^1.0.0" },
      };
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockPackageJson));

      // Call multiple methods that all need package.json
      await freshDetector.hasPapi();
      await freshDetector.hasDedot();
      await freshDetector.hasDescriptors();
      await freshDetector.detectPolkadotLibrary();

      // Should only have been called once due to caching
      expect(mockFs.readFile).toHaveBeenCalledTimes(1);
      expect(mockFs.readFile).toHaveBeenCalledWith(
        path.join(mockCwd, "package.json"),
        "utf-8"
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle malformed package.json gracefully", async () => {
      const freshDetector = new PolkadotDetector(mockCwd);
      mockFs.readFile.mockResolvedValueOnce("invalid json");

      const result = await freshDetector.hasPapi();

      expect(result).toBe(false);
    });

    it("should handle missing package.json gracefully", async () => {
      const freshDetector = new PolkadotDetector(mockCwd);
      mockPackageJsonRead(null); // null means missing package.json

      const result = await freshDetector.detectPolkadotLibrary();

      expect(result).toBe("none");
    });

    it("should handle filesystem permission errors gracefully", async () => {
      const freshDetector = new PolkadotDetector(mockCwd);
      mockFs.stat.mockRejectedValue(new Error("EACCES: permission denied"));

      const result = await freshDetector.hasPapiConfig();

      expect(result).toBe(false);
    });

    it("should handle empty .papi directory", async () => {
      const freshDetector = new PolkadotDetector(mockCwd);
      const mockConfig = {
        version: 0,
        descriptorPath: ".papi/descriptors",
        entries: {},
      };
      mockPackageJsonRead({}, { "polkadot-api.json": mockConfig });

      const result = await freshDetector.getPapiConfig();

      expect(result).toEqual({ chains: [] });
    });
  });
});
