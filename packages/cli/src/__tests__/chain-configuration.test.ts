import fs from "fs/promises";
import { PolkadotDetector } from "../utils/polkadot-detector";

// Mock fs.promises
jest.mock("fs/promises");
const mockFs = fs as jest.Mocked<typeof fs>;

describe("Chain Configuration Tests", () => {
  let detector: PolkadotDetector;
  const mockCwd = "/test/project";

  beforeEach(() => {
    jest.clearAllMocks();
    detector = new PolkadotDetector(mockCwd);
    detector.clearCache();
  });

  // Test chain extraction from different configuration scenarios
  describe("Chain Detection from PAPI Config", () => {
    test.each([
      [
        "single development chain",
        { paseo: { chain: "paseo", metadata: ".papi/metadata/paseo.scale" } },
        ["paseo"],
      ],
      [
        "single production chain",
        {
          polkadot: {
            chain: "polkadot",
            metadata: ".papi/metadata/polkadot.scale",
          },
        },
        ["polkadot"],
      ],
      [
        "multiple development chains",
        {
          paseo_asset_hub: {
            chain: "paseo_asset_hub",
            metadata: ".papi/metadata/paseo_asset_hub.scale",
          },
          paseo: { chain: "paseo", metadata: ".papi/metadata/paseo.scale" },
        },
        ["paseo_asset_hub", "paseo"],
      ],
      [
        "multiple production chains",
        {
          polkadot: {
            chain: "polkadot",
            metadata: ".papi/metadata/polkadot.scale",
          },
          asset_hub_polkadot: {
            chain: "asset_hub_polkadot",
            metadata: ".papi/metadata/asset_hub_polkadot.scale",
          },
        },
        ["polkadot", "asset_hub_polkadot"],
      ],
      [
        "mixed dev and production chains",
        {
          polkadot: {
            chain: "polkadot",
            metadata: ".papi/metadata/polkadot.scale",
          },
          paseo: { chain: "paseo", metadata: ".papi/metadata/paseo.scale" },
          kusama: { chain: "kusama", metadata: ".papi/metadata/kusama.scale" },
        },
        ["polkadot", "paseo", "kusama"],
      ],
      [
        "testnet chains",
        {
          westend: {
            chain: "westend",
            metadata: ".papi/metadata/westend.scale",
          },
          rococo: { chain: "rococo", metadata: ".papi/metadata/rococo.scale" },
        },
        ["westend", "rococo"],
      ],
      ["empty configuration", {}, []],
    ])(
      "should detect chains for %s",
      async (scenario, entries, expectedChains) => {
        const mockConfig = {
          version: 0,
          descriptorPath: ".papi/descriptors",
          entries,
        };
        mockFs.readFile.mockResolvedValue(JSON.stringify(mockConfig));

        const result = await detector.getPapiConfig();
        expect(result).toEqual({ chains: expectedChains });
      }
    );
  });

  // Test integration with setup requirements
  describe("Setup Requirements for Chain Configurations", () => {
    it("should require setup when papi installed but no chains configured", async () => {
      const mockPackageJson = {
        dependencies: { "polkadot-api": "^1.0.0" },
      };

      // Mock .papi directory exists but no config
      const mockStat = { isDirectory: () => true };
      mockFs.stat.mockResolvedValue(mockStat as any);
      mockFs.readFile.mockImplementation((filePath: any) => {
        const pathStr = filePath.toString();
        if (pathStr.includes("package.json")) {
          return Promise.resolve(JSON.stringify(mockPackageJson));
        }
        return Promise.reject(new Error("File not found"));
      });

      const needsSetup = await detector.needsPolkadotSetup();
      expect(needsSetup).toBe(true);
    });

    it("should not require setup when chains are properly configured", async () => {
      const mockPackageJson = {
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

      const mockStat = { isDirectory: () => true };
      mockFs.stat.mockResolvedValue(mockStat as any);
      mockFs.readFile.mockImplementation((filePath: any) => {
        const pathStr = filePath.toString();
        if (pathStr.includes("package.json")) {
          return Promise.resolve(JSON.stringify(mockPackageJson));
        } else if (pathStr.includes("polkadot-api.json")) {
          return Promise.resolve(JSON.stringify(mockConfig));
        }
        return Promise.reject(new Error("File not found"));
      });

      const needsSetup = await detector.needsPolkadotSetup();
      expect(needsSetup).toBe(false);
    });
  });

  // Test error handling scenarios
  describe("Error Handling", () => {
    it("should handle missing config file gracefully", async () => {
      mockFs.readFile.mockRejectedValue(new Error("ENOENT: no such file"));

      const result = await detector.getPapiConfig();
      expect(result).toBe(null);
    });

    it("should handle malformed config file", async () => {
      mockFs.readFile.mockResolvedValue("invalid json");

      const result = await detector.getPapiConfig();
      expect(result).toBe(null);
    });

    it("should handle config without entries field", async () => {
      const mockConfig = {
        version: 0,
        descriptorPath: ".papi/descriptors",
        // missing entries field
      };
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockConfig));

      const result = await detector.getPapiConfig();
      expect(result).toEqual({ chains: [] });
    });
  });

  // Test realistic configuration examples
  describe("Real Configuration Examples", () => {
    it("should handle typical development setup", async () => {
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
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockConfig));

      const result = await detector.getPapiConfig();
      expect(result).toEqual({
        chains: ["paseo_asset_hub", "paseo"],
      });
    });

    it("should handle typical production setup", async () => {
      const mockConfig = {
        version: 0,
        descriptorPath: ".papi/descriptors",
        entries: {
          polkadot: {
            chain: "polkadot",
            metadata: ".papi/metadata/polkadot.scale",
            genesis:
              "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
            codeHash: "0x...",
          },
          asset_hub_polkadot: {
            chain: "asset_hub_polkadot",
            metadata: ".papi/metadata/asset_hub_polkadot.scale",
            genesis: "0x...",
            codeHash: "0x...",
          },
        },
      };
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockConfig));

      const result = await detector.getPapiConfig();
      expect(result).toEqual({
        chains: ["polkadot", "asset_hub_polkadot"],
      });
    });
  });
});
