import { useTypink } from "typink";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientOnly } from "@/registry/dot-ui/blocks/client-only";
import { RemarkButton } from "@/components/examples/dedot/remark-button";

import type { ComponentExample } from "../types.examples";

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
  const { supportedNetworks } = useTypink();
  return (
    <div className="flex w-full  flex-col gap-6">
      <Tabs defaultValue={supportedNetworks[0].name}>
        <TabsList>
          {supportedNetworks.slice(0, 3).map((network) => (
            <TabsTrigger
              key={network.name}
              value={network.name}
              className="text-xs"
            >
              {network.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {supportedNetworks.slice(0, 3).map((network) => (
          <TabsContent
            key={network.name}
            value={network.name}
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
