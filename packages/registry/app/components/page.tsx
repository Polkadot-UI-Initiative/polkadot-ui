"use client";

import { DemoHooks } from "@/components/demo-hooks";
import { PolkadotProvider } from "@/registry/dot-ui/providers/dedot-provider";
import { supportedChains } from "@/registry/dot-ui/lib/config.dedot";
import { polkadot } from "typink";
import { BtnRemark } from "./btn-remark";
import { WalletSelect } from "@/registry/dot-ui/blocks/connect-wallet/components/wallet-select";

export default function Components() {
  return (
    <PolkadotProvider availableChains={[...supportedChains, polkadot]}>
      <DemoHooks />
      <WalletSelect />
      <BtnRemark />
    </PolkadotProvider>
  );
}
