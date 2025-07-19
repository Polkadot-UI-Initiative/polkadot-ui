import { PolkadotProvider } from "@/registry/dot-ui/providers/dedot-provider";
import { BlockNumber } from "@/registry/dot-ui/blocks/block-number/components/block-number.dedot";

export default function BlockNumberPage() {
  return (
    <PolkadotProvider>
      <div className="flex flex-col items-center justify-center h-screen">
        <BlockNumber />
      </div>
    </PolkadotProvider>
  );
}
