import fs from "fs/promises";
import path from "path";
import { PolkadotDetector } from "../utils/polkadot-detector";
// Mock fs.promises
jest.mock("fs/promises");
const mockFs = fs;
describe("PolkadotDetector", () => {
    let detector;
    const mockCwd = "/test/project";
    beforeEach(() => {
        jest.clearAllMocks();
        detector = new PolkadotDetector(mockCwd);
    });
    describe("Package Detection", () => {
        describe("hasPapi", () => {
            it("should return true when polkadot-api is in dependencies", async () => {
                const mockPackageJson = {
                    name: "test-project",
                    dependencies: {
                        "polkadot-api": "^1.14.1",
                    },
                };
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
                const result = await detector.hasPapi();
                expect(result).toBe(true);
                expect(mockFs.readFile).toHaveBeenCalledWith(path.join(mockCwd, "package.json"), "utf-8");
            });
            it("should return true when polkadot-api is in devDependencies", async () => {
                const mockPackageJson = {
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
                const mockPackageJson = {
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
                const mockPackageJson = {
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
                const mockPackageJson = {
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
                const mockPackageJson = {
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
                const mockPackageJson = {
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
                const mockPackageJson = {
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
                const mockPackageJson = {
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
                const mockPackageJson = {
                    name: "test-project",
                    dependencies: {
                        dedot: "^1.0.0",
                    },
                };
                // Mock for hasPapi() call - no papi installed
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
                // Mock for hasDedot() call - dedot is installed
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
                const result = await detector.detectPolkadotLibrary();
                expect(result).toBe("dedot");
            });
            it("should return 'papi' when both are installed (papi takes precedence)", async () => {
                const mockPackageJson = {
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
                const mockPackageJson = {
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
                mockFs.stat.mockResolvedValueOnce(mockStat);
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
                mockFs.stat.mockResolvedValueOnce(mockStat);
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
                            genesis: "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
                            codeHash: "0x.....",
                        },
                    },
                };
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockConfig));
                const result = await detector.getPapiConfig();
                expect(result).toEqual({ chains: ["polkadot"] });
                expect(mockFs.readFile).toHaveBeenCalledWith(path.join(mockCwd, ".papi", "polkadot-api.json"), "utf-8");
            });
            it("should return multiple chains when multiple entries exist", async () => {
                const mockConfig = {
                    version: 0,
                    descriptorPath: ".papi/descriptors",
                    entries: {
                        paseo_asset_hub: {
                            chain: "paseo_asset_hub",
                            metadata: ".papi/metadata/paseo_asset_hub.scale",
                            genesis: "0xd6eec26135305a8ad257a20d003357284c8aa03d0bdb2b357ab0a22371e11ef2",
                            codeHash: "0xb7f52ff9b4fb5124568a5b8cbfcebba2bc9318bcb5916b69457c10bc6a2d0ac5",
                        },
                        paseo: {
                            chain: "paseo",
                            metadata: ".papi/metadata/paseo.scale",
                            genesis: "0x77afd6190f1554ad45fd0d31aee62aacc33c6db0ea801129acb813f913e0764f",
                            codeHash: "0xcc4b027a0dbb5e0f389dd8418c41012d618290a22f84af8411c8fd20b2738304",
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
                expect(mockFs.access).toHaveBeenCalledWith(path.join(mockCwd, "polkadot-config.ts"));
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
                    dependencies: { "polkadot-api": "^1.0.0" },
                };
                // Mock papi config
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
                // getPolkadotApiConfig calls: hasPapi(), hasDedot(), hasPapiConfig(), getPapiConfig()
                // Mock for hasPapi() call
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
                // Mock for hasDedot() call
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
                // Mock for hasPapiConfig() - .papi directory exists
                const mockStat = { isDirectory: () => true };
                mockFs.stat.mockResolvedValueOnce(mockStat);
                // Mock for getPapiConfig() - read polkadot-api.json
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockConfig));
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
                    dependencies: { dedot: "^1.0.0" },
                };
                // getPolkadotApiConfig calls: hasPapi(), hasDedot(), hasPapiConfig()
                // Mock for hasPapi() call - no papi installed
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
                // Mock for hasDedot() call - dedot is installed
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
                // Mock for hasPapiConfig() - .papi directory doesn't exist
                mockFs.stat.mockRejectedValueOnce(new Error("ENOENT"));
                const result = await detector.getPolkadotApiConfig();
                expect(result).toEqual({
                    hasExistingConfig: false,
                    existingChains: [],
                    hasPapi: false,
                    hasDedot: true,
                });
            });
            it("should return empty config when no polkadot libraries are installed", async () => {
                // Mock no polkadot packages
                const mockPackageJson = {
                    dependencies: { react: "^18.0.0" },
                };
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
                // Mock no papi config (directory doesn't exist)
                mockFs.stat.mockRejectedValueOnce(new Error("ENOENT"));
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
                const mockPackageJson = {
                    dependencies: { react: "^18.0.0" },
                };
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
                const result = await detector.needsPolkadotSetup(true);
                expect(result).toBe(true);
            });
            it("should return true when papi is installed but not configured", async () => {
                // Mock papi installation
                const mockPackageJson = {
                    dependencies: { "polkadot-api": "^1.0.0" },
                };
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
                // Mock no papi config
                mockFs.stat.mockRejectedValueOnce(new Error("ENOENT"));
                const result = await detector.needsPolkadotSetup(true);
                expect(result).toBe(true);
            });
            it("should return true when papi is configured but descriptors are missing", async () => {
                // Mock papi installation without descriptors
                const mockPackageJson = {
                    dependencies: { "polkadot-api": "^1.0.0" },
                };
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
                // Mock papi config exists
                const mockStat = { isDirectory: () => true };
                mockFs.stat.mockResolvedValueOnce(mockStat);
                const result = await detector.needsPolkadotSetup(true);
                expect(result).toBe(true);
            });
            it("should return false when papi is fully configured", async () => {
                // Mock papi installation with descriptors
                const mockPackageJson = {
                    dependencies: {
                        "polkadot-api": "^1.0.0",
                        "@polkadot-api/descriptors": "^1.0.0",
                    },
                };
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
                // Mock papi config exists
                const mockStat = { isDirectory: () => true };
                mockFs.stat.mockResolvedValueOnce(mockStat);
                const result = await detector.needsPolkadotSetup(true);
                expect(result).toBe(false);
            });
            it("should return false when dedot is installed", async () => {
                // Mock dedot installation
                const mockPackageJson = {
                    dependencies: { dedot: "^1.0.0" },
                };
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
                const result = await detector.needsPolkadotSetup(true);
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
                const mockPackageJson = {
                    dependencies: { react: "^18.0.0" },
                };
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
                const result = await detector.getRecommendedSetup(true);
                expect(result).toEqual({
                    needsInstall: true,
                    needsConfig: true,
                    recommendedLibrary: "papi",
                    existingLibrary: "none",
                });
            });
            it("should recommend configuration when papi is installed but not configured", async () => {
                // Mock papi installation without descriptors
                const mockPackageJson = {
                    dependencies: { "polkadot-api": "^1.0.0" },
                };
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
                // Mock no papi config
                mockFs.stat.mockRejectedValueOnce(new Error("ENOENT"));
                const result = await detector.getRecommendedSetup(true);
                expect(result).toEqual({
                    needsInstall: true,
                    needsConfig: true,
                    recommendedLibrary: "papi",
                    existingLibrary: "papi",
                });
            });
            it("should recommend no setup when dedot is installed", async () => {
                // Mock dedot installation
                const mockPackageJson = {
                    dependencies: { dedot: "^1.0.0" },
                };
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
                const result = await detector.getRecommendedSetup(true);
                expect(result).toEqual({
                    needsInstall: false,
                    needsConfig: false,
                    recommendedLibrary: "dedot",
                    existingLibrary: "dedot",
                });
            });
            it("should recommend no setup when papi is fully configured", async () => {
                // Mock papi installation with descriptors
                const mockPackageJson = {
                    dependencies: {
                        "polkadot-api": "^1.0.0",
                        "@polkadot-api/descriptors": "^1.0.0",
                    },
                };
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
                mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
                // Mock papi config exists
                const mockStat = { isDirectory: () => true };
                mockFs.stat.mockResolvedValueOnce(mockStat);
                const result = await detector.getRecommendedSetup(true);
                expect(result).toEqual({
                    needsInstall: false,
                    needsConfig: false,
                    recommendedLibrary: "papi",
                    existingLibrary: "papi",
                });
            });
        });
    });
    describe("Edge Cases", () => {
        it("should handle malformed package.json gracefully", async () => {
            mockFs.readFile.mockResolvedValueOnce("invalid json");
            const result = await detector.hasPapi();
            expect(result).toBe(false);
        });
        it("should handle missing package.json gracefully", async () => {
            mockFs.readFile.mockRejectedValueOnce(new Error("ENOENT: no such file"));
            const result = await detector.detectPolkadotLibrary();
            expect(result).toBe("none");
        });
        it("should handle filesystem permission errors gracefully", async () => {
            mockFs.stat.mockRejectedValueOnce(new Error("EACCES: permission denied"));
            const result = await detector.hasPapiConfig();
            expect(result).toBe(false);
        });
        it("should handle empty .papi directory", async () => {
            const mockConfig = {
                version: 0,
                descriptorPath: ".papi/descriptors",
                entries: {},
            };
            mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockConfig));
            const result = await detector.getPapiConfig();
            expect(result).toEqual({ chains: [] });
        });
    });
});
