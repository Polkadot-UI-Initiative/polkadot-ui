"use client";

import { WalletSelect } from "@/registry/dot-ui/blocks/connect-wallet/components/wallet-select";
import { TxButton } from "@/registry/dot-ui/blocks/tx-button/components/tx-button.dedot";
import { usePolkadotApi } from "@/registry/dot-ui/providers/dedot-provider";
import { dotUiConfig, type ChainId } from "@/registry/dot-ui/lib/config.dot-ui";
import { DemoHooks } from "@/components/demo-hooks";
import { TestTx } from "@/components/test-tx";

export default function Components() {
  const defaultChain: ChainId = dotUiConfig.defaultChain;
  const api = usePolkadotApi(defaultChain);
  const tx = api?.tx.system.remark("Hello, World from polkadot-ui!");

  const peopleApi = usePolkadotApi("paseo_people");
  const tx2 = peopleApi?.tx.system.remarkWithEvent(
    "Hello, World from polkadot-ui via paseo_people"
  );

  return (
    <>
      <DemoHooks />
      <div className="flex flex-col gap-4 max-w-md">
        <TxButton tx={tx}>Send Remark (defaultChain)</TxButton>
        <TxButton tx={tx2}>Send Remark (paseo_people)</TxButton>
      </div>
      <WalletSelect />
      <TestTx />
    </>
  );
}
