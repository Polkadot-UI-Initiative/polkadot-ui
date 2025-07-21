import { jest } from "@jest/globals";
import { Telemetry } from "../utils/telemetry.js";
import type { CliOptions } from "../types/index.js";
import fs from "fs/promises";
import os from "os";
import path from "path";

// Mock PostHog
jest.mock("posthog-node", () => ({
  PostHog: jest.fn().mockImplementation(() => ({
    capture: jest.fn(),
    flush: jest.fn(),
    shutdown: jest.fn(),
  })),
}));

// Mock file system operations
jest.mock("fs/promises");
jest.mock("os");

const mockFs = fs as jest.Mocked<typeof fs>;
const mockOs = os as jest.Mocked<typeof os>;

describe("Telemetry Privacy Improvements", () => {
  let telemetry: Telemetry;
  const mockOptions: CliOptions = {
    dev: false,
    verbose: false,
    force: false,
    interactive: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup OS mocks
    mockOs.homedir.mockReturnValue("/home/user");
    mockOs.platform.mockReturnValue("linux");

    // Setup default file system behavior
    mockFs.mkdir.mockResolvedValue(undefined);
    mockFs.writeFile.mockResolvedValue();

    // Setup readFile mock with proper typing
    (mockFs.readFile as any).mockImplementation((...args: any[]) => {
      const filePath = args[0];
      if (typeof filePath === "string" && filePath.includes("package.json")) {
        return Promise.resolve('{"version":"1.0.0"}');
      }
      return Promise.reject(new Error("File not found"));
    });

    // Clear environment variables
    delete process.env.DOT_UI_DISABLE_TELEMETRY;
    delete process.env.CI;
    delete process.env.NODE_ENV;
  });

  afterEach(async () => {
    if (telemetry) {
      await telemetry.shutdown();
    }
  });

  describe("Persistent User ID Generation", () => {
    it("should generate a valid UUID v4", async () => {
      // Mock config file doesn't exist (first run)
      mockFs.readFile.mockRejectedValue(new Error("File not found"));

      telemetry = new Telemetry(mockOptions);
      const info = await telemetry.getInfo();

      // Verify UUID v4 format (8-4-4-4-12 characters)
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(info.userId).toMatch(uuidRegex);
    });

    it("should reuse existing user ID from config file", async () => {
      const existingUserId = "existing-uuid-123";
      const mockConfig = {
        userId: existingUserId,
        enabled: true,
        version: 1,
        createdAt: "2024-01-01T00:00:00.000Z",
      };

      mockFs.readFile.mockResolvedValue(JSON.stringify(mockConfig));

      telemetry = new Telemetry(mockOptions);
      const info = await telemetry.getInfo();

      expect(info.userId).toBe(existingUserId);
    });

    it("should create config directory and file", async () => {
      mockFs.readFile.mockRejectedValue(new Error("File not found"));

      telemetry = new Telemetry(mockOptions);
      await telemetry.getInfo();

      expect(mockFs.mkdir).toHaveBeenCalledWith(
        path.join("/home/user", ".dot-ui"),
        { recursive: true }
      );
      expect(mockFs.writeFile).toHaveBeenCalled();
    });
  });

  describe("Privacy Controls", () => {
    it("should respect DOT_UI_DISABLE_TELEMETRY environment variable", async () => {
      process.env.DOT_UI_DISABLE_TELEMETRY = "true";

      telemetry = new Telemetry(mockOptions);
      const isEnabled = await telemetry.isEnabled();

      expect(isEnabled).toBe(false);
    });

    it("should disable telemetry in CI environments", async () => {
      process.env.CI = "true";
      mockFs.readFile.mockRejectedValue(new Error("File not found"));

      telemetry = new Telemetry(mockOptions);
      const info = await telemetry.getInfo();

      expect(info.enabled).toBe(false);
    });

    it("should allow enabling and disabling telemetry", async () => {
      mockFs.readFile.mockRejectedValue(new Error("File not found"));

      telemetry = new Telemetry(mockOptions);

      // Enable telemetry
      await telemetry.setEnabled(true);
      expect(await telemetry.isEnabled()).toBe(true);

      // Disable telemetry
      await telemetry.setEnabled(false);
      expect(await telemetry.isEnabled()).toBe(false);
    });
  });

  describe("Data Collection Transparency", () => {
    it("should provide comprehensive information about data collection", async () => {
      mockFs.readFile.mockRejectedValue(new Error("File not found"));

      telemetry = new Telemetry(mockOptions);
      const info = await telemetry.getInfo();

      expect(info.dataCollection).toContain("CLI version and command usage");
      expect(info.dataCollection).toContain("Framework choice (Next.js/Vite)");
      expect(info.dataCollection).toContain(
        "Error messages (truncated, no personal data)"
      );
      expect(info.dataCollection.length).toBeGreaterThan(5);
    });

    it("should provide config file path for user reference", async () => {
      mockFs.readFile.mockRejectedValue(new Error("File not found"));

      telemetry = new Telemetry(mockOptions);
      const info = await telemetry.getInfo();

      expect(info.configPath).toBe("/home/user/.dot-ui/telemetry.json");
    });
  });

  describe("Configuration Migration", () => {
    it("should migrate old configuration format", async () => {
      const oldConfig = {
        userId: "old-uuid",
        enabled: true,
        version: 0, // Old version
      };

      mockFs.readFile.mockResolvedValue(JSON.stringify(oldConfig));

      telemetry = new Telemetry(mockOptions);
      const info = await telemetry.getInfo();

      // Should preserve user ID but update version
      expect(info.userId).toBe("old-uuid");
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('"version":1')
      );
    });
  });

  describe("Fallback Behavior", () => {
    it("should handle config file access failures gracefully", async () => {
      mockFs.readFile.mockRejectedValue(new Error("Permission denied"));
      mockFs.writeFile.mockRejectedValue(new Error("Permission denied"));
      mockOs.homedir.mockImplementation(() => {
        throw new Error("Cannot access home directory");
      });

      telemetry = new Telemetry(mockOptions);
      const info = await telemetry.getInfo();

      // Should still provide a user ID (fallback)
      expect(info.userId).toBeDefined();
      expect(info.enabled).toBe(false); // Should default to disabled if can't persist
      expect(info.configPath).toBeNull();
    });
  });
});
