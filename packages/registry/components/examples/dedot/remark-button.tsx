"use client";

import { TxButton } from "@/registry/polkadot-ui/blocks/tx-button/components/tx-button.dedot";
import { NetworkId, useTx, useTypink } from "typink";

export function RemarkButton({ networkId }: { networkId: NetworkId }) {
  const { supportedNetworks } = useTypink();
  const network = supportedNetworks.find((n) => n.id === networkId);
  const tx = useTx((tx) => tx.system.remark, {
    networkId,
  });

  return (
    <TxButton
      tx={tx}
      args={["Hello World from polkadot-ui"]}
      networkId={networkId}
      className="w-full"
    >
      Remark a message on{" "}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={network?.logo} alt={network?.name} className="w-4 h-4" />
    </TxButton>
  );
}
