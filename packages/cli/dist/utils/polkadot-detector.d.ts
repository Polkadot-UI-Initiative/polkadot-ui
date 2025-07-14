import { PolkadotApiConfig, PolkadotLibrary } from "../types/index.js";
export declare class PolkadotDetector {
    private cwd;
    constructor(cwd?: string);
    /**
     * Read and parse package.json
     */
    private getPackageJson;
    /**
     * Check if polkadot-api (papi) is installed
     */
    hasPapi(): Promise<boolean>;
    /**
     * Check if dedot is installed
     */
    hasDedot(): Promise<boolean>;
    /**
     * Detect which Polkadot library is being used
     */
    detectPolkadotLibrary(): Promise<PolkadotLibrary>;
    /**
     * Check if .papi directory exists
     */
    hasPapiConfig(): Promise<boolean>;
    /**
     * Get existing papi configuration
     */
    getPapiConfig(): Promise<{
        chains: string[];
    } | null>;
    /**
     * Check if polkadot-config.ts exists
     */
    hasPolkadotConfig(): Promise<boolean>;
    /**
     * Check if @polkadot-api/descriptors is installed
     */
    hasDescriptors(): Promise<boolean>;
    /**
     * Get comprehensive Polkadot API configuration status
     */
    getPolkadotApiConfig(): Promise<PolkadotApiConfig>;
    /**
     * Check if the project needs Polkadot API setup for a component
     */
    needsPolkadotSetup(requiresPolkadotApi: boolean): Promise<boolean>;
    /**
     * Get recommended setup steps based on current configuration
     */
    getRecommendedSetup(requiresPolkadotApi: boolean): Promise<{
        needsInstall: boolean;
        needsConfig: boolean;
        recommendedLibrary: PolkadotLibrary;
        existingLibrary: PolkadotLibrary;
    }>;
}
