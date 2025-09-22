"use client";

import { useTx } from "typink";
import { ConnectWallet } from "@/registry/polkadot-ui/blocks/connect-wallet/connect-wallet.dedot";
import { TxButton as TxButtonDedot } from "@/registry/polkadot-ui/blocks/tx-button/components/tx-button.dedot";
import { PolkadotProvider as PolkadotProviderDedot } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";

import { PolkadotProvider as PolkadotProviderPapi } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";

import { examples } from "@/components/examples/papi";

export function Components() {
  const tx = useTx((tx) => tx.system.remark, {
    networkId: "paseo",
  });

  return (
    <>
      <ConnectWallet />
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
  return <>{examples.map((example) => example.component)}</>;
}

export function Papi() {
  return (
    <PolkadotProviderPapi>
      <h1>PAPI</h1>
      <PapiComponents />
    </PolkadotProviderPapi>
  );
}
