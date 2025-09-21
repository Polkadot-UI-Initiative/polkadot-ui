import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";

import type { ComponentExample } from "@/components/examples/types.examples";
import { useChainIds, useClient } from "@reactive-dot/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TxButton } from "@/registry/polkadot-ui/blocks/tx-button/components/tx-button.papi";
import { Binary } from "polkadot-api";
import { config } from "@/registry/polkadot-ui/reactive-dot.config";
import { ChainId } from "@reactive-dot/core";
import { Suspense } from "react";

export const txButtonExample: ComponentExample = {
  name: "Tx Button",
  href: "/docs/components/tx-button",
  code: "tx-button",
  description:
    "Button component for sending arbitrary transactions. Supports all chains, all signers with default notification. Fees and error states are handled by the component.",
  component: (
    <ClientOnly>
      <DemoTxButton />
    </ClientOnly>
  ),
};

export function DemoTxButton() {
  const supportedChainIds = useChainIds();
  const supportedNetworks = supportedChainIds?.map((chainId) => ({
    id: chainId,
    // TODO: get decimals and symbol from chain
    decimals: config.chains[chainId].decimals ?? 0,
    symbol: config.chains[chainId].symbol ?? "N/A",
    name: config.chains[chainId].name,
  }));

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
              <ClientOnly>
                <RemarkButton networkId={network.id} />
              </ClientOnly>
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
  const transaction = typedApi?.tx.System.remark({
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
      Remark a message on {network.name}
    </TxButton>
  );
}
