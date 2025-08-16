"use client";
import { usePolkadotApi } from "@/registry/dot-ui/providers/dedot-provider";
import { TxButton } from "@/registry/dot-ui/blocks/tx-button/components/tx-button.dedot";

export function BtnRemark() {
  const paseoApi = usePolkadotApi("paseo_testnet");
  const tx = paseoApi?.tx.system.remark(
    "Hello, World from Polkadot polkadot-ui!"
  );

  return <TxButton tx={tx}>Send Remark</TxButton>;
}
