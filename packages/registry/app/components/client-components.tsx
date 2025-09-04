"use client";

import { useTx } from "typink";
import { WalletSelect } from "@/registry/polkadot-ui/blocks/connect-wallet/components/wallet-select.dedot";
import { WalletSelect as WalletSelectPapi } from "@/registry/polkadot-ui/blocks/connect-wallet/components/wallet-select.papi";
import { TxButton as TxButtonDedot } from "@/registry/polkadot-ui/blocks/tx-button/components/tx-button.dedot";
import { PolkadotProvider as PolkadotProviderDedot } from "@/registry/polkadot-ui/providers/polkadot-provider.dedot";

import { TxButtonStandalone as TxButtonPapi } from "@/registry/polkadot-ui/blocks/tx-button/components/tx-button.standalone.papi";
import { PolkadotProvider as PolkadotProviderPapi } from "@/registry/polkadot-ui/providers/polkadot-provider.reactive-dot";
import { Binary } from "polkadot-api";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import { usePolkadotApi } from "@/registry/polkadot-ui/providers/polkadot-provider.papi";
import { Suspense } from "react";

export function Components() {
  const tx = useTx((tx) => tx.system.remark, {
    networkId: "paseo",
  });

  return (
    <>
      <WalletSelect />
      <TxButtonDedot
        tx={tx}
        args={["Hello, World from Polkadot Next.js Starter!"]}
        networkId="paseo"
      >
        Send Remark
      </TxButtonDedot>
    </>
  );
}

export function Dedot() {
  return (
    <PolkadotProviderDedot>
      <h1>Dedot</h1>
      <Components />
    </PolkadotProviderDedot>
  );
}

export function Papi() {
  const networkId = "paseo" as const;
  const typedApi = usePolkadotApi(networkId);
  const transaction = typedApi?.tx.System.remark({
    remark: Binary.fromText("Hello from polkadot-next-js-starter!"),
  });

  return (
    <PolkadotProviderPapi>
      <h1>PAPI</h1>
      {transaction ? (
        <ClientOnly>
          <WalletSelectPapi />
          <Suspense>
            <TxButtonPapi transaction={transaction} networkId={networkId}>
              Send Remark (PAPI)
            </TxButtonPapi>
          </Suspense>
        </ClientOnly>
      ) : null}
    </PolkadotProviderPapi>
  );
}
