#!/usr/bin/env node

import { execSync } from "child_process";
import { copyFileSync, existsSync, readdir, rename, mkdir } from "fs";
import { promisify } from "util";
import path from "path";

// Promisify fs functions for async/await usage
const readdirAsync = promisify(readdir);
const renameAsync = promisify(rename);
const mkdirAsync = promisify(mkdir);

/**
 * Move files from source directory to target directory using Node.js fs operations
 */
async function moveFilesToDirectory(sourceDir, targetDir) {
  try {
    // Create target directory if it doesn't exist
    await mkdirAsync(targetDir, { recursive: true });

    // Read files in source directory
    const files = await readdirAsync(sourceDir);

    // Filter only files (not directories) and move them
    for (const file of files) {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);

      // Check if it's a file (not a directory) by trying to stat it
      try {
        const stats = await import("fs").then((fs) =>
          promisify(fs.stat)(sourcePath)
        );
        if (stats.isFile()) {
          await renameAsync(sourcePath, targetPath);
        }
      } catch (error) {
        // Skip if file doesn't exist or can't be accessed
        console.warn(`Warning: Could not move ${file}: ${error.message}`);
      }
    }
  } catch (error) {
    throw new Error(
      `Failed to move files from ${sourceDir} to ${targetDir}: ${error.message}`
    );
  }
}

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
  if (!existsSync("registry-papi.json")) {
    console.error("❌ registry-papi.json not found");
    process.exit(1);
  }
  copyFileSync("registry-papi.json", "registry.json");

  try {
    execSync("shadcn build", { stdio: "inherit" });
    console.log("✅ PAPI registry built successfully\n");

    // Move generated files to papi-specific directory
    await moveFilesToDirectory("public/r", "public/r/papi");
  } catch (error) {
    console.error("❌ Failed to build PAPI registry:", error.message);
    process.exit(1);
  }

  // Build Dedot registry
  console.log("📦 Building Dedot registry...");
  if (!existsSync("registry-dedot.json")) {
    console.error("❌ registry-dedot.json not found");
    process.exit(1);
  }
  copyFileSync("registry-dedot.json", "registry.json");

  try {
    execSync("shadcn build", { stdio: "inherit" });
    console.log("✅ Dedot registry built successfully\n");

    // Move generated files to dedot-specific directory
    await moveFilesToDirectory("public/r", "public/r/dedot");
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
