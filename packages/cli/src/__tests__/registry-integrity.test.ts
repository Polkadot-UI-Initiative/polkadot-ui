import path from "path";
import fs from "fs/promises";

const repoRoot = path.resolve(__dirname, "../../../..");
const registryPublicDir = path.join(repoRoot, "packages/registry/public");
const registrySourceDir = path.join(repoRoot, "packages/registry");

async function readJson(filePath: string): Promise<any> {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

describe("Registry integrity", () => {
  jest.setTimeout(30_000);

  async function assertComponentMatchesIndex(
    library: "dedot" | "papi"
  ): Promise<void> {
    const indexPath = path.join(registryPublicDir, `registry-${library}.json`);
    const index = await readJson(indexPath);
    const items: Array<{ name: string; files?: Array<{ path: string }> }> =
      index.items;

    expect(Array.isArray(items)).toBe(true);

    for (const item of items) {
      const compPath = path.join(
        registryPublicDir,
        "r",
        library,
        `${item.name}.json`
      );
      const component = await readJson(compPath);
      expect(component).toBeDefined();

      const componentFilePaths = new Set(
        (component.files || []).map((f: { path: string }) => f.path)
      );

      // 1) Every file declared in the index exists in the component payload
      for (const f of item.files || []) {
        expect(componentFilePaths.has(f.path)).toBe(true);
      }

      // 2) Every component file has non-empty content
      for (const f of component.files || []) {
        expect(typeof f.content).toBe("string");
        expect(f.content.length).toBeGreaterThan(0);
      }
    }
  }

  it("dedot index files must exist in component payloads and have content", async () => {
    await assertComponentMatchesIndex("dedot");
  });

  it("papi index files must exist in component payloads and have content", async () => {
    await assertComponentMatchesIndex("papi");
  });

  async function assertSourceRegistryFilesExist(
    library: "dedot" | "papi"
  ): Promise<void> {
    const indexPath = path.join(registrySourceDir, `registry-${library}.json`);
    const index = await readJson(indexPath);
    const items: Array<{ name: string; files?: Array<{ path: string }> }> =
      index.items;

    for (const item of items) {
      for (const f of item.files || []) {
        const abs = path.join(registrySourceDir, f.path);
        try {
          const stat = await fs.stat(abs);
          expect(stat.isFile()).toBe(true);
        } catch (e) {
          throw new Error(
            `Missing source file for ${library} component "${item.name}": ${f.path}`
          );
        }
      }
    }
  }

  it("dedot source registry file paths must exist on disk", async () => {
    await assertSourceRegistryFilesExist("dedot");
  });

  it("papi source registry file paths must exist on disk", async () => {
    await assertSourceRegistryFilesExist("papi");
  });
});
