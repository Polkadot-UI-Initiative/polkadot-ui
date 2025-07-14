import { PackageJson, ProjectStructure, ProjectType, ValidationResult } from "../types/index.js";
export declare class ProjectDetector {
    private cwd;
    constructor(cwd?: string);
    /**
     * Check if package.json exists in the current directory
     */
    hasPackageJson(): Promise<boolean>;
    /**
     * Read and parse package.json
     */
    getPackageJson(): Promise<PackageJson | null>;
    /**
     * Detect the project type (Next.js, Vite, CRA, etc.)
     */
    detectProjectType(): Promise<ProjectType>;
    /**
     * Check if the project uses React
     */
    hasReact(): Promise<boolean>;
    /**
     * Check if the project uses TypeScript
     */
    hasTypeScript(): Promise<boolean>;
    /**
     * Check if src directory exists (common in Vite/CRA)
     */
    hasSrcDirectory(): Promise<boolean>;
    /**
     * Get Tailwind CSS version if installed
     */
    getTailwindVersion(): Promise<number | null>;
    /**
     * Detect complete project structure
     */
    detectProjectStructure(): Promise<ProjectStructure>;
    /**
     * Validate that the current directory is a proper React project
     */
    validateProject(): Promise<ValidationResult>;
}
/**
 * Helper function to detect project type without instantiating the class
 */
export declare function detectProjectType(): Promise<ProjectType>;
