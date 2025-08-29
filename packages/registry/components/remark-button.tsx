import { TxButtonBase } from "@/registry/dot-ui/blocks/tx-button/components/tx-button.base";
import { paseoPeople, polkadot, useTx } from "typink";

export function RemarkButton() {
  const tx = useTx((tx) => tx.system.remark, {
    networkId: polkadot.id,
  });

  return (
    <TxButtonBase
      tx={tx}
      args={["Hello World from polkadot-ui"]}
      networkId={polkadot.id}
      className="w-full"
    >
      Write a message on chain
    </TxButtonBase>
  );
}
