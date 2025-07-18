#!/usr/bin/env node

import { execSync } from "child_process";
import { copyFileSync, existsSync } from "fs";

/**
 * Build both PAPI and Dedot registries
 */
async function buildRegistries() {
  console.log("🚀 Building PAPI and Dedot registries...\n");

  // Build PAPI registry
  console.log("📦 Building PAPI registry...");
  if (existsSync("registry.json")) {
    copyFileSync("registry.json", "registry.json.backup");
  }
  copyFileSync("registry-papi.json", "registry.json");

  try {
    execSync("shadcn build", { stdio: "inherit" });
    console.log("✅ PAPI registry built successfully\n");

    // Move generated files to papi-specific directory
    execSync("mkdir -p public/r/papi", { stdio: "inherit" });
    execSync(
      "find public/r -maxdepth 1 -type f -exec mv {} public/r/papi/ \\;",
      {
        stdio: "inherit",
        shell: true,
      }
    );
  } catch (error) {
    console.error("❌ Failed to build PAPI registry:", error.message);
    process.exit(1);
  }

  // Build Dedot registry
  console.log("📦 Building Dedot registry...");
  copyFileSync("registry-dedot.json", "registry.json");

  try {
    execSync("shadcn build", { stdio: "inherit" });
    console.log("✅ Dedot registry built successfully\n");

    // Move generated files to dedot-specific directory
    execSync("mkdir -p public/r/dedot", { stdio: "inherit" });
    execSync(
      "find public/r -maxdepth 1 -type f -exec mv {} public/r/dedot/ \\;",
      {
        stdio: "inherit",
        shell: true,
      }
    );
  } catch (error) {
    console.error("❌ Failed to build Dedot registry:", error.message);
    process.exit(1);
  }

  // Restore original registry.json or clean up
  if (existsSync("registry.json.backup")) {
    copyFileSync("registry.json.backup", "registry.json");
    execSync("rm registry.json.backup", { stdio: "inherit" });
  } else {
    execSync("rm registry.json", { stdio: "inherit" });
  }

  console.log("🎉 All registries built successfully!");
  console.log("   - PAPI components: public/r/papi/");
  console.log("   - Dedot components: public/r/dedot/");
}

buildRegistries().catch(console.error);
