import { TxButtonBase } from "@/registry/dot-ui/blocks/tx-button/components/tx-button.base";
import { useTx } from "typink";

export function RemarkButton() {
  const tx = useTx((tx) => tx.system.remark);

  return (
    <TxButtonBase tx={tx} args={[2]} networkId="paseo" className="w-full">
      Write a message on chain
    </TxButtonBase>
  );
}
