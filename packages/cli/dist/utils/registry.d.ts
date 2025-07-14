import { ComponentInfo, CliOptions } from "../types/index.js";
export declare class Registry {
    private baseUrl;
    constructor(isDev?: boolean);
    /**
     * Fetch the registry index
     */
    fetchRegistry(): Promise<ComponentInfo[]>;
    /**
     * Fetch a specific component's details
     */
    fetchComponent(componentName: string): Promise<ComponentInfo | null>;
    /**
     * Check if a component exists in the registry
     */
    componentExists(componentName: string): Promise<boolean>;
    /**
     * Get all available components
     */
    getAvailableComponents(): Promise<Array<{
        name: string;
        title: string;
        description: string;
    }>>;
    /**
     * Search components by name or description
     */
    searchComponents(query: string): Promise<ComponentInfo[]>;
    /**
     * Get component dependencies (other components it requires)
     */
    getComponentDependencies(componentName: string): Promise<string[]>;
    /**
     * Check if component requires Polkadot API setup
     */
    requiresPolkadotApi(componentName: string): Promise<boolean>;
    /**
     * Validate registry connection
     */
    validateConnection(): Promise<{
        isConnected: boolean;
        error?: string;
    }>;
    /**
     * Get registry status and metadata
     */
    getRegistryInfo(): Promise<{
        url: string;
        isConnected: boolean;
        componentCount?: number;
        homepage?: string;
        error?: string;
    }>;
}
/**
 * Factory function to create registry instance based on CLI options
 */
export declare function createRegistry(options: CliOptions): Registry;
/**
 * Helper function to validate component name format
 */
export declare function isValidComponentName(name: string): boolean;
/**
 * Helper function to format component name for display
 */
export declare function formatComponentName(name: string): string;
