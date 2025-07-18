import { PolkadotProvider } from "@/registry/dot-ui/providers/dedot-provider";
import { BlockNumber } from "@/registry/dot-ui/blocks/block-number/components/block-number.dedot";

export default function BlockNumberPage() {
  return (
    <PolkadotProvider>
      <BlockNumber />
    </PolkadotProvider>
  );
}
