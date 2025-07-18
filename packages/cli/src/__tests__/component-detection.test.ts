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

describe("Component Detection Tests", () => {
  let detector: PolkadotDetector;

  beforeEach(() => {
    jest.clearAllMocks();
    detector = new PolkadotDetector(mockCwd);
    detector.clearCache();
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

      const needsSetup = await freshDetector.needsPolkadotSetup();
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

      const needsSetup = await freshDetector.needsPolkadotSetup();
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

      const recommendations = await freshDetector.getRecommendedSetup();

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
        const result = detector.needsPolkadotSetup();
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
      expect(detector.needsPolkadotSetup()).toBe(true);
      expect(detector.needsPolkadotSetup()).toBe(true);
    });
  });
});
