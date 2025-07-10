import { BlockNumber } from "@/registry/polkadot-ui/blocks/block-number/components/block-number";
import { PolkadotProvider } from "@/registry/polkadot-ui/providers/polkadot-provider";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Polkadot UI Components Registry
          </h1>
          <p className="text-lg text-gray-600">
            Type-safe React components for the Polkadot ecosystem with best UX
            built in.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Live Demo</h2>
            <PolkadotProvider>
              <BlockNumber />
            </PolkadotProvider>
          </div>
        </div>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Usage Example</h2>
          <div className="space-y-3">
            <div className="font-mono text-sm bg-black text-green-400 p-3 rounded">
              const &#123; api &#125; =
              usePolkadot(&quot;paseo_asset_hub&quot;);
            </div>
            <p className="text-sm text-gray-600">
              TypeScript only allows registered chains as parameters and
              provides full type safety for the specific chain&apos;s API
              structure.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
