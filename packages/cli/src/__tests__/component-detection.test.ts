import { PolkadotDetector } from "../utils/polkadot-detector";
import type { PackageJson, ComponentInfo } from "../types";
import fs from "fs/promises";

// Mock fs module
jest.mock("fs/promises");
const mockFs = fs as jest.Mocked<typeof fs>;

const mockCwd = "/test/project";

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

// Helper to determine if component requires polkadot (mirrors CLI logic)
function componentRequiresPolkadot(
  componentInfo: Partial<ComponentInfo>
): boolean {
  const hasPolkadotDependency =
    componentInfo.dependencies?.includes("polkadot-api") || false;
  const requiresPolkadotFromFlag = Boolean(componentInfo.requiresPolkadotApi);
  return requiresPolkadotFromFlag || hasPolkadotDependency;
}

describe("Component Detection Tests", () => {
  let detector: PolkadotDetector;

  beforeEach(() => {
    jest.clearAllMocks();
    detector = new PolkadotDetector(mockCwd);
    detector.clearCache();
  });

  // Test component requirement detection logic
  describe("Component Requirements Detection", () => {
    test.each([
      [
        "requiresPolkadotApi flag only",
        {
          name: "block-number",
          requiresPolkadotApi: true,
          dependencies: ["react"],
        },
        true,
      ],
      [
        "polkadot-api dependency only",
        {
          name: "balance-display",
          requiresPolkadotApi: false,
          dependencies: ["polkadot-api", "react"],
        },
        true,
      ],
      [
        "both flag and dependency",
        {
          name: "advanced-component",
          requiresPolkadotApi: true,
          dependencies: ["polkadot-api", "react"],
        },
        true,
      ],
      [
        "neither flag nor dependency",
        {
          name: "simple-button",
          requiresPolkadotApi: false,
          dependencies: ["react", "tailwind"],
        },
        false,
      ],
      [
        "undefined dependencies",
        {
          name: "minimal-component",
          requiresPolkadotApi: false,
          dependencies: undefined,
        },
        false,
      ],
      [
        "empty dependencies",
        {
          name: "basic-component",
          requiresPolkadotApi: false,
          dependencies: [],
        },
        false,
      ],
    ])(
      "should detect polkadot requirement: %s",
      (scenario, componentInfo, expected) => {
        const result = componentRequiresPolkadot(componentInfo);
        expect(result).toBe(expected);
      }
    );
  });

  // Test integration with actual polkadot setup detection
  describe("Integration with Setup Detection", () => {
    it("should not require setup when dedot is installed", async () => {
      const componentInfo = {
        name: "polkadot-component",
        requiresPolkadotApi: true,
        dependencies: ["polkadot-api"],
      };

      // Create fresh detector and set up dedot mock
      const freshDetector = new PolkadotDetector(mockCwd);
      const mockPackageJson = { dependencies: { dedot: "^1.0.0" } };

      // Reset mocks and setup fresh state
      jest.resetAllMocks();
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockPackageJson));
      freshDetector.clearCache();

      const requiresPolkadot = componentRequiresPolkadot(componentInfo);
      expect(requiresPolkadot).toBe(true);

      const needsSetup = await freshDetector.needsPolkadotSetup(
        requiresPolkadot
      );
      expect(needsSetup).toBe(false); // dedot satisfies polkadot requirement
    });

    it("should require setup when no polkadot library exists", async () => {
      const componentInfo = {
        name: "needs-setup-component",
        requiresPolkadotApi: true,
        dependencies: ["polkadot-api"],
      };

      const freshDetector = new PolkadotDetector(mockCwd);
      const mockPackageJson = {
        dependencies: { react: "^18.0.0", tailwind: "^3.0.0" },
      };
      mockPackageJsonRead(mockPackageJson);

      const requiresPolkadot = componentRequiresPolkadot(componentInfo);
      expect(requiresPolkadot).toBe(true);

      const needsSetup = await freshDetector.needsPolkadotSetup(
        requiresPolkadot
      );
      expect(needsSetup).toBe(true);
    });

    it("should provide proper setup recommendations", async () => {
      const componentInfo = {
        name: "component-needing-setup",
        requiresPolkadotApi: true,
        dependencies: ["polkadot-api"],
      };

      const freshDetector = new PolkadotDetector(mockCwd);
      const mockPackageJson = { dependencies: { react: "^18.0.0" } };
      mockPackageJsonRead(mockPackageJson);

      const requiresPolkadot = componentRequiresPolkadot(componentInfo);
      const recommendations = await freshDetector.getRecommendedSetup(
        requiresPolkadot
      );

      expect(recommendations).toEqual({
        needsInstall: true,
        needsConfig: true,
        recommendedLibrary: "papi",
        existingLibrary: "none",
      });
    });
  });

  // Test real-world component scenarios
  describe("Real-world Component Examples", () => {
    test.each([
      [
        "block-number component",
        {
          name: "block-number",
          requiresPolkadotApi: true,
          dependencies: ["polkadot-api"],
        },
        true,
      ],
      [
        "regular UI component",
        { name: "button", requiresPolkadotApi: false, dependencies: ["react"] },
        false,
      ],
      [
        "component with polkadot dependency but no flag",
        { name: "balance-display", dependencies: ["polkadot-api", "react"] },
        true,
      ],
      [
        "component with dedot dependency",
        { name: "dedot-component", dependencies: ["dedot", "react"] },
        false, // dedot dependency doesn't trigger polkadot-api requirement
      ],
      [
        "component with mixed polkadot dependencies",
        {
          name: "advanced-polkadot",
          dependencies: ["polkadot-api", "@polkadot-api/descriptors", "react"],
        },
        true,
      ],
    ])(
      "should handle %s correctly",
      (scenario, componentInfo, expectedRequiresPolkadot) => {
        const result = componentRequiresPolkadot(componentInfo);
        expect(result).toBe(expectedRequiresPolkadot);
      }
    );

    it("should handle edge case where flag gets stripped but dependencies remain", async () => {
      // Simulate scenario where CLI processes component metadata
      const originalComponent = {
        name: "processed-component",
        requiresPolkadotApi: true,
        dependencies: ["polkadot-api", "react"],
      };

      // After processing, flag might be removed but dependencies preserved
      const processedComponent = {
        name: "processed-component",
        dependencies: ["polkadot-api", "react"],
        // requiresPolkadotApi removed during processing
      };

      // Should still detect polkadot requirement via dependencies
      expect(componentRequiresPolkadot(originalComponent)).toBe(true);
      expect(componentRequiresPolkadot(processedComponent)).toBe(true);
    });
  });
});
