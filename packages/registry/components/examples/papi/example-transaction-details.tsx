import type { ComponentExample } from "../types.examples";
import { TxDetailsDialog } from "@/registry/polkadot-ui/blocks/tx-details/tx-details.papi";
import { usePapi } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { config } from "@/registry/polkadot-ui/reactive-dot.config";
import { Button } from "@/components/ui/button";

import {
  XcmVersionedLocation,
  XcmVersionedXcm,
  XcmV5Instruction,
  XcmV5Junctions,
  MultiAddress,
} from "@polkadot-api/descriptors";

export const transactionDetailsExample: ComponentExample = {
  name: "Transaction Details",
  href: "/docs/components/transaction-details",
  code: "transaction-details",
  description: "Summarize fees, sender, recipient and call data",
  component: <TxDetailsExample />,
};

function TxDetailsExample() {
  const { client } = usePapi();

  const typedApi = client?.getTypedApi(config.chains["paseo"].descriptor);
  const tx = typedApi.tx.Balances.transfer_keep_alive({
    // these args are strongly typed!
    dest: MultiAddress.Id(
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    ),
    value: 10n ** 10n, // 1 DOT
  });
  const tx2 = typedApi.tx.XcmPallet.send({
    dest: XcmVersionedLocation.V5({
      parents: 0,
      interior: XcmV5Junctions.Here(),
    }),
    message: XcmVersionedXcm.V5([XcmV5Instruction.ClearOrigin()]),
  });
  return (
    <div className="flex flex-col gap-4">
      <TxDetailsDialog
        tx={tx}
        title="Transfer"
        trigger={<Button>Transfer</Button>}
      />
      <TxDetailsDialog tx={tx2} title="XCM" />
    </div>
  );
}
