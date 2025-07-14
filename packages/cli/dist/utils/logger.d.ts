export declare class Logger {
    private verbose;
    constructor(verbose?: boolean);
    /**
     * General information message
     */
    info(message: string): void;
    /**
     * Detailed information (shown only in verbose mode or when explicitly called)
     */
    detail(message: string, force?: boolean): void;
    /**
     * Success message
     */
    success(message: string): void;
    /**
     * Final success message (more prominent)
     */
    finalSuccess(message: string): void;
    /**
     * Error message
     */
    error(message: string): void;
    /**
     * Warning message
     */
    warning(message: string): void;
    /**
     * Step indicator
     */
    step(step: number, total: number, message: string): void;
    /**
     * Command suggestion
     */
    command(command: string): void;
    /**
     * Code block
     */
    code(code: string): void;
    /**
     * Section header
     */
    section(title: string): void;
    /**
     * Subsection header
     */
    subsection(title: string): void;
    /**
     * Empty line
     */
    newline(): void;
    /**
     * Show project guidance when no React project is found
     */
    showProjectGuidance(): void;
    /**
     * Show React project requirements
     */
    showReactRequirements(): void;
    /**
     * Show validation errors
     */
    showValidationErrors(errors: string[], warnings: string[]): void;
    /**
     * Show next steps after component installation
     */
    showNextSteps(componentName: string, hasPolkadotSetup?: boolean): void;
    /**
     * Show available components in a formatted list
     */
    showComponentList(components: Array<{
        name: string;
        title: string;
        description: string;
    }>): void;
}
export declare const logger: Logger;
export declare function createLogger(verbose?: boolean): Logger;
