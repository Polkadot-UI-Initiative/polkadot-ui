import { CliOptions } from "../types/index.js";
export declare class ListCommand {
    private options;
    private registry;
    constructor(options: CliOptions);
    /**
     * Main list command execution
     */
    execute(): Promise<void>;
    /**
     * Validate registry connection
     */
    private validateRegistryConnection;
    /**
     * Show available components
     */
    private showComponentList;
    /**
     * Show registry information
     */
    private showRegistryInfo;
    /**
     * Show connection guidance when registry is unreachable
     */
    private showConnectionGuidance;
}
/**
 * Factory function to create list command instance
 */
export declare function createListCommand(options: CliOptions): ListCommand;
