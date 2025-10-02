"use client";

import type { ComponentExample } from "@/components/examples/types.examples";
import { useChainIds, useClient } from "@reactive-dot/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TxButton } from "@/registry/polkadot-ui/blocks/tx-button/components/tx-button.papi";
import { Binary } from "polkadot-api";
import { config } from "@/registry/polkadot-ui/lib/reactive-dot.config";
import type { ChainId } from "@reactive-dot/core";
import { Suspense } from "react";

export const txButtonExample: ComponentExample = {
  name: "Tx Button",
  href: "/docs/components/tx-button",
  code: "tx-button",
  description:
    "Button component for sending arbitrary transactions. Supports all chains, all signers with default notification. Fees and error states are handled by the component.",
  component: (
    <Suspense fallback={<div>Loading...</div>}>
      <DemoTxButton />
    </Suspense>
  ),
};

export function DemoTxButton() {
  const supportedChainIds = useChainIds();
  const supportedNetworks = supportedChainIds?.map((chainId) => {
    const id = String(chainId) as ChainId;
    return {
      id,
      decimals: config.chains[id].decimals ?? 0,
      symbol: config.chains[id].symbol ?? "N/A",
      name: config.chains[id].name,
    };
  });

  const nets = supportedNetworks?.slice() || [];

  if (nets.length === 0) {
    return (
      <div className="flex w-full items-center justify-center p-8 text-muted-foreground">
        No supported networks available
      </div>
    );
  }

  return (
    <div className="flex w-full  flex-col gap-6">
      <Tabs defaultValue={nets[0].id}>
        <TabsList>
          {nets.slice(0, 3).map((network) => (
            <TabsTrigger
              key={network.id}
              value={network.id}
              className="text-xs"
            >
              {network.id}
            </TabsTrigger>
          ))}
        </TabsList>
        {nets.slice(0, 3).map((network) => (
          <TabsContent
            key={network.id}
            value={network.id}
            className="w-full items-center justify-center h-full flex my-8"
          >
            <Suspense>
              <RemarkButton networkId={network.id} />
            </Suspense>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export function RemarkButton({ networkId }: { networkId: ChainId }) {
  const client = useClient({ chainId: networkId });
  const network = config.chains[networkId];
  const typedApi = client?.getTypedApi(config.chains[networkId].descriptor);

  if (!typedApi) {
    return (
      <div className="flex w-full items-center justify-center p-8 text-muted-foreground">
        No typed API available
      </div>
    );
  }
  const transaction = typedApi.tx.System.remark({
    remark: Binary.fromText("Hello World from polkadot-ui"),
  });

  return (
    <TxButton
      transaction={transaction}
      networkId={networkId}
      notifications={{
        title: "Remark Welcome Message",
      }}
    >
      Remark message on
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={network?.logo} alt={network?.name} className="w-4 h-4" />
    </TxButton>
  );
}
