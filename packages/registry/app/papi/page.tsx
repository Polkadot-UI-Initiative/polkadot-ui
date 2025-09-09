import { examples } from "@/components/examples/papi";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";

export default function PapiPage() {
  return (
    <PolkadotProvider>
      {examples.map((example) => (
        <div key={example.name}>{example.component}</div>
      ))}
    </PolkadotProvider>
  );
}
