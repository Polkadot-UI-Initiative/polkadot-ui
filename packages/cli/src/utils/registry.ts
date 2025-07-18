import { ComponentInfo, CliOptions } from "../types/index.js";
import { PolkadotDetector } from "./polkadot-detector.js";

export class Registry {
  private baseUrl: string;
  private polkadotDetector: PolkadotDetector;
  private isDev: boolean;
  private cachedDetectedApi: "papi" | "dedot" | "none" | null = null;

  constructor(isDev: boolean = false) {
    this.baseUrl = isDev ? "http://localhost:3000" : "https://dot-ui.com";
    this.polkadotDetector = new PolkadotDetector();
    this.isDev = isDev;
  }

  /**
   * Get the detected Polkadot API library with caching
   */
  private async getDetectedApi(): Promise<"papi" | "dedot" | "none"> {
    if (this.cachedDetectedApi === null) {
      try {
        this.cachedDetectedApi =
          await this.polkadotDetector.detectPolkadotLibrary();
      } catch {
        // Default to papi if detection fails
        this.cachedDetectedApi = "papi";
      }
    }
    return this.cachedDetectedApi;
  }

  /**
   * Get the path prefix based on detected API
   */
  private async getPathPrefix(): Promise<string> {
    const detectedApi = await this.getDetectedApi();
    return detectedApi === "papi" ? "/r/papi" : "/r/dedot";
  }

  /**
   * Clear the cached detection result (useful for testing or when project state changes)
   */
  public clearDetectionCache(): void {
    this.cachedDetectedApi = null;
  }

  /**
   * Get the appropriate registry URL based on detected Polkadot API
   */
  private async getRegistryUrl(): Promise<string> {
    try {
      const detectedApi = await this.getDetectedApi();
      const registryFile =
        detectedApi === "papi" ? "registry-papi.json" : "registry-dedot.json";
      return `${this.baseUrl}/${registryFile}`;
    } catch {
      // Default to papi if detection fails
      return `${this.baseUrl}/registry-papi.json`;
    }
  }

  /**
   * Fetch the registry index
   */
  async fetchRegistry(): Promise<ComponentInfo[]> {
    try {
      const registryUrl = await this.getRegistryUrl();
      const response = await fetch(registryUrl);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch registry: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Registry fetch failed: ${error.message}`);
      }
      throw new Error("Unknown error occurred while fetching registry");
    }
  }

  /**
   * Fetch a specific component's details
   */
  async fetchComponent(componentName: string): Promise<ComponentInfo | null> {
    try {
      const pathPrefix = await this.getPathPrefix();
      const response = await fetch(
        `${this.baseUrl}${pathPrefix}/${componentName}.json`
      );

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Component not found
        }
        throw new Error(
          `Failed to fetch component: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Component fetch failed: ${error.message}`);
      }
      throw new Error("Unknown error occurred while fetching component");
    }
  }

  /**
   * Check if a component exists in the registry
   */
  async componentExists(componentName: string): Promise<boolean> {
    const component = await this.fetchComponent(componentName);
    return component !== null;
  }

  /**
   * Get all available components
   */
  async getAvailableComponents(): Promise<
    Array<{ name: string; title: string; description: string }>
  > {
    const components = await this.fetchRegistry();

    return components.map((component) => ({
      name: component.name,
      title: component.title,
      description: component.description,
    }));
  }

  /**
   * Search components by name or description
   */
  async searchComponents(query: string): Promise<ComponentInfo[]> {
    const components = await this.fetchRegistry();
    const lowercaseQuery = query.toLowerCase();

    return components.filter(
      (component) =>
        component.name.toLowerCase().includes(lowercaseQuery) ||
        component.title.toLowerCase().includes(lowercaseQuery) ||
        component.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Get component dependencies (other components it requires)
   */
  async getComponentDependencies(componentName: string): Promise<string[]> {
    const component = await this.fetchComponent(componentName);
    return component?.registryDependencies || [];
  }

  /**
   * Validate registry connection
   */
  async validateConnection(): Promise<{
    isConnected: boolean;
    error?: string;
  }> {
    try {
      const registryUrl = await this.getRegistryUrl();
      const response = await fetch(registryUrl, {
        method: "HEAD",
      });

      return {
        isConnected: response.ok,
      };
    } catch (error) {
      return {
        isConnected: false,
        error:
          error instanceof Error ? error.message : "Unknown connection error",
      };
    }
  }

  /**
   * Get registry status and metadata
   */
  async getRegistryInfo(): Promise<{
    url: string;
    isConnected: boolean;
    componentCount?: number;
    homepage?: string;
    error?: string;
  }> {
    const connectionCheck = await this.validateConnection();

    if (!connectionCheck.isConnected) {
      return {
        url: this.baseUrl,
        isConnected: false,
        error: connectionCheck.error,
      };
    }

    try {
      const registryUrl = await this.getRegistryUrl();
      const response = await fetch(registryUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch registry metadata: ${response.status}`
        );
      }

      const registryData = await response.json();
      const components = registryData.items || [];

      // Get API-specific component URL base
      const pathPrefix = await this.getPathPrefix();

      return {
        url: `${this.baseUrl}${pathPrefix}`,
        isConnected: true,
        componentCount: components.length,
        homepage: registryData.homepage,
      };
    } catch (error) {
      return {
        url: this.baseUrl,
        isConnected: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

/**
 * Factory function to create registry instance based on CLI options
 */
export function createRegistry(options: CliOptions): Registry {
  return new Registry(options.dev);
}

/**
 * Helper function to validate component name format
 */
export function isValidComponentName(name: string): boolean {
  // Component names should be kebab-case and contain only letters, numbers, and hyphens
  const componentNameRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return componentNameRegex.test(name);
}

/**
 * Helper function to format component name for display
 */
export function formatComponentName(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}
