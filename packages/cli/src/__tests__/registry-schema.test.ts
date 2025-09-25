import path from "path";
import fs from "fs/promises";
import { compileSchema } from "json-schema-library";

const repoRoot = path.resolve(__dirname, "../../../..");
const registrySourceDir = path.join(repoRoot, "packages/registry");

async function readJson(filePath: string): Promise<any> {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

describe("Registry JSON schema (json-schema-library)", () => {
  jest.setTimeout(30_000);

  async function validateForLibrary(library: "dedot" | "papi"): Promise<void> {
    const indexPath = path.join(registrySourceDir, `registry-${library}.json`);
    const indexJson = await readJson(indexPath);

    const [indexSchema, itemSchema] = await Promise.all([
      (await fetch("https://ui.shadcn.com/schema/registry.json")).json(),
      (await fetch("https://ui.shadcn.com/schema/registry-item.json")).json(),
    ]);

    // Register remote subschema so $ref resolves
    if (!itemSchema.$id)
      itemSchema.$id = "https://ui.shadcn.com/schema/registry-item.json";

    const node = compileSchema(indexSchema);

    const { valid, errors } = node.validate(indexJson);
    if (!valid) {
      const message = errors
        .map((e) => `${e.pointer}: ${e.message}`)
        .join("\n");
      throw new Error(`Index schema mismatch (${library}):\n${message}`);
    }

    // Validate each item against registry-item.json
    const itemNode = compileSchema(itemSchema);
    for (const item of indexJson.items as any[]) {
      const { valid: v, errors: es } = itemNode.validate(item);
      if (!v) {
        const msg = es.map((e) => `${e.pointer}: ${e.message}`).join("\n");
        throw new Error(
          `Item schema mismatch (${library} - ${item?.name}):\n${msg}`
        );
      }
    }
  }

  it("dedot and papi registries conform to schema", async () => {
    await validateForLibrary("dedot");
    await validateForLibrary("papi");
  });
});
