import { CliOptions } from "../types/index.js";
export declare class AddCommand {
    private options;
    private registry;
    private projectDetector;
    private polkadotDetector;
    constructor(options: CliOptions);
    /**
     * Main add command execution
     */
    execute(componentName: string): Promise<void>;
    /**
     * Step 1: Validate component name format
     */
    private validateComponentName;
    /**
     * Step 2: Validate project setup (package.json, React, framework)
     */
    private validateProjectSetup;
    /**
     * Step 3: Check component availability
     */
    private validateComponentAvailability;
    /**
     * Step 4: Detect Polkadot API setup
     */
    private detectPolkadotSetup;
    /**
     * Step 5: Install component
     */
    private installComponent;
    /**
     * Install component using shadcn CLI
     */
    private installComponentWithShadcn;
    /**
     * Install Polkadot API dependencies
     */
    private installPolkadotDependencies;
    /**
     * Setup Polkadot API configuration
     */
    private setupPolkadotApi;
    /**
     * Install missing papi chains and generate types
     */
    private installMissingChains;
    /**
     * Show completion message and next steps
     */
    private showCompletionMessage;
    /**
     * Suggest similar components when component not found
     */
    private suggestSimilarComponents;
}
