import fs from "fs/promises";
import path from "path";
export class PolkadotDetector {
    cwd;
    constructor(cwd = process.cwd()) {
        this.cwd = cwd;
    }
    /**
     * Read and parse package.json
     */
    async getPackageJson() {
        try {
            const packageJsonPath = path.join(this.cwd, "package.json");
            const content = await fs.readFile(packageJsonPath, "utf-8");
            return JSON.parse(content);
        }
        catch {
            return null;
        }
    }
    /**
     * Check if polkadot-api (papi) is installed
     */
    async hasPapi() {
        const packageJson = await this.getPackageJson();
        if (!packageJson)
            return false;
        const deps = {
            ...packageJson.dependencies,
            ...packageJson.devDependencies,
        };
        return Boolean(deps["polkadot-api"]);
    }
    /**
     * Check if dedot is installed
     */
    async hasDedot() {
        const packageJson = await this.getPackageJson();
        if (!packageJson)
            return false;
        const deps = {
            ...packageJson.dependencies,
            ...packageJson.devDependencies,
        };
        return Boolean(deps["dedot"]);
    }
    /**
     * Detect which Polkadot library is being used
     */
    async detectPolkadotLibrary() {
        const hasPapi = await this.hasPapi();
        const hasDedot = await this.hasDedot();
        if (hasPapi)
            return "papi";
        if (hasDedot)
            return "dedot";
        return "none";
    }
    /**
     * Check if .papi directory exists
     */
    async hasPapiConfig() {
        try {
            const papiPath = path.join(this.cwd, ".papi");
            const stat = await fs.stat(papiPath);
            return stat.isDirectory();
        }
        catch {
            return false;
        }
    }
    /**
     * Get existing papi configuration
     */
    async getPapiConfig() {
        try {
            const configPath = path.join(this.cwd, ".papi", "polkadot-api.json");
            const content = await fs.readFile(configPath, "utf-8");
            const config = JSON.parse(content);
            const chains = Object.keys(config.entries || {});
            return { chains };
        }
        catch {
            return null;
        }
    }
    /**
     * Check if polkadot-config.ts exists
     */
    async hasPolkadotConfig() {
        try {
            await fs.access(path.join(this.cwd, "polkadot-config.ts"));
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Check if @polkadot-api/descriptors is installed
     */
    async hasDescriptors() {
        const packageJson = await this.getPackageJson();
        if (!packageJson)
            return false;
        const deps = {
            ...packageJson.dependencies,
            ...packageJson.devDependencies,
        };
        return Boolean(deps["@polkadot-api/descriptors"]);
    }
    /**
     * Get comprehensive Polkadot API configuration status
     */
    async getPolkadotApiConfig() {
        const hasPapi = await this.hasPapi();
        const hasDedot = await this.hasDedot();
        const hasConfig = await this.hasPapiConfig();
        let existingChains = [];
        if (hasConfig) {
            const config = await this.getPapiConfig();
            existingChains = config?.chains || [];
        }
        console.log("hasPapi", hasPapi);
        console.log("hasDedot", hasDedot);
        console.log("hasConfig", hasConfig);
        console.log("existingChains", existingChains);
        return {
            hasExistingConfig: hasConfig,
            existingChains,
            hasPapi,
            hasDedot,
        };
    }
    /**
     * Check if the project needs Polkadot API setup for a component
     */
    async needsPolkadotSetup(requiresPolkadotApi) {
        if (!requiresPolkadotApi)
            return false;
        const library = await this.detectPolkadotLibrary();
        // If no Polkadot library is installed, setup is needed
        if (library === "none")
            return true;
        // If using papi, check if proper configuration exists
        if (library === "papi") {
            const hasConfig = await this.hasPapiConfig();
            const hasDescriptors = await this.hasDescriptors();
            return !hasConfig || !hasDescriptors;
        }
        // For dedot, basic installation is sufficient for now
        return false;
    }
    /**
     * Get recommended setup steps based on current configuration
     */
    async getRecommendedSetup(requiresPolkadotApi) {
        const existingLibrary = await this.detectPolkadotLibrary();
        const needsSetup = await this.needsPolkadotSetup(requiresPolkadotApi);
        if (!requiresPolkadotApi) {
            return {
                needsInstall: false,
                needsConfig: false,
                recommendedLibrary: "none",
                existingLibrary,
            };
        }
        // If no library is installed, recommend papi
        if (existingLibrary === "none") {
            return {
                needsInstall: true,
                needsConfig: true,
                recommendedLibrary: "papi",
                existingLibrary,
            };
        }
        // If papi is installed but not configured
        if (existingLibrary === "papi") {
            const hasConfig = await this.hasPapiConfig();
            const hasDescriptors = await this.hasDescriptors();
            return {
                needsInstall: !hasDescriptors,
                needsConfig: !hasConfig,
                recommendedLibrary: "papi",
                existingLibrary,
            };
        }
        // If dedot is installed, use it (minimal setup needed)
        return {
            needsInstall: false,
            needsConfig: false,
            recommendedLibrary: "dedot",
            existingLibrary,
        };
    }
}
