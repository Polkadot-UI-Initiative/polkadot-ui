import fs from "fs/promises";
import { PolkadotDetector } from "../utils/polkadot-detector";
// Mock fs.promises
jest.mock("fs/promises");
const mockFs = fs;
describe("Chain Configuration Tests", () => {
    let detector;
    const mockCwd = "/test/project";
    beforeEach(() => {
        jest.clearAllMocks();
        detector = new PolkadotDetector(mockCwd);
    });
    describe("Development Mode Chains", () => {
        it("should detect paseo_asset_hub and paseo chains correctly", async () => {
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
        it("should handle only paseo_asset_hub chain", async () => {
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
                },
            };
            mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockConfig));
            const result = await detector.getPapiConfig();
            expect(result).toEqual({
                chains: ["paseo_asset_hub"],
            });
        });
        it("should handle only paseo chain", async () => {
            const mockConfig = {
                version: 0,
                descriptorPath: ".papi/descriptors",
                entries: {
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
                chains: ["paseo"],
            });
        });
    });
    describe("Production Mode Chains", () => {
        it("should detect polkadot chain correctly", async () => {
            const mockConfig = {
                version: 0,
                descriptorPath: ".papi/descriptors",
                entries: {
                    polkadot: {
                        chain: "polkadot",
                        metadata: ".papi/metadata/polkadot.scale",
                        genesis: "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
                        codeHash: "0x...",
                    },
                },
            };
            mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockConfig));
            const result = await detector.getPapiConfig();
            expect(result).toEqual({
                chains: ["polkadot"],
            });
        });
        it("should handle polkadot with asset hub", async () => {
            const mockConfig = {
                version: 0,
                descriptorPath: ".papi/descriptors",
                entries: {
                    polkadot: {
                        chain: "polkadot",
                        metadata: ".papi/metadata/polkadot.scale",
                        genesis: "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
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
            mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockConfig));
            const result = await detector.getPapiConfig();
            expect(result).toEqual({
                chains: ["polkadot", "asset_hub_polkadot"],
            });
        });
    });
    describe("Mixed Chain Configurations", () => {
        it("should handle mixed dev/prod chains", async () => {
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
                    paseo_asset_hub: {
                        chain: "paseo_asset_hub",
                        metadata: ".papi/metadata/paseo_asset_hub.scale",
                    },
                },
            };
            mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockConfig));
            const result = await detector.getPapiConfig();
            expect(result).toEqual({
                chains: ["polkadot", "paseo", "paseo_asset_hub"],
            });
        });
        it("should handle kusama and other testnet chains", async () => {
            const mockConfig = {
                version: 0,
                descriptorPath: ".papi/descriptors",
                entries: {
                    kusama: {
                        chain: "kusama",
                        metadata: ".papi/metadata/kusama.scale",
                    },
                    westend: {
                        chain: "westend",
                        metadata: ".papi/metadata/westend.scale",
                    },
                    rococo: {
                        chain: "rococo",
                        metadata: ".papi/metadata/rococo.scale",
                    },
                },
            };
            mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockConfig));
            const result = await detector.getPapiConfig();
            expect(result).toEqual({
                chains: ["kusama", "westend", "rococo"],
            });
        });
        it("should extract chain names correctly regardless of entry order", async () => {
            const mockConfig = {
                version: 0,
                descriptorPath: ".papi/descriptors",
                entries: {
                    zzz_last_chain: {
                        chain: "zzz_last_chain",
                        metadata: ".papi/metadata/zzz_last_chain.scale",
                    },
                    aaa_first_chain: {
                        chain: "aaa_first_chain",
                        metadata: ".papi/metadata/aaa_first_chain.scale",
                    },
                    mmm_middle_chain: {
                        chain: "mmm_middle_chain",
                        metadata: ".papi/metadata/mmm_middle_chain.scale",
                    },
                },
            };
            mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockConfig));
            const result = await detector.getPapiConfig();
            expect(result).toEqual({
                chains: ["zzz_last_chain", "aaa_first_chain", "mmm_middle_chain"],
            });
        });
    });
    describe("Complex Chain Scenarios", () => {
        it("should handle asset hub variations correctly", async () => {
            const mockConfig = {
                version: 0,
                descriptorPath: ".papi/descriptors",
                entries: {
                    asset_hub_polkadot: {
                        chain: "asset_hub_polkadot",
                        metadata: ".papi/metadata/asset_hub_polkadot.scale",
                    },
                    asset_hub_kusama: {
                        chain: "asset_hub_kusama",
                        metadata: ".papi/metadata/asset_hub_kusama.scale",
                    },
                    asset_hub_westend: {
                        chain: "asset_hub_westend",
                        metadata: ".papi/metadata/asset_hub_westend.scale",
                    },
                    paseo_asset_hub: {
                        chain: "paseo_asset_hub",
                        metadata: ".papi/metadata/paseo_asset_hub.scale",
                    },
                },
            };
            mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockConfig));
            const result = await detector.getPapiConfig();
            expect(result).toEqual({
                chains: [
                    "asset_hub_polkadot",
                    "asset_hub_kusama",
                    "asset_hub_westend",
                    "paseo_asset_hub",
                ],
            });
        });
        it("should handle chain names with underscores and hyphens", async () => {
            const mockConfig = {
                version: 0,
                descriptorPath: ".papi/descriptors",
                entries: {
                    my_custom_chain: {
                        chain: "my_custom_chain",
                        metadata: ".papi/metadata/my_custom_chain.scale",
                    },
                    "bridge-hub-polkadot": {
                        chain: "bridge-hub-polkadot",
                        metadata: ".papi/metadata/bridge-hub-polkadot.scale",
                    },
                    bridge_hub_kusama: {
                        chain: "bridge_hub_kusama",
                        metadata: ".papi/metadata/bridge_hub_kusama.scale",
                    },
                    "collectives-polkadot": {
                        chain: "collectives-polkadot",
                        metadata: ".papi/metadata/collectives-polkadot.scale",
                    },
                },
            };
            mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockConfig));
            const result = await detector.getPapiConfig();
            expect(result).toEqual({
                chains: [
                    "my_custom_chain",
                    "bridge-hub-polkadot",
                    "bridge_hub_kusama",
                    "collectives-polkadot",
                ],
            });
        });
    });
    describe("Chain Configuration Integration", () => {
        it("should return proper config when chains are configured for dev mode", async () => {
            // Mock papi installation
            const mockPackageJson = {
                dependencies: { "polkadot-api": "^1.0.0" },
            };
            mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
            // Mock dev chains config
            const mockConfig = {
                version: 0,
                descriptorPath: ".papi/descriptors",
                entries: {
                    paseo_asset_hub: {
                        chain: "paseo_asset_hub",
                        metadata: ".papi/metadata/paseo_asset_hub.scale",
                    },
                    paseo: {
                        chain: "paseo",
                        metadata: ".papi/metadata/paseo.scale",
                    },
                },
            };
            const mockStat = { isDirectory: () => true };
            mockFs.stat.mockResolvedValueOnce(mockStat);
            mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockConfig));
            const result = await detector.getPolkadotApiConfig();
            expect(result).toEqual({
                hasExistingConfig: true,
                existingChains: ["paseo_asset_hub", "paseo"],
                hasPapi: true,
                hasDedot: false,
            });
        });
        it("should return proper config when chains are configured for prod mode", async () => {
            // Mock papi installation
            const mockPackageJson = {
                dependencies: { "polkadot-api": "^1.0.0" },
            };
            mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
            // Mock prod chains config
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
            mockFs.stat.mockResolvedValueOnce(mockStat);
            mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockConfig));
            const result = await detector.getPolkadotApiConfig();
            expect(result).toEqual({
                hasExistingConfig: true,
                existingChains: ["polkadot"],
                hasPapi: true,
                hasDedot: false,
            });
        });
        it("should indicate no config when .papi exists but polkadot-api.json is empty", async () => {
            // Mock papi installation
            const mockPackageJson = {
                dependencies: { "polkadot-api": "^1.0.0" },
            };
            mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
            // Mock empty config
            const mockConfig = {
                version: 0,
                descriptorPath: ".papi/descriptors",
                entries: {},
            };
            const mockStat = { isDirectory: () => true };
            mockFs.stat.mockResolvedValueOnce(mockStat);
            mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockConfig));
            const result = await detector.getPolkadotApiConfig();
            expect(result).toEqual({
                hasExistingConfig: true, // .papi directory exists
                existingChains: [], // but no chains configured
                hasPapi: true,
                hasDedot: false,
            });
        });
    });
    describe("Setup Requirements for Different Chain Configurations", () => {
        it("should not need setup when papi is fully configured regardless of specific chains", async () => {
            // Mock full papi setup
            const mockPackageJson = {
                dependencies: {
                    "polkadot-api": "^1.0.0",
                    "@polkadot-api/descriptors": "^1.0.0",
                },
            };
            mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
            mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
            // Mock existing chain config
            const mockStat = { isDirectory: () => true };
            mockFs.stat.mockResolvedValueOnce(mockStat);
            const result = await detector.needsPolkadotSetup(true);
            expect(result).toBe(false);
        });
        it("should need setup when papi is installed but configuration is missing", async () => {
            // Mock papi installation without descriptors
            const mockPackageJson = {
                dependencies: { "polkadot-api": "^1.0.0" },
            };
            mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
            mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
            // Mock no .papi directory
            mockFs.stat.mockRejectedValueOnce(new Error("ENOENT"));
            const result = await detector.needsPolkadotSetup(true);
            expect(result).toBe(true);
        });
    });
    describe("Error Handling in Chain Detection", () => {
        it("should handle polkadot-api.json read errors gracefully", async () => {
            mockFs.readFile.mockRejectedValueOnce(new Error("Permission denied"));
            const result = await detector.getPapiConfig();
            expect(result).toBeNull();
        });
        it("should handle malformed polkadot-api.json gracefully", async () => {
            mockFs.readFile.mockResolvedValueOnce("invalid json");
            const result = await detector.getPapiConfig();
            expect(result).toBeNull();
        });
        it("should handle missing polkadot-api.json file", async () => {
            mockFs.readFile.mockRejectedValueOnce(new Error("ENOENT: no such file"));
            const result = await detector.getPapiConfig();
            expect(result).toBeNull();
        });
        it("should handle filesystem permission issues", async () => {
            mockFs.stat.mockRejectedValueOnce(new Error("EACCES: permission denied"));
            const result = await detector.hasPapiConfig();
            expect(result).toBe(false);
        });
    });
    describe("Real Configuration Examples", () => {
        it("should handle the exact structure provided by user", async () => {
            const realConfig = {
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
            mockFs.readFile.mockResolvedValueOnce(JSON.stringify(realConfig));
            const result = await detector.getPapiConfig();
            expect(result).toEqual({
                chains: ["paseo_asset_hub", "paseo"],
            });
        });
    });
});
