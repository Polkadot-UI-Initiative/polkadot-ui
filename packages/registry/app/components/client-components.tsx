"use client";

import { useTx } from "typink";
import { WalletSelect } from "@/registry/polkadot-ui/blocks/connect-wallet/components/wallet-select.dedot";
import { WalletSelect as WalletSelectPapi } from "@/registry/polkadot-ui/blocks/connect-wallet/components/wallet-select.papi";
import { TxButton as TxButtonDedot } from "@/registry/polkadot-ui/blocks/tx-button/components/tx-button.dedot";
import { PolkadotProvider as PolkadotProviderDedot } from "@/registry/polkadot-ui/providers/polkadot-provider.dedot";

import { TxButtonStandalone as TxButtonPapi } from "@/registry/polkadot-ui/blocks/tx-button/components/tx-button.papi";
import {
  PolkadotProvider as PolkadotProviderPapi,
  usePapi,
} from "@/registry/polkadot-ui/providers/polkadot-provider.papi";
import { Binary } from "polkadot-api";
import { Suspense } from "react";
import { config } from "@/registry/polkadot-ui/reactive-dot.config";
import { TxButtonSkeleton } from "@/registry/polkadot-ui/blocks/tx-button/components/tx-button.base";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";

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
        notifications={{
          title: "Remark Welcome Message",
        }}
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

export function PapiComponents() {
  const networkId = "paseo";
  const { client } = usePapi(networkId);
  const typedApi = client?.getTypedApi(config.chains[networkId].descriptor);
  const transaction = typedApi?.tx.System.remark({
    remark: Binary.fromText("Hello from polkadot-ui!"),
  });
  return (
    <>
      {transaction ? (
        <ClientOnly>
          <div className="flex flex-col gap-4 max-w-sm">
            <WalletSelectPapi />
            <Suspense
              fallback={<TxButtonSkeleton>Send Remark (PAPI)</TxButtonSkeleton>}
            >
              <TxButtonPapi
                transaction={transaction}
                networkId={networkId}
                notifications={{
                  title: "Remark Welcome Message",
                  description: "Please sign the transaction in your wallet",
                }}
              >
                Send Remark (PAPI)
              </TxButtonPapi>
            </Suspense>
          </div>
        </ClientOnly>
      ) : null}
    </>
  );
}

export function Papi() {
  return (
    <PolkadotProviderPapi>
      <h1>PAPI</h1>
      <PapiComponents />
    </PolkadotProviderPapi>
  );
}
