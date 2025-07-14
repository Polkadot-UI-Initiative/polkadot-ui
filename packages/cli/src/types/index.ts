export interface ProjectStructure {
  isNextJs: boolean;
  isVite: boolean;
  isCRA: boolean;
  hasTypeScript: boolean;
  srcDir: string;
  componentDir: string;
  hookDir: string;
  providerDir: string;
  registryDir: string;
}

export interface PackageJson {
  name?: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
}

export interface PolkadotApiConfig {
  hasExistingConfig: boolean;
  existingChains: string[];
  hasPapi: boolean;
  hasDedot: boolean;
}

export interface ComponentInfo {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies?: string[];
  requiresPolkadotApi?: boolean;
  registryDependencies?: string[];
  files: ComponentFile[];
}

export interface ComponentFile {
  path: string;
  content: string;
  type: string;
}

export interface CliOptions {
  dev?: boolean;
  force?: boolean;
  verbose?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface SetupSteps {
  validateProject: boolean;
  detectPolkadotApi: boolean;
  installComponent: boolean;
  setupPolkadotApi: boolean;
}

export type ProjectType = "nextjs" | "vite" | "cra" | "unknown";
export type PolkadotLibrary = "papi" | "dedot" | "none";
