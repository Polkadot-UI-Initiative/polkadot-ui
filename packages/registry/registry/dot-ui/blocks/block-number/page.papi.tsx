import { PolkadotProvider } from "@/registry/dot-ui/providers/papi-provider";
import { BlockNumber } from "@/registry/dot-ui/blocks/block-number/components/block-number.papi";

export default function BlockNumberPage() {
  return (
    <PolkadotProvider>
      <div className="flex flex-col items-center justify-center h-screen">
        <BlockNumber />
      </div>
    </PolkadotProvider>
  );
}
