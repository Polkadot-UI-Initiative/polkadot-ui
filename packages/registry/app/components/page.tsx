"use client";

import { WalletSelect } from "@/registry/dot-ui/blocks/connect-wallet/components/wallet-select";
import { TxButton } from "@/registry/dot-ui/blocks/tx-button/components/tx-button.dedot";
import { usePolkadotApi } from "@/registry/dot-ui/providers/dedot-provider";
import { dotUiConfig, type ChainId } from "@/registry/dot-ui/lib/config.dot-ui";
import { DemoHooks } from "@/components/demo-hooks";
import { TestTx } from "@/components/test-tx";

export default function Components() {
  const defaultChain: ChainId = dotUiConfig.defaultChain;
  const polkadotApi = usePolkadotApi(defaultChain);
  const tx = polkadotApi?.tx.system.remark("Hello, World from polkadot-ui!");

  return (
    <>
      <DemoHooks />
      <TxButton tx={tx}>Send Remark</TxButton>
      <WalletSelect />
      <TestTx />
    </>
  );
}
