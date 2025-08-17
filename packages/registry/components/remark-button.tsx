import { TxButton } from "@/registry/dot-ui/blocks/tx-button/components/tx-button.dedot";
import { usePolkadotApi } from "@/registry/dot-ui/providers/dedot-provider";

export function RemarkButton() {
  const paseoTestnetApi = usePolkadotApi("paseo");

  const tx = paseoTestnetApi?.tx.system.remarkWithEvent(
    "Hello, World from Polkadot Next.js Starter!"
  );

  return (
    <TxButton tx={tx} className="w-full">
      Remark on chain message
    </TxButton>
  );
}
