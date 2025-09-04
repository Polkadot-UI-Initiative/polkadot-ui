import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";

import type { ComponentExample } from "../types.examples";
import { useChainIds } from "@reactive-dot/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TxButtonStandalone as TxButton } from "@/registry/polkadot-ui/blocks/tx-button/components/tx-button.standalone.papi";
import { Binary } from "polkadot-api";

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
  const supportedNetworks = useChainIds()?.map((chainId) => ({
    id: chainId,
    // TODO: get decimals and symbol from chain
    decimals: 0,
    symbol: "",
    name: "",
  }));
  return (
    <div className="flex w-full  flex-col gap-6">
      <Tabs defaultValue={supportedNetworks[0].name}>
        <TabsList>
          {supportedNetworks.slice(0, 3).map((network) => (
            <TabsTrigger
              key={network.id}
              value={network.id}
              className="text-xs"
            >
              {network.id}
            </TabsTrigger>
          ))}
        </TabsList>
        {supportedNetworks.slice(0, 3).map((network) => (
          <TabsContent
            key={network.id}
            value={network.id}
            className="w-full items-center justify-center h-full flex my-8"
          >
            <ClientOnly>
              <RemarkButton networkId={network.id} />
            </ClientOnly>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export function RemarkButton({ networkId }: { networkId: string }) {
  type MinimalPapiTx = {
    System: { remark: (data: { remark: Binary }) => unknown };
  };
  const remarkTxBuilder = ((tx: MinimalPapiTx) => (data: { remark: Binary }) =>
    tx.System.remark(data)) as unknown as TxButtonStandaloneProps["txBuilder"];
  return (
    <TxButton
      txBuilder={remarkTxBuilder}
      args={[{ remark: Binary.fromText("Hello World from polkadot-ui") }]}
      networkId={networkId as unknown as TxButtonStandaloneProps["networkId"]}
    >
      Click Me
    </TxButton>
  );
}
