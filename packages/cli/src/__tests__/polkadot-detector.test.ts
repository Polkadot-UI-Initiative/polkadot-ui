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
    detector = new PolkadotDetector(mockCwd);
    detector.clearCache();
  });

  // Test package detection for different dependency types
  describe("Package Detection", () => {
    test.each([
      ["polkadot-api", "dependencies", true, "hasPapi"],
      ["polkadot-api", "devDependencies", true, "hasPapi"],
      ["dedot", "dependencies", true, "hasDedot"],
      ["dedot", "devDependencies", true, "hasDedot"],
      ["@polkadot-api/descriptors", "dependencies", true, "hasDescriptors"],
      ["@polkadot-api/descriptors", "devDependencies", true, "hasDescriptors"],
    ])(
      "should detect %s in %s",
      async (packageName, depType, expected, method) => {
        const mockPackageJson = {
          [depType]: { [packageName]: "^1.0.0" },
        };
        mockPackageJsonRead(mockPackageJson);

        const result = await (detector as any)[method]();
        expect(result).toBe(expected);
      }
    );

    test.each([
      ["hasPapi", "polkadot-api"],
      ["hasDedot", "dedot"],
      ["hasDescriptors", "@polkadot-api/descriptors"],
    ])(
      "%s should return false when package not installed",
      async (method, packageName) => {
        mockPackageJsonRead({ dependencies: { react: "^18.0.0" } });
        const result = await (detector as any)[method]();
        expect(result).toBe(false);
      }
    );

    it("should handle missing package.json gracefully", async () => {
      mockPackageJsonRead(null);

      expect(await detector.hasPapi()).toBe(false);
      expect(await detector.hasDedot()).toBe(false);
      expect(await detector.hasDescriptors()).toBe(false);
    });
  });

  // Test library detection logic
  describe("Library Detection", () => {
    test.each([
      [{ "polkadot-api": "^1.0.0" }, "papi"],
      [{ dedot: "^1.0.0" }, "dedot"],
      [{ "polkadot-api": "^1.0.0", dedot: "^1.0.0" }, "papi"], // papi takes precedence
      [{ react: "^18.0.0" }, "none"],
      [{}, "none"],
    ])("should detect library: %j -> %s", async (dependencies, expected) => {
      mockPackageJsonRead({ dependencies });
      const result = await detector.detectPolkadotLibrary();
      expect(result).toBe(expected);
    });
  });

  // Test configuration detection
  describe("Configuration Detection", () => {
    describe("PAPI Configuration", () => {
      it("should detect .papi directory", async () => {
        mockDirectoryExists(true);
        expect(await detector.hasPapiConfig()).toBe(true);
      });

      it("should return false when .papi directory missing", async () => {
        mockDirectoryExists(false);
        expect(await detector.hasPapiConfig()).toBe(false);
      });

      it("should read papi configuration", async () => {
        const mockConfig = {
          version: 0,
          descriptorPath: ".papi/descriptors",
          entries: {
            polkadot: {
              chain: "polkadot",
              metadata: ".papi/metadata/polkadot.scale",
            },
            paseo: { chain: "paseo", metadata: ".papi/metadata/paseo.scale" },
          },
        };

        mockPackageJsonRead({}, { "polkadot-api.json": mockConfig });

        const result = await detector.getPapiConfig();
        expect(result).toEqual({ chains: ["polkadot", "paseo"] });
      });

      it("should handle empty papi config", async () => {
        const mockConfig = {
          version: 0,
          descriptorPath: ".papi/descriptors",
          entries: {},
        };
        mockPackageJsonRead({}, { "polkadot-api.json": mockConfig });

        const result = await detector.getPapiConfig();
        expect(result).toEqual({ chains: [] });
      });

      it("should return null when config missing", async () => {
        mockPackageJsonRead({});
        const result = await detector.getPapiConfig();
        expect(result).toBe(null);
      });
    });

    describe("Polkadot Config", () => {
      it("should detect polkadot-config.ts", async () => {
        mockFs.access.mockResolvedValue(undefined);
        expect(await detector.hasPolkadotConfig()).toBe(true);
      });

      it("should return false when polkadot-config.ts missing", async () => {
        mockFs.access.mockRejectedValue(new Error("ENOENT"));
        expect(await detector.hasPolkadotConfig()).toBe(false);
      });
    });
  });

  // Test comprehensive configuration analysis
  describe("Complete Configuration Analysis", () => {
    it("should return complete config for fully configured papi", async () => {
      const mockPackageJson = { dependencies: { "polkadot-api": "^1.0.0" } };
      const mockConfig = {
        version: 0,
        descriptorPath: ".papi/descriptors",
        entries: { polkadot: { chain: "polkadot" }, paseo: { chain: "paseo" } },
      };

      mockPackageJsonRead(mockPackageJson, { "polkadot-api.json": mockConfig });
      mockDirectoryExists(true);

      const result = await detector.getPolkadotApiConfig();
      expect(result).toEqual({
        hasExistingConfig: true,
        existingChains: ["polkadot", "paseo"],
        hasPapi: true,
        hasDedot: false,
      });
    });

    it("should return config for dedot setup", async () => {
      const mockPackageJson = { dependencies: { dedot: "^1.0.0" } };
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

    it("should return empty config when no polkadot libraries", async () => {
      mockPackageJsonRead({ dependencies: { react: "^18.0.0" } });
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

  // Test setup requirements
  describe("Setup Requirements", () => {
    it("should not require setup when component doesn't need polkadot", async () => {
      expect(await detector.needsPolkadotSetup(false)).toBe(false);
    });

    test.each([
      ["no library", { react: "^18.0.0" }, false, true],
      ["papi without config", { "polkadot-api": "^1.0.0" }, false, true],
      [
        "papi fully configured",
        { "polkadot-api": "^1.0.0", "@polkadot-api/descriptors": "^1.0.0" },
        true,
        false,
      ],
      ["dedot installed", { dedot: "^1.0.0" }, false, false],
    ])(
      "should handle setup requirements: %s",
      async (scenario, dependencies, hasConfig, expectedNeedsSetup) => {
        const freshDetector = new PolkadotDetector(mockCwd);
        mockPackageJsonRead({ dependencies });
        mockDirectoryExists(hasConfig);

        if (hasConfig) {
          const mockConfig = {
            version: 0,
            descriptorPath: ".papi/descriptors",
            entries: { test: {} },
          };
          mockPackageJsonRead(
            { dependencies },
            { "polkadot-api.json": mockConfig }
          );
        }

        const result = await freshDetector.needsPolkadotSetup(true);
        expect(result).toBe(expectedNeedsSetup);
      }
    );
  });

  // Test setup recommendations
  describe("Setup Recommendations", () => {
    it("should recommend no action when component doesn't need polkadot", async () => {
      const result = await detector.getRecommendedSetup(false);
      expect(result.needsInstall).toBe(false);
      expect(result.needsConfig).toBe(false);
      expect(result.recommendedLibrary).toBe("none");
    });

    test.each([
      [
        "papi installation for no library",
        { react: "^18.0.0" },
        false,
        {
          needsInstall: true,
          needsConfig: true,
          recommendedLibrary: "papi",
          existingLibrary: "none",
        },
      ],
      [
        "papi configuration when installed but not configured",
        { "polkadot-api": "^1.0.0", "@polkadot-api/descriptors": "^1.0.0" },
        false,
        {
          needsInstall: false,
          needsConfig: true,
          recommendedLibrary: "papi",
          existingLibrary: "papi",
        },
      ],
      [
        "no setup for dedot",
        { dedot: "^1.0.0", "@dedot/chaintypes": "^1.0.0" },
        false,
        {
          needsInstall: false,
          needsConfig: false,
          recommendedLibrary: "dedot",
          existingLibrary: "dedot",
        },
      ],
      [
        "no setup for fully configured papi",
        { "polkadot-api": "^1.0.0", "@polkadot-api/descriptors": "^1.0.0" },
        true,
        {
          needsInstall: false,
          needsConfig: false,
          recommendedLibrary: "papi",
          existingLibrary: "papi",
        },
      ],
    ])(
      "should recommend %s",
      async (scenario, dependencies, hasConfig, expected) => {
        const freshDetector = new PolkadotDetector(mockCwd);
        mockPackageJsonRead({ dependencies });
        mockDirectoryExists(hasConfig);

        if (hasConfig) {
          const mockConfig = {
            version: 0,
            descriptorPath: ".papi/descriptors",
            entries: { test: {} },
          };
          mockPackageJsonRead(
            { dependencies },
            { "polkadot-api.json": mockConfig }
          );
        }

        const result = await freshDetector.getRecommendedSetup(true);
        expect(result).toEqual(expected);
      }
    );
  });

  // Test library selection exclusivity
  describe("Library Selection Exclusivity", () => {
    test.each([
      [
        "should recommend papi when no library is installed",
        { react: "^18.0.0" },
        {
          needsInstall: true,
          needsConfig: true,
          recommendedLibrary: "papi",
          existingLibrary: "none",
        },
      ],
      [
        "should recommend dedot when dedot is already installed",
        { dedot: "^1.0.0", "@dedot/chaintypes": "^1.0.0" },
        {
          needsInstall: false,
          needsConfig: false,
          recommendedLibrary: "dedot",
          existingLibrary: "dedot",
        },
      ],
      [
        "should recommend papi when papi is already installed",
        { "polkadot-api": "^1.0.0", "@polkadot-api/descriptors": "^1.0.0" },
        {
          needsInstall: false,
          needsConfig: false,
          recommendedLibrary: "papi",
          existingLibrary: "papi",
        },
      ],
      [
        "should recommend papi when both libraries are installed (papi takes precedence)",
        { 
          "polkadot-api": "^1.0.0", 
          "@polkadot-api/descriptors": "^1.0.0",
          "dedot": "^1.0.0",
          "@dedot/chaintypes": "^1.0.0"
        },
        {
          needsInstall: false,
          needsConfig: false,
          recommendedLibrary: "papi",
          existingLibrary: "papi",
        },
      ],
             [
         "should recommend dedot installation when only dedot is installed but missing chaintypes",
         { dedot: "^1.0.0" },
         {
           needsInstall: false,
           needsConfig: false,
           recommendedLibrary: "dedot",
           existingLibrary: "dedot",
         },
       ],
             [
         "should recommend papi installation when only papi is installed but missing descriptors",
         { "polkadot-api": "^1.0.0" },
         {
           needsInstall: true,
           needsConfig: false,
           recommendedLibrary: "papi",
           existingLibrary: "papi",
         },
       ],
    ])(
      "%s",
      async (scenario, dependencies, expected) => {
        const freshDetector = new PolkadotDetector(mockCwd);
        mockPackageJsonRead({ dependencies });
        
                 // Mock papi config as needed
         const hasPapiConfig = (dependencies as any)["polkadot-api"] && (dependencies as any)["@polkadot-api/descriptors"];
         mockDirectoryExists(hasPapiConfig);
        
        if (hasPapiConfig) {
          const mockConfig = {
            version: 0,
            descriptorPath: ".papi/descriptors",
            entries: { test: {} },
          };
          mockPackageJsonRead(
            { dependencies },
            { "polkadot-api.json": mockConfig }
          );
        }

        const result = await freshDetector.getRecommendedSetup(true);
        expect(result).toEqual(expected);
      }
    );

    it("should not recommend installing both libraries simultaneously", async () => {
      const freshDetector = new PolkadotDetector(mockCwd);
      
      // Test with no libraries installed
      mockPackageJsonRead({ dependencies: { react: "^18.0.0" } });
      
      const result = await freshDetector.getRecommendedSetup(true);
      
      // Should only recommend one library
      expect(result.recommendedLibrary).toBe("papi");
      expect(result.existingLibrary).toBe("none");
      
      // Should not recommend both
      expect(result.recommendedLibrary).not.toBe("both");
      expect(result.recommendedLibrary).not.toBe("all");
    });

    it("should maintain library preference when both are partially installed", async () => {
      const freshDetector = new PolkadotDetector(mockCwd);
      
      // Test with both libraries installed but both incomplete
      mockPackageJsonRead({ 
        dependencies: { 
          "polkadot-api": "^1.0.0",  // papi without descriptors
          "dedot": "^1.0.0"          // dedot without chaintypes
        } 
      });
      mockDirectoryExists(false); // no papi config
      
      const result = await freshDetector.getRecommendedSetup(true);
      
      // Should prefer papi (existing precedence rule)
      expect(result.recommendedLibrary).toBe("papi");
      expect(result.existingLibrary).toBe("papi");
      expect(result.needsInstall).toBe(true); // needs descriptors
      expect(result.needsConfig).toBe(true);  // needs config
    });
  });

  // Test caching behavior
  describe("Caching", () => {
    it("should cache package.json reads", async () => {
      const freshDetector = new PolkadotDetector(mockCwd);
      const mockPackageJson = {
        dependencies: { "polkadot-api": "^1.0.0", dedot: "^1.0.0" },
      };
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockPackageJson));

      // Call multiple methods that all need package.json
      await freshDetector.hasPapi();
      await freshDetector.hasDedot();
      await freshDetector.hasDescriptors();

      // Should only have been called once due to caching
      expect(mockFs.readFile).toHaveBeenCalledTimes(1);
    });

    it("should clear cache when requested", async () => {
      const mockPackageJson = { dependencies: { "polkadot-api": "^1.0.0" } };
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockPackageJson));

      await detector.hasPapi();
      detector.clearCache();
      await detector.hasPapi();

      expect(mockFs.readFile).toHaveBeenCalledTimes(2);
    });
  });

  // Test error handling
  describe("Error Handling", () => {
    it("should handle malformed package.json", async () => {
      const freshDetector = new PolkadotDetector(mockCwd);
      mockFs.readFile.mockResolvedValue("invalid json");
      expect(await freshDetector.hasPapi()).toBe(false);
    });

    it("should handle filesystem permission errors", async () => {
      const freshDetector = new PolkadotDetector(mockCwd);
      mockFs.stat.mockRejectedValue(new Error("EACCES: permission denied"));
      expect(await freshDetector.hasPapiConfig()).toBe(false);
    });
  });
});
