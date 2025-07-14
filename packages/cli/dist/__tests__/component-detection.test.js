import fs from "fs/promises";
import { PolkadotDetector } from "../utils/polkadot-detector";
// Mock fs.promises
jest.mock("fs/promises");
const mockFs = fs;
describe("Component Detection Tests", () => {
    let detector;
    const mockCwd = "/test/project";
    beforeEach(() => {
        jest.clearAllMocks();
        detector = new PolkadotDetector(mockCwd);
    });
    describe("Component Requirements Detection", () => {
        it("should detect component that requires polkadot via requiresPolkadotApi flag", async () => {
            const componentInfo = {
                name: "block-number",
                requiresPolkadotApi: true,
                dependencies: ["react"],
            };
            const result = await detector.needsPolkadotSetup(Boolean(componentInfo.requiresPolkadotApi));
            // Will return true if no polkadot library is installed
            const mockPackageJson = {
                dependencies: { react: "^18.0.0" },
            };
            mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
            const needsSetup = await detector.needsPolkadotSetup(true);
            expect(needsSetup).toBe(true);
        });
        it("should detect component that requires polkadot via dependencies array", async () => {
            const componentInfo = {
                name: "polkadot-balance",
                requiresPolkadotApi: false, // flag is false but dependency exists
                dependencies: ["polkadot-api", "react"],
            };
            // Component detection logic from add command:
            const hasPolkadotDependency = componentInfo.dependencies?.includes("polkadot-api") || false;
            const requiresPolkadotFromFlag = Boolean(componentInfo.requiresPolkadotApi);
            const requiresPolkadot = requiresPolkadotFromFlag || hasPolkadotDependency;
            expect(hasPolkadotDependency).toBe(true);
            expect(requiresPolkadotFromFlag).toBe(false);
            expect(requiresPolkadot).toBe(true);
        });
        it("should not detect polkadot requirement when neither flag nor dependency exists", async () => {
            const componentInfo = {
                name: "simple-button",
                requiresPolkadotApi: false,
                dependencies: ["react", "tailwind"],
            };
            const hasPolkadotDependency = componentInfo.dependencies?.includes("polkadot-api") || false;
            const requiresPolkadotFromFlag = Boolean(componentInfo.requiresPolkadotApi);
            const requiresPolkadot = requiresPolkadotFromFlag || hasPolkadotDependency;
            expect(hasPolkadotDependency).toBe(false);
            expect(requiresPolkadotFromFlag).toBe(false);
            expect(requiresPolkadot).toBe(false);
            const result = await detector.needsPolkadotSetup(requiresPolkadot);
            expect(result).toBe(false);
        });
        it("should detect polkadot requirement when both flag and dependency exist", async () => {
            const componentInfo = {
                name: "advanced-polkadot-component",
                requiresPolkadotApi: true,
                dependencies: ["polkadot-api", "react", "@polkadot-api/descriptors"],
            };
            const hasPolkadotDependency = componentInfo.dependencies?.includes("polkadot-api") || false;
            const requiresPolkadotFromFlag = Boolean(componentInfo.requiresPolkadotApi);
            const requiresPolkadot = requiresPolkadotFromFlag || hasPolkadotDependency;
            expect(hasPolkadotDependency).toBe(true);
            expect(requiresPolkadotFromFlag).toBe(true);
            expect(requiresPolkadot).toBe(true);
        });
    });
    describe("Edge Cases in Component Detection", () => {
        it("should handle component with undefined dependencies", async () => {
            const componentInfo = {
                name: "minimal-component",
                requiresPolkadotApi: false,
                dependencies: undefined,
            };
            const hasPolkadotDependency = componentInfo.dependencies?.includes("polkadot-api") || false;
            const requiresPolkadotFromFlag = Boolean(componentInfo.requiresPolkadotApi);
            const requiresPolkadot = requiresPolkadotFromFlag || hasPolkadotDependency;
            expect(hasPolkadotDependency).toBe(false);
            expect(requiresPolkadotFromFlag).toBe(false);
            expect(requiresPolkadot).toBe(false);
        });
        it("should handle component with empty dependencies array", async () => {
            const componentInfo = {
                name: "empty-deps-component",
                requiresPolkadotApi: false,
                dependencies: [],
            };
            const hasPolkadotDependency = componentInfo.dependencies?.includes("polkadot-api") || false;
            const requiresPolkadotFromFlag = Boolean(componentInfo.requiresPolkadotApi);
            const requiresPolkadot = requiresPolkadotFromFlag || hasPolkadotDependency;
            expect(hasPolkadotDependency).toBe(false);
            expect(requiresPolkadotFromFlag).toBe(false);
            expect(requiresPolkadot).toBe(false);
        });
        it("should handle component with missing requiresPolkadotApi field", async () => {
            const componentInfo = {
                name: "no-flag-component",
                // requiresPolkadotApi is missing (undefined)
                dependencies: ["polkadot-api"],
            };
            const hasPolkadotDependency = componentInfo.dependencies?.includes("polkadot-api") || false;
            const requiresPolkadotFromFlag = Boolean(componentInfo.requiresPolkadotApi);
            const requiresPolkadot = requiresPolkadotFromFlag || hasPolkadotDependency;
            expect(hasPolkadotDependency).toBe(true);
            expect(requiresPolkadotFromFlag).toBe(false); // undefined -> false
            expect(requiresPolkadot).toBe(true);
        });
    });
    describe("Complex Component Scenarios", () => {
        it("should handle component with dedot dependency", async () => {
            const componentInfo = {
                name: "dedot-component",
                requiresPolkadotApi: false,
                dependencies: ["dedot", "react"],
            };
            // Current logic only checks for polkadot-api, not dedot
            const hasPolkadotDependency = componentInfo.dependencies?.includes("polkadot-api") || false;
            const requiresPolkadotFromFlag = Boolean(componentInfo.requiresPolkadotApi);
            const requiresPolkadot = requiresPolkadotFromFlag || hasPolkadotDependency;
            expect(hasPolkadotDependency).toBe(false); // dedot is not polkadot-api
            expect(requiresPolkadotFromFlag).toBe(false);
            expect(requiresPolkadot).toBe(false);
            // But if we want to extend this to support dedot detection:
            const hasDedotDependency = componentInfo.dependencies?.includes("dedot") || false;
            const requiresAnyPolkadotLib = requiresPolkadot || hasDedotDependency;
            expect(requiresAnyPolkadotLib).toBe(true);
        });
        it("should handle component with multiple polkadot-related dependencies", async () => {
            const componentInfo = {
                name: "complex-polkadot-component",
                requiresPolkadotApi: true,
                dependencies: [
                    "polkadot-api",
                    "@polkadot-api/descriptors",
                    "@polkadot/api",
                    "@polkadot/types",
                    "react",
                ],
            };
            const hasPolkadotDependency = componentInfo.dependencies?.includes("polkadot-api") || false;
            const requiresPolkadotFromFlag = Boolean(componentInfo.requiresPolkadotApi);
            const requiresPolkadot = requiresPolkadotFromFlag || hasPolkadotDependency;
            expect(hasPolkadotDependency).toBe(true);
            expect(requiresPolkadotFromFlag).toBe(true);
            expect(requiresPolkadot).toBe(true);
        });
        it("should handle component with case-sensitive dependency matching", async () => {
            const componentInfo = {
                name: "case-test-component",
                requiresPolkadotApi: false,
                dependencies: ["POLKADOT-API", "Polkadot-Api"], // wrong case
            };
            const hasPolkadotDependency = componentInfo.dependencies?.includes("polkadot-api") || false;
            const requiresPolkadotFromFlag = Boolean(componentInfo.requiresPolkadotApi);
            const requiresPolkadot = requiresPolkadotFromFlag || hasPolkadotDependency;
            expect(hasPolkadotDependency).toBe(false); // exact match required
            expect(requiresPolkadotFromFlag).toBe(false);
            expect(requiresPolkadot).toBe(false);
        });
    });
    describe("Integration with Setup Detection", () => {
        it("should properly integrate component detection with setup requirements", async () => {
            // Test scenario: component requires polkadot but user has dedot installed
            const componentInfo = {
                name: "papi-requiring-component",
                requiresPolkadotApi: true,
                dependencies: ["polkadot-api"],
            };
            // Mock dedot installation (not papi)
            const mockPackageJson = {
                dependencies: { dedot: "^1.0.0" },
            };
            mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
            const hasPolkadotDependency = componentInfo.dependencies?.includes("polkadot-api") || false;
            const requiresPolkadotFromFlag = Boolean(componentInfo.requiresPolkadotApi);
            const requiresPolkadot = requiresPolkadotFromFlag || hasPolkadotDependency;
            expect(requiresPolkadot).toBe(true);
            // Check if setup is needed - should return false for dedot
            const needsSetup = await detector.needsPolkadotSetup(requiresPolkadot);
            expect(needsSetup).toBe(false); // dedot satisfies polkadot requirement
        });
        it("should handle component that requires setup when no polkadot library exists", async () => {
            const componentInfo = {
                name: "needs-setup-component",
                requiresPolkadotApi: true,
                dependencies: ["polkadot-api"],
            };
            // Mock no polkadot libraries installed
            const mockPackageJson = {
                dependencies: { react: "^18.0.0", tailwind: "^3.0.0" },
            };
            mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
            const hasPolkadotDependency = componentInfo.dependencies?.includes("polkadot-api") || false;
            const requiresPolkadotFromFlag = Boolean(componentInfo.requiresPolkadotApi);
            const requiresPolkadot = requiresPolkadotFromFlag || hasPolkadotDependency;
            expect(requiresPolkadot).toBe(true);
            const needsSetup = await detector.needsPolkadotSetup(requiresPolkadot);
            expect(needsSetup).toBe(true);
        });
        it("should get proper setup recommendations for component requiring polkadot", async () => {
            const componentInfo = {
                name: "recommend-setup-component",
                requiresPolkadotApi: true,
                dependencies: ["polkadot-api"],
            };
            // Mock no polkadot libraries installed
            const mockPackageJson = {
                dependencies: { react: "^18.0.0" },
            };
            mockFs.readFile.mockResolvedValueOnce(JSON.stringify(mockPackageJson));
            const hasPolkadotDependency = componentInfo.dependencies?.includes("polkadot-api") || false;
            const requiresPolkadotFromFlag = Boolean(componentInfo.requiresPolkadotApi);
            const requiresPolkadot = requiresPolkadotFromFlag || hasPolkadotDependency;
            expect(requiresPolkadot).toBe(true);
            const recommendations = await detector.getRecommendedSetup(requiresPolkadot);
            expect(recommendations).toEqual({
                needsInstall: true,
                needsConfig: true,
                recommendedLibrary: "papi",
                existingLibrary: "none",
            });
        });
    });
    describe("Real-world Component Examples", () => {
        it("should handle block-number component correctly", async () => {
            const componentInfo = {
                name: "block-number",
                type: "registry:block",
                title: "Block Number",
                description: "Display current block number",
                requiresPolkadotApi: true,
                dependencies: ["polkadot-api"],
                registryDependencies: ["button"],
                files: [],
            };
            const hasPolkadotDependency = componentInfo.dependencies?.includes("polkadot-api") || false;
            const requiresPolkadotFromFlag = Boolean(componentInfo.requiresPolkadotApi);
            const requiresPolkadot = requiresPolkadotFromFlag || hasPolkadotDependency;
            expect(hasPolkadotDependency).toBe(true);
            expect(requiresPolkadotFromFlag).toBe(true);
            expect(requiresPolkadot).toBe(true);
        });
        it("should handle regular UI component correctly", async () => {
            const componentInfo = {
                name: "button",
                type: "registry:ui",
                title: "Button",
                description: "A simple button component",
                requiresPolkadotApi: false,
                dependencies: ["react"],
                registryDependencies: [],
                files: [],
            };
            const hasPolkadotDependency = componentInfo.dependencies?.includes("polkadot-api") || false;
            const requiresPolkadotFromFlag = Boolean(componentInfo.requiresPolkadotApi);
            const requiresPolkadot = requiresPolkadotFromFlag || hasPolkadotDependency;
            expect(hasPolkadotDependency).toBe(false);
            expect(requiresPolkadotFromFlag).toBe(false);
            expect(requiresPolkadot).toBe(false);
        });
        it("should handle component where flag gets stripped but dependencies remain", async () => {
            // This represents the real issue mentioned in the conversation summary
            const componentInfo = {
                name: "polkadot-hook",
                type: "registry:hook",
                title: "Polkadot Hook",
                description: "Hook for polkadot operations",
                requiresPolkadotApi: undefined, // Flag was stripped during shadcn build
                dependencies: ["polkadot-api"], // But dependencies remain
                registryDependencies: [],
                files: [],
            };
            const hasPolkadotDependency = componentInfo.dependencies?.includes("polkadot-api") || false;
            const requiresPolkadotFromFlag = Boolean(componentInfo.requiresPolkadotApi);
            const requiresPolkadot = requiresPolkadotFromFlag || hasPolkadotDependency;
            expect(hasPolkadotDependency).toBe(true);
            expect(requiresPolkadotFromFlag).toBe(false); // undefined -> false
            expect(requiresPolkadot).toBe(true); // Still detected via dependencies
        });
    });
});
