import { PolkadotDetector } from "../utils/polkadot-detector";
import type { PackageJson } from "../types";
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

describe("Component Detection Tests", () => {
  let detector: PolkadotDetector;

  beforeEach(() => {
    jest.clearAllMocks();
    detector = new PolkadotDetector(mockCwd);
    detector.clearCache();
  });

  // Test integration with actual polkadot setup detection
  describe("Integration with Setup Detection", () => {
    it("should require setup when only dedot is installed", async () => {
      // Create fresh detector and set up dedot mock
      const freshDetector = new PolkadotDetector(mockCwd);
      const mockPackageJson = { dependencies: { dedot: "^1.0.0" } };

      // Reset mocks and setup fresh state
      jest.resetAllMocks();
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockPackageJson));
      freshDetector.clearCache();

      const needsSetup = await freshDetector.needsPolkadotSetup();
      expect(needsSetup).toBe(false); // dedot basic installation is sufficient
    });

    it("should require setup when no polkadot library exists", async () => {
      const freshDetector = new PolkadotDetector(mockCwd);
      const mockPackageJson = {
        dependencies: { react: "^18.0.0", tailwind: "^3.0.0" },
      };
      mockPackageJsonRead(mockPackageJson);

      const needsSetup = await freshDetector.needsPolkadotSetup();
      expect(needsSetup).toBe(true);
    });

    it("should provide proper setup recommendations", async () => {
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

  // Test project-level polkadot setup detection
  describe("Project Setup Detection", () => {
    test.each([
      [
        "project with no polkadot dependencies",
        { dependencies: { react: "^18.0.0", next: "^13.0.0" } },
        true, // needs setup because no polkadot library
      ],
      [
        "project with polkadot-api installed",
        { dependencies: { react: "^18.0.0", "polkadot-api": "^1.0.0" } },
        true, // needs setup because papi requires configuration
      ],
      [
        "project with dedot installed",
        { dependencies: { react: "^18.0.0", dedot: "^1.0.0" } },
        false, // dedot doesn't require additional setup
      ],
      [
        "project with both polkadot libraries",
        {
          dependencies: {
            react: "^18.0.0",
            "polkadot-api": "^1.0.0",
            dedot: "^1.0.0",
          },
        },
        true, // papi takes precedence and needs setup
      ],
    ])(
      "should detect setup needs for %s",
      async (scenario, mockDependencies, expectedNeedsSetup) => {
        const freshDetector = new PolkadotDetector(mockCwd);
        const mockPackageJson = mockDependencies;
        mockPackageJsonRead(mockPackageJson);

        const result = await freshDetector.needsPolkadotSetup();
        expect(result).toBe(expectedNeedsSetup);
      }
    );
  });
});
